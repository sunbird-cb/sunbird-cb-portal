import {
    AfterViewInit, Component,
    EventEmitter,
    // HostListener,
    Input,
    OnChanges, OnInit,
    Output,
    SimpleChanges, ViewEncapsulation,
} from '@angular/core'
import { NSPractice } from '../../../practice.model'
// import { PracticeService } from '../../../practice.service'

@Component({
    selector: 'viewer-mcq-mca-question',
    templateUrl: './mcq-mca.component.html',
    styleUrls: ['./mcq-mca.component.scss'],
    // tslint:disable-next-line
    encapsulation: ViewEncapsulation.None
})
export class MultipleChoiseQuesComponent implements OnInit, OnChanges, AfterViewInit {
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
    localQuestion: string = this.question.question
    constructor(
        // private practiceSvc: PracticeService,
    ) {

    }
    ngOnInit() {
        this.localQuestion = this.question.question
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {

        }
    }
    ngAfterViewInit(): void { }
    isSelected(option: NSPractice.IOption) {
        return this.itemSelectedList && this.itemSelectedList.indexOf(option.optionId) !== -1
    }
    updateParent($event: any) {
        this.update.emit($event)
    }
}
