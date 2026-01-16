import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { noop } from 'rxjs'
import {
  IFeedbackThread,
  EFeedbackType,
  IFeedbackConfig,
  FeedbackService,
  EFeedbackRole,
  NsContent,
} from '@sunbird-cb/collection'
import { IResolveResponse, ConfigurationsService } from '@sunbird-cb/utils-v2'
@Component({
  selector: 'ws-app-feedback-thread-header',
  templateUrl: './feedback-thread-header.component.html',
  styleUrls: ['./feedback-thread-header.component.scss'],
})
export class FeedbackThreadHeaderComponent implements OnInit {
  @Input() threadHead!: IFeedbackThread
  @Input() viewedBy!: EFeedbackRole
  feedbackTypes: typeof EFeedbackType
  feedbackRoles: typeof EFeedbackRole
  contentTypes: typeof NsContent.EContentTypes
  feedbackConfig!: IFeedbackConfig
  feedbackCategory?: string
  userId?: any

  constructor(
    private feedbackApi: FeedbackService,
    private route: ActivatedRoute,
    private configSvc: ConfigurationsService
  ) {

    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
    }

    this.feedbackTypes = EFeedbackType
    this.feedbackRoles = EFeedbackRole
    this.contentTypes = NsContent.EContentTypes

    const feedbackConfigResolve = this.route.snapshot.data['feedbackConfig'] as IResolveResponse<
      IFeedbackConfig
    >
    if (feedbackConfigResolve && feedbackConfigResolve.data) {
      this.feedbackConfig = feedbackConfigResolve.data
    }
  }

  ngOnInit() {
    this.feedbackCategory = this.threadHead.feedbackCategory
  }

  updateCategory(category: string) {
    this.feedbackApi
      .updateFeedbackStatus(this.threadHead.rootFeedbackId, category)
      .subscribe(threadItem => {
        this.feedbackCategory = threadItem.feedbackCategory
      },         noop)
  }
}
