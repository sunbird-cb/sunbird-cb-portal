import { AccessControlService } from '@ws/author'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { NsContent, NsDiscussionForum, WidgetContentService } from '@sunbird-cb/collection'
import { WsEvents, EventService, ConfigurationsService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'
// import { environment } from 'src/environments/environment'

@Component({
  selector: 'viewer-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
})
export class SurveyComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  private telemetryIntervalSubscription: Subscription | null = null
  isFetchingDataComplete = false
  surveyData: NsContent.IContent | null = null
  oldData: NsContent.IContent | null = null
  alreadyRaised = false
  widgetResolverSurveyData: any = {
    widgetType: 'player',
    widgetSubType: 'playerSurvey',
    widgetData: {
      surveyUrl: '',
      identifier: '',
      disableTelemetry: false,
      hideControls: true,
      mimeType: '',
      collectionId: '',
      courseName: '',
      progressStatus: '',
    },
  }
  isPreviewMode = false
  forPreview = window.location.href.includes('/author/')
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  batchId = this.activatedRoute.snapshot.queryParamMap.get('batchId')
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private viewerSvc: ViewerUtilService,
    private eventSvc: EventService,
    private accessControlSvc: AccessControlService,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    if (
      this.activatedRoute.snapshot.queryParamMap.get('preview') &&
      !this.accessControlSvc.authoringConfig.newDesign
    ) {
      this.isPreviewMode = true
      this.viewerDataSubscription = this.viewerSvc
        .getContent(this.activatedRoute.snapshot.paramMap.get('resourceId') || '')
        .subscribe(async data => {
          this.surveyData = data.result.content
          if (this.surveyData) {
            this.formDiscussionForumWidget(this.surveyData)
            if (this.discussionForumWidget) {
              this.discussionForumWidget.widgetData.isDisabled = true
            }
          }
          if (this.surveyData && this.surveyData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.surveyData.identifier)
          }
          if (this.activatedRoute.snapshot.queryParams.collectionId) {
            this.widgetResolverSurveyData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
            if (this.widgetResolverSurveyData.widgetData && this.widgetResolverSurveyData.widgetData.collectionId) {
              await this.fetchContent()
            }
          } else {
            this.widgetResolverSurveyData.widgetData.collectionId = ''
          }
          if (this.surveyData && this.surveyData.identifier) {
            if (this.activatedRoute.snapshot.queryParams.collectionId) {
              await this.fetchContinueLearning(
                this.surveyData.identifier,
              )
            } else {
              await this.fetchContinueLearning(this.surveyData.identifier)
            }
          }
          this.widgetResolverSurveyData.widgetData.surveyUrl = this.surveyData
          ? this.forPreview
            ? this.viewerSvc.getAuthoringUrl(this.surveyData.artifactUrl)
            : this.surveyData.artifactUrl
          : ''
          this.widgetResolverSurveyData.widgetData.disableTelemetry = true
          this.isFetchingDataComplete = true
        })
    } else {
      this.dataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.surveyData = data.content.data
          if (this.alreadyRaised && this.oldData) {
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.oldData)
          }
          if (this.surveyData) {
            this.formDiscussionForumWidget(this.surveyData)
            if (this.discussionForumWidget) {
              this.discussionForumWidget.widgetData.isDisabled = true
            }
          }

          if (this.surveyData && this.surveyData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.surveyData.identifier)
          }
          if (this.activatedRoute.snapshot.queryParams.collectionId) {
            this.widgetResolverSurveyData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
            if (this.widgetResolverSurveyData.widgetData && this.widgetResolverSurveyData.widgetData.collectionId) {
              await this.fetchContent()
            }
          } else {
            this.widgetResolverSurveyData.widgetData.collectionId = ''
          }
          // this.widgetResolverSurveyData.widgetData.resumePage = 1
          if (this.surveyData && this.surveyData.identifier) {
            if (this.activatedRoute.snapshot.queryParams.collectionId) {
              await this.fetchContinueLearning(
                this.surveyData.identifier,
              )
            } else {
              await this.fetchContinueLearning(this.surveyData.identifier)
            }
          }
          this.widgetResolverSurveyData.widgetData.surveyUrl = this.surveyData
            ? this.forPreview
              ? this.viewerSvc.getAuthoringUrl(this.surveyData.artifactUrl)
              : this.surveyData.artifactUrl
            : ''
          if (this.surveyData) {
            this.widgetResolverSurveyData.widgetData.identifier = this.surveyData.identifier
            this.widgetResolverSurveyData.widgetData.mimeType = this.surveyData.mimeType
            this.widgetResolverSurveyData.widgetData.contentType = this.surveyData.contentType
            this.widgetResolverSurveyData.widgetData.primaryCategory = this.surveyData.primaryCategory
            this.widgetResolverSurveyData.widgetData.version = `${this.surveyData.version}${''}`
          }
          this.widgetResolverSurveyData = JSON.parse(JSON.stringify(this.widgetResolverSurveyData))
          if (this.surveyData) {
            this.oldData = this.surveyData
            this.alreadyRaised = true
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.surveyData)
          }
          this.isFetchingDataComplete = true
        },
        () => { },
      )
    }
  }

  async fetchContent() {
    const content = await this.contentSvc
      .fetchContent(this.widgetResolverSurveyData.widgetData.collectionId || '', 'minimal')
      .toPromise()
    this.widgetResolverSurveyData.widgetData.courseName = content.result.content.name
  }

  // generateUrl(oldUrl: string) {
  //   const chunk = oldUrl.split('/')
  //   const newChunk = environment.azureHost.split('/')
  //   const newLink = []
  //   for (let i = 0; i < chunk.length; i += 1) {
  //     if (i === 2) {
  //       newLink.push(newChunk[i])
  //     } else if (i === 3) {
  //       newLink.push(environment.azureBucket)
  //     } else {
  //       newLink.push(chunk[i])
  //     }
  //   }
  //   const newUrl = newLink.join('/')
  //   return newUrl
  // }

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

  raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {
    if (this.forPreview) {
      return
    }
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'survey',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
        content: data,
        identifier: data ? data.identifier : null,
        mimeType: NsContent.EMimeTypes.PDF,
        url: data ? data.artifactUrl : null,
        object: {
          id: data ? data.identifier : null,
          type: data ? data.primaryCategory : '',
          rollup: {
            l1: this.activatedRoute.snapshot.queryParams.collectionId || '',
          },
        },
      },
    }
    this.eventSvc.dispatchEvent(event)
  }

  async fetchContinueLearning(surveyId: string) {
    return new Promise(resolve => {
      let userId
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId || ''
      }

      // this.activatedRoute.data.subscribe(data => {
      //   userId = data.profileData.data.userId
      // })
      const requestCourse = this.viewerSvc.getBatchIdAndCourseId(
        this.activatedRoute.snapshot.queryParams.collectionId,
        this.activatedRoute.snapshot.queryParams.batchId,
        surveyId)
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
              if (content.contentId === surveyId) {
                this.widgetResolverSurveyData.widgetData.progressStatus = content.status
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
      .catch(() => {
        // throw new DataResponseError('COOKIE_SET_FAILURE')
      })
    return
  }

  ngOnDestroy() {
    if (this.surveyData) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.surveyData)
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
    if (this.viewerDataSubscription) {
      this.viewerDataSubscription.unsubscribe()
    }
    if (this.telemetryIntervalSubscription) {
      this.telemetryIntervalSubscription.unsubscribe()
    }
  }
}
