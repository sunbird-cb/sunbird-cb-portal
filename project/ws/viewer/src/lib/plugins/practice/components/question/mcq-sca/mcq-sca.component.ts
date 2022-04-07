import {
    Component,
    EventEmitter,
    // HostListener,
    Input,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core'
import { NSPractice } from '../../../practice.model'
// import { PracticeService } from '../../../practice.service'
// tslint:disable-next-line
import _ from 'lodash'
import { Subscription } from 'rxjs'
@Component({
    selector: 'viewer-mcq-sca-question',
    templateUrl: './mcq-sca.component.html',
    styleUrls: ['./mcq-sca.component.scss'],
    // tslint:disable-next-line
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleChoiseQuesComponent implements OnInit {
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
    @Input() itemSelectedList: string[] = []
    @Output() update = new EventEmitter<string | Object>()
    subscription!: Subscription
    localQuestion: string = this.question.question
    constructor(
        // private practiceSvc: PracticeService,
    ) {

    }
    ngOnInit() {
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
    updateParent($event: any) {
        this.update.emit($event)
    }
    // ngOnDestroy(): void {
    //     if (this.subscription) {
    //         this.subscription.unsubscribe()
    //         // this.question.options = []
    //     }
    // }
}
