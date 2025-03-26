import {
    AfterViewInit, Component,
    EventEmitter,
    // HostListener,
    Input,
    OnChanges, OnInit,
    Output,
    SimpleChanges, ViewEncapsulation, OnDestroy,
} from '@angular/core'
import { NSPractice } from '../../../practice.model'
import { Subscription } from 'rxjs'
import { PracticeService } from '../../../practice.service'
import { NsContent } from '@sunbird-cb/utils-v2'

@Component({
    selector: 'viewer-mcq-mca-question',
    templateUrl: './mcq-mca.component.html',
    styleUrls: ['./mcq-mca.component.scss'],
    // tslint:disable-next-line
    encapsulation: ViewEncapsulation.None
})
export class MultipleChoiseQuesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() question: NSPractice.IQuestion = {
        multiSelection: false,
        section: '',
        question: '',
        instructions: '',
        questionId: '',
        questionLevel: '',
        timeTaken: '',
        editorState: undefined,
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
    @Output() update = new EventEmitter<string | Object>()
    @Input() assessmentType = ''
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
        // if(this.question && this.question.editorState && this.question.editorState.options) {
        //     this.question.options = this.question.editorState.options
        // }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {

        }
    }
    ngAfterViewInit(): void { }
    isSelected(option: NSPractice.IOption) {
        return this.itemSelectedList && this.itemSelectedList.indexOf(option.optionId) !== -1
    }
    updateParent($event: any, checked: any) {
        if (this.assessmentType === 'optionalWeightage') {
            this.update.emit({ 'index': $event, 'status': checked })
        } else {
            this.update.emit($event)
        }

    }
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
