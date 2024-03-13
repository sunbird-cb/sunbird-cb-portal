import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import {
  NsContent,
  IWidgetsPlayerMediaData,
  NsDiscussionForum,
  WidgetContentService,
} from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ConfigurationsService, ValueService } from '@sunbird-cb/utils'
import { ActivatedRoute } from '@angular/router'
import { Platform } from '@angular/cdk/platform'
import { ViewerUtilService } from '../../viewer-util.service'

@Component({
  selector: 'viewer-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss'],
})
export class YoutubeComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  private screenSizeSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  isScreenSizeSmall = false
  isFetchingDataComplete = false
  youtubeData: NsContent.IContent | null = null
  widgetResolverYoutubeData: NsWidgetResolver.IRenderConfigWithTypedData<
    IWidgetsPlayerMediaData
  > | null = null
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  isScreenSizeLtMedium = false
  batchId = this.activatedRoute.snapshot.queryParamMap.get('batchId')

  constructor(
    private activatedRoute: ActivatedRoute,
    private valueSvc: ValueService,
    private viewerSvc: ViewerUtilService,
    private contentSvc: WidgetContentService,
    private platform: Platform,
    private configSvc: ConfigurationsService

  ) { }

  ngOnInit() {
    this.screenSizeSubscription = this.valueSvc.isXSmall$.subscribe(data => {
      this.isScreenSizeSmall = data
    })
    this.routeDataSubscription = this.activatedRoute.data.subscribe(
      async data => {
        this.widgetResolverYoutubeData = null
        this.youtubeData = data.content.data
        if (this.youtubeData && !this.forPreview) {
          this.formDiscussionForumWidget(this.youtubeData)
        }

        this.widgetResolverYoutubeData = this.initWidgetResolverYoutubeData()
        if (this.youtubeData && this.youtubeData.identifier) {
          if (!this.forPreview && this.activatedRoute.snapshot.queryParams.collectionId) {
            await this.fetchContinueLearning(
              this.youtubeData.identifier,
            )
          } else {
            if (!this.forPreview) {
              await this.fetchContinueLearning(this.youtubeData.identifier)
            }
          }
        }
        if (this.forPreview) {
          // this.widgetResolverYoutubeData.widgetData.disableTelemetry = true
          // TODO: for public couese access forPreview is set to true, but we need telemetry too
          this.widgetResolverYoutubeData.widgetData.disableTelemetry = false
        }
        this.widgetResolverYoutubeData.widgetData.url = this.youtubeData
          ? this.youtubeData.artifactUrl
          : ''
        this.widgetResolverYoutubeData.widgetData.identifier = this.youtubeData
          ? this.youtubeData.identifier
          : ''

        this.widgetResolverYoutubeData.widgetData.primaryCategory = this.youtubeData
          ? this.youtubeData.primaryCategory : ''
        this.widgetResolverYoutubeData.widgetData.version = this.youtubeData ?
          `${this.youtubeData.version}${''}` : '1'
        this.widgetResolverYoutubeData.widgetData.collectionId =
          this.activatedRoute.snapshot.queryParamMap.get('collectionId') || undefined

        this.widgetResolverYoutubeData.widgetData.channel =
          this.activatedRoute.snapshot.queryParamMap.get('channelId') || undefined

        if (this.platform.ANDROID) {
          this.widgetResolverYoutubeData.widgetData.isVideojs = false
        } else {
          this.widgetResolverYoutubeData.widgetData.isVideojs = true
        }
        if (this.youtubeData && this.youtubeData.artifactUrl.indexOf('content-store') >= 0) {
          await this.setS3Cookie(this.youtubeData.identifier)
        }
        // this.widgetResolverYoutubeData.widgetData.resumePoint = this.getResumePoint(this.youtubeData)
        if (this.youtubeData) {
          this.widgetResolverYoutubeData.widgetData.primaryCategory = this.youtubeData.primaryCategory
        }
        this.isFetchingDataComplete = true
      },
      () => { },
    )
  }

  ngOnDestroy() {
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe()
    }
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe()
    }
    if (this.viewerDataSubscription) {
      this.viewerDataSubscription.unsubscribe()
    }
  }

  async fetchContinueLearning(videoId: string): Promise<boolean> {
    return new Promise(resolve => {
      // this.contentSvc.fetchContentHistory(collectionId).subscribe(
      //   data => {
      //     if (data) {
      //       if (
      //         data.identifier === videoId &&
      //         data.continueData &&
      //         data.continueData.progress &&
      //         this.widgetResolverVideoData
      //       ) {
      //         this.widgetResolverVideoData.widgetData.resumePoint = Number(
      //           data.continueData.progress,
      //         )
      //       }
      //     }
      //     resolve(true)
      //   },
      //   () => resolve(true),
      // )
      let userId
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId || ''
      }
      const requestCourse = this.viewerSvc.getBatchIdAndCourseId(
        this.activatedRoute.snapshot.queryParams.collectionId,
        this.activatedRoute.snapshot.queryParams.batchId,
        videoId)
      const req: NsContent.IContinueLearningDataReq = {
        request: {
          userId,
          batchId: requestCourse.batchId,
          courseId: requestCourse.courseId || '',
          contentIds: [],
          fields: ['progressdetails'],
        },
      }
      this.contentSvc.fetchContentHistoryV2(req).subscribe(
        data => {
          if (data && data.result && data.result.contentList.length) {
            for (const content of data.result.contentList) {
              if (
                content.contentId === videoId &&
                content.progressdetails &&
                content.progressdetails.current &&
                this.widgetResolverYoutubeData
              ) {
                if(content.progress === 100 || content.status === 2){
                  // if its completed then resume from starting
                  this.widgetResolverYoutubeData.widgetData.resumePoint = 0
                } else {
                  // resume from last played point
                  this.widgetResolverYoutubeData.widgetData.resumePoint = Number(
                    content.progressdetails.current.pop(),
                  )
                }
                this.widgetResolverYoutubeData.widgetData.size = content.progressdetails.max_size
              }
            }
          }
          resolve(true)
        },
        () => resolve(true),
      )
    })
  }

  getResumePoint(content: NsContent.IContent | null) {
    if (content) {
      if (content.progress && content.progress.progressSupported && content.progress.progress) {
        return Math.floor(content.duration * content.progress.progress) || 0
      }
      return 0

    }
    return 0
  }

  initWidgetResolverYoutubeData() {
    return {
      widgetType: 'player',
      widgetSubType: 'playerYoutube',
      widgetData: {
        disableTelemetry: false,
        url: '',
        identifier: '',
      },
      widgetHostClass: 'video-full',
    }
  }

  formDiscussionForumWidget(content: NsContent.IContent) {
    this.discussionForumWidget = {
      widgetData: {
        description: content.description,
        id: content.identifier,
        name: NsDiscussionForum.EDiscussionType.LEARNING,
        title: content.name,
        initialPostCount: 2,
        isDisabled: this.forPreview,
      },
      widgetSubType: 'discussionForum',
      widgetType: 'discussionForum',
    }
  }

  private async setS3Cookie(contentId: string) {
    await this.contentSvc
      .setS3Cookie(contentId)
      .toPromise()
      .catch(() => { })
    return
  }
}
