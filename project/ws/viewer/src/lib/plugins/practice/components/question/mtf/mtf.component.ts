import {
    AfterViewInit, Component,
    EventEmitter,
    HostListener,
    // HostListener,
    Input,
    OnChanges, OnDestroy, OnInit,
    Output,
    SimpleChanges, ViewEncapsulation,
} from '@angular/core'
import { NSPractice } from '../../../practice.model'
import { PracticeService } from '../../../practice.service'
import { jsPlumb, OnConnectionBindInfo } from 'jsplumb'
// tslint:disable-next-line
import _ from 'lodash'
import { Subscription } from 'rxjs'
import { NsContent } from '@sunbird-cb/utils-v2'

@Component({
    selector: 'viewer-mtf-question',
    templateUrl: './mtf.component.html',
    styleUrls: ['./mtf.component.scss'],
    // tslint:disable-next-line
    encapsulation: ViewEncapsulation.None
})
export class MatchTheFollowingQuesComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() question: NSPractice.IQuestion = {
        multiSelection: false,
        section: '',
        instructions: '',
        question: '',
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
    @Input() primaryCategory = NsContent.EPrimaryCategory.PRACTICE_RESOURCE
    @Output() update = new EventEmitter<string | Object>()
    jsPlumbInstance: any
    edit = false
    showAns = false
    matchHintDisplay: NSPractice.IOption[] = []
    localQuestion: string = this.question.question
    shCorrectAnsSubscription: Subscription | null = null
    constructor(
        private practiceSvc: PracticeService,
    ) {

    }
    @HostListener('window:resize')
    onResize(_event: any) {
        this.repaintEveryThing()
    }
    ngOnInit() {
        // console.log(this.practiceSvc.questionAnswerHash.value)
        this.matchHintDisplay = []
        if (this.shCorrectAnsSubscription) {
            this.shCorrectAnsSubscription.unsubscribe()
        }
        this.shCorrectAnsSubscription = this.practiceSvc.displayCorrectAnswer.subscribe(displayAns => {
            this.showAns = displayAns
            if (this.showAns) {
                this.changeColor()
            }
        })
        this.localQuestion = this.question.question
        this.question.options.map(option => (option.matchForView = option.match))
        // const array = this.question.options.map(elem => elem.match)
        // const arr = this.practiceSvc.shuffle(array)
        // for (let i = 0; i < this.question.options.length; i += 1) {
        //     this.question.options[i].matchForView = arr[i]
        // }
        const matchHintDisplayLocal = [...this.question.options]
        matchHintDisplayLocal.forEach(element => {
            if (element.hint) {
                this.matchHintDisplay.push(element)
            }
        })
        this.practiceSvc.clearResponse.subscribe((questionId: any) => {
           if (this.question.questionId === questionId) {
            this.resetMtf()
           }
        })
    }
    get numConnections() {
        if (this.jsPlumbInstance) {
            return (this.jsPlumbInstance.getAllConnections() as any[]).length
        }
        return 0
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes) {

        }
    }
    ngAfterViewInit(): void {
        this.jsPlumbInstance = jsPlumb.getInstance({
            DragOptions: {
                cursor: 'pointer',
            },
            PaintStyle: {
                stroke: 'rgba(0,0,0,0.5)',
                strokeWidth: 3,
            },
        })
        const connectorType = ['Bezier', { curviness: 10 }]
        this.jsPlumbInstance.bind('connection', (_i: any, _c: any) => {
            // root cause
            // const allConnection = this.jsPlumbInstance.getAllConnections()
            // const finalConnection=[]
            // if (allConnection) {
            //     const allHast = this.practiceSvc.questionAnswerHash.getValue()
            //     const qHash = allHast[this.question.questionId]
            //     if (qHash && qHash[0]) {

            //         console.log(allHast, qHash[0])
            //         finalConnection.push()
            //     }
            // }
            const newData = [...this.jsPlumbInstance.getAllConnections()]
            if (!this.edit || _c) {
                this.update.emit(newData)
            }
        })
        this.jsPlumbInstance.bind('connectionDetached', (i: OnConnectionBindInfo, _c: any) => {
            this.setBorderColor(i, '')
            this.resetColor()
            this.edit = false
        })
        this.jsPlumbInstance.bind(
            'connectionMoved',
            (i: { originalSourceId: string; newSourceId: string; originalTargetId: string }, _c: any) => {
                this.setBorderColorById(i.originalSourceId, '')
                this.setBorderColorById(i.newSourceId, '')
                this.setBorderColorById(i.originalTargetId, '')
                this.resetColor()
                this.edit = false
            })
        // get the list of ".smallWindow" elements.
        const questionSelector = `.question${this.question.questionId}`
        const answerSelector = `.answer${this.question.questionId}`
        const questions = this.jsPlumbInstance.getSelector(questionSelector)
        const answers = this.jsPlumbInstance.getSelector(answerSelector)
        this.jsPlumbInstance.batch(() => {
            this.jsPlumbInstance.makeSource((questions as unknown as string), {
                maxConnections: 1,
                connector: connectorType,
                overlay: 'Arrow',
                endpoint: [
                    'Dot',
                    {
                        radius: 3,
                    },
                ],
                anchor: 'Right',
            })
            this.jsPlumbInstance.makeTarget(answers as unknown as string, {
                maxConnections: 1,
                dropOptions: {
                    hoverClass: 'hover',
                },
                anchor: 'Left',
                endpoint: [
                    'Dot',
                    {
                        radius: 3,
                    },
                ],
            })
        })
        this.matchShowAnswer()
    }
    setBorderColor(bindInfo: OnConnectionBindInfo, color: string) {
        const connnectionSourceId: HTMLElement | null = document.getElementById(bindInfo.sourceId)
        const connnectionTargetId: HTMLElement | null = document.getElementById(bindInfo.targetId)
        if (connnectionSourceId != null) {
            connnectionSourceId.style.borderColor = color
        }
        if (connnectionTargetId != null) {
            connnectionTargetId.style.borderColor = color
        }
    }
    resetMtf() {
        this.jsPlumbInstance.deleteEveryConnection()
        this.edit = false
    }

    resetColor() {
        const a = this.jsPlumbInstance.getAllConnections() as any[]
        a.forEach((element: { setPaintStyle: (arg0: { stroke: string }) => void }) => {
            element.setPaintStyle({
                stroke: 'rgba(0,0,0,0.5)',
            })
            // this.setBorderColor(element, '')
        })
    }
    repaintEveryThing() {
        this.jsPlumbInstance.repaintEverything()
    }
    setBorderColorById(id: string, color: string | null) {
        const elementById: HTMLElement | null = document.getElementById(id)
        if (elementById && color) {
            elementById.style.borderColor = color
        }
    }
    changeColor() {
        const a = this.jsPlumbInstance.getAllConnections() as any[]
        // if (a.length < this.question.options.length) {
        //     this.showAns = false
        //     alert('Please select all answers')
        //     return
        // }
        a.forEach(element => {
            const b = element.sourceId
            const options = this.question.options
            if (options) {
                const hint = options[(b.slice(-1) as number) - 1].hint
                if (hint && hint.trim() === element.target.innerText.trim()) {
                    element.setPaintStyle({
                        stroke: '#357a38',
                    })
                    this.setBorderColor(element, '#357a38')
                } else {
                    element.setPaintStyle({
                        stroke: '#f44336',
                    })
                    this.setBorderColor(element, '#f44336')
                }
            }
        })
    }
    matchShowAnswer() {
        this.jsPlumbInstance.deleteEveryConnection()
        for (let i = 1; i <= this.question.options.length; i += 1) {
            const questionSelector = `#c1${this.question.questionId}${i}`
            // for (let j = 1; j <= this.question.options.length; j += 1) {
            const selectedOptions = _.first(this.practiceSvc.questionAnswerHash.value[this.question.questionId] || []) || []
            // tslint:disable-next-line
            if (selectedOptions.length) {
                this.edit = true
            }
            for (let j = 0; j < selectedOptions.length; j += 1) {
                // const answerSelector = `#c2${this.question.questionId}${j + 1}`
                const sourceId = `#${_.get(selectedOptions[j], 'sourceId')}`
                const targetId = `#${_.get(selectedOptions[j], 'targetId')}`              // this.question.options[i - 1]
                if (sourceId === questionSelector && targetId) {
                    const match = _.get(_.first(this.jsPlumbInstance.getSelector(targetId) as unknown as HTMLElement[]), 'innerText')
                    // const selectors: HTMLElement[] = this.jsPlumbInstance.getSelector(targetId) as unknown as HTMLElement[]
                    if (match && match.trim()) {/** ===  selectors[0].innerText.trim() */
                        this.jsPlumbInstance.connect({
                            endpoint: ['Dot', {
                                radius: 3,
                                cssClass: 'amit icon-svg',
                                PaintStyle: {
                                    stroke: 'rgba(0,0,0,0.5)',
                                    strokeWidth: 3,
                                },
                            }],
                            source: this.jsPlumbInstance.getSelector(questionSelector) as unknown as Element,
                            target: this.jsPlumbInstance.getSelector(targetId) as unknown as Element,
                            anchors: ['Right', 'Left'],
                            ConnectionsDetachable: false,
                        })
                    }
                }
            }
        }
        // this.changeColor()
        setTimeout(() => {
            this.repaintEveryThing()
        },
            // tslint:disable-next-line:align
            100
        )

    }
    getSanitizeString(res: any) {
        if (res && (typeof res === 'string')) {
            const response = res.replace(/\&lt;/g, '<').replace(/\&gt;/g, '>')
            return response
        }
        return res
    }
    ngOnDestroy(): void {
        this.resetMtf()
        this.practiceSvc.shCorrectAnswer(false)
        if (this.shCorrectAnsSubscription) {
            this.shCorrectAnsSubscription.unsubscribe()
        }
    }
}
