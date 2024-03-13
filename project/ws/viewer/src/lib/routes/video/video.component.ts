import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { AccessControlService } from '@ws/author'
import {
  NsContent,
  IWidgetsPlayerMediaData,
  NsDiscussionForum,
  WidgetContentService,
} from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ValueService, ConfigurationsService } from '@sunbird-cb/utils'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'
import { Platform } from '@angular/cdk/platform'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'viewer-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  private screenSizeSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
  isScreenSizeSmall = false
  videoData: NsContent.IContent | null = null
  isFetchingDataComplete = false
  isNotEmbed = true
  widgetResolverVideoData: NsWidgetResolver.IRenderConfigWithTypedData<
    IWidgetsPlayerMediaData
  > | null = null
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  batchId = this.activatedRoute.snapshot.queryParamMap.get('batchId')
  channelId: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private valueSvc: ValueService,
    private viewerSvc: ViewerUtilService,
    private contentSvc: WidgetContentService,
    private platform: Platform,
    private accessControlSvc: AccessControlService,
    private configSvc: ConfigurationsService
  ) { }

  ngOnInit() {
    this.screenSizeSubscription = this.valueSvc.isXSmall$.subscribe(data => {
      this.isScreenSizeSmall = data
    })
    this.isNotEmbed =
      this.activatedRoute.snapshot.queryParamMap.get('embed') === 'true' ? false : true
      this.channelId = this.activatedRoute.snapshot.queryParamMap.get('channelId')
    if (
      this.activatedRoute.snapshot.queryParamMap.get('preview') === 'true' &&
      !this.accessControlSvc.authoringConfig.newDesign
    ) {
      this.viewerDataSubscription = this.activatedRoute.data.subscribe(data => {
        this.videoData = data.content.data
        if (this.videoData) {
          this.formDiscussionForumWidget(this.videoData)
        }
        // tslint:disable-next-line
        this.widgetResolverVideoData = this.initWidgetResolverVideoData(this.videoData!)
        if (this.activatedRoute.snapshot.queryParams.collectionId) {
          this.widgetResolverVideoData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
        } else {
          this.widgetResolverVideoData.widgetData.collectionId = ''
        }
        let url = ''
        // if (this.videoData.artifactUrl.indexOf('/content-store/') > -1) {
        //   url = `/apis/authContent/${new URL(this.videoData.artifactUrl).pathname}`
        // } else {
        //   url = `/apis/authContent/${encodeURIComponent(this.videoData.artifactUrl)}`
        // }
        // tslint:disable-next-line
        url = this.generateUrl(this.videoData!.artifactUrl)
        this.widgetResolverVideoData.widgetData.url = this.videoData ? url : ''
        this.widgetResolverVideoData.widgetData.disableTelemetry = false
        if (this.videoData) {
          this.widgetResolverVideoData.widgetData.identifier = this.videoData.identifier
          this.widgetResolverVideoData.widgetData.mimeType = this.videoData.mimeType
          this.widgetResolverVideoData.widgetData.contentType = this.videoData.contentType
          this.widgetResolverVideoData.widgetData.primaryCategory = this.videoData.primaryCategory
          this.widgetResolverVideoData.widgetData.version = `${this.videoData.version}${''}`
          this.widgetResolverVideoData.widgetData.channel = this.channelId
          this.widgetResolverVideoData.widgetData.size = this.videoData.duration
        }
        this.isFetchingDataComplete = true
        // if (this.videoData.artifactUrl.indexOf('/content-store/') > -1) {
        //   url = `/apis/authContent/${new URL(this.videoData.artifactUrl).pathname}`
        // } else {
        //   url = `/apis/authContent/${encodeURIComponent(this.videoData.artifactUrl)}`
        // }
        // tslint:disable-next-line
        if (this.videoData && this.videoData!.subTitles) {

          let subTitleUrl = ''
          if (this.videoData.subTitles.length > 0 && this.videoData.subTitles[0]) {
            if (this.videoData.subTitles[0].url.indexOf('/content-store/') > -1) {
              subTitleUrl = `/apis/authContent/${new URL(this.videoData.subTitles[0].url).pathname}`
            } else {
              subTitleUrl = `/apis/authContent/${encodeURIComponent(this.videoData.subTitles[0].url)}`
            }
          }

          this.widgetResolverVideoData.widgetData.subtitles = [{
            srclang: '',
            label: '',
            url: subTitleUrl,
          }]
        }
      })
    } else {
      this.routeDataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.widgetResolverVideoData = null
          this.videoData = data.content.data
          if (this.videoData) {
            this.formDiscussionForumWidget(this.videoData)
          }
          this.widgetResolverVideoData = this.initWidgetResolverVideoData(this.videoData as any)
          if (this.activatedRoute.snapshot.queryParams.collectionId) {
            this.widgetResolverVideoData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
          } else {
            this.widgetResolverVideoData.widgetData.collectionId = ''
          }
          if (this.videoData && this.videoData.identifier) {
            if (this.activatedRoute.snapshot.queryParams.collectionId) {
              await this.fetchContinueLearning(
                this.videoData.identifier,
              )
            } else {
              await this.fetchContinueLearning(this.videoData.identifier)
            }
          }
          this.widgetResolverVideoData.widgetData.url = this.videoData
            ? this.forPreview
              ? this.viewerSvc.getAuthoringUrl(this.videoData.artifactUrl)
              : this.viewerSvc.getPublicUrl(this.videoData.artifactUrl) || this.videoData.artifactUrl
            : ''
          // this.widgetResolverVideoData.widgetData.resumePoint = this.getResumePoint(this.videoData)
          this.widgetResolverVideoData.widgetData.identifier = this.videoData
            ? this.videoData.identifier
            : ''
          this.widgetResolverVideoData.widgetData.mimeType = data.content.data.mimeType
          this.widgetResolverVideoData.widgetData.contentType = data.content.data.contentType
          this.widgetResolverVideoData.widgetData.primaryCategory = data.content.data.primaryCategory
          this.widgetResolverVideoData.widgetData.channel = this.channelId
          this.widgetResolverVideoData.widgetData.version = `${data.content.data.version}${''}`
          this.widgetResolverVideoData.widgetData.size = data.content.data.duration
          if (data.content.data.length > 0 && data.content.data.subTitles[0]) {

            let subTitlesUrl = ''
            if (data.content.data.subTitles[0].url.indexOf('/content-store/') > -1) {
              subTitlesUrl = `/apis/authContent/${new URL(data.content.data.subTitles[0].url).pathname}`
            } else {
              subTitlesUrl = `/apis/authContent/${encodeURIComponent(data.content.data.subTitles[0].url)}`
            }

            this.widgetResolverVideoData.widgetData.subtitles = [{
              srclang: '',
              label: '',
              url: subTitlesUrl,
            }]

          }

          this.widgetResolverVideoData = JSON.parse(JSON.stringify(this.widgetResolverVideoData))
          if (this.videoData && this.videoData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.videoData.identifier)
          }
          this.isFetchingDataComplete = true
        },
        () => { },
      )
    }
  }

  generateUrl(oldUrl: string) {
    const chunk = oldUrl.split('/')
    const newChunk = environment.azureHost.split('/')
    const newLink = []
    for (let i = 0; i < chunk.length; i += 1) {
      if (i === 2) {
        newLink.push(newChunk[i])
      } else if (i === 3) {
        newLink.push(environment.azureBucket)
      } else {
        newLink.push(chunk[i])
      }
    }
    const newUrl = newLink.join('/')
    return newUrl
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
  getResumePoint(content: NsContent.IContent | null) {
    if (content) {
      if (content.progress && content.progress.progressSupported && content.progress.progress) {
        return Math.floor(content.duration * content.progress.progress) || 0
      }
      return 0

    }
    return 0
  }

  initWidgetResolverVideoData(content: NsContent.IContent) {
    let isVideojs = false
    if (this.platform.IOS) {
      isVideojs = true
    } else if (!this.platform.WEBKIT && !this.platform.IOS && !this.platform.SAFARI) {
      isVideojs = true
    } else if (this.platform.ANDROID) {
      isVideojs = true
    } else {
      isVideojs = false
    }
    return {
      widgetType: 'player',
      widgetSubType: 'playerVideo',
      widgetData: {
        isVideojs,
        disableTelemetry: false,
        url: '',
        identifier: '',
        mimeType: content.mimeType,
        resumePoint: 0,
        continueLearning: true,
        subtitles: [],
        collectionId: '',
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
                this.widgetResolverVideoData
              ) {
                if(content.progress === 100 || content.status === 2){
                  // if its completed then resume from starting
                  this.widgetResolverVideoData.widgetData.resumePoint = 0
                } else {
                  // resume from last played point
                  this.widgetResolverVideoData.widgetData.resumePoint = Number(
                    content.progressdetails.current.pop(),
                  )
                }
              }
            }
          }
          resolve(true)
        },
        () => resolve(true),
      )
    })
  }
  private async setS3Cookie(contentId: string) {
    await this.contentSvc
      .setS3Cookie(contentId)
      .toPromise()
      .catch(() => { })
    return
  }
}
