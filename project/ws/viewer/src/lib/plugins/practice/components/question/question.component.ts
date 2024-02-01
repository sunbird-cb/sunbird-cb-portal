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
import { NsContent } from '@sunbird-cb/utils/src/public-api'

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
  @Input() ePrimaryCategory:any;
  @Input() totalQCount:any;
  @Input() showAnswer:any;
  @Input() current_Question:any;
  @Input() question: NSPractice.IQuestion = {
    multiSelection: false,
    section: '',
    instructions: '',
    editorState: undefined,
    question: '',
    questionId: '',
    options: [
      {
        optionId: '',
        text: '',
        isCorrect: false,
      },
    ],
  }
  @Input() itemSelectedList: string[] = []
  @Input() markedQuestions: Set<string> = new Set()
  @Output() itemSelected = new EventEmitter<string | Object>()
  @Input()
  quizAnswerHash: { [questionId: string]: string[] } = {}
  title = 'match'
  itemSelectedList1: any
  jsPlumbInstance: any
  safeQuestion: SafeHtml = ''
  correctOption: boolean[] = []
  unTouchedBlank: boolean[] = []
  matchHintDisplay: NSPractice.IOption[] = []

  constructor(
    // private domSanitizer: DomSanitizer,
    // private elementRef: ElementRef,
    private practiceSvc: PracticeService,
  ) { }

  ngOnInit() {
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
        const baseUrl = this.artifactUrl.split('/')
        const newUrl = this.artifactUrl.replace(baseUrl[baseUrl.length - 1], temp[0])
        this.question.question = this.question.question.replace(toBeReplaced, `src="${newUrl}"`)
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
    }
  }

  setBorderColorById(id: string, color: string | null) {
    const elementById: HTMLElement | null = document.getElementById(id)
    if (elementById && color) {
      elementById.style.borderColor = color
    }
  }

  checkAns(quesIdx: number) {
    if (quesIdx > 0 && quesIdx <= this.totalQCount && this.current_Question.editorState && this.current_Question.editorState.options) {
      this.showAnswer = true
      this.practiceSvc.shCorrectAnswer(true)
    }
  }

}
