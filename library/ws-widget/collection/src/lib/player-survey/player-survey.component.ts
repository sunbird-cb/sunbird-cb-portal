import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { IWidgetsPlayerSurveyData } from './player-survey.model'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { interval, Subscription } from 'rxjs'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'
import { ROOT_WIDGET_CONFIG } from '../collection.config'
// import { NsContent } from '../_services/widget-content.model'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '@ws/viewer/src/lib/viewer-util.service'
import { MatSnackBar } from '@angular/material'
import { ViewerDataService } from '@ws/viewer/src/lib/viewer-data.service'
import { WidgetContentService } from '@sunbird-cb/collection'

@Component({
  selector: 'ws-widget-player-survey',
  templateUrl: './player-survey.component.html',
  styleUrls: ['./player-survey.component.scss'],
})
export class PlayerSurveyComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any>, OnDestroy {
  viewerDataServiceSubscription: Subscription | null = null
  @Input() widgetData!: IWidgetsPlayerSurveyData
  runnerSubs: Subscription | null = null
  enableTelemetry = false
  surveyId: any
  courseId: any
  courseName: any
  apiData: {
    // tslint:disable-next-line:prefer-template
    getAPI: string;
    postAPI: string;
    getAllApplications: string;
    customizedHeader: {};
  } | undefined
  public afterSubmitAction = this.checkAfterSubmit.bind(this)
  isReadOnly = false
  progressStatus: any
  identifierId: any
  resourceId: any
  currentResourceId: any
  userid: any
  contentProgressHash: any = []

  constructor(private activatedRoute: ActivatedRoute,
              private eventSvc: EventService,
              private viewerSvc: ViewerUtilService,
              private snackBar: MatSnackBar,
              private viewerDataSvc: ViewerDataService,
              private configSvc: ConfigurationsService,
              private widgetServ: WidgetContentService,
    ) {
    super()
  }

  ngOnInit() {
    const identifier = this.activatedRoute.snapshot.queryParams.collectionId
    const batchId = this.activatedRoute.snapshot.queryParams.batchId
    this.courseId = this.widgetData.collectionId
    this.courseName = this.widgetData.courseName
    this.progressStatus = this.widgetData.progressStatus
    const sID = this.widgetData.surveyUrl.split('surveys/')
    this.surveyId = sID[1]
    this.identifierId = this.activatedRoute.snapshot.data.content.data.identifier
    this.apiData = {
      // tslint:disable-next-line:prefer-template
      getAPI: '/apis/proxies/v8/forms/getFormById?id=' + this.surveyId,
      postAPI: '/apis/proxies/v8/forms/v1/saveFormSubmit',
      getAllApplications: '/apis/proxies/v8/forms/getAllApplications',
      customizedHeader: {},
    }
    this.widgetData.disableTelemetry = false
    this.updateProgress(1)

    if (!this.widgetData.disableTelemetry) {
      this.runnerSubs = interval(30000).subscribe(_ => {
        this.eventDispatcher(WsEvents.EnumTelemetrySubType.HeartBeat)
      })
      this.eventDispatcher(WsEvents.EnumTelemetrySubType.Init)
    }

    this.viewerDataServiceSubscription = this.viewerDataSvc.changedSubject.subscribe(_data => {
      if (this.resourceId !== this.viewerDataSvc.resourceId) {
        this.resourceId = this.viewerDataSvc.resourceId
      }
    })

    this.activatedRoute.params.subscribe(params => {
      this.currentResourceId = params['resourceId']
      this.contentProgressHash = []

      if (identifier && batchId && this.configSvc.userProfile) {
        let userId
        if (this.configSvc.userProfile) {
          userId = this.configSvc.userProfile.userId || ''
          this.userid = this.configSvc.userProfile.userId || ''
        }
        const resData = this.viewerSvc.getBatchIdAndCourseId(this.activatedRoute.snapshot.queryParams.collectionId,
                                                             this.activatedRoute.snapshot.queryParams.batchId, this.identifierId)
        const req = {
          request: {
            userId,
            batchId: resData.batchId || '',
            courseId: resData.courseId || '',
            contentIds: [],
            fields: ['progressdetails'],
          },
        }
        this.widgetServ.fetchContentHistoryV2(req).subscribe(
          (data: any) => {
            this.contentProgressHash = data.result.contentList.filter((i: any) => i.contentId === this.currentResourceId)
            if (this.contentProgressHash && this.contentProgressHash.length > 0) {
              this.progressStatus = this.contentProgressHash[0].status
            }
            // console.log(this.progressStatus)
        })
      }
    })
  }

  // async ngAfterViewInit() {
  //   if (this.widgetData && this.widgetData.collectionId) {
  //       await this.fetchContent()
  //   }
  // }

  // async fetchContent() {
  //   const content = await this.contentSvc
  //     .fetchContent(this.widgetData.collectionId || '', 'minimal')
  //     .toPromise()
  //   this.widgetData.courseName = content.result.content.name
  //   this.courseName = this.widgetData.courseName
  //   // tslint:disable-next-line:no-console
  //   console.log('****courseName****', this.courseName)
  // }

  checkAfterSubmit(e: any) {
    // this.renderSubject.next()
    // tslint:disable-next-line:no-console
    console.log(e)
    this.openSnackbar('Survey is submitted successfully')
    this.progressStatus = 2
    this.updateProgress(2)
  }

  updateProgress(status: number) {
    const id = this.activatedRoute.snapshot.data.content ?
    this.activatedRoute.snapshot.data.content.data.identifier : this.widgetData.identifier
    const resData = this.viewerSvc.getBatchIdAndCourseId(this.activatedRoute.snapshot.queryParams.collectionId,
                                                         this.activatedRoute.snapshot.queryParams.batchId, id)
    const collectionId = (resData && resData.courseId) ? resData.courseId : this.widgetData.identifier
    const batchId = (resData && resData.batchId) ? resData.batchId : this.widgetData.identifier
    this.viewerSvc.realTimeProgressUpdateQuiz(id, collectionId, batchId, status)
  }

  // fireRealTimeProgress(id: string) {
  //   const realTimeProgressRequest = {
  //     ...this.realTimeProgressRequest,
  //     // max_size: this.totalPages,
  //     // current: this.current,
  //   }
  //   const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
  //     this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier
  //   const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
  //     this.activatedRoute.snapshot.queryParams.batchId : this.widgetData.identifier
  //   this.viewerSvc.realTimeProgressUpdate(id, realTimeProgressRequest, collectionId, batchId)
  //   return
  // }

  private eventDispatcher(eventType: WsEvents.EnumTelemetrySubType) {
    if (this.widgetData.disableTelemetry) {
      return
    }
    const commonStructure: WsEvents.WsEventTelemetrySurvey = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: {
        type: 'widget',
        widgetType: ROOT_WIDGET_CONFIG.player._type,
        widgetSubType: ROOT_WIDGET_CONFIG.player.survey,
      },
      to: '',
      data: {
        eventSubType: eventType,
        object: {
          id: this.widgetData.identifier,
          type: this.widgetData.contentType,
          rollup: {
            l1: this.widgetData.collectionId || '',
          },
        },
      },
    }

    switch (eventType) {
      case WsEvents.EnumTelemetrySubType.HeartBeat:
      case WsEvents.EnumTelemetrySubType.Init:
      case WsEvents.EnumTelemetrySubType.Loaded:
      case WsEvents.EnumTelemetrySubType.StateChange:
      case WsEvents.EnumTelemetrySubType.Unloaded:
        break
      default:
        return
    }
    if (this.enableTelemetry) {
      this.eventSvc.dispatchEvent(commonStructure)
    }
  }

  ngOnDestroy() {
    // if (this.identifier) {
    //   this.fireRealTimeProgress(this.identifier)
    // }
    if(this.viewerDataServiceSubscription) {
      this.viewerDataServiceSubscription.unsubscribe()
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
