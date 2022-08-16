import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core'
import { IWidgetsPlayerSurveyData } from './player-survey.model'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { interval, Subscription } from 'rxjs'
import { EventService, WsEvents } from '@sunbird-cb/utils'
import { ROOT_WIDGET_CONFIG } from '../collection.config'
import { NsContent } from '../_services/widget-content.model'
import { ActivatedRoute } from '@angular/router'
import { ViewerUtilService } from '@ws/viewer/src/lib/viewer-util.service'

@Component({
  selector: 'ws-widget-player-survey',
  templateUrl: './player-survey.component.html',
  styleUrls: ['./player-survey.component.scss'],
})
export class PlayerSurveyComponent extends WidgetBaseComponent
implements OnInit, AfterViewInit, NsWidgetResolver.IWidgetData<any>, OnDestroy  {
  @Input() widgetData!: IWidgetsPlayerSurveyData
  runnerSubs: Subscription | null = null
  enableTelemetry = false
  surveyId: any
  afterSubmitLink = '/page/home'
  apiData: {
    // tslint:disable-next-line:prefer-template
    getAPI: string;
    postAPI: string;
    customizedHeader: {};
  } | undefined
  realTimeProgressRequest = {
    content_type: 'Resource',
    current: ['0'],
    max_size: 0,
    mime_type: NsContent.EMimeTypes.SURVEY,
    user_id_type: 'uuid',
  }
  identifier: string | null = null

  constructor(private activatedRoute: ActivatedRoute, private eventSvc: EventService, private viewerSvc: ViewerUtilService) {
    super()
  }

  ngOnInit() {
    console.log('widgetData', this.widgetData)
    // if (this.widgetData && this.widgetData.surveyUrl) {
      const sID = this.widgetData.surveyUrl.split('surveys/')
      this.surveyId = sID[1]
      this.apiData = {
        // tslint:disable-next-line:prefer-template
        getAPI: '/apis/proxies/v8/forms/getFormById?id=' + this.surveyId,
        postAPI: '/apis/proxies/v8/forms/v1/saveFormSubmit',
        customizedHeader: {
        },
      }
    // }
    this.widgetData.disableTelemetry = false

    if (!this.widgetData.disableTelemetry) {
      this.runnerSubs = interval(30000).subscribe(_ => {
        this.eventDispatcher(WsEvents.EnumTelemetrySubType.HeartBeat)
      })
      this.eventDispatcher(WsEvents.EnumTelemetrySubType.Init)
    }
  }

  ngAfterViewInit() {
    if (this.widgetData && this.widgetData.surveyUrl) {
      if (this.widgetData.identifier) {
        this.identifier = this.widgetData.identifier
      }
    }
  }

  fireRealTimeProgress(id: string) {
    const realTimeProgressRequest = {
      ...this.realTimeProgressRequest,
      // max_size: this.totalPages,
      // current: this.current,
    }
    const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
      this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier
    const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
      this.activatedRoute.snapshot.queryParams.batchId : this.widgetData.identifier
    this.viewerSvc.realTimeProgressUpdate(id, realTimeProgressRequest, collectionId, batchId)
    return
  }

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
        widgetSubType: ROOT_WIDGET_CONFIG.player.pdf,
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
    if (this.identifier) {
      this.fireRealTimeProgress(this.identifier)
    }
  }
}
