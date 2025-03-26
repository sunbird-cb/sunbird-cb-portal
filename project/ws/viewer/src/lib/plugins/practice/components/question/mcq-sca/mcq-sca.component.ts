import {
    Component,
    EventEmitter,
    // HostListener,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core'
import { NSPractice } from '../../../practice.model'
// tslint:disable-next-line
import _ from 'lodash'
import { Subscription } from 'rxjs'
import { PracticeService } from '../../../practice.service'
import { NsContent } from '@sunbird-cb/utils-v2'
@Component({
    selector: 'viewer-mcq-sca-question',
    templateUrl: './mcq-sca.component.html',
    styleUrls: ['./mcq-sca.component.scss'],
    // tslint:disable-next-line
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleChoiseQuesComponent implements OnInit, OnDestroy {
    @Input() question: NSPractice.IQuestion = {
        multiSelection: false,
        section: '',
        question: '',
        instructions: '',
        questionId: '',
        questionLevel: '',
        editorState: undefined,
        timeTaken: '',
        options: [
            {
                optionId: '',
                text: '',
                isCorrect: false,
            },
        ],
    }
    @Input() itemSelectedList: string[] = []
    @Input() primaryCategory = NsContent.EPrimaryCategory.PRACTICE_RESOURCE
    @Input() assessmentType = ''
    @Output() update = new EventEmitter<string | Object>()
    localQuestion: string = this.question.question
    shCorrectAnsSubscription: Subscription | null = null
    showAns = false
    constructor(
        private practiceSvc: PracticeService,
    ) {

    }
    ngOnInit() {
        if (this.shCorrectAnsSubscription) {
            this.shCorrectAnsSubscription.unsubscribe()
        }
        this.shCorrectAnsSubscription = this.practiceSvc.displayCorrectAnswer.subscribe(displayAns => {
            this.showAns = displayAns
        })
        this.localQuestion = this.question.question
        // this.subscription = this.practiceSvc.questionAnswerHash.subscribe((val) => {
        //     this.itemSelectedList = val[this.question.questionId]
        // })
    }
    // ngOnChanges(changes: SimpleChanges): void {
    //     // if (changes) {
    //     //     for (const change in changes) {
    //     //         if (change === 'questionNumber') {
    //     //             // this.ngOnInit() //question.currentValue
    //     //             this.question = changes.question.currentValue
    //     //         } else if (change === 'itemSelectedList') {
    //     //             this.itemSelectedList = changes.itemSelectedList.currentValue
    //     //         }
    //     //         // else if(change === 'question'){`
    //     //         //     // this.ngOnDestroy()
    //     //         // }
    //     //     }
    //     // }
    // }
    isSelected(option: NSPractice.IOption) {
        // let isSelected = false
        // const store = this.practiceSvc.questionAnswerHash.getValue()
        // if (store && store[this.question.questionId]) {
        //     isSelected = store[this.question.questionId].indexOf(option.optionId) !== -1
        // }
        // return isSelected
        return this.itemSelectedList && this.itemSelectedList.indexOf(option.optionId) !== -1
    }
    updateParent($event: any, checked: any) {
        if (this.assessmentType === 'optionalWeightage') {
            this.update.emit({ 'index': $event, 'status': checked })
        } else {
            this.update.emit($event)
        }
    }
    // ngOnDestroy(): void {
    //     if (this.subscription) {
    //         this.subscription.unsubscribe()
    //         // this.question.options = []
    //     }
    // }
    getSanitizeString(res: any) {
        if (res && (typeof res === 'string')) {
            const response = res.replace(/\&lt;/g, '<').replace(/\&gt;/g, '>')
            return response
        }
        return res
    }
    ngOnDestroy(): void {
        this.practiceSvc.shCorrectAnswer(false)
        if (this.shCorrectAnsSubscription) {
            this.shCorrectAnsSubscription.unsubscribe()
        }
    }
}
