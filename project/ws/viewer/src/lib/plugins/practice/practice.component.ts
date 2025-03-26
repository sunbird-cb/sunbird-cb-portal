import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges, OnDestroy, OnInit,
  QueryList,
  SimpleChanges,
  ViewChild, ViewChildren,
  Renderer2,
  TemplateRef,
} from '@angular/core'
import { MatDialog, MatSidenav, MatSnackBar, MatSnackBarConfig } from '@angular/material'
import { Subscription, interval } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { NSPractice } from './practice.model'
import { QuestionComponent } from './components/question/question.component'
import { SubmitQuizDialogComponent } from './components/submit-quiz-dialog/submit-quiz-dialog.component'
import { OnConnectionBindInfo } from 'jsplumb'
import { PracticeService } from './practice.service'
import { EventService, NsContent, ValueService, WsEvents } from '@sunbird-cb/utils-v2'
import { WidgetContentService } from '@sunbird-cb/collection'
import { ActivatedRoute, NavigationStart, Router } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'
// tslint:disable-next-line
import _ from 'lodash'
import { NSQuiz } from '../quiz/quiz.model'
import { environment } from 'src/environments/environment'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ViewerDataService } from '../../viewer-data.service'
import { ViewerHeaderSideBarToggleService } from './../../viewer-header-side-bar-toggle.service'
import { FinalAssessmentPopupComponent } from './components/final-assessment-popup/final-assessment-popup.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
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
  @Input() quizData: any
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
        questionLevel: '',
        marks: 0,
        options: [
          {
            optionId: '',
            text: '',
            isCorrect: false,
          },
        ],
        choices: [],
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
  @ViewChild('itemTooltip', { static: false }) itemTooltip: ElementRef | null = null
  @ViewChild('tooltipTrigger', { static: false }) tooltipTrigger: ElementRef | null = null
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
  showToolTip = false
  coursePrimaryCategory: any
  currentSetNumber = 0
  noOfQuestionsPerSet = 20
  totalQuestionsCount = 0
  instructionAssessment: any = ''
  selectedSectionIdentifier: any
  questionSectionTableData: any = []
  questionVisitedData: any = []
  assessmentType = 'optionalWeightage'
  compatibilityLevel = 2
  selectedAssessmentCompatibilityLevel = 0
  sectionalInstruction: any = ''
  allSectionTimeLimit = 0
  totalAssessemntQuestionsCount = 0
  sectionalTimer = false
  questionStartTime: number = Date.now()
  timeSpentOnQuestions: any = {}
  charactersPerPage = 1300
  showQuestionMarks = 'No'
  questionParagraph = ''
  forPreview = (window.location.href.includes('public') || window.location.href.includes('author') ||
                window.location.href.includes('editMode') || window.location.href.includes('preview=true'))
  forCreatorMode = window.location.href.includes('editMode=true')

  public publicUserInfoForm!: FormGroup
  public submitted = false
  emailLengthVal = false

  @ViewChild('publicUserDialog', { static: true }) publicUserDialog!: TemplateRef<any>
  constructor(
    private events: EventService,
    public dialog: MatDialog,
    private quizSvc: PracticeService,
    private activatedRoute: ActivatedRoute,
    private viewerSvc: ViewerUtilService,
    private router: Router,
    private valueSvc: ValueService,
    // private vws: ViewerDataService,
    private formBuilder: FormBuilder,
    public snackbar: MatSnackBar,
    private sanitized: DomSanitizer,
    private viewerDataSvc: ViewerDataService,
    private viewerHeaderSideBarToggleService: ViewerHeaderSideBarToggleService,
    private renderer: Renderer2,
    private widgetContentService: WidgetContentService

  ) {
    if (environment.assessmentBuffer) {
      this.assessmentBuffer = environment.assessmentBuffer
    }
    this.renderer.listen('window', 'click', event => {
      const infoToolTip: any = document.getElementById('toolTipSection')
      if (infoToolTip && !infoToolTip.contains(event.target)) {
        this.showToolTip = false
      }
    })

  }

  toggleToolTip() {
    const tooltipStatus = this.showToolTip
    if (tooltipStatus) {
      this.showToolTip = false
    } else if (tooltipStatus === false) {
      this.showToolTip = true
    }
  }
  init() {
    if (window.innerWidth < 768) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }

    if ((this.forPreview && !this.forCreatorMode) &&
      this.primaryCategory === this.ePrimaryCategory.FINAL_ASSESSMENT &&
       (this.quizData && this.quizData.isPublic)) {
      this.getPublicUserDetails()
    }
    // if (this.coursePrimaryCategory === 'Standalone Assessment') {
    //   // this.getSections()
    // }
    this.isSubmitted = false
    this.markedQuestions = new Set([])
    this.questionAnswerHash = {}
    // this.quizSvc.mtfSrc.next({})
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
        // this.submitQuiz()
      }
      // console.log(val)
    })
    this.valueSvc.isXSmall$.subscribe((isXSmall: any) => {
      this.isXsmall = isXSmall
    })

    // this.quizSvc.checkAlreadySubmitAssessment.subscribe(result => {
    //   if (result) {
    //     this.isSubmitted = true
    //     this.viewState = 'answer' || 'review'
    //   }
    // })
  }

  getPublicUserDetails() {
    this.publicUserInfoForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: [
        '', [
          Validators.required,
          Validators.pattern(`^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`),
        ],
      ],
    })
    this.dialog.open(this.publicUserDialog, {
      disableClose: true,
      panelClass: 'public-user-dialog',
      backdropClass: 'public-user-backdrop',
      height : 'auto',
      data: {},
    })
  }

  retakeAssessment() {
    if (window.innerWidth < 768) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    // if (this.coursePrimaryCategory === 'Standalone Assessment') {
    //   // this.getSections()
    // }
    this.isSubmitted = false
    this.markedQuestions = new Set([])
    this.questionAnswerHash = {}
    // this.quizSvc.mtfSrc.next({})
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
    this.valueSvc.isXSmall$.subscribe((isXSmall: any) => {
      this.isXsmall = isXSmall
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
    // if (this.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE) {
    //   this.canAttempt = {
    //     attemptsAllowed: 1,
    //     attemptsMade: 0,
    //   }
    //   this.init()
    //   this.updateVisivility()
    // } else {

    if ((this.forPreview && !this.forCreatorMode)) {
      this.init()
      this.updateVisivility()
    } else {
      if (this.selectedAssessmentCompatibilityLevel) {
        if (this.selectedAssessmentCompatibilityLevel < 7) {
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
        } else {
          this.quizSvc.canAttendV5(this.identifier).subscribe(response => {
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
    }

    // }
  }
  ngOnInit() {
    this.attemptSubscription = this.quizSvc.secAttempted.subscribe(data => {
      this.attemptSubData = data
    })
    if (this.quizSvc.questionAnswerHash.value) {
      this.questionAnswerHash = this.quizSvc.questionAnswerHash.getValue()
    }

    this.coursePrimaryCategory = this.widgetContentService.currentMetaData.primaryCategory
    if (this.widgetContentService.currentMetaData.children && this.widgetContentService.currentMetaData.children.length) {
      this.widgetContentService.currentMetaData.children.map((item: any) => {
        const activeResource =  this.findNested(item, 'identifier', this.identifier)
        this.showQuestionMarks = item.showMarks ? item.showMarks : 'No'
          // this.selectedAssessmentCompatibilityLevel = item.compatibilityLevel
          // console.log('item.children', item.children)
          // console.log('selectedAssessmentCompatibilityLevel', this.selectedAssessmentCompatibilityLevel)
          // console.log('this.identifier',this.identifier, 'item.identifier', item.identifier)
          // this.canAttend()
          // if (this.identifier === item.identifier) {
          //   // this.instructionAssessment = item.description
          //   if (item.identifier) {
          //     this.getInstructionAssessmentPagination(item.description)
          //   }
          //   this.totalAssessemntQuestionsCount = item.maxQuestions
          // }
          if (activeResource && activeResource.compatibilityLevel) {
            this.selectedAssessmentCompatibilityLevel = activeResource.compatibilityLevel
          }
          if (activeResource && activeResource.maxQuestions) {
            this.totalAssessemntQuestionsCount = activeResource.maxQuestions
          }
          if (activeResource &&  activeResource.description) {
            this.instructionAssessment = activeResource.description
            this.getInstructionAssessmentPagination(activeResource.description)
          }
          this.canAttend()
      })
    }

    // console.log('this.widgetContentService.currentMetaData', this.widgetContentService)
    // console.log('this.identifier', this.identifier)
  }

  /* tslint:disable */
  findNested(obj: any, key: any, value: any) {

    // Base case
    if (obj[key] === value) {
      return obj
    }  {
      let keys = Object.keys(obj) // add this line to iterate over the keys

      for (let i = 0, len = keys.length; i < len; i++) {
        let k = keys[i] // use this key for iteration, instead of index "i"

        // add "obj[k] &&" to ignore null values
        if (obj[k] && typeof obj[k] == 'object') {
          let found: any = this.findNested(obj[k], key, value)
          if (found) {
            // If the object was found in the recursive call, bubble it up.
            return found
          }
        }
      }
    }
  }
  /* tslint:enable */
  getInstructionAssessmentPagination(htmlData: any) {
    const totalCharacters = htmlData.length
    const totalPages = Math.ceil(totalCharacters / this.charactersPerPage)
    this.instructionAssessment = []

    for (let i = 0; i < totalPages; i += 1) {
      const start = i * this.charactersPerPage
      const pageContent = htmlData.substr(start, this.charactersPerPage)
      this.instructionAssessment.push(pageContent)
    }
  }

  get getTimeLimit(): number {
    let jsonTime = (this.quizJson.timeLimit || 0)
    if (this.retake && jsonTime === 0) {
      jsonTime = _.get(this.activatedRoute, 'snapshot.data.content.data.expectedDuration') || 0
      this.quizJson.timeLimit = jsonTime
    }
    return jsonTime + this.assessmentBuffer
  }
  getSections() {
    // this.identifier
    this.questionSectionTableData = []
    this.markedQuestions = new Set([])
    this.questionAnswerHash = {}
    this.questionVisitedData = []
    if (this.assessmentType === 'optionalWeightage') {
      this.quizJson.questions  = []
    }

    if (this.forPreview && this.quizData.isPublic) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.quizData)
    }
    this.fetchingSectionsStatus = 'fetching'
    if (this.quizSvc.paperSections && this.quizSvc.paperSections.value
      && _.get(this.quizSvc.paperSections, 'value.questionSet.children')) {
      this.paperSections = _.get(this.quizSvc.paperSections, 'value.questionSet.children')
      this.questionSectionTableData = _.get(this.quizSvc.paperSections, 'value.questionSet.children')

      const showTimer = _.toLower(_.get(this.quizSvc.paperSections, 'value.questionSet.showTimer')) === 'yes'
      if (showTimer || this.primaryCategory !== NsContent.EPrimaryCategory.PRACTICE_RESOURCE) {
        this.quizJson.timeLimit = (_.get(this.quizSvc.paperSections, 'value.questionSet.expectedDuration') || 0)
      } else {
        // this.quizJson.timeLimit = this.duration * 60
        this.quizJson.timeLimit = this.quizJson.timeLimit
      }
      this.allSectionTimeLimit = (_.get(this.quizSvc.paperSections, 'value.questionSet.expectedDuration') || 0)
      this.fetchingSectionsStatus = 'done'
      this.viewState = 'detail'
      this.startIfonlySection()
    } else {
      if (this.selectedAssessmentCompatibilityLevel < 7) {

        this.quizSvc.getSectionV4(this.identifier, this.forPreview,
                                  this.getPublicContentRequestData()).subscribe((section: NSPractice.ISectionResponse) => {
          // console.log(section)
          if (section && section.result && section.result.response) {
            if ((this.forPreview && !this.forCreatorMode)) {
              this.showPublicUserPopUp('noAtempt')
            }
          } else {
            this.fetchingSectionsStatus = 'done'
            if (section.responseCode && section.responseCode === 'OK') {
              this.compatibilityLevel = section.result.questionSet.compatibilityLevel
              this.assessmentType = section.result.questionSet.assessmentType
              /** this is to enable or disable Timer */
              const showTimer = _.toLower(_.get(section, 'result.questionSet.showTimer')) === 'yes'
              if (showTimer) {
                this.quizJson.timeLimit = section.result.questionSet.expectedDuration
              } else {
                // this.quizJson.timeLimit = this.duration * 60
                this.quizJson.timeLimit = this.quizJson.timeLimit
              }
              this.allSectionTimeLimit = section.result.questionSet.expectedDuration
              // this.quizSvc.paperSections.next(section.result)
              const tempObj = _.get(section, 'result.questionSet.children')
              this.showQuestionMarks = _.get(section, 'result.questionSet.showMarks', 'No')
              this.updataDB(tempObj)
              this.paperSections = []
              this.questionSectionTableData = []
              let totalQuestions = 0
              _.each(tempObj, o => {
                if (this.paperSections) {
                  this.paperSections.push(o)
                  this.questionSectionTableData.push(o)
                  if (o.childNodes) {
                    totalQuestions = totalQuestions + o.childNodes.length
                  }
                }
              })
              this.totalAssessemntQuestionsCount = totalQuestions
              // this.paperSections = _.get(section, 'result.questionSet.children')
              this.viewState = 'detail'
              // this.updateTimer()
              this.startIfonlySection()
            }
          }
        })
      } else {
        this.quizSvc.getSection(this.identifier, this.forPreview,
                                this.getPublicContentRequestData()).subscribe((section: NSPractice.ISectionResponse) => {
          // console.log(section)
          if (section && section.result && section.result.response) {
            if ((this.forPreview && !this.forCreatorMode)) {
                this.showPublicUserPopUp('noAtempt')
              }
          } else {
            this.fetchingSectionsStatus = 'done'
            if (section.responseCode && section.responseCode === 'OK') {
              this.compatibilityLevel = section.result.questionSet.compatibilityLevel
              this.assessmentType = section.result.questionSet.assessmentType
              /** this is to enable or disable Timer */
              const showTimer = _.toLower(_.get(section, 'result.questionSet.showTimer')) === 'yes'
              if (showTimer) {
                this.quizJson.timeLimit = section.result.questionSet.expectedDuration
              } else {
                // this.quizJson.timeLimit = this.duration * 60
                this.quizJson.timeLimit = this.quizJson.timeLimit
              }
              this.allSectionTimeLimit  = section.result.questionSet.expectedDuration
              // this.quizSvc.paperSections.next(section.result)
              const tempObj = _.get(section, 'result.questionSet.children')
              this.showQuestionMarks = _.get(section, 'result.questionSet.showMarks', 'No')
              this.updataDB(tempObj)
              this.paperSections = []
              this.questionSectionTableData = []
              let totalQuestions = 0
              _.each(tempObj, o => {
                if (this.paperSections) {
                  this.paperSections.push(o)
                  this.questionSectionTableData.push(o)
                  if (o.childNodes) {
                    totalQuestions = totalQuestions + o.childNodes.length
                  }
                }
              })
              this.totalAssessemntQuestionsCount = totalQuestions
              // this.paperSections = _.get(section, 'result.questionSet.children')
              this.viewState = 'detail'
              // this.updateTimer()
              this.startIfonlySection()
            }
          }
        })
      }

    }
  }
  startIfonlySection() {
    // console.log('in start only section', this.isOnlySection)
    // directly start section if only section is there is set
    // if (this.isOnlySection) {
    //   const firstSection = _.first(this.paperSections) || null
    //   if (firstSection) {
    //     this.nextSection(firstSection)
    //     this.overViewed('start')
    //   }
    // }
    const firstSection = _.first(this.paperSections) || null
    if (firstSection) {
      this.nextSection(firstSection)
      this.overViewed('start')
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
    this.totalQuestionsCount = qq ? qq.length : 0
    const setStartIndex = this.noOfQuestionsPerSet * this.currentSetNumber
    const setEndIndex = setStartIndex + this.noOfQuestionsPerSet
    const secQuestions = qq.slice(setStartIndex, setEndIndex)
    return this.selectedAssessmentCompatibilityLevel < 7 ? qq : secQuestions
  }

  get hasNextSet(): boolean {
    return this.totalQuestionsCount > this.noOfQuestionsPerSet * (this.currentSetNumber + 1)
  }

  nextSection(section: NSPractice.IPaperSection) {
    // this.quizSvc.currentSection.next(section)
    this.startSection(section)
  }

  changeSection(identifier: any) {
   const selectedSection: any =  _.filter(this.paperSections, { identifier })
   if (selectedSection && selectedSection.length) {
    this.selectedSectionIdentifier = selectedSection[0]['identifier']
    this.startSection(selectedSection[0])
   }
  }
  startSection(section: NSPractice.IPaperSection) {

    this.sectionalInstruction = section.additionalInstructions
    this.selectedSectionIdentifier = section.identifier
    if (section.childNodes && section.childNodes.length) {
      this.totalQuestionsCount = section.childNodes.length
      this.questionAttemptedCount = 0
    }

    if (section && section.expectedDuration) {
      this.quizJson.timeLimit = section.expectedDuration
      this.timeLeft  = section.expectedDuration
      this.sectionalTimer = true
    } else {
      this.sectionalTimer = false
    }
    // this.quizJson.timeLimit = (_.get(this.quizSvc.paperSections, 'value.questionSet.expectedDuration') || 0)
    if (section) {
      // this.quizSvc.currentSection.next(section)
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
          // console.log('question--', question)
          const codes = _.compact(_.map(this.quizJson.questions, 'section') || [])
          this.quizSvc.startSection(section)
          // console.log(this.quizSvc.secAttempted.value)
          _.each(question.questions, q => {
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
                questionLevel: q.questionLevel,
                marks: q.totalMarks,
                rhsChoices: this.getRhsValue(q),
                choices: q.choices ? q.choices : [],
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
        //   _.each(question.questions, q => {
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

      if (section && section.questionParagraph) {
        const questionParagraph = section.questionParagraph
        this.questionParagraph = questionParagraph.replace(/&nbsp;/g, ' ')
      } else {
        this.questionParagraph = ''
      }
    }
  }
  getMultiQuestions(ids: string[]) {
    if (this.selectedAssessmentCompatibilityLevel < 7) {
      return this.quizSvc.getQuestionsV4(ids, this.identifier, this.forPreview,
                                         this.viewerSvc.publicUserDetails, this.collectionId).toPromise()
    }
      return this.quizSvc.getQuestions(ids, this.identifier, this.forPreview,
                                       this.viewerSvc.publicUserDetails, this.collectionId).toPromise()
  }
  getRhsValue(question: NSPractice.IQuestionV2) {
    if (question && question.qType) {
      const qTyp = question.qType
      switch (qTyp) {
        case 'MTF':
          return question.rhsChoices
        default:
          return []
      }
    }
    return []
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
        case 'MCQ-MCA-W':
        case 'MCQ-SCA-TF':
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
    const currentQuestionId = this.currentQuestion ? this.currentQuestion.questionId : ''
    if (currentQuestionId && this.secQuestions && this.currentQuestion.section === this.secQuestions[0]['section']) {
      this.calculateTimeSpentOnQuestion(currentQuestionId)
    } else {
      this.setQuestionStartTime()
    }
    const questions = this.secQuestions
    if (this.assessmentType === 'optionalWeightage') {
      if (idx > 0) {
        if (questions && questions[idx - 1]) {
          const response = this.isQuestionAttempted(questions[idx - 1]['questionId'])
          if (!response) {
            this.openSnackbar('Please attempt the current question to move on next question.')
          } else {
            if (this.totalQCount > idx) {
              this.process = true
              if (idx !== this.currentQuestionIndex) {
                this.currentQuestionIndex = idx
              }

              this.currentQuestion = questions && questions[idx] ? questions[idx] : null
              if (questions[idx] && questions[idx]['questionId'] &&
              !(this.questionVisitedData.indexOf(questions[idx]['questionId']) > -1)) {
                this.questionVisitedData.push(questions[idx]['questionId'])
              }

              setTimeout(() => {
                this.process = false
                // tslint:disable-next-line
              }, 10)
              this.showAnswer = false
              this.matchHintDisplay = []

              if (this.compatibilityLevel <= 6) {
                // console.log(this.generateRequest)
              }
            }
          }
        }
      } else {
        if (this.totalQCount > idx) {
          this.process = true
          if (idx !== this.currentQuestionIndex) {
            this.currentQuestionIndex = idx
          }

          this.currentQuestion = questions && questions[idx] ? questions[idx] : null
          if (questions[idx] && questions[idx]['questionId'] && !(this.questionVisitedData.indexOf(questions[idx]['questionId']) > -1)) {
            this.questionVisitedData.push(questions[idx]['questionId'])
          }

          setTimeout(() => {
            this.process = false
            // tslint:disable-next-line
          }, 10)
          this.showAnswer = false
          this.matchHintDisplay = []

          if (this.compatibilityLevel <= 6) {
            // console.log(this.generateRequest)
          }
        }
      }

    } else {
      if (this.totalQCount > idx) {
        this.process = true
        if (idx !== this.currentQuestionIndex) {
          this.currentQuestionIndex = idx
        }

        this.currentQuestion = questions && questions[idx] ? questions[idx] : null
        if (questions[idx] && questions[idx]['questionId'] && !(this.questionVisitedData.indexOf(questions[idx]['questionId']) > -1)) {
          this.questionVisitedData.push(questions[idx]['questionId'])
        }

        setTimeout(() => {
          this.process = false
          // tslint:disable-next-line
        }, 10)
        this.showAnswer = false
        this.matchHintDisplay = []

        if (this.compatibilityLevel <= 6) {
          // console.log(this.generateRequest)
        }
      }
    }

  }

  clearQuestion(question: any) {
    if (this.questionAnswerHash[question.questionId]) {
      delete this.questionAnswerHash[question.questionId]
      this.quizSvc.questionAnswerHash.next(this.questionAnswerHash)
    }
    this.quizSvc.clearResponse.next(question.questionId)
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
    if (this.totalAssessemntQuestionsCount) {
      return this.totalAssessemntQuestionsCount
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
    if (this.identifier && collectionId && batchId) {
      this.viewerSvc.realTimeProgressUpdateQuiz(this.identifier, collectionId, batchId, status)
    }
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
            if (this.paperSections && this.paperSections.length) {
              if (this.allSecAttempted.full) {
                this.isIdeal = true
                this.timeLeft = 0
                if (this.timerSubscription) {
                  this.timerSubscription.unsubscribe()
                }
                this.submitQuiz()
              } else if (this.allSecAttempted.next) {
                this.nextSection(this.allSecAttempted.next)
              }
            } else {
              this.isIdeal = true
              this.timeLeft = 0
              if (this.timerSubscription) {
                this.timerSubscription.unsubscribe()
              }
              this.submitQuiz()
            }

          }
        })
    }
  }

  get allSecAttempted(): { full: boolean, next: NSPractice.IPaperSection | null, sectionsCount: number } {
    const sections = this.quizSvc.secAttempted.getValue()
    let fullAttempted = false
    let sectionsCount = 0
    if (sections && sections.length) {
      sectionsCount = sections.length
      const attemped = _.filter(sections, s => s.fullAttempted || s.isAttempted)
      fullAttempted = (attemped || []).length === sections.length
    }
    const currentSectionId = _.get(this.selectedSection, 'identifier') || _.get(this.quizSvc, 'currentSection.value.identifier')
    const nextId = _.get(_.first(_.filter(_.get(this.quizSvc.secAttempted, 'value'), { identifier: currentSectionId })), 'nextSection')
    // const next = _.first(_.filter(_.get(this.paperSections, 'childNodes'), { identifier: nextId }))
    let next: any
    if (this.paperSections) {
      next = this.paperSections.filter(el => {
        return el.identifier === nextId
      })[0]
    }

    return { next, sectionsCount, full: fullAttempted }
  }

  fillSelectedItems(question: NSPractice.IQuestion, response: any) {
    let optionId: any
    let checked: any
    if (this.assessmentType === 'optionalWeightage')  {
      optionId = response['index']
      checked = response['status']
    } else {
       optionId = response
    }

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
      if (this.assessmentType === 'optionalWeightage') {
        if (!checked) {
          if (this.questionAnswerHash[question.questionId]) {
            // const questionIndex = this.questionAnswerHash[question.questionId].indexOf(optionId)
            // this.questionAnswerHash[question.questionId].splice(questionIndex, 1)
            delete this.questionAnswerHash[question.questionId]
          }
        } else {
          this.questionAnswerHash[question.questionId] = [optionId]
        }
      } else {
        this.questionAnswerHash[question.questionId] = [optionId]
      }

    }
    // tslint:disable-next-line
    if (question.questionType && question.questionType === 'mtf') {
      const mTfval = this.quizSvc.mtfSrc.getValue()
      mTfval[question.questionId] = {
        // [_.first(_.map(optionId, 'source.innerText'))]: {
        source: _.map(optionId, 'source.innerText'),
        target: _.map(optionId, 'target.id'),
        // target: [wrapper.firstChild.innerHTML]
        // sourceId: _.first(_.map(optionId, 'source.id')),
        // targetId: _.first(_.map(optionId, 'target.id')),
        // },
      }
      // console.log('mTfval--', mTfval)
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
      // if (this.coursePrimaryCategory === 'Standalone Assessment') {
      if (this.selectedAssessmentCompatibilityLevel >= 7) {
        const submitAssessment = true
        this.openSectionPopup(submitAssessment)
      } else {
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
      }

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
        const timeSpent = this.timeSpentOnQuestions[sq.questionId] ? this.timeSpentOnQuestions[sq.questionId] : ''
        switch (_.toLower(sq.questionType || '')) {
          case 'mcq-mca':
            const mcqMca: NSPractice.IMCQ_MCA = {
              identifier: sq.questionId,
              question: sq.question,
              mimeType: NsContent.EMimeTypes.QUESTION,
              objectType: 'Question',
              primaryCategory: NsContent.EPrimaryCategory.MULTIPLE_CHOICE_QUESTION,
              qType: 'MCQ-MCA',
              questionLevel: sq.questionLevel ? sq.questionLevel : '',
              timeTaken: timeSpent.toString(),
              timeSpent: timeSpent.toString(),
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
          case 'mcq-mca-w':
            const mcqMcaW: NSPractice.IMCQ_MCA_W = {
              identifier: sq.questionId,
              question: sq.question,
              mimeType: NsContent.EMimeTypes.QUESTION,
              objectType: 'Question',
              primaryCategory: NsContent.EPrimaryCategory.MULTIPLE_CHOICE_QUESTION,
              qType: 'MCQ-MCA-W',
              questionLevel: sq.questionLevel,
              timeTaken: timeSpent.toString(),
              timeSpent: timeSpent.toString(),
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
            responseQ.push(mcqMcaW)
            break
          case 'mcq-sca':
            const mcqSca: NSPractice.IMCQ_SCA = {
              identifier: sq.questionId,
              mimeType: NsContent.EMimeTypes.QUESTION,
              objectType: 'Question',
              question: sq.question,
              primaryCategory: NsContent.EPrimaryCategory.SINGLE_CHOICE_QUESTION,
              qType: 'MCQ-SCA',
              questionLevel: sq.questionLevel ? sq.questionLevel : '',
              timeTaken: timeSpent.toString(),
              timeSpent: timeSpent.toString(),
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
            const obj: any = {}
            let optionsAll: any = []
            if (sq.options && sq.options.length) {
              optionsAll =  _.compact(_.map(sq.options, (_o: NSPractice.IOption, idx: number) => {
                  if (_o.response) {
                    return {
                      index: (_o.optionId || idx).toString(),
                      selectedAnswer: _o.response || '',
                    } as NSPractice.IResponseOptions
                  } return null
                }))
                // selectedAnswer: _.join(_.map(sq.options, (_o: NSPractice.IOption) => {
                //   return _o.response
                // }),
                //   // tslint:disable-next-line:align
                //   ','
                // ),

            } else {
              /* tslint:disable */
              for (let i = 0; i < Object.keys(this.questionAnswerHash).length; i++) {
                if (Object.keys(this.questionAnswerHash)[i] === sq.questionId) {
                  /* tslint:disable */
                  for (let j = 0; j < Object.values(this.questionAnswerHash)[i].length; j++) {
                    obj['index'] = j,
                    obj['selectedAnswer'] = Object.values(this.questionAnswerHash)[i][j]
                    optionsAll.push(obj)
                  }

                }
              }
            }
            const ftb: NSPractice.IMCQ_FTB = {
              identifier: sq.questionId,
              mimeType: NsContent.EMimeTypes.QUESTION,
              objectType: 'Question',
              question: sq.question,
              primaryCategory: NsContent.EPrimaryCategory.FTB_QUESTION,
              qType: 'FTB',
              questionLevel: sq.questionLevel,
              timeTaken: timeSpent.toString(),
              timeSpent: timeSpent.toString(),
              editorState: { options: [] },
            }
            
            if (sq.options.length === 0 && this.questionAnswerHash[sq.questionId]) {
              const ftbAns = this.questionAnswerHash[sq.questionId][0].split(',')
              ftbAns.forEach((ans: string, index) => {
                ftb.editorState.options.push({
                  index: index.toString(),
                  selectedAnswer: ans,
                })
              })
            } else if( this.questionAnswerHash[sq.questionId]) {
              const ftbAns = this.questionAnswerHash[sq.questionId][0].split(',')
              ftbAns.forEach((ans: string, index) => {
                ftb.editorState.options.push({
                  index: index.toString(),
                  selectedAnswer: ans,
                })
              })
            }
            responseQ.push(ftb)
            break
          case 'mtf':
            let optionAll:any = []
            optionAll = _.compact(_.map(sq.options, (_o: any) => {
              if (_o.userSelected && this.questionAnswerHash[sq.questionId]) {
                return {
                  index: (_o.optionId).toString(),
                  selectedAnswer: _o.response,
                } as NSPractice.IResponseOptions
              }
              return null

            }))
            const mtf: NSPractice.IMCQ_MTF = {
              identifier: sq.questionId,
              mimeType: NsContent.EMimeTypes.QUESTION,
              objectType: 'Question',
              question: sq.question,
              primaryCategory: NsContent.EPrimaryCategory.MTF_QUESTION,
              qType: 'MTF',
              questionLevel: sq.questionLevel,
              timeTaken: timeSpent.toString(),
              timeSpent: timeSpent.toString(),
              editorState: {
                options:  optionAll.filter((o:any) => { return o.hasOwnProperty('index'); }).length > 0 ? optionAll : [],
              },
            }
            responseQ.push(mtf)
            break
          case 'mcq-sca-tf': 
          const mcqScaTF: any = {
            identifier: sq.questionId,
            mimeType: NsContent.EMimeTypes.QUESTION,
            objectType: 'Question',
            question: sq.question,
            primaryCategory: NsContent.EPrimaryCategory.SINGLE_CHOICE_QUESTION,
            qType: 'MCQ-SCA-TF',
            questionLevel: sq.questionLevel ? sq.questionLevel : '',
            timeTaken: timeSpent.toString(),
            timeSpent: timeSpent.toString(),
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
          responseQ.push(mcqScaTF)
          break
        }
      })
    }
    return responseQ
  }
  async submitQuiz() {
    this.raiseTelemetry('quiz', null, 'submit')
    
    if(this.assessmentType !== 'optionalWeightage') {
      if (this.primaryCategory !== NsContent.EPrimaryCategory.PRACTICE_RESOURCE) {
        this.showOverlay = true
        setTimeout(() => {
          this.showOverlay = false
          this.viewerHeaderSideBarToggleService.visibilityStatus.next(true)
        },         5000)
      } else {
        this.viewerHeaderSideBarToggleService.visibilityStatus.next(true)
      }
  
      this.isSubmitted = true
      this.ngOnDestroy()
      if (!this.quizJson.isAssessment) {
        this.viewState = 'review'
        // this.calculateResults()
      } else {
        this.viewState = 'answer'
      }
      
      let allPromiseResolvedCount = 0
      if(this.paperSections && this.paperSections.length) {
        for(let i =0 ; i< this.paperSections.length;i++) {
          let section = this.paperSections[i];
          const lst = _.chunk(section.childNodes || [], 1000)
          const prom: any[] = []
          _.each(lst, l => {
            prom.push(this.getMultiQuestions(l))
          })
          Promise.all(prom).then(qqr => {
            allPromiseResolvedCount++;
            const question = { questions: _.flatten(_.map(qqr, 'result.questions')) }
            const codes = _.compact(_.map(this.quizJson.questions, 'section') || [])
            // console.log(this.quizSvc.secAttempted.value)
            _.each(question.questions, q => {
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
                  questionLevel: q.questionLevel,
                  marks: q.totalMarks,
                  rhsChoices: this.getRhsValue(q),
                  choices: q.choices ? q.choices : []
                })
              }
            })
           
            
            if(this.paperSections && this.paperSections.length === allPromiseResolvedCount) {
              // console.log('this.quizJson',this.quizJson)
              // console.log('this.generateRequest',this.generateRequest)
              this.submitAfterAllPromiseResolved();
            }
          })
        }
             
      }
    } else {
      this.submitQuizForOptionWeightage()
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

  async submitAfterAllPromiseResolved() {
    if(!this.forPreview || this.forCreatorMode){
      if (this.selectedAssessmentCompatibilityLevel < 7) {
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
      } else {
        if(this.selectedAssessmentCompatibilityLevel >=8) {
          const quizV4Res: any = await this.quizSvc.submitQuizV6(this.generateRequest).toPromise().catch(_error => {})
          if (quizV4Res && quizV4Res.params && quizV4Res.params.status.toLowerCase() === 'success') {
            if (quizV4Res.result.primaryCategory === 'Course Assessment') {
              setTimeout(() => {
                this.getQuizResult()
              },         environment.quizResultTimeout)
            } else if (quizV4Res.result.primaryCategory === 'Practice Question Set') {
              this.assignQuizResult(quizV4Res.result)
            }
          }
        } else {
          const quizV4Res: any = await this.quizSvc.submitQuizV5(this.generateRequest).toPromise().catch(_error => {})
          if (quizV4Res && quizV4Res.params && quizV4Res.params.status.toLowerCase() === 'success') {
            if (quizV4Res.result.primaryCategory === 'Course Assessment') {
              setTimeout(() => {
                this.getQuizResult()
              },         environment.quizResultTimeout)
            } else if (quizV4Res.result.primaryCategory === 'Practice Question Set') {
              this.assignQuizResult(quizV4Res.result)
            }
          }
        }
      }
    } else {
      let requestData = this.generateRequest
      requestData = {
        ...requestData,
        ...this.viewerSvc.publicUserDetails,
        contextId: this.collectionId
      }
      
      const quizV4Res: any = await this.quizSvc.publicSubmit(requestData).toPromise().catch(_error => {})
          if (quizV4Res && quizV4Res.params && quizV4Res.params.status.toLowerCase() === 'success') {
            if (quizV4Res.result.primaryCategory === 'Course Assessment') {
              setTimeout(() => {
                this.getQuizResult()
                if(this.forPreview && this.quizData.isPublic){
                  this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.quizData)
                }
              },         environment.quizResultTimeout)
            } else if (quizV4Res.result.primaryCategory === 'Practice Question Set') {
              this.assignQuizResult(quizV4Res.result)
            }
      }
    }
  }

  async submitQuizForOptionWeightage() {
    let allPromiseResolvedCount = 0
    if(this.paperSections && this.paperSections.length) {
      for(let i =0 ; i< this.paperSections.length;i++) {
        let section = this.paperSections[i];
        const lst = _.chunk(section.childNodes || [], 1000)
        const prom: any[] = []
        _.each(lst, l => {
          prom.push(this.getMultiQuestions(l))
        })
        Promise.all(prom).then(qqr => {
          console.log('qqr', qqr)
          allPromiseResolvedCount++;
          const question = { questions: _.flatten(_.map(qqr, 'result.questions')) }
          const codes = _.compact(_.map(this.quizJson.questions, 'section') || [])
          // console.log(this.quizSvc.secAttempted.value)
          _.each(question.questions, q => {
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
                questionLevel: q.questionLevel,
                marks: q.totalMarks,
                rhsChoices: this.getRhsValue(q),
                choices: q.choices ? q.choices : []
              })
            }
          })
         
          
          if(this.paperSections && this.paperSections.length === allPromiseResolvedCount) {
            // console.log('this.quizJson',this.quizJson)
            // console.log('this.generateRequest',this.generateRequest)
            this.submitAfterAllPromiseResolvedForOptionWeightage();
          }
        })
      }
           
    }
  }

  async submitAfterAllPromiseResolvedForOptionWeightage() {
    if(!this.forPreview  || this.forCreatorMode){
      if (this.selectedAssessmentCompatibilityLevel < 7) {
        await this.quizSvc.submitQuizV4(this.generateRequest).toPromise().catch(_error => {})
      
      } else {
        if (this.selectedAssessmentCompatibilityLevel >= 8) {
          await this.quizSvc.submitQuizV6(this.generateRequest).toPromise().catch(_error => {}) 
        } else {
          await this.quizSvc.submitQuizV5(this.generateRequest).toPromise().catch(_error => {}) 
        }
            
      }
    } else {
      let requestData : any = this.generateRequest
      requestData = {
        ...requestData,
        ...this.viewerSvc.publicUserDetails,
        contextId: this.collectionId
      }
      await this.quizSvc.publicSubmit(requestData ).toPromise().catch(_error => {}) 
      if(this.forPreview && this.quizData.isPublic){
        this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.quizData)
      }
    }
    if (!(this.quizJson.primaryCategory === 'Course Assessment' || this.quizJson.primaryCategory === 'Practice Question Set')) {
      this.updateProgress(2)
    }
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

  isQuestionVisited(questionId: string) {
    return (this.questionVisitedData.indexOf(questionId) > -1)
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
        this.raiseInteractTelemetry()
        this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.quizData)
        this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.quizData)
        this.clearStoragePartial()
        this.clearStorage()
        this.retake = true
        this.isSubmitted = false
        
        // this.init()
        if(!this.forPreview) {
          if(this.selectedAssessmentCompatibilityLevel < 7) {
            // this.init()
            if(this.ePrimaryCategory.FINAL_ASSESSMENT == this.primaryCategory ) {
              this.quizSvc.canAttend(this.identifier).subscribe(response => {
                if (response) {
                    this.canAttempt = response
                  //  this.canAttempt = {
                  //   attemptsAllowed: 1,
                  //   attemptsMade: 0,
                  // }
                }
              })
            }          
            this.retakeAssessment()
          } else {      
            if(this.ePrimaryCategory.FINAL_ASSESSMENT == this.primaryCategory && !this.forPreview) {
              this.quizSvc.canAttendV5(this.identifier).subscribe(response => {
                if (response) {
                    this.canAttempt = response
                  //  this.canAttempt = {
                  //   attemptsAllowed: 1,
                  //   attemptsMade: 0,
                  // }
                }
              })
            }          
            this.retakeAssessment()
          }
        }
        
        
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
  toggleExpandforMobile() {
    this.expandFalse = !this.expandFalse
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
    const req: any = {
      request: {
        assessmentId: this.generateRequest.identifier,
        batchId: this.generateRequest.batchId,
        courseId: this.generateRequest.courseId,
      },
    }
    if(this.forPreview) {
      req.request['email'] = this.viewerSvc.publicUserDetails.email
      req.request['assessmentIdentifier'] =  this.generateRequest.identifier
      req.request['contextId'] =  this.generateRequest.courseId
    }
    if(this.selectedAssessmentCompatibilityLevel < 7) {
      const resultRes: any = await this.quizSvc.quizResult(req,this.forPreview).toPromise().catch(_error => {})
      if (resultRes && resultRes.params && resultRes.params.status.toLowerCase() === 'success') {
        if (resultRes.result) {
          this.fetchingResultsStatus = (resultRes.result.isInProgress) ?  'fetching' : 'done'
          this.assignQuizResult(resultRes.result)
        }
        if((this.forPreview && !this.forCreatorMode) && resultRes.result ) {
          this.showPublicUserPopUp(resultRes.result.pass? 'pass': 'fail')
        }
      } else if (resultRes && resultRes.params && resultRes.params.status.toLowerCase() === 'failed') {
        this.finalResponse = resultRes.responseCode
      }
    } else {
      if(this.forPreview) {
        req.request['email'] = this.viewerSvc.publicUserDetails.email
        req.request['assessmentIdentifier'] =  this.generateRequest.identifier
        req.request['contextId'] =  this.generateRequest.courseId
      }
      const resultRes: any = await this.quizSvc.quizResultV5(req,this.forPreview).toPromise().catch(_error => {})
      if (resultRes && resultRes.params && resultRes.params.status.toLowerCase() === 'success') {
        if (resultRes.result) {
          this.fetchingResultsStatus = (resultRes.result.isInProgress) ?  'fetching' : 'done'
          this.assignQuizResult(resultRes.result)
        }

        if((this.forPreview && !this.forCreatorMode) && resultRes.result) {
          this.showPublicUserPopUp(resultRes.result.pass? 'pass': 'fail')
        }
      } else if (resultRes && resultRes.params && resultRes.params.status.toLowerCase() === 'failed') {
        this.finalResponse = resultRes.responseCode
      }
    }
    
  }

  assignQuizResult(res: NSPractice.IQuizSubmitResponseV2) {
    if (!(this.quizJson.primaryCategory === 'Course Assessment' || this.quizJson.primaryCategory === 'Practice Question Set')) {
      this.updateProgress(2)
    }
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
    this.result = typeof res.overallResult === 'number' ? res.overallResult : 0
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

  raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {
    const event = {
        eventType: WsEvents.WsEventType.Telemetry,
        eventLogLevel: WsEvents.WsEventLogLevel.Info,
        from: 'test',
        to: '',
        data: {
            state,
            type: WsEvents.WsTimeSpentType.Player,
            mode: WsEvents.WsTimeSpentMode.Play,
            content: data,
            identifier: data ? data.identifier : null,
            mimeType: NsContent.EMimeTypes.QUESTION_SET,
            url: data ? data.artifactUrl : null,
            object: {
                id: data ? data.identifier : null,
                type: data ? data.primaryCategory : '',
                rollup: {
                    l1: this.activatedRoute.snapshot.queryParams.collectionId || '',
                },
            },
        },
    }
    this.events.dispatchEvent(event)
  }

  raiseInteractTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'reattempt-test',
        subType: this.primaryCategory,
      },
      {
         id: this.quizData.identifier,
         type: this.assessmentType,
         rollup: {
            l1: this.activatedRoute.snapshot.queryParams.collectionId || '',
        },
      }
    )
  }

  openSectionPopup(submitAssessment = false, getTime = true) {
    const currentQuestionId = this.currentQuestion ? this.currentQuestion.questionId : ''
    if(currentQuestionId && this.secQuestions && this.currentQuestion.section === this.secQuestions[0]['section'] && getTime) {
      this.calculateTimeSpentOnQuestion(currentQuestionId)
    } else {
      this.setQuestionStartTime()
    }
    const tableColumns: any[] = [
      { header: 'practiceoverview.section', key: 'section' },
      { header: 'practiceoverview.noOfQuestions', key: 'NoOfQuestions' },
      { header: 'practiceoverview.answered', key: 'answered' },
      { header: 'practiceoverview.notAnswered', key: 'notAnswered' },
      { header: 'practiceoverview.markedForReview', key: 'markedForReview' },
      { header: 'practiceoverview.notVisited', key: 'notVisited' },
    ]
    const tableData: any = []
    /* tslint:disable */
    for (let i = 0; i < this.questionSectionTableData.length; i++) {
      if(submitAssessment) {
        const sectionChildNodes = this.getSectionTableDataCounts(this.questionSectionTableData[i]['childNodes'])
        const tableObj = {
          section: this.questionSectionTableData[i]['name'],
          // NoOfQuestions: this.questionSectionTableData[i]['maxQuestions'],
          NoOfQuestions: this.questionSectionTableData[i]['childNodes'].length,
          answered: sectionChildNodes.answeredCount,
          notAnswered: sectionChildNodes.notAnsweredCount,
          markedForReview: sectionChildNodes.markedForReviewCount,
          notVisited: sectionChildNodes.notVisitedCount,
        }
        tableData.push(tableObj)
      } else {
        if(this.questionSectionTableData[i]['identifier'] === this.selectedSectionIdentifier) {
          const sectionChildNodes = this.getSectionTableDataCounts(this.questionSectionTableData[i]['childNodes'])
          const tableObj = {
            section: this.questionSectionTableData[i]['name'],
            // NoOfQuestions: this.questionSectionTableData[i]['maxQuestions'],
            NoOfQuestions: this.questionSectionTableData[i]['childNodes'].length,
            answered: sectionChildNodes.answeredCount,
            notAnswered: sectionChildNodes.notAnsweredCount,
            markedForReview: sectionChildNodes.markedForReviewCount,
            notVisited: sectionChildNodes.notVisitedCount,
          }
          tableData.push(tableObj)
        }
      }
     
    }
    let popupData:any = {
      headerText: this.resourceName,
      assessmentType: this.assessmentType,
      tableDetails: {
        tableColumns,
        tableData,
      }      
     
    }

    if(submitAssessment) {
      popupData['warningNote']= 'practiceoverview.warningNoteForAssessmentSubmit',
      popupData['buttonsList'] =[
        {
          response: 'yes',
          text: 'practiceoverview.submitYes',
          classes: 'blue-outline',
        },
        {
          response: 'no',
          text: 'practiceoverview.submitNo',
          classes: 'blue-full',
        },
        // {
        //   response: 'Back',
        //   text: 'back',
        //   classes: 'gray-full'
        // },
      ]
    } else if(this.allSecAttempted.full) {
      popupData['buttonsList'] =[
        {
          response: 'back',
          text: 'practiceoverview.back',
          classes: 'gray-full',
        },
        {
          response: 'submitAssessment',
          text: 'practiceoverview.submitTest',
          classes: 'blue-full',
        }
      ]
    }
     else if(this.allSecAttempted.next) {
      popupData['buttonsList'] =[
        {
          response: 'next-section',
          text: 'practiceoverview.nextSection',
          classes: 'blue-full',
        },
        {
          response: 'no',
          text: 'practiceoverview.backToAssessment',
          classes: 'gray-full',
        }
      ]
    }

    if (this.assessmentType === 'optionalWeightage') {
      if(this.secQuestions.length !== Object.keys(this.questionAnswerHash).length) {        
          this.openSnackbar('Please attempt the current question to move on next question.')        
      } else {
        this.submitQuiz()
        this.showOverlay = true
        setTimeout(() => {
          this.showOverlay = false
          this.showAssessmentPopup(popupData)
        },         5000)
      }
      
      

    } else {
      this.showAssessmentPopup(popupData)
    }

  }

  showAssessmentPopup(popupData: any) {    
    const dialogRef =  this.dialog.open(FinalAssessmentPopupComponent, {
      data: popupData,
      width: popupData.assessmentType === 'optionalWeightage' ? '300px' : '1000px',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'final-assessment',
    })
    // dialogRef.componentInstance.xyz = this.configSvc
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        switch (result) {
          case 'yes':
          this.submitQuiz()
          break
          case 'next-section':
            if(this.allSecAttempted.next) {              
              this.nextSection(this.allSecAttempted.next)
            }
            
          break;
          case 'retake':
          if(this.assessmentType === 'optionalWeightage') {
            setTimeout(() => {
              this.showOverlay = false
              this.viewerHeaderSideBarToggleService.visibilityStatus.next(true)
            },100)
          }
         
          this.action('retake')
          break;
          case 'submitAssessment':
            const submitAssessment = true
            const getTime = false
            this.openSectionPopup(submitAssessment, getTime)
            break;
          default :
            this.setQuestionStartTime()
        }

      }
    })
  }

  getSectionTableDataCounts(quesArray: any) {
    const obj  = {
      answeredCount : 0,
      notAnsweredCount: 0,
      markedForReviewCount: 0,
      notVisitedCount: 0,
    }
    const markedQuestionArray:any = [...this.markedQuestions]
    /* tslint:disable */
    const questionAnswerHashKeys:string[] = Object.keys(this.questionAnswerHash)
    for (let i = 0; i < questionAnswerHashKeys.length; i++) {
      if (quesArray.indexOf(questionAnswerHashKeys[i]) > -1
        && markedQuestionArray.indexOf(questionAnswerHashKeys[i]) < 0) {
        obj['answeredCount'] = obj['answeredCount'] + 1
      }

    }
    /* tslint:disable */
    for (let i = 0; i < markedQuestionArray.length; i++) {
      if (quesArray.indexOf(markedQuestionArray[i]) > -1) {
        obj['markedForReviewCount'] = obj['markedForReviewCount'] + 1
      }

    }
    /* tslint:disable */
    for (let i = 0; i < this.questionVisitedData.length; i++) {
      if (quesArray.indexOf(this.questionVisitedData[i]) > -1) {
        obj['notVisitedCount'] = obj['notVisitedCount'] + 1
      }
    }
    obj['notVisitedCount'] = quesArray.length - obj['notVisitedCount']
    obj['notAnsweredCount'] = (quesArray.length - obj['answeredCount'] - obj['markedForReviewCount'] - obj['notVisitedCount'])

    return obj
  }

  getQuestionIndex(index: number): number {
    return (this.noOfQuestionsPerSet * this.currentSetNumber) + index + 1
  }

  getSectionTotalQuestionAndAnswerCount() {
    let obj:any = {totalCount:0, answered:0, notAnswered:0, markedForReview:0, notVisited:0}
    if(this.questionSectionTableData && this.questionSectionTableData.length) {      
      for(let i = 0; i<this.questionSectionTableData.length;i++) {
        if(this.questionSectionTableData[i]['identifier'] === this.selectedSectionIdentifier) {
          const sectionChildNodes = this.getSectionTableDataCounts(this.questionSectionTableData[i]['childNodes'])
          obj = {
            section: this.questionSectionTableData[i]['name'],
            totalCount: this.questionSectionTableData[i]['childNodes'].length,
            answered: sectionChildNodes.answeredCount,
            notAnswered: sectionChildNodes.notAnsweredCount,
            markedForReview: sectionChildNodes.markedForReviewCount,
            notVisited: sectionChildNodes.notVisitedCount,
          }
          break;
        }
      }
    }
    return obj
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    if (window.innerWidth <= 1200) {
      const config = new MatSnackBarConfig()
      config.panelClass = ['show-answer-alert-class']
      config.duration = duration
      config.verticalPosition = 'top'
      config.horizontalPosition = 'center',
      this.snackbar.open(primaryMsg, '', config)
    } else {
      const config = new MatSnackBarConfig()
      config.panelClass = ['show-answer-alert-class']
      config.duration = duration
      this.snackbar.open(primaryMsg, '', config)
    }
  }

  getAllQuestionAnswer() {
    // let count = 0;
    // if(this.generateRequest.children && this.generateRequest.children.length) {
    //   for(let i=0; i<this.generateRequest.children[0].children.length;i++) {
    //     if(this.generateRequest.children[0].children[i] &&
    //       this.generateRequest.children[0].children[i]['editorState'] && 
    //       this.generateRequest.children[0].children[i]['editorState']['options'] 
    //       ) {
    //         let optionLength:any = this.generateRequest.children[0].children[i]['editorState']['options'];
    //         if(optionLength.length) {
    //           count++;
    //         }            
    //       }        
    //   }
    // }
    // return count
    return Object.keys(this.questionAnswerHash).length
  }

  calculateTimeSpentOnQuestion(currentQuestionId: string) {
    if(currentQuestionId) {
      if(this.timeSpentOnQuestions && this.timeSpentOnQuestions[currentQuestionId]) {
        this.timeSpentOnQuestions[currentQuestionId] = this.timeSpentOnQuestions[currentQuestionId] + this.timeSpent
      } else {
        this.timeSpentOnQuestions[currentQuestionId] = this.timeSpent
      }
    }
    this.setQuestionStartTime()
  }

  get timeSpent(): number {
    const timeSpentNow = Date.now() - this.questionStartTime;
    return timeSpentNow
  }

  setQuestionStartTime() {
    this.questionStartTime = Date.now()
  }

  get getTimeZone(): string {
    if (this.selectedSection) {
      if (this.timeLeft < (this.selectedSection!.expectedDuration * 0.2)) {
        return 'countDownTimerReg'
      } else if (this.timeLeft < (this.selectedSection!.expectedDuration * 0.5)) {
        return 'countDownTimerOrange'
      }
    } else if (this.quizJson.timeLimit) {
      if (this.timeLeft < (this.quizJson.timeLimit * 0.2)) {
        return 'countDownTimerReg'
      } else if (this.timeLeft < (this.quizJson.timeLimit * 0.5)) {
        return 'countDownTimerOrange'
      }
    }
    return 'countDownTimerGreen' 
  }

  emailVerification(emailId: string) {
    this.emailLengthVal = false
    if (emailId && emailId.length > 0) {
      const email = emailId.split('@')
      if (email && email.length === 2) {
        if ((email[0] && email[0].length > 64) || (email[1] && email[1].length > 255)) {
          this.emailLengthVal = true
        }
      } else {
        this.emailLengthVal = false
      }
    }
  }
  submitpublicUserInfo() {
    this.viewerSvc.publicUserDetails =  this.publicUserInfoForm.value
    this.dialog.closeAll()
  }

  getPublicContentRequestData(){
    let assessmentReadReqData = {}

    if(this.forPreview){
      assessmentReadReqData = {
        "assessmentIdentifier":this.identifier,
        "contextId": this.collectionId,
        ...this.viewerSvc.publicUserDetails
      }
    }
    return assessmentReadReqData
  }
  showPublicUserPopUp(ontype: string) {
    let msg: any = ''
    switch(ontype) {
      case 'pass':
        msg = 'Congratulations! Your certificate will be sent to your email soon.'
        break;
      case 'noAtempt':
        msg = 'You have successfully completed the assessment! If you have not received your certificate yet, don’t worry—we will resend them shortly.'
        break;
      case 'fail':
        msg = 'Unfortunately, you did not pass. Please retake the assessment.'
        break
      default:
        msg = 'Your certificate has been successfully resent to your email.'
        break;
    }
    const dialogRef =  this.dialog.open(FinalAssessmentPopupComponent, {
      data: {
        assessmentType:'publicUserSuccess',
        message: msg,
        popUpType: ontype
      },
      width:'320px',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'final-assessment',
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       if(ontype === 'noAtempt') {
        this.router.navigateByUrl(`public/toc/${this.collectionId}/overview`)
       } else  if(ontype === 'pass') {
        this.router.navigateByUrl(`public/toc/${this.collectionId}/overview`)
       }
      } else {
        if(ontype !== 'fail') {
          this.router.navigateByUrl(`public/toc/${this.collectionId}/overview`)
        }
      }
    })
  }
}