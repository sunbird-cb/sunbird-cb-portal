import {
  Component,
  ElementRef,
  Input,
  OnChanges, OnDestroy, OnInit,
  QueryList,
  SimpleChanges,
  ViewChild, ViewChildren,
} from '@angular/core'
import { MatDialog, MatSidenav } from '@angular/material'
import { interval, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { NSPractice } from './practice.model'
import { QuestionComponent } from './components/question/question.component'
import { SubmitQuizDialogComponent } from './components/submit-quiz-dialog/submit-quiz-dialog.component'
import { OnConnectionBindInfo } from 'jsplumb'
import { PracticeService } from './practice.service'
import { EventService, NsContent, WsEvents } from '@sunbird-cb/utils'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'
// tslint:disable-next-line
import _ from 'lodash'
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
  @Input() quizJson = {
    timeLimit: 0,
    questions: [
      {
        multiSelection: false,
        section: '',
        question: '',
        questionId: '',
        questionType: '',
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
  }
  @ViewChildren('questionsReference') questionsReference: QueryList<QuestionComponent> | null = null
  @ViewChild('sidenav', { static: false }) sideNav: MatSidenav | null = null
  @ViewChild('submitModal', { static: false }) submitModal: ElementRef | null = null
  currentQuestionIndex = 0
  currentTheme = ''
  fetchingResultsStatus: FetchStatus = 'none'
  fetchingSectionsStatus: FetchStatus = 'none'
  fetchingQuestionsStatus: FetchStatus = 'none'
  isCompleted = false
  isIdeal = false
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
  startTime = 0
  submissionState: NSPractice.TQuizSubmissionState = 'unanswered'
  telemetrySubscription: Subscription | null = null
  attemptSubData!: NSPractice.ISecAttempted[]
  attemptSubscription: Subscription | null = null
  timeLeft = 0
  timerSubscription: Subscription | null = null
  viewState: NSPractice.TQuizViewMode = 'initial'
  paramSubscription: Subscription | null = null
  paperSections: NSPractice.IPaperSection[] | null = null
  selectedSection: NSPractice.IPaperSection | null = null
  ePrimaryCategory = NsContent.EPrimaryCategory
  currentQuestion!: NSPractice.IQuestionV2 | any
  constructor(
    private events: EventService,
    public dialog: MatDialog,
    private quizSvc: PracticeService,
    private activatedRoute: ActivatedRoute,
    private viewerSvc: ViewerUtilService,
  ) {
    // this.getSections()
    if (quizSvc.questionAnswerHash.value) {
      this.questionAnswerHash = quizSvc.questionAnswerHash.getValue()
    }
  }
  ngOnInit() {
    this.attemptSubscription = this.quizSvc.secAttempted.subscribe(data => {
      this.attemptSubData = data
    })
  }
  getSections(_event: NSPractice.TUserSelectionType) {
    // this.identifier
    this.fetchingSectionsStatus = 'fetching'
    this.quizSvc.getSection('do_1134922417267752961130').subscribe((section: NSPractice.ISectionResponse) => {
      // console.log(section)
      this.fetchingSectionsStatus = 'done'
      if (section.responseCode && section.responseCode === 'OK') {
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
        // this.overViewed(event)
      }
    })
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
  startSection(section: NSPractice.IPaperSection) {
    if (section) {
      this.fetchingQuestionsStatus = 'fetching'
      this.selectedSection = section
      this.quizSvc.getQuestions(_.map(section.children, 'identifier')).subscribe(qqr => {
        this.fetchingQuestionsStatus = 'done'
        const question = _.get(qqr, 'result')
        const codes = _.compact(_.map(this.quizJson.questions, 'section') || [])
        this.quizSvc.startSection(section)
        // console.log(this.quizSvc.secAttempted.value)
        _.eachRight(question.questions, q => {
          // const qHtml = document.createElement('div')
          // qHtml.innerHTML = q.editorState.question
          if (codes.indexOf(section.code) === -1) {
            this.quizJson.questions.push({
              section: section.code,
              question: q.editorState.question, // qHtml.textContent || qHtml.innerText || '',
              multiSelection: ((q.qType || '').toLowerCase() === 'mcq-mca' ? true : false),
              questionType: (q.qType || '').toLowerCase(),
              questionId: q.identifier,
              options: this.getOptions(q),
            })
          }
        })
        this.overViewed('start')
      })
    }
  }
  getOptions(question: NSPractice.IQuestionV2): NSPractice.IOption[] {
    // debugger
    const options: NSPractice.IOption[] = []
    if (question && question.qType) {
      const qTyp = question.qType

      switch (qTyp) {
        // 'mcq-sca' | 'mcq-mca' | 'fitb' | 'mtf'
        case 'mcq-sca':
        case 'MCQ-SCA':
        case 'mcq-mca':
        case 'MCQ-MCA':
        case 'MCQ':
          _.each(question.editorState.options, o => {
            const aHtml = document.createElement('div')
            aHtml.innerHTML = o.value.body

            const vHtml = document.createElement('div')
            vHtml.innerHTML = o.value.value
            options.push({
              optionId: vHtml.textContent || vHtml.innerText || '',
              text: aHtml.textContent || aHtml.innerText || '',
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
        // tslint:disable
        case 'SA':
        case 'sa':
          // tslint:enable
          const ansHtml = document.createElement('div')
          ansHtml.innerHTML = question.editorState.answer || '<p></p>'

          const opIdHtml = document.createElement('div')
          opIdHtml.innerHTML = question.answer || '<p></p>'

          options.push({
            optionId: opIdHtml.textContent || opIdHtml.innerText || '',
            text: ansHtml.textContent || ansHtml.innerText || opIdHtml.textContent || opIdHtml.innerText || '',
            isCorrect: true,
          })
          break
        case 'mtf':
        case 'MTF':
          _.each(question.editorState.options, o => {
            options.push({
              isCorrect: true,
              optionId: o.value.value,
              text: (o.answer || '').toString(),
              hint: '',
              response: '',
              userSelected: false,
              matchForView: o.value.value,
              match: o.value.body,
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
    } // if (!this.sidenavOpenDefault) {
    //   if (this.sideNav) {
    //     this.sideNav.close()
    //   }
    // }
    // const questionElement = document.getElementById(`question${qIndex}`)
    // if (questionElement) {
    //   questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // }
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const change in changes) {
      if (change === 'quiz') {
        if (
          this.quizJson &&
          this.quizJson.timeLimit
        ) {
          this.quizJson.timeLimit *= 1000
        }
      }
    }
  }
  getNextQuestion(idx: any) {
    if (idx !== this.currentQuestionIndex) {
      this.currentQuestionIndex = idx
    }
    const questions = _.get(this.quizJson, 'questions')
    this.currentQuestion = questions && questions[idx] ? questions[idx] : null
  }
  get current_Question() {
    return this.currentQuestion
  }
  get currentIndex() {
    return this.currentQuestionIndex
  }
  get totalQCount(): number {
    const questions = _.get(this.quizJson, 'questions') || []
    return questions.length
  }
  backToSections() {
    this.viewState = 'detail'
  }
  ngOnDestroy() {
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

  overViewed(event: NSPractice.TUserSelectionType) {
    if (event === 'start') {
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
    const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
      this.activatedRoute.snapshot.queryParams.collectionId : ''
    const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
      this.activatedRoute.snapshot.queryParams.batchId : ''
    this.viewerSvc.realTimeProgressUpdateQuiz(this.identifier, collectionId, batchId, status)
  }

  startQuiz() {
    // this.sidenavOpenDefault = true
    // setTimeout(() => { this.sidenavOpenDefault = false }, 500)
    this.viewState = 'attempt'
    this.getNextQuestion(this.currentQuestionIndex)
    this.startTime = Date.now()
    this.markedQuestions = new Set([])
    this.questionAnswerHash = {}
    this.currentQuestionIndex = 0
    this.timeLeft = this.quizJson.timeLimit
    if (this.primaryCategory !== this.ePrimaryCategory.PRACTICE_RESOURCE
      && this.quizJson.timeLimit > -1) {
      this.timerSubscription = interval(100)
        .pipe(
          map(
            () =>
              this.startTime + this.quizJson.timeLimit - Date.now(),
          ),
        )
        .subscribe(_timeRemaining => {
          this.timeLeft -= 0.1
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

  fillSelectedItems(question: NSPractice.IQuestion, optionId: string) {
    if (typeof (optionId) === 'string') {
      this.raiseTelemetry('mark', optionId, 'click')
    } if (this.viewState === 'answer') {
      if (this.questionsReference) {
        this.questionsReference.forEach(questionReference => {
          questionReference.reset()
        })
      }
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
    this.quizSvc.qAnsHash(this.questionAnswerHash)
  }

  proceedToSubmit() {
    if (this.timeLeft || this.primaryCategory === this.ePrimaryCategory.PRACTICE_RESOURCE) {
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
  }
  back() {
    this.viewState = 'initial'
  }
  submitQuiz() {
    this.raiseTelemetry('quiz', null, 'submit')
    this.isSubmitted = true
    this.ngOnDestroy()
    if (!this.quizJson.isAssessment) {
      this.viewState = 'review'
      this.calculateResults()
    } else {
      this.viewState = 'answer'
    }
    const submitQuizJson = JSON.parse(JSON.stringify(this.quizJson))
    this.fetchingResultsStatus = 'fetching'
    const requestData: NSPractice.IQuizSubmitRequest = this.quizSvc.createAssessmentSubmitRequest(
      this.identifier,
      this.name,
      {
        ...submitQuizJson,
        timeLimit: this.quizJson.timeLimit * 1000,
      },
      this.questionAnswerHash,
    )

    const sanitizedRequestData: NSPractice.IQuizSubmitRequest = this.quizSvc.sanitizeAssessmentSubmitRequest(requestData)

    this.quizSvc.submitQuizV2(sanitizedRequestData).subscribe(
      (res: NSPractice.IQuizSubmitResponse) => {
        // call content progress with status 2 i.e, completed
        this.updateProgress(2)

        if (this.quizJson.isAssessment) {
          this.isIdeal = true
        }
        this.fetchingResultsStatus = 'done'
        this.numCorrectAnswers = res.correct
        this.numIncorrectAnswers = res.inCorrect
        this.numUnanswered = res.blank
        this.passPercentage = res.passPercent
        this.result = res.result
        if (this.result >= this.passPercentage) {
          this.isCompleted = true
        }
        // const result = {
        //   result: (this.numCorrectAnswers * 100.0) / this.processedContent.quiz.questions.length,
        //   total: this.processedContent.quiz.questions.length,
        //   blank: res.blank,
        //   correct: res.correct,
        //   inCorrect: res.inCorrect,
        //   passPercentage: res.passPercent,
        // }
        // this.quizSvc.firePlayerTelemetryEvent(
        //   this.processedContent.content.identifier,
        //   this.collectionId,
        //   MIME_TYPE.quiz,
        //   result,
        //   this.isCompleted,
        //   'DONE',
        //   this.isIdeal,
        //   true,
        // )
        const top = document.getElementById('quiz-end')
        if (top !== null) {
          top.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      },
      (_error: any) => {
        this.fetchingResultsStatus = 'error'
      },
    )
    // this.fetchingResultsStatus = 'done'
  }

  showAnswers() {
    this.showMtfAnswers()
    this.showFitbAnswers()
    this.viewState = 'answer'
  }

  showMtfAnswers() {
    if (this.questionsReference) {
      this.questionsReference.forEach(questionReference => {
        questionReference.matchShowAnswer()
      })
    }
  }

  showFitbAnswers() {
    if (this.questionsReference) {
      this.questionsReference.forEach(questionReference => {
        questionReference.functionChangeBlankBorder()
      })
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
}
