import { AccessControlService } from '@ws/author'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { NsContent, NsDiscussionForum, WidgetContentService } from '@sunbird-cb/collection'
import { WsEvents, EventService, ConfigurationsService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '../../viewer-util.service'
import { environment } from 'src/environments/environment'
import { PdfScormDataService } from '../../pdf-scorm-data-service'
@Component({
  selector: 'viewer-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
})
export class PdfComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  private telemetryIntervalSubscription: Subscription | null = null
  isFetchingDataComplete = false
  pdfData: NsContent.IContent | null = null
  oldData: NsContent.IContent | null = null
  alreadyRaised = false
  widgetResolverPdfData: any = {
    widgetType: 'player',
    widgetSubType: 'playerPDF',
    widgetData: {
      pdfUrl: '',
      identifier: '',
      disableTelemetry: false,
      hideControls: true,
      mimeType: '',
      collectionId: '',
    },
  }
  isPreviewMode = false
  forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
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
    private pdfScormDataService: PdfScormDataService
  ) { }

  ngOnInit() {
    if (
      this.activatedRoute.snapshot.queryParamMap.get('preview') === 'true' &&
      !this.accessControlSvc.authoringConfig.newDesign
    ) {
      this.isPreviewMode = true
      this.viewerDataSubscription = this.activatedRoute.data
        .subscribe(data => {
          this.pdfData = data.content.data
          if (this.pdfData) {
            this.formDiscussionForumWidget(this.pdfData)
            if (this.discussionForumWidget) {
              this.discussionForumWidget.widgetData.isDisabled = true
            }
          }
          // this.widgetResolverPdfData.widgetData.pdfUrl = this.pdfData
          //   ? `/apis/authContent/${encodeURIComponent(this.pdfData.artifactUrl)}`
          //   : ''
          if (this.activatedRoute.snapshot.queryParams.collectionId) {
            this.widgetResolverPdfData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
          } else {
            this.widgetResolverPdfData.widgetData.collectionId = ''
          }
          // this.widgetResolverPdfData.widgetData.identifier=''
          // tslint:disable-next-line
          this.widgetResolverPdfData.widgetData.pdfUrl = this.generateUrl(this.pdfData!.artifactUrl)
          this.widgetResolverPdfData.widgetData.disableTelemetry = true
          if (this.pdfData) {
            this.widgetResolverPdfData.widgetData.identifier = this.pdfData.identifier
            this.widgetResolverPdfData.widgetData.mimeType = this.pdfData.mimeType
            this.widgetResolverPdfData.widgetData.contentType = this.pdfData.contentType
            this.widgetResolverPdfData.widgetData.primaryCategory = this.pdfData.primaryCategory

            this.widgetResolverPdfData.widgetData.version = `${this.pdfData.version}${''}`
          }
          this.isFetchingDataComplete = true
        })
    } else {
      this.dataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.pdfData = data.content.data
          if (this.alreadyRaised && this.oldData) {
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.oldData)
          }
          if (this.pdfData) {
            this.formDiscussionForumWidget(this.pdfData)
          }

          if (this.pdfData && this.pdfData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.pdfData.identifier)
          }
          if (this.activatedRoute.snapshot.queryParams.collectionId) {
            this.widgetResolverPdfData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
          } else {
            this.widgetResolverPdfData.widgetData.collectionId = ''
          }
          this.widgetResolverPdfData.widgetData.resumePage = 1
          if (this.pdfData && this.pdfData.identifier) {
            if (this.activatedRoute.snapshot.queryParams.collectionId) {
              await this.fetchContinueLearning(
                this.pdfData.identifier,
              )
            } else {
              await this.fetchContinueLearning(this.pdfData.identifier)
            }
          }
          this.widgetResolverPdfData.widgetData.pdfUrl = this.pdfData
            ? this.forPreview
              ? this.viewerSvc.getAuthoringUrl(this.pdfData.artifactUrl)
              : this.pdfData.artifactUrl
            : ''
          if (this.pdfData) {
            this.widgetResolverPdfData.widgetData.identifier = this.pdfData.identifier
            this.widgetResolverPdfData.widgetData.mimeType = this.pdfData.mimeType
            this.widgetResolverPdfData.widgetData.contentType = this.pdfData.contentType
            this.widgetResolverPdfData.widgetData.primaryCategory = this.pdfData.primaryCategory

            this.widgetResolverPdfData.widgetData.version = `${this.pdfData.version}${''}`
          }
          this.widgetResolverPdfData = JSON.parse(JSON.stringify(this.widgetResolverPdfData))
          if (this.pdfData) {
            this.oldData = this.pdfData
            this.alreadyRaised = true
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.pdfData)
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
    // if (this.forPreview) {
    //   return
    // }

    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'pdf',
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
            l1: this.widgetResolverPdfData.widgetData.collectionId || '',
          },
        },
      },
    }
    this.eventSvc.dispatchEvent(event)
  }

  async fetchContinueLearning(pdfId: string): Promise<boolean> {
    return new Promise(resolve => {
      // this.contentSvc.fetchContentHistory(collectionId).subscribe(
      //   data => {
      //     if (data) {
      //       if (data.identifier === pdfId && data.continueData && data.continueData.progress) {
      //         this.widgetResolverPdfData.widgetData.resumePage = Number(data.continueData.progress)
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

      // this.activatedRoute.data.subscribe(data => {
      //   userId = data.profileData.data.userId
      // })
      const requestCourse = this.viewerSvc.getBatchIdAndCourseId(
        this.activatedRoute.snapshot.queryParams.collectionId,
        this.activatedRoute.snapshot.queryParams.batchId,
        pdfId)
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
              if (content.contentId === pdfId && content.progressdetails && content.progressdetails.current) {
                if (content.progress === 100 || content.status === 2) {
                  this.widgetResolverPdfData.widgetData.resumePage = 1
                } else {
                  this.widgetResolverPdfData.widgetData.resumePage = Number(content.progressdetails.current.pop())
                }
                this.pdfScormDataService.handlePdfMarkComplete.next(content)
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
    if (this.pdfData) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.pdfData)
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
