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
  @Input() question: NSPractice.IQuestion = {
    multiSelection: false,
    section: '',
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
    // debugger
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
  get numConnections() {
    if (this.jsPlumbInstance) {
      return (this.jsPlumbInstance.getAllConnections() as any[]).length
    }

    return 0
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

  ifFillInTheBlankCorrect(id: string) {
    const blankPosition: number = id.slice(-1) as unknown as number
    const text = this.question.options[blankPosition].text
    const valueOfBlank = document.getElementById(id) as HTMLInputElement
    if (text.trim().toLowerCase() === valueOfBlank.value.trim().toLowerCase()) {
      this.correctOption[blankPosition] = true
    } else {
      this.correctOption[blankPosition] = false
    }
    if (valueOfBlank.value.length < 1) {
      this.unTouchedBlank[blankPosition] = true
    } else {
      this.unTouchedBlank[blankPosition] = false
    }
  }
  reset() {
    if (this.question.questionType === 'ftb') {
      // this.resetBlankBorder()
    } else if (this.question.questionType === 'mtf') {
      // this.resetColor()
      // this.resetMtf()
    }
  }
  // matchShowAnswer() {
  //   if (this.question.questionType === 'mtf') {
  //     this.jsPlumbInstance.deleteEveryConnection()
  //     for (let i = 1; i <= this.question.options.length; i += 1) {
  //       const questionSelector = `#c1${this.question.questionId}${i}`
  //       for (let j = 1; j <= this.question.options.length; j += 1) {
  //         const answerSelector = `#c2${this.question.questionId}${j}`
  //         const options = this.question.options[i - 1]
  //         if (options) {
  //           const match = options.match
  //           const selectors: HTMLElement[] = this.jsPlumbInstance.getSelector(answerSelector) as unknown as HTMLElement[]
  //           if (match && match.trim() === selectors[0].innerText.trim()) {
  //             const endpoint = `[
  //               'Dot',
  //               {
  //                 radius: 5
  //               }
  //             ]`
  //             this.jsPlumbInstance.connect({
  //               endpoint,
  //               source: this.jsPlumbInstance.getSelector(questionSelector) as unknown as Element,
  //               target: this.jsPlumbInstance.getSelector(answerSelector) as unknown as Element,
  //               anchors: ['Right', 'Left'],
  //             })
  //           }
  //         }
  //       }
  //     }
  //     this.changeColor()
  //   }
  // }

  resetBlankBorder() {
    // for (let i = 0; i < (this.question.question.match(/_______________/g) || []).length; i += 1) {
    //   this.elementRef.nativeElement
    //     .querySelector(`#${this.question.questionId}${i}`)
    //     .setAttribute('style', 'border-style: none none solid none; border-width: 1px; padding: 8px 12px;')
    // }
  }
  // log(val: any) {
  //   // console.log(val)
  // }
}
