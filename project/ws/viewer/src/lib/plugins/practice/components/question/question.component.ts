import {
  AfterViewInit, Component, EventEmitter,
  Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation,
} from '@angular/core'
import { NSPractice } from '../../practice.model'
import { SafeHtml } from '@angular/platform-browser'
// import { jsPlumb, OnConnectionBindInfo } from 'jsplumb'
import { PracticeService } from '../../practice.service'
// tslint:disable-next-line
import _ from 'lodash'
import { NsContent } from '@sunbird-cb/utils-v2'
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarConfig as MatSnackBarConfig } from '@angular/material/legacy-snack-bar'
@Component({
  selector: 'viewer-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None
})
export class QuestionComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() artifactUrl = ''
  @Input() questionNumber = 0
  @Input() total = 0
  @Input() viewState = 'initial'
  @Input() primaryCategory = NsContent.EPrimaryCategory.PRACTICE_RESOURCE
  @Input() ePrimaryCategory: any
  @Input() totalQCount: any
  @Input() showAnswer: any
  @Input() currentQuestion: any
  @Input() selectedAssessmentCompatibilityLevel = 2
  @Input() question: NSPractice.IQuestion = {
    multiSelection: false,
    section: '',
    instructions: '',
    editorState: undefined,
    question: '',
    questionId: '',
    questionLevel: '',
    timeTaken: '',
    options: [
      {
        optionId: '',
        text: '',
        isCorrect: false,
      },
    ],
    choices: { options: [] },
  }
  @Input() itemSelectedList: string[] = []
  @Input() markedQuestions: Set<string> = new Set()
  @Output() itemSelected = new EventEmitter<string | Object>()
  @Output() getNextQuestion = new EventEmitter<Boolean>()
  @Output() clearQuestion = new EventEmitter<Boolean>()
  @Input() questionAnswerHash: any
  @Input() showQuestionMarks = 'No'
  @Input() questionParagraph = ''
  quizAnswerHash: { [questionId: string]: string[] } = {}
  title = 'match'
  itemSelectedList1: any
  jsPlumbInstance: any
  safeQuestion: SafeHtml = ''
  correctOption: boolean[] = []
  unTouchedBlank: boolean[] = []
  matchHintDisplay: NSPractice.IOption[] = []
  isMobile = false
  @Input() mobileQuestionSetExpand: any = false
  @Input() coursePrimaryCategory: any
  @Input() showOnlyQuestion: any
  @Input() showMarkForReview: any = false
  @Input() assessmentType = ''
  expandedQuestionSetSubscription: any

  constructor(
    // private elementRef: ElementRef,
    private practiceSvc: PracticeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }

    this.init()
  }

  ngAfterViewInit() {

  }

  init() {
    this.matchHintDisplay = []
    const res: string[] = this.question.question.match(/<img[^>]+src="([^">]+)"/g) || ['']
    for (const oldImg of res) {
      if (oldImg) {
        let temp = oldImg.match(/src="([^">]+)"/g) || ['']
        const toBeReplaced = temp[0]
        temp = [temp[0].replace('src="/', '')]
        temp = [temp[0].replace(/\"/g, '')]
        if (this.artifactUrl) {
          const baseUrl = this.artifactUrl.split('/')
          const newUrl = this.artifactUrl.replace(baseUrl[baseUrl.length - 1], temp[0])
          this.question.question = this.question.question.replace(toBeReplaced, `src="${newUrl}"`)
        }

      }
    }
    this.practiceSvc.questionAnswerHash.subscribe(val => {
      this.itemSelectedList1 = val[this.question.questionId]
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const change in changes) {
      if (change === 'questionNumber' || change === 'itemSelectedList') {
        this.init()
      }
    }
  }
  update($event: any) {
    this.itemSelected.emit($event)
  }
  isSelected(option: NSPractice.IOption) {
    return this.itemSelectedList && this.itemSelectedList.indexOf(option.optionId) !== -1
  }
  get selectedList() {
    return this.itemSelectedList || []
  }
  isQuestionMarked() {
    return this.markedQuestions.has(this.question.questionId)
  }

  markQuestion() {
    if (this.markedQuestions.has(this.question.questionId)) {
      this.markedQuestions.delete(this.question.questionId)
    } else {
      this.markedQuestions.add(this.question.questionId)
      if (this.selectedAssessmentCompatibilityLevel >= 7) {
        this.getNextQuestion.emit(true)
      }
    }
  }

  clearResponse() {
    this.clearQuestion.emit(true)
  }

  setBorderColorById(id: string, color: string | null) {
    const elementById: HTMLElement | null = document.getElementById(id)
    if (elementById && color) {
      elementById.style.borderColor = color
    }
  }

  checkAns(quesIdx: number) {
    if (!this.itemSelectedList) {
      this.openSnackbar('Please give your answer before showing the answer')
    } else {
      if (quesIdx > 0 && quesIdx <= this.totalQCount && this.currentQuestion.editorState && this.currentQuestion.editorState.options) {
        this.showAnswer = true
        this.practiceSvc.shCorrectAnswer(true)
      }
    }

  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    if (window.innerWidth <= 1200) {
      const config = new MatSnackBarConfig()
      config.panelClass = ['show-answer-alert-class']
      config.duration = duration
      config.verticalPosition = 'top'
      config.horizontalPosition = 'center',
      this.snackBar.open(primaryMsg, '', config)
    } else {
      const config = new MatSnackBarConfig()
      config.panelClass = ['show-answer-alert-class']
      config.duration = duration
      this.snackBar.open(primaryMsg, '', config)
    }
  }

}
