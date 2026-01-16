import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'
// import { NSQuiz } from '../../plugins/quiz/quiz.model'
import { ActivatedRoute } from '@angular/router'
import { NSQuiz } from '../../plugins/quiz/quiz.model'

@Component({
    selector: 'viewer-practice-container',
    templateUrl: './practice.component.html',
    styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit, OnDestroy {
    @Input() isFetchingDataComplete = false
    @Input() isErrorOccured = false
    @Input() quizData: NsContent.IContent | null = null
    @Input() forPreview = false
    @Input() quizJson: NSQuiz.IQuiz = {
        timeLimit: 300,
        questions: [],
        isAssessment: false,
        allowSkip: 'No',
        maxQuestions: 0,
        requiresSubmit: 'Yes',
        showTimer: 'Yes',
        primaryCategory: NsContent.EPrimaryCategory.PRACTICE_RESOURCE,
    }
    @Input() isPreviewMode = false
    isTypeOfCollection = false
    collectionId: string | null = null
    isMobile = false
    constructor(private activatedRoute: ActivatedRoute) {
        if (this.quizData) {
            this.quizJson.timeLimit = this.quizData.expectedDuration
        }
    }

    ngOnInit() {
        if (window.innerWidth <= 1200) {
            this.isMobile = true
          } else {
            this.isMobile = false
          }
        this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
        if (this.isTypeOfCollection) {
            this.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
        }
    }
    ngOnDestroy(): void {
        this.isFetchingDataComplete = false
    }
}
