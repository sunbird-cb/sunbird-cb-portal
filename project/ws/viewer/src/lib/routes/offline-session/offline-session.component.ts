import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { NsContent, NsDiscussionForum, WidgetContentService } from '@sunbird-cb/collection'
import { AccessControlService } from '@ws/author'
import { NsWidgetResolver } from '@sunbird-cb/resolver/src/public-api'
import { environment } from 'src/environments/environment'
import { WsEvents, EventService } from '@sunbird-cb/utils'

@Component({
  selector: 'viewer-offline-session',
  templateUrl: './offline-session.component.html',
  styleUrls: ['./offline-session.component.scss'],
})
export class OfflineSessionComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | null = null
  private viewerDataSubscription: Subscription | null = null
  private telemetryIntervalSubscription: Subscription | null = null
  isFetchingDataComplete = false
  offlineSessionData: NsContent.IContent | null = null
  oldData: NsContent.IContent | null = null
  alreadyRaised = false
  widgetResolverOfflineSessionData: any = {
    widgetType: 'player',
    widgetSubType: 'playerOfflineSession',
    widgetData: {
      offlineSessionUrl: '',
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
    private eventSvc: EventService,
    private accessControlSvc: AccessControlService,
  ) { }

  ngOnInit() {
    if (
      this.activatedRoute.snapshot.queryParamMap.get('preview') &&
      !this.accessControlSvc.authoringConfig.newDesign
    ) {
      this.isPreviewMode = true
      this.viewerDataSubscription = this.activatedRoute.data
      .subscribe(data => {
        this.offlineSessionData = data.content.data
        if (this.offlineSessionData) {
          this.formDiscussionForumWidget(this.offlineSessionData)
          if (this.discussionForumWidget) {
            this.discussionForumWidget.widgetData.isDisabled = true
          }
        }
        // this.widgetResolverOfflineSessionData.widgetData.pdfUrl = this.pdfData
        //   ? `/apis/authContent/${encodeURIComponent(this.pdfData.artifactUrl)}`
        //   : ''
        if (this.activatedRoute.snapshot.queryParams.collectionId) {
          this.widgetResolverOfflineSessionData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
        } else {
          this.widgetResolverOfflineSessionData.widgetData.collectionId = ''
        }
        // this.widgetResolverOfflineSessionData.widgetData.identifier=''
        // tslint:disable-next-line
        this.widgetResolverOfflineSessionData.widgetData.OfflineSessionUrl = this.generateUrl(this.offlineSessionData!.artifactUrl)
        this.widgetResolverOfflineSessionData.widgetData.disableTelemetry = true
        if (this.offlineSessionData) {
          this.widgetResolverOfflineSessionData.widgetData.identifier = this.offlineSessionData.identifier
          this.widgetResolverOfflineSessionData.widgetData.mimeType = this.offlineSessionData.mimeType
          this.widgetResolverOfflineSessionData.widgetData.contentType = this.offlineSessionData.contentType
          this.widgetResolverOfflineSessionData.widgetData.primaryCategory = this.offlineSessionData.primaryCategory

          this.widgetResolverOfflineSessionData.widgetData.version = `${this.offlineSessionData.version}${''}`
          this.widgetResolverOfflineSessionData.widgetData.content = this.offlineSessionData
        }
        this.isFetchingDataComplete = true
      })
    } else {
      this.dataSubscription = this.activatedRoute.data.subscribe(
        async data => {
          this.offlineSessionData = data.content.data
          if (this.alreadyRaised && this.oldData) {
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.oldData)
          }
          if (this.offlineSessionData) {
            this.formDiscussionForumWidget(this.offlineSessionData)
          }

          if (this.offlineSessionData && this.offlineSessionData.artifactUrl.indexOf('content-store') >= 0) {
            await this.setS3Cookie(this.offlineSessionData.identifier)
          }
          if (this.activatedRoute.snapshot.queryParams.collectionId) {
            this.widgetResolverOfflineSessionData.widgetData.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
          } else {
            this.widgetResolverOfflineSessionData.widgetData.collectionId = ''
          }
          //  TO DO: in future enable this to get the content history and resume feature
          // if (this.offlineSessionData && this.offlineSessionData.identifier) {
          //   if (this.activatedRoute.snapshot.queryParams.collectionId) {
          //     await this.fetchContinueLearning(
          //       this.activatedRoute.snapshot.queryParams.collectionId,
          //       this.offlineSessionData.identifier,
          //     )
          //   } else {
          //     await this.fetchContinueLearning(this.offlineSessionData.identifier, this.offlineSessionData.identifier)
          //   }
          // }
          // this.widgetResolverOfflineSessionData.widgetData.OfflineSessionUrl = this.offlineSessionData
          //   ? this.forPreview
          //     ? this.viewerSvc.getAuthoringUrl(this.offlineSessionData.artifactUrl)
          //     : this.offlineSessionData.artifactUrl
          //   : ''
          if (this.offlineSessionData) {
            this.widgetResolverOfflineSessionData.widgetData.identifier = this.offlineSessionData.identifier
            this.widgetResolverOfflineSessionData.widgetData.mimeType = this.offlineSessionData.mimeType
            this.widgetResolverOfflineSessionData.widgetData.contentType = this.offlineSessionData.contentType
            this.widgetResolverOfflineSessionData.widgetData.primaryCategory = this.offlineSessionData.primaryCategory

            this.widgetResolverOfflineSessionData.widgetData.version = `${this.offlineSessionData.version}${''}`
            this.widgetResolverOfflineSessionData.widgetData.content = this.offlineSessionData
          }
          this.widgetResolverOfflineSessionData = JSON.parse(JSON.stringify(this.widgetResolverOfflineSessionData))
          if (this.offlineSessionData) {
            this.oldData = this.offlineSessionData
            this.alreadyRaised = true
            this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.offlineSessionData)
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

  // async fetchContinueLearning(collectionId: string, OfflineSessionId: string): Promise<boolean> {
  //   return new Promise(resolve => {

  //     let userId
  //     if (this.configSvc.userProfile) {
  //       userId = this.configSvc.userProfile.userId || ''
  //     }

  //     const req: NsContent.IContinueLearningDataReq = {
  //       request: {
  //         userId,
  //         batchId: this.batchId,
  //         courseId: collectionId || '',
  //         contentIds: [],
  //         fields: ['progressdetails'],
  //       },
  //     }
  //     this.contentSvc.fetchContentHistoryV2(req).subscribe(
  //       data => {
  //         if (data && data.result && data.result.contentList.length) {
  //           for (const content of data.result.contentList) {
  //             //  TO DO: Put the resume logic here in future
  //             // if (content.contentId === OfflineSessionId && content.progressdetails && content.progressdetails.current) {
  //             //   this.widgetResolverOfflineSessionData.widgetData.resumePage = Number(content.progressdetails.current.pop())
  //             // }
  //           }
  //         }
  //         resolve(true)
  //       },
  //       () => resolve(true),
  //     )
  //   })
  // }

  private async setS3Cookie(contentId: string) {
    await this.contentSvc
      .setS3Cookie(contentId)
      .toPromise()
      .catch(() => {
        // throw new DataResponseError('COOKIE_SET_FAILURE')
      })
    return
  }

  raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {
    // if (this.forPreview) {
    //   return
    // }

    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'OfflineSession',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
        content: data,
        identifier: data ? data.identifier : null,
        mimeType: NsContent.EMimeTypes.OFFLINE_SESSION,
        url: data ? data.artifactUrl : null,
        object: { id: data ? data.identifier : null, type: data ? data.primaryCategory : '' },
      },
    }
    this.eventSvc.dispatchEvent(event)
  }

  ngOnDestroy() {
    if (this.offlineSessionData) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.offlineSessionData)
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
