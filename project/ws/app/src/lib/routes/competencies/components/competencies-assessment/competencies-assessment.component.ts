import { Component, OnInit, Input } from '@angular/core'
import { NsContent } from '@sunbird-cb/utils-v2'
import { NSQuiz } from '@ws/viewer/src/lib/plugins/quiz/quiz.model'
// import { NSQuiz } from '@ws/viewer/src/lib/plugins/quiz/quiz.model'
import { NSCompetencie } from '../../models/competencies.model'

// import { Router } from '@angular/router'
@Component({
    selector: 'app-competencies-assessment',
    templateUrl: './competencies-assessment.component.html',
    styleUrls: ['./competencies-assessment.component.scss'],
    /* tslint:disable */
    host: { class: 'flex flex-row margin-right-xs margin-bottom-s competency_main_box' },
    /* tslint:enable */

})
export class CompetenciesAssessmentComponent implements OnInit {
    @Input()
    data!: NSCompetencie.ICompetencie
    @Input() assessmentData!: any
    ePrimartCategory = NsContent.EPrimaryCategory
    @Input() assessmentId!: string
    quizJson!: NSQuiz.IQuiz
    // fullScreenContainer: HTMLElement | null = null
    // forPreview = window.location.href.includes('/author/')
    learningObjective = 'Competency test'
    duration = 0
    primaryCategory = NsContent.EPrimaryCategory.COMP_ASSESSMENT
    constructor() {

    }
    ngOnInit() {
        this.quizJson = {
            timeLimit: 300,
            questions: [
                {
                    multiSelection: false,
                    section: '',
                    question: '',
                    questionId: '',
                    instructions: '',
                    questionType: undefined,
                    questionLevel: '',
                    marks: 0,
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
            allowSkip: 'No',
            maxQuestions: this.assessmentData.maxQuestions,
            requiresSubmit: 'Yes',
            showTimer: 'Yes',
            primaryCategory: NsContent.EPrimaryCategory.COMP_ASSESSMENT,
        }
        this.learningObjective = this.assessmentData.name
        // let complexityLevel =  this.assessmentData.name
        this.duration = this.assessmentData.expectedDuration
        // let collectionId =  this.assessmentData.name
        this.primaryCategory = this.assessmentData.primaryCategory || NsContent.EPrimaryCategory.COMP_ASSESSMENT

    }

}
