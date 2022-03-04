import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'
// import { NSQuiz } from '../../plugins/quiz/quiz.model'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'viewer-practice-container',
    templateUrl: './practice.component.html',
    styleUrls: ['./practice.component.scss'],
})
export class PracticeComponent implements OnInit {
    @Input() isFetchingDataComplete = false
    @Input() isErrorOccured = false
    @Input() quizData: NsContent.IContent | null = null
    @Input() forPreview = false
    @Input() quizJson: any = {
        timeLimit: 2000,
        questions: [],
        isAssessment: false,
    }
    @Input() isPreviewMode = false
    isTypeOfCollection = false
    collectionId: string | null = null
    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
        if (this.isTypeOfCollection) {
            this.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
        }
    }
}
