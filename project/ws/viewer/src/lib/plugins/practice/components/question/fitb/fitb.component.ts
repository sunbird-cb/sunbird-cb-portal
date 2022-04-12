import {
    AfterViewInit, Component,
    ElementRef,
    EventEmitter,
    // HostListener,
    Input,
    OnChanges, OnInit,
    Output,
    SimpleChanges, ViewEncapsulation,
} from '@angular/core'
import { SafeHtml, DomSanitizer } from '@angular/platform-browser'
import { NSPractice } from '../../../practice.model'
import { PracticeService } from '../../../practice.service'

@Component({
    selector: 'viewer-fitb-question',
    templateUrl: './fitb.component.html',
    styleUrls: ['./fitb.component.scss'],
    // tslint:disable-next-line
    encapsulation: ViewEncapsulation.None
})
export class FillInTheBlankComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() question: NSPractice.IQuestion = {
        multiSelection: false,
        section: '',
        question: '',
        instructions: '',
        questionId: '',
        options: [
            {
                optionId: '',
                text: '',
                isCorrect: false,
            },
        ],
    }
    localQuestion: string = this.question.question
    safeQuestion: SafeHtml = ''
    @Output() update = new EventEmitter<string | Object>()
    // tslint:disable-next-line
    constructor(
        private domSanitizer: DomSanitizer,
        private elementRef: ElementRef,
        private practiceSvc: PracticeService,
    ) {

    }
    ngOnInit() {
        this.localQuestion = this.question.question
        this.init()
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {

        }
    }
    onEntryInBlank(_id: any) {
        const arr = []
        for (let i = 0; i < (this.localQuestion.match(/matInput/g) || []).length; i += 1) {
            const blank: HTMLInputElement = this.elementRef.nativeElement.querySelector(`#${this.question.questionId}${i}`)
            arr.push(blank.value.trim())
        }
        // console.log(arr)
        this.update.emit(arr.join())
        // this.ifFillInTheBlankCorrect(id)
    }
    onChange(id: any, _event: any) {
        this.onEntryInBlank(id)
    }
    ngAfterViewInit(): void {
        if (this.question.questionType === 'ftb') {
            for (let i = 0; i < (this.localQuestion.match(/matInput/g) || []).length; i += 1) {
                this.elementRef.nativeElement
                    .querySelector(`#${this.question.questionId}${i}`)
                    .addEventListener('change', this.onChange.bind(this, this.question.questionId + i))
            }
        }
    }

    init() {
        if (this.question.questionType === 'ftb') {
            // if (this.practiceSvc.questionAnswerHash.value && this.practiceSvc.questionAnswerHash.value[this.question.questionId]) {
            //     needToModify = false
            //     let value = this.practiceSvc.questionAnswerHash.value[this.question.questionId]
            //     console.log(value)
            // }
            // if (needToModify) {
            let value = (this.practiceSvc.questionAnswerHash.value[this.question.questionId] || '')
            value = value.toString().split(',')
            // tslint:disable-next-line
            const iterationNumber = (this.localQuestion.match(/_______________/g) || []).length
            for (let i = 0; i < iterationNumber; i += 1) {
                // tslint:disable-next-line
                this.localQuestion = this.localQuestion.replace('_______________', 'idMarkerForReplacement')
                // this.correctOption.push(false)
                // this.unTouchedBlank.push(true)
            }
            for (let i = 0; i < iterationNumber; i += 1) {
                if (this.question.options.length > 0) {
                    // console.log('============>', i, this.question.options[i].text)
                    if (value[i]) {
                        this.localQuestion = this.localQuestion.replace(
                            'idMarkerForReplacement',
                            `<input matInput autocomplete="off" style="border-style: none none solid none;
                   padding: 8px 12px;" type="text" id="${this.question.questionId}${i}"
                  value="${value[i]}" />`,
                        )
                    } else {
                        this.localQuestion = this.localQuestion.replace(
                            'idMarkerForReplacement',
                            `<input matInput autocomplete="off" style="border-style: none none solid none;
                   padding: 8px 12px;" type="text" id="${this.question.questionId}${i}"
                   />`,
                        )
                    }
                }
            }
        } else {
            for (let i = 0; i < (this.localQuestion.match(/matInput/g) ||
                this.localQuestion.match(/matInput/g) || []).length; i += 1) {
                // console.log(this.elementRef.nativeElement.querySelector(`#${this.question.questionId}${i}`))
            }
        }
        this.safeQuestion = this.domSanitizer.bypassSecurityTrustHtml(this.localQuestion)
        // }
    }
    functionChangeBlankBorder() {
        // if (this.question.questionType === 'ftb') {
        //   for (let i = 0; i < (this.question.question.match(/_______________/g) || []).length; i += 1) {
        //     if (this.correctOption[i] && !this.unTouchedBlank[i]) {
        //       this.elementRef.nativeElement
        //         .querySelector(`#${this.question.questionId}${i}`)
        //         .setAttribute('style', 'border-style: none none solid none; border-width: 1px; padding: 8px 12px; border-color: #357a38')
        //     } else if (!this.correctOption[i] && !this.unTouchedBlank[i]) {
        //       this.elementRef.nativeElement
        //         .querySelector(`#${this.question.questionId}${i}`)
        //         .setAttribute('style', 'border-style: none none solid none; border-width: 1px; padding: 8px 12px; border-color: #f44336')
        //     } else if (this.unTouchedBlank[i]) {
        //       this.elementRef.nativeElement
        //         .querySelector(`#${this.question.questionId}${i}`)
        //         .setAttribute('style', 'border-style: none none solid none; border-width: 1px; padding: 8px 12px;')
        //     }
        //   }
        // }
    }
}
