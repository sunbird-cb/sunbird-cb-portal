import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'
import { NSQuiz } from '../../plugins/quiz/quiz.model'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'viewer-quiz-container',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  /* tslint:disable */
  host: { class: 'h-inherit inline-block', style: 'height: inherit !important; overflow-y: scroll;width: 100%;'},
  /* tslint:enable */
})
export class QuizComponent implements OnInit, OnDestroy {

  @Input() isFetchingDataComplete = false
  @Input() isErrorOccured = false
  @Input() quizData: NsContent.IContent | null = null
  @Input() forPreview = false
  @Input() quizJson: Partial<NSQuiz.IQuiz> = {
    timeLimit: 0,
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
  ngOnDestroy(): void {
    this.isFetchingDataComplete = false
  }
}
