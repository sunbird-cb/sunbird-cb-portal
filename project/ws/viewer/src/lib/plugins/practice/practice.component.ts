import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges, OnDestroy, OnInit,
  QueryList,
  SimpleChanges,
  ViewChild, ViewChildren,
} from '@angular/core'
import { MatDialog, MatSidenav, MatSnackBar } from '@angular/material'
import { Subscription, interval } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { NSPractice } from './practice.model'
import { QuestionComponent } from './components/question/question.component'
import { SubmitQuizDialogComponent } from './components/submit-quiz-dialog/submit-quiz-dialog.component'
import { OnConnectionBindInfo } from 'jsplumb'
import { PracticeService } from './practice.service'
import { EventService, NsContent, ValueService, WsEvents } from '@sunbird-cb/utils'
import { ActivatedRoute, NavigationStart, Router } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'
// tslint:disable-next-line
import _ from 'lodash'
import { NSQuiz } from '../quiz/quiz.model'
import { environment } from 'src/environments/environment'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ViewerDataService } from '../../viewer-data.service'
import { ViewerHeaderSideBarToggleService } from './../../viewer-header-side-bar-toggle.service'
// import { ViewerDataService } from '../../viewer-data.service'
export type FetchStatus = 'hasMore' | 'fetching' | 'done' | 'error' | 'none'
@Component({
  selector: 'viewer-plugin-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss'],
})
// ComponentCanDeactivate
export class PracticeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() identifier = ''
  @Input() artifactUrl = ''
  @Input() name = ''
  @Input() learningObjective = ''
  @Input() complexityLevel = ''
  @Input() duration = 0
  @Input() collectionId = ''
  @Input() primaryCategory = NsContent.EPrimaryCategory.PRACTICE_RESOURCE
  @Input() quizJson: NSQuiz.IQuiz = {
    timeLimit: 300,
    questions: [
      {
        multiSelection: false,
        section: '',
        question: '',
        questionId: '',
        instructions: '',
        questionType: undefined,
        options: [
          {
            optionId: '',
            text: '',
            isCorrect: false,
          },
        ],
      },
    ],
    isAssessment: false,
    allowSkip: 'No',
    maxQuestions: 0,
    requiresSubmit: 'Yes',
    showTimer: 'Yes',
    primaryCategory: NsContent.EPrimaryCategory.PRACTICE_RESOURCE,
  }
  @ViewChildren('questionsReference') questionsReference: QueryList<QuestionComponent> | null = null
  @ViewChild('sidenav', { static: false }) sideNav: MatSidenav | null = null
  @ViewChild('submitModal', { static: false }) submitModal: ElementRef | null = null
  resourceName: string | null = this.viewerDataSvc.resource ? this.viewerDataSvc.resource.name : ''
  currentQuestionIndex = 0
  currentTheme = ''
  fetchingResultsStatus: FetchStatus = 'none'
  fetchingSectionsStatus: FetchStatus = 'none'
  fetchingQuestionsStatus: FetchStatus = 'none'
  isCompleted = false
  isIdeal = false
  retake = false
  isSubmitted = false
  markedQuestions = new Set([])
  numCorrectAnswers = 0
  numIncorrectAnswers = 0
  numUnanswered = 0
  passPercentage = 0
  questionAnswerHash: NSPractice.IQAnswer = {}
  result = 0
  sidenavMode = 'start'
  sidenavOpenDefault = false
  finalResponse!: NSPractice.IQuizSubmitResponseV2
  startTime = 0
  submissionState: NSPractice.TQuizSubmissionState = 'unanswered'
  telemetrySubscription: Subscription | null = null
  attemptSubData!: NSPractice.ISecAttempted[]
  attemptSubscription: Subscription | null = null
  timeLeft = 55
  timerSubscription: Subscription | null = null
  viewState: NSPractice.TQuizViewMode = 'initial'
  paramSubscription: Subscription | null = null
  paperSections: NSPractice.IPaperSection[] | null = null
  selectedSection: NSPractice.IPaperSection | null = null
  ePrimaryCategory = NsContent.EPrimaryCategory
  currentQuestion!: NSPractice.IQuestionV2 | any
  process = false
  isXsmall = false
  assessmentBuffer = 0
  showAnswer = false
  matchHintDisplay: any[] = []
  canAttempt!: NSPractice.IRetakeAssessment
  isMobile = false
  questionAttemptedCount = 0
  expandFalse = true
  showOverlay = false
  constructor(
    private events: EventService,
    public dialog: MatDialog,
    private quizSvc: PracticeService,
    private activatedRoute: ActivatedRoute,
    private viewerSvc: ViewerUtilService,
    private router: Router,
    private valueSvc: ValueService,
    // private vws: ViewerDataService,
    public snackbar: MatSnackBar,
    private sanitized: DomSanitizer,
    private viewerDataSvc: ViewerDataService,
    private viewerHeaderSideBarToggleService: ViewerHeaderSideBarToggleService

  ) {
    if (environment.assessmentBuffer) {
      this.assessmentBuffer = environment.assessmentBuffer
    }
  }
  init() {

    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    // this.getSections()
    this.isSubmitted = false
    this.markedQuestions = new Set([])
    this.questionAnswerHash = {}
    this.quizSvc.mtfSrc.next({})
    // quizSvc.questionAnswerHash.subscribe(qaHash => {
    //   this.questionAnswerHash = qaHash
    // })
    // console.log(activatedRoute.snapshot.data)
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart && e.navigationTrigger === 'imperative'),
      // switchMap(() => this.router.events.pipe(
      //   filter(e => e instanceof NavigationEnd
      //     || e instanceof NavigationCancel
      //     || e instanceof NavigationError
      //   ),
      //   take(1),
      //   filter(e => e instanceof NavigationEnd)
      // ))
    ).subscribe(() => {
      if (this.viewState !== 'initial' && !this.isSubmitted) {
        this.submitQuiz()
      }
      // console.log(val)
    })
    this.valueSvc.isXSmall$.subscribe(isXSmall => {
      this.isXsmall = isXSmall
    })

    this.quizSvc.checkAlreadySubmitAssessment.subscribe((result)=>{
      if(result) {
        this.isSubmitted = true;
        this.viewState = 'answer' || 'review';
      }
    })
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(e: any) {
    // or directly false
    const confirmationMessage = `\o/`
    if (this.viewState !== 'initial' && !this.isSubmitted) {
      e.returnValue = confirmationMessage
      return confirmationMessage
    }
    return
  }
  canAttend() {
    if (this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE) {
      this.canAttempt = {
        attemptsAllowed: 1,
        attemptsMade: 0,
      }
      this.init()
      this.updateVisivility()
    } else {
      this.quizSvc.canAttend(this.identifier).subscribe(response => {
        if (response) {
           this.canAttempt = response
          //  this.canAttempt = {
          //   attemptsAllowed: 1,
          //   attemptsMade: 0,
          // }
        }
        this.init()
        this.updateVisivility()
      })
    }
  }
  ngOnInit() {
    this.canAttend()
    this.attemptSubscription = this.quizSvc.secAttempted.subscribe(data => {
      this.attemptSubData = data
    })
    if (this.quizSvc.questionAnswerHash.value) {
      this.questionAnswerHash = this.quizSvc.questionAnswerHash.getValue()
    }
    // console.log(this.vws.resource)
  }
  get getTimeLimit(): number {
    let jsonTime = (this.quizJson.timeLimit || 0)
    if (this.retake && jsonTime === 0) {
      jsonTime = _.get(this.activatedRoute, 'snapshot.data.content.data.expectedDuration') || 0
      this.quizJson.timeLimit = jsonTime
    }
    return jsonTime + this.assessmentBuffer
  }
  getSections(_event: NSPractice.TUserSelectionType) {
    // this.identifier
    this.fetchingSectionsStatus = 'fetching'
    if (this.quizSvc.paperSections && this.quizSvc.paperSections.value
      && _.get(this.quizSvc.paperSections, 'value.questionSet.children')) {
      this.paperSections = _.get(this.quizSvc.paperSections, 'value.questionSet.children')
      const showTimer = _.toLower(_.get(this.quizSvc.paperSections, 'value.questionSet.showTimer')) === 'yes'
      if (showTimer || this.primaryCategory !== NsContent.EPrimaryCategory.PRACTICE_RESOURCE) {
        this.quizJson.timeLimit = (_.get(this.quizSvc.paperSections, 'value.questionSet.expectedDuration') || 0)
      } else {
        // this.quizJson.timeLimit = this.duration * 60
        this.quizJson.timeLimit = this.quizJson.timeLimit
      }
      this.fetchingSectionsStatus = 'done'
      this.viewState = 'detail'
      this.startIfonlySection()
    } else {
      this.quizSvc.getSection(this.identifier).subscribe((section: NSPractice.ISectionResponse) => {
        // console.log(section)
        this.fetchingSectionsStatus = 'done'
        if (section.responseCode && section.responseCode === 'OK') {
          /** this is to enable or disable Timer */
          const showTimer = _.toLower(_.get(section, 'result.questionSet.showTimer')) === 'yes'
          if (showTimer) {
            this.quizJson.timeLimit = section.result.questionSet.expectedDuration
          } else {
            // this.quizJson.timeLimit = this.duration * 60
            this.quizJson.timeLimit = this.quizJson.timeLimit
          }
          this.quizSvc.paperSections.next(section.result)
          const tempObj = _.get(section, 'result.questionSet.children')
          this.updataDB(tempObj)
          this.paperSections = []
          _.each(tempObj, o => {
            if (this.paperSections) {
              this.paperSections.push(o)
            }
          })
          // this.paperSections = _.get(section, 'result.questionSet.children')
          this.viewState = 'detail'
          // this.updateTimer()
          this.startIfonlySection()
        }
      })
    }
  }
  startIfonlySection() {
    // directly start section if only section is there is set
    if (this.isOnlySection) {
      const firstSection = _.first(this.paperSections) || null
      if (firstSection) {
        this.nextSection(firstSection)
        this.overViewed('start')
      }
    }
    this.updateTimer()

  }
  get isOnlySection(): boolean {
    return !!this.paperSections && !!(this.paperSections.length === 1)
  }
  updataDB(sections: NSPractice.IPaperSection[]) {
    const data: NSPractice.ISecAttempted[] = []
    for (let i = 0; i < sections.length; i += 1) {
      const nextsec = sections[i + 1]
      data.push({
        identifier: sections[i].identifier,
        fullAttempted: false,
        isAttempted: false,
        nextSection: nextsec && nextsec.identifier ? nextsec.identifier : null,
        totalQueAttempted: 0,
        attemptData: null,
      })
    }
    // console.log(data)
    this.quizSvc.secAttempted.next(data)
  }
  get secQuestions(): any[] {
    if (!(this.quizJson && this.quizJson.questions) || !(this.selectedSection && this.selectedSection.identifier)) {
      return []
    }
    const qq = _.filter(this.quizJson.questions, { section: this.selectedSection.identifier })
    return qq
  }
  nextSection(section: NSPractice.IPaperSection) {
    this.quizSvc.currentSection.next(section)
    this.startSection(section)
  }
  startSection(section: NSPractice.IPaperSection) {
    if (section) {
      this.quizSvc.currentSection.next(section)
      this.fetchingQuestionsStatus = 'fetching'
      this.selectedSection = section
      if (this.secQuestions && this.secQuestions.length > 0) {
        this.fetchingQuestionsStatus = 'done'
        this.overViewed('start')
      } else {
        // updated because there is a 20 questions limit
        const lst = _.chunk(section.childNodes || [], 20)
        const prom: any[] = []
        _.each(lst, l => {
          prom.push(this.getMultiQuestions(l))
        })
        Promise.all(prom).then(qqr => {
          this.fetchingQuestionsStatus = 'done'
          const question = { questions: _.flatten(_.map(qqr, 'result.questions')) }
          const codes = _.compact(_.map(this.quizJson.questions, 'section') || [])
          this.quizSvc.startSection(section)
          // console.log(this.quizSvc.secAttempted.value)
          _.eachRight(question.questions, q => {
            // const qHtml = document.createElement('div')
            // qHtml.innerHTML = q.editorState.question
            if (codes.indexOf(section.identifier) === -1) {
              this.quizJson.questions.push({
                section: section.identifier,
                question: q.body, // qHtml.textContent || qHtml.innerText || '',
                multiSelection: ((q.qType || '').toLowerCase() === 'mcq-mca' ? true : false),
                questionType: (q.qType || '').toLowerCase(),
                questionId: q.identifier,
                instructions: null,
                options: this.getOptions(q),
                editorState: q.editorState,
              })
            }
          })
          this.overViewed('start')
        })
        // this.quizSvc.getQuestions(section.childNodes || [], this.identifier).subscribe(qqr => {
        //   this.fetchingQuestionsStatus = 'done'
        //   const question = _.get(qqr, 'result')
        //   const codes = _.compact(_.map(this.quizJson.questions, 'section') || [])
        //   this.quizSvc.startSection(section)
        //   // console.log(this.quizSvc.secAttempted.value)
        //   _.eachRight(question.questions, q => {
        //     // const qHtml = document.createElement('div')
        //     // qHtml.innerHTML = q.editorState.question
        //     if (codes.indexOf(section.identifier) === -1) {
        //       this.quizJson.questions.push({
        //         section: section.identifier,
        //         question: q.body, // qHtml.textContent || qHtml.innerText || '',
        //         multiSelection: ((q.qType || '').toLowerCase() === 'mcq-mca' ? true : false),
        //         questionType: (q.qType || '').toLowerCase(),
        //         questionId: q.identifier,
        //         instructions: null,
        //         options: this.getOptions(q),
        //       })
        //     }
        //   })
        //   this.overViewed('start')
        // })
      }
    }
  }
  getMultiQuestions(ids: string[]) {
    return this.quizSvc.getQuestions(ids, this.identifier).toPromise()
  }
  getOptions(question: NSPractice.IQuestionV2): NSPractice.IOption[] {
    const options: NSPractice.IOption[] = []
    if (question && question.qType) {
      const qTyp = question.qType
      switch (qTyp) {
        // 'mcq-sca' | 'mcq-mca' | 'ftb' | 'mtf'
        case 'mcq-sca':
        case 'MCQ-SCA':
        case 'mcq-mca':
        case 'MCQ-MCA':
        case 'MCQ':
          _.each(this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE && question.editorState
            // tslint:disable-next-line: align
            ? question.editorState.options : question.choices.options, o => {
              // const aHtml = document.createElement('div')
              // aHtml.innerHTML = o.value.body

              // const vHtml = document.createElement('div')
              // vHtml.innerHTML = o.value.value
              options.push({
                optionId: o.value.value,
                text: o.value.body || '',
                isCorrect: o.answer,
                // hint: '',
                // match: '',
                // matchForView: '',
                // response: '',
                // userSelected: false,
              })
            })
          break
        case 'ftb':
        case 'FTB':
          const noOptions = _.split(question.body, '_______________')
          noOptions.pop()
          // _.each(question.choices.options, op => {
          // const ansHtml = document.createElement('div')
          // ansHtml.innerHTML = op.value.body || '<p></p>'

          // const opIdHtml = document.createElement('div')
          // opIdHtml.innerHTML = op.value.value || '<p></p>'
          _.each(noOptions, (_op, idx) => {
            options.push({
              optionId: (idx).toString(),
              text: '',
              // isCorrect: op.answer,
            })
          })

          // })

          break
        case 'mtf':
        case 'MTF':
          // const array = this.question.options.map(elem => elem.match)
          // const arr = this.practiceSvc.shuffle(array)
          // for (let i = 0; i < this.question.options.length; i += 1) {
          //     this.question.options[i].matchForView = arr[i]
          // }
          _.each(this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE && question.editorState
            // tslint:disable-next-line: align
            ? question.editorState.options : question.choices.options, (o, idx) => {
              options.push({
                // isCorrect: true,
                optionId: o.value.value,
                text: (o.value.body || '').toString(), // modified
                hint: this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE
                  ? _.get(_.nth(question.editorState && question.editorState.options, idx), 'answer')
                  : _.nth(question.rhsChoices, idx),
                response: '',
                userSelected: false,
                matchForView: '',
                match: _.nth(question.rhsChoices, idx),
                // this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE
                //   ? _.get(_.nth(question.editorState && question.editorState.options, idx), 'answer')
                //   : _.nth(question.rhsChoices, idx),
              })
            })
          break
      }
    }
    return options
  }
  getClass(section: NSPractice.ISecAttempted) {
    const storeData = _.first(_.filter(this.attemptSubData, { identifier: section.identifier }))
    let className = 'not-started'
    if (storeData) {
      if (storeData.fullAttempted) {
        className = 'complete'
      } else {
        if (storeData.isAttempted) {
          className = 'incomplete'
        }
      }
    }
    return className
  }
  scroll(qIndex: number) {
    if (qIndex > 0) {
      this.getNextQuestion(qIndex - 1)
    }
    if (!this.sidenavOpenDefault && this.isXsmall) {
      if (this.sideNav) {
        this.sideNav.close()
      }
    }
    // const questionElement = document.getElementById(`question${qIndex}`)
    // if (questionElement) {
    //   questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // }
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const change in changes) {
      if (change) {
        if (change === 'quiz') {
          if (
            this.quizJson &&
            this.quizJson.timeLimit
          ) {
            this.quizJson.timeLimit *= 1000
          }
        }
        if (change === 'name') {
          // this.quizJson.questions = []
          // this.quizJson.timeLimit = 0
          this.clearStorage()
        }
      }
    }
  }
  getNextQuestion(idx: any) {
    this.process = true
    if (idx !== this.currentQuestionIndex) {
      this.currentQuestionIndex = idx
    }
    const questions = this.secQuestions
    this.currentQuestion = questions && questions[idx] ? questions[idx] : null
    setTimeout(() => {
      this.process = false
      // tslint:disable-next-line
    }, 10)
    this.showAnswer = false
    this.matchHintDisplay = []
  }
  get current_Question(): NSPractice.IQuestionV2 {
    return this.currentQuestion
  }
  get currentIndex() {
    return this.currentQuestionIndex
  }
  get totalQCount(): number {
    const questions = this.secQuestions || []
    return questions.length
  }
  get noOfQuestions(): number {
    console.log('this.quizJson', this.quizJson)
    if (this.quizJson.maxQuestions) {
      return this.quizJson.maxQuestions
    }
    if (this.retake) {
      return _.get(this.activatedRoute, 'snapshot.data.content.data.maxQuestions') || 0
    }
    return 0
  }
  backToSections() {
    this.viewState = 'detail'
  }

  overViewed(event: NSPractice.TUserSelectionType) {
    if (event === 'start') {
      this.retake = false
      this.startQuiz()
      // call content progress with status 1 i.e, started
      this.updateProgress(1)
    } else if (event === 'skip') {
      // alert('skip quiz TBI')
    }
  }

  updateProgress(status: number) {
    // status = 1 indicates started
    // status = 2 indicates completed
    const resData = this.viewerSvc.getBatchIdAndCourseId(this.activatedRoute.snapshot.queryParams.collectionId,
                                                         this.activatedRoute.snapshot.queryParams.batchId, this.identifier)
    const collectionId = (resData && resData.courseId) ? resData.courseId : ''
    const batchId = (resData && resData.batchId) ? resData.batchId : ''
    // const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
    //   this.activatedRoute.snapshot.queryParams.collectionId : ''
    // const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
    //   this.activatedRoute.snapshot.queryParams.batchId : ''
    this.viewerSvc.realTimeProgressUpdateQuiz(this.identifier, collectionId, batchId, status)
  }

  startQuiz() {
    if (this.isXsmall) {
      this.sidenavOpenDefault = true
      setTimeout(() => { this.sidenavOpenDefault = false }, 500)
    }
    this.currentQuestionIndex = 0
    this.viewState = 'attempt'
    this.getNextQuestion(this.currentQuestionIndex)
  }
  updateTimer() {
    this.startTime = Date.now()
    this.timeLeft = this.getTimeLimit
    // && this.primaryCategory !== this.ePrimaryCategory.PRACTICE_RESOURCE
    if (this.getTimeLimit > 0
    ) {
      this.timerSubscription = interval(1000)
        .pipe(
          map(
            () =>
              this.startTime + this.getTimeLimit - Date.now(),
          ),
        )
        .subscribe(_timeRemaining => {
          this.timeLeft -= 1
          if (this.timeLeft < 0) {
            this.isIdeal = true
            this.timeLeft = 0
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe()
            }
            this.submitQuiz()
          }
        })
    }
  }
  get allSecAttempted(): { full: boolean, next: NSPractice.IPaperSection | null } {
    const sections = this.quizSvc.secAttempted.getValue()
    let fullAttempted = false
    if (sections && sections.length) {
      const attemped = _.filter(sections, s => s.fullAttempted || s.isAttempted)
      fullAttempted = (attemped || []).length === sections.length
    }
    const currentSectionId = _.get(this.selectedSection, 'identifier') || _.get(this.quizSvc, 'currentSection.value.identifier')
    const nextId = _.get(_.first(_.filter(_.get(this.quizSvc.secAttempted, 'value'), { identifier: currentSectionId })), 'nextSection')
    const next = _.first(_.filter(_.get(this.quizSvc.paperSections.value, 'questionSet.children'), { identifier: nextId }))
    return { next, full: fullAttempted }
  }
  fillSelectedItems(question: NSPractice.IQuestion, optionId: string) {
    if (typeof (optionId) === 'string') {
      this.raiseTelemetry('mark', optionId, 'click')
    } if (this.viewState === 'answer') {
      // if (this.questionsReference) {
      //   this.questionsReference.forEach(qr => {
      //     qr.reset()
      //   })
      // }
    }
    this.viewState = 'attempt'
    if (
      this.questionAnswerHash[question.questionId] &&
      question.multiSelection
    ) {
      const questionIndex = this.questionAnswerHash[question.questionId].indexOf(optionId)
      if (questionIndex === -1) {
        this.questionAnswerHash[question.questionId].push(optionId)
      } else {
        this.questionAnswerHash[question.questionId].splice(questionIndex, 1)
      }
      if (!this.questionAnswerHash[question.questionId].length) {
        delete this.questionAnswerHash[question.questionId]
      }
    } else {
      this.questionAnswerHash[question.questionId] = [optionId]
    }
    // tslint:disable-next-line
    if (question.questionType && question.questionType === 'mtf') {
      const mTfval = this.quizSvc.mtfSrc.getValue()
      mTfval[question.questionId] = {
        // [_.first(_.map(optionId, 'source.innerText'))]: {
        source: _.map(optionId, 'source.innerText'),
        target: _.map(optionId, 'target.innerText'),
        // sourceId: _.first(_.map(optionId, 'source.id')),
        // targetId: _.first(_.map(optionId, 'target.id')),
        // },
      }
      this.quizSvc.mtfSrc.next(mTfval)
    }
    this.quizSvc.qAnsHash({ ...this.questionAnswerHash })
    const answered = (this.quizSvc.questionAnswerHash.getValue() || [])
    if (this.markSectionAsComplete(answered) && this.selectedSection) {
      this.quizSvc.setFullAttemptSection(this.selectedSection)
    }
    if (this.questionAnswerHash) {
      this.questionAttemptedCount = Object.keys(this.questionAnswerHash).length
    }
  }
  markSectionAsComplete(answered: any): boolean {
    let seted = true
    _.each(this.secQuestions, q => {
      if (!answered[q.questionId]) {
        seted = false
      }
    })
    return seted
  }
  proceedToSubmit() {
    // if (this.timeLeft || this.primaryCategory === this.ePrimaryCategory.PRACTICE_RESOURCE) {
    if (
      Object.keys(this.questionAnswerHash).length !==
      this.quizJson.questions.length
    ) {
      this.submissionState = 'unanswered'
    } else if (this.markedQuestions.size) {
      this.submissionState = 'marked'
    } else {
      this.submissionState = 'answered'
    }
    const dialogRef = this.dialog.open(SubmitQuizDialogComponent, {
      width: '250px',
      data: this.submissionState,
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitQuiz()
      }
    })
    // }
  }
  back() {
    this.proceedToSubmit()
  }
  get generateRequest(): NSPractice.IQuizSubmit {
    const submitQuizJson = JSON.parse(JSON.stringify(this.quizJson))
    const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
      this.activatedRoute.snapshot.queryParams.collectionId : ''
    const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
      this.activatedRoute.snapshot.queryParams.batchId : ''

    const req = this.quizSvc.createAssessmentSubmitRequest(
      this.identifier,
      this.name,
      {
        ...submitQuizJson,
        timeLimit: this.quizJson.timeLimit * 1000,
      },
      this.questionAnswerHash,
      this.quizSvc.mtfSrc.getValue() as any ,
    )
    const request: NSPractice.IQuizSubmit = {
      batchId,
      identifier: this.identifier,
      primaryCategory: this.primaryCategory,
      courseId: collectionId,
      isAssessment: true,
      objectType: 'QuestionSet',
      timeLimit: this.quizJson.timeLimit,
      children: _.map(this.paperSections, (ps: NSPractice.IPaperSection) => {
        return {
          identifier: ps.identifier,
          objectType: ps.objectType,
          primaryCategory: ps.primaryCategory,
          scoreCutoffType: ps.scoreCutoffType,
          children: this.getQuestions(ps, req),
        } as NSPractice.ISubSec
      }),
    }
    // // tslint:disable-next-line
    // console.log(request)
    return request
  }
  getQuestions(section: NSPractice.IPaperSection, req: NSPractice.IQuizSubmitRequest): NSPractice.IRScratch[] {
    const responseQ: NSPractice.IRScratch[] = []
    if (section && section.identifier) {
      const secQues = _.filter(req.questions, q => q.section === section.identifier)
      _.each(secQues, sq => {
        switch (_.toLower(sq.questionType || '')) {
          case 'mcq-mca':
            const mcqMca: NSPractice.IMCQ_MCA = {
              identifier: sq.questionId,
              question: sq.question,
              mimeType: NsContent.EMimeTypes.QUESTION,
              objectType: 'Question',
              primaryCategory: NsContent.EPrimaryCategory.MULTIPLE_CHOICE_QUESTION,
              qType: 'MCQ-MCA',
              editorState: {
                options: _.compact(_.map(sq.options, (_o: NSPractice.IOption) => {
                  if (_o.userSelected) {
                    return {
                      index: (_o.optionId).toString(),
                      selectedAnswer: !!_o.userSelected,
                    } as NSPractice.IResponseOptions
                  } return null
                })),
              },
            }
            responseQ.push(mcqMca)
            break
          case 'mcq-sca':
            const mcqSca: NSPractice.IMCQ_SCA = {
              identifier: sq.questionId,
              mimeType: NsContent.EMimeTypes.QUESTION,
              objectType: 'Question',
              question: sq.question,
              primaryCategory: NsContent.EPrimaryCategory.SINGLE_CHOICE_QUESTION,
              qType: 'MCQ-SCA',
              editorState: {
                options: _.compact(_.map(sq.options, (_o: NSPractice.IOption) => {
                  if (_o.userSelected) {
                    return {
                      index: (_o.optionId).toString(),
                      selectedAnswer: _o.userSelected,
                    } as NSPractice.IResponseOptions
                  } return null
                })),
              },
            }
            responseQ.push(mcqSca)
            break
          case 'ftb':
            const ftb: NSPractice.IMCQ_FTB = {
              identifier: sq.questionId,
              mimeType: NsContent.EMimeTypes.QUESTION,
              objectType: 'Question',
              question: sq.question,
              primaryCategory: NsContent.EPrimaryCategory.FTB_QUESTION,
              qType: 'FTB',
              editorState: {
                options: _.compact(_.map(sq.options, (_o: NSPractice.IOption, idx: number) => {
                  if (_o.response) {
                    return {
                      index: (_o.optionId || idx).toString(),
                      selectedAnswer: _o.response || '',
                    } as NSPractice.IResponseOptions
                  } return null
                })),
                // selectedAnswer: _.join(_.map(sq.options, (_o: NSPractice.IOption) => {
                //   return _o.response
                // }),
                //   // tslint:disable-next-line:align
                //   ','
                // ),
              },
            }
            responseQ.push(ftb)
            break
          case 'mtf':
            const mtf: NSPractice.IMCQ_MTF = {
              identifier: sq.questionId,
              mimeType: NsContent.EMimeTypes.QUESTION,
              objectType: 'Question',
              question: sq.question,
              primaryCategory: NsContent.EPrimaryCategory.MTF_QUESTION,
              qType: 'MTF',
              editorState: {
                options: _.compact(_.map(sq.options, (_o: NSPractice.IOption) => {
                  if (_o.userSelected) {
                    return {
                      index: (_o.optionId).toString(),
                      selectedAnswer: _o.response,
                    } as NSPractice.IResponseOptions
                  } return null
                })),
              },
            }
            responseQ.push(mtf)
            break
        }
      })
    }
    return responseQ
  }
  async submitQuiz() {

    this.raiseTelemetry('quiz', null, 'submit')
    this.showOverlay = true
    setTimeout(() => {
      this.showOverlay = false
      this.viewerHeaderSideBarToggleService.visibilityStatus.next(true)
    },         1000)
    this.isSubmitted = true
    this.ngOnDestroy()
    if (!this.quizJson.isAssessment) {
      this.viewState = 'review'
      // this.calculateResults()
    } else {
      this.viewState = 'answer'
    }
    const quizV4Res: any = await this.quizSvc.submitQuizV4(this.generateRequest).toPromise().catch(_error => {})
    if (quizV4Res && quizV4Res.params && quizV4Res.params.status.toLowerCase() === 'success') {
      if (quizV4Res.result.primaryCategory === 'Course Assessment') {
        setTimeout(() => {
          this.getQuizResult()
        },         environment.quizResultTimeout)
      } else if (quizV4Res.result.primaryCategory === 'Practice Question Set') {
        this.assignQuizResult(quizV4Res.result)
      }
    }
    // this.quizSvc.submitQuizV3(this.generateRequest).subscribe(
    //   (res: NSPractice.IQuizSubmitResponseV2) => {
    //     // call content progress with status 2 i.e, completed
    //     this.updateProgress(2)
    //     this.finalResponse = res
    //     if (this.quizJson.isAssessment) {
    //       this.isIdeal = true
    //     }
    //     this.clearQuizJson()
    //     this.fetchingResultsStatus = 'done'
    //     this.numCorrectAnswers = res.correct
    //     this.numIncorrectAnswers = res.incorrect
    //     this.numUnanswered = res.blank
    //     this.passPercentage = res.passPercentage
    //     this.result = res.overallResult
    //     if (this.result >= this.passPercentage) {
    //       this.isCompleted = true
    //     }
    //     const top = document.getElementById('quiz-end')
    //     if (top !== null) {
    //       top.scrollIntoView({ behavior: 'smooth', block: 'start' })
    //     }
    //     this.clearStoragePartial()
    //   },
    //   (_error: any) => {
    //     this.fetchingResultsStatus = 'error'
    //     this.snackbar.open(_error.error.params.errmsg)
    //   },
    // )
  }
  showAnswers() {
    this.showMtfAnswers()
    this.showFitbAnswers()
    this.viewState = 'answer'
  }

  showMtfAnswers() {
    // if (this.questionsReference) {
    //   this.questionsReference.forEach(questionReference => {
    //     questionReference.matchShowAnswer()
    //   })
    // }
  }

  showFitbAnswers() {
    if (this.questionsReference) {
      // this.questionsReference.forEach(questionReference => {
      //   questionReference.functionChangeBlankBorder()
      // })
    }
  }

  calculateResults() {
    const correctAnswers = this.quizJson.questions.map(
      // tslint:disable-next-line
      question => {
        return {
          questionType: question.questionType,
          questionId: question.questionId,
          correctOptions: question.options
            .filter(option => option.isCorrect)
            .map(option =>
              question.questionType === 'fitb' ? option.text : option.optionId,
            ),
          correctMtfOptions: question.options
            .filter(option => option.isCorrect)
            .map(option =>
              question.questionType === 'mtf' ? option : undefined,
            ),
        }
      },
    )
    // logger.log(correctAnswers);
    this.numCorrectAnswers = 0
    this.numIncorrectAnswers = 0
    correctAnswers.forEach(answer => {
      const correctOptions = answer.correctOptions
      const correctMtfOptions = answer.correctMtfOptions
      let selectedOptions: any =
        this.questionAnswerHash[answer.questionId] || []
      if (
        answer.questionType &&
        answer.questionType === 'fitb' &&
        this.questionAnswerHash[answer.questionId] &&
        this.questionAnswerHash[answer.questionId][0]
      ) {
        selectedOptions =
          this.questionAnswerHash[answer.questionId][0].split(',') || []
        let correctFlag = true
        let unTouched = false
        if (selectedOptions.length < 1) {
          unTouched = true
        }
        if (correctOptions.length !== selectedOptions.length) {
          correctFlag = false
        }
        if (correctFlag && !unTouched) {
          for (let i = 0; i < correctOptions.length; i += 1) {
            if (
              correctOptions[i].trim().toLowerCase() !==
              selectedOptions[i].trim().toLowerCase()
            ) {
              correctFlag = false
            }
          }
        }
        if (correctFlag && !unTouched) {
          this.numCorrectAnswers += 1
        } else if (!unTouched) {
          this.numIncorrectAnswers += 1
        }
        this.showFitbAnswers()
      } else if (answer.questionType === 'mtf') {
        let unTouched = false
        let correctFlag = true
        if (selectedOptions.length < 1 || selectedOptions[0].length < 1) {
          unTouched = true
        } else if (selectedOptions[0].length < correctMtfOptions.length) {
          correctFlag = false
        }
        if (selectedOptions && selectedOptions[0]) {
          // logger.log(selectedOptions)
          // logger.log(correctOptions)
          (selectedOptions[0] as any[]).forEach(element => {
            const b = element.sourceId
            if (correctMtfOptions) {
              const option = correctMtfOptions[(b.slice(-1) as number) - 1] || { match: '' }
              const match = _.get(option, 'match')
              if (match && match.trim() === element.target.innerHTML.trim()
              ) {
                element.setPaintStyle({
                  stroke: '#357a38',
                })
                this.setBorderColor(element, '#357a38')
              } else {
                element.setPaintStyle({
                  stroke: '#f44336',
                })
                correctFlag = false
                this.setBorderColor(element, '#f44336')
              }
            }
          })
        }
        if (correctFlag && !unTouched) {
          this.numCorrectAnswers += 1
        } else if (!unTouched) {
          this.numIncorrectAnswers += 1
        }
      } else {
        if (
          correctOptions.sort().join(',') === selectedOptions.sort().join(',')
        ) {
          this.numCorrectAnswers += 1
        } else if (selectedOptions.length > 0) {
          this.numIncorrectAnswers += 1
        }
      }
    })
    this.numUnanswered =
      this.quizJson.questions.length -
      this.numCorrectAnswers -
      this.numIncorrectAnswers
  }

  setBorderColor(connection: OnConnectionBindInfo, color: string) {
    const connectionSourceId = document.getElementById(connection.sourceId)
    const connectionTargetId = document.getElementById(connection.targetId)
    if (connectionSourceId) {
      connectionSourceId.style.borderColor = color
    }
    if (connectionTargetId) {
      connectionTargetId.style.borderColor = color
    }
  }

  isQuestionAttempted(questionId: string): boolean {
    return !(Object.keys(this.questionAnswerHash).indexOf(questionId) === -1)
  }

  isQuestionMarked(questionId: string) {
    return this.markedQuestions.has(questionId as unknown as never)
  }

  markQuestion(questionId: string) {
    if (this.markedQuestions.has(questionId as unknown as never)) {
      this.markedQuestions.delete(questionId as unknown as never)
    } else {
      this.markedQuestions.add(questionId as unknown as never)
    }
  }
  action($event: string) {
    switch ($event) {
      case 'retake':
        // raise telemetry
        this.clearStoragePartial()
        this.clearStorage()
        this.retake = true
        this.init()
        break
    }
  }
  raiseTelemetry(action: string, optionId: string | null, event: string) {
    if (optionId) {
      this.events.raiseInteractTelemetry(
        {
          type: action,
          subType: event,
          id: optionId,
        },
        {
          id: optionId,
        },
      )
    } else {
      this.events.raiseInteractTelemetry(
        {
          type: action,
          subType: event,
          id: this.identifier,
        },
        {
          id: this.identifier,
        },
        {
          pageIdExt: `quiz`,
          module: WsEvents.EnumTelemetrymodules.LEARN,
        })
    }
  }
  checkAns(quesIdx: number) {
    if (quesIdx > 0 && quesIdx <= this.totalQCount && this.current_Question.editorState && this.current_Question.editorState.options) {
      this.showAnswer = true
      this.quizSvc.shCorrectAnswer(true)
    }
  }
  updateVisivility() {
    this.quizSvc.displayCorrectAnswer.subscribe(displayAns => {
      this.showAnswer = displayAns
    })
  }
  clearStorage() {
    this.quizSvc.paperSections.next(null)
    this.quizSvc.questionAnswerHash.next({})
    this.quizSvc.qAnsHash({})
    this.quizSvc.secAttempted.next([])
    // this.markedQuestions = new Set([])
    // this.questionAnswerHash = {}
    this.attemptSubData = []
    this.viewState = 'initial'
    this.currentQuestion = null
    this.currentQuestionIndex = 0
    // this.isSubmitted = true
  }
  clearStoragePartial() {
    this.quizSvc.paperSections.next(null)
    this.quizSvc.questionAnswerHash.next({})
    this.quizSvc.qAnsHash({})
    this.quizSvc.secAttempted.next([])
    // this.markedQuestions = new Set([])
    // this.questionAnswerHash = {}
    this.attemptSubData = []
    this.currentQuestionIndex = 0
    this.currentQuestion = null

    // this.viewState = 'initial'
    // this.isSubmitted = true
  }
  clearQuizJson() {
    this.quizJson = {
      isAssessment: false,
      questions: [],
      timeLimit: 0,
      allowSkip: 'No',
      maxQuestions: 0,
      requiresSubmit: 'Yes',
      showTimer: 'Yes',
      primaryCategory: NsContent.EPrimaryCategory.PRACTICE_RESOURCE,
    }
  }
  ngOnDestroy() {
    this.clearStorage()
    if (this.attemptSubscription) {
      this.attemptSubscription.unsubscribe()
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
    if (this.telemetrySubscription) {
      this.telemetrySubscription.unsubscribe()
    }
  }

  async getQuizResult() {
    const req = {
      request: {
        assessmentId: this.generateRequest.identifier,
        batchId: this.generateRequest.batchId,
        courseId: this.generateRequest.courseId,
      },
    }
    const resultRes: any = await this.quizSvc.quizResult(req).toPromise().catch(_error => {})
    if (resultRes && resultRes.params && resultRes.params.status.toLowerCase() === 'success') {
      if (resultRes.result) {
        this.fetchingResultsStatus = (resultRes.result.isInProgress) ?  'fetching' : 'done'
        this.assignQuizResult(resultRes.result)
      }
    } else if (resultRes && resultRes.params && resultRes.params.status.toLowerCase() === 'failed') {
      this.finalResponse = resultRes.responseCode
    }
  }

  assignQuizResult(res: NSPractice.IQuizSubmitResponseV2) {
    this.updateProgress(2)
    this.finalResponse = res
    if (this.quizJson.isAssessment) {
      this.isIdeal = true
    }
    this.clearQuizJson()
    this.fetchingResultsStatus = 'done'
    this.numCorrectAnswers = res.correct
    this.numIncorrectAnswers = res.incorrect
    this.numUnanswered = res.blank
    this.passPercentage = res.passPercentage
    this.result = res.overallResult
    if (this.result >= this.passPercentage) {
      this.isCompleted = true
    }
    const top = document.getElementById('quiz-end')
    if (top !== null) {
      top.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    this.clearStoragePartial()
  }
  formate(text: string): SafeHtml {
    let newText = '<ul>'
    if (text) {
      const splitTest = text.split('\n')
      for (let index = 0; index < text.split('\n').length; index += 1) {
        const text1 = splitTest[index]
        if (text1 && text1.trim()) {
          newText += `<li>${text1.trim()}</li>`
        }
      }
    }
    newText += `</ul>`
    return this.sanitized.bypassSecurityTrustHtml(newText)
  }
}
