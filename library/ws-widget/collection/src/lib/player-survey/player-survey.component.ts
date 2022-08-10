import { Component, OnInit, Input } from '@angular/core'
import { IWidgetsPlayerSurveyData } from './player-survey.model'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { interval, Subscription } from 'rxjs'
import { EventService, WsEvents } from '@sunbird-cb/utils'
import { ROOT_WIDGET_CONFIG } from '../collection.config'

@Component({
  selector: 'ws-widget-player-survey',
  templateUrl: './player-survey.component.html',
  styleUrls: ['./player-survey.component.scss'],
})
export class PlayerSurveyComponent extends WidgetBaseComponent
implements OnInit, NsWidgetResolver.IWidgetData<any>  {
  @Input() widgetData!: IWidgetsPlayerSurveyData
  runnerSubs: Subscription | null = null
  enableTelemetry = false

  domain = 'https://igot-dev.in/'
  surveyTitle = 'Feedback and suggestions'
  surveyId = 1658991702886
  thankYouMessage = 'Thank you for your feedback!!!'
  thankYouDescription = 'We are always looking forward to improvement.'
  tyPrimaryBtnLink = '/page/home'
  tySecondaryBtnLink = '/app/info/feedback'
  tyPrimaryBtnText = 'Go to'
  tySecondaryBtnText = 'More feedback'
  apiData: object = {
    getAPI: `${this.domain}api/forms/getFormById?id=${this.surveyId}`,
    postAPI: `${this.domain}api/forms/saveFormSubmit`,
    customizedHeader: {
    },
  }
  constructor(
    private eventSvc: EventService) {
    super()
  }

  ngOnInit() {
    console.log('widgetData', this.widgetData)
    // const sID = this.widgetData.surveyUrl.split('surveys/')
    // this.surveyId = sID[1]
    this.widgetData.disableTelemetry = false

    if (!this.widgetData.disableTelemetry) {
      this.runnerSubs = interval(30000).subscribe(_ => {
        this.eventDispatcher(WsEvents.EnumTelemetrySubType.HeartBeat)
      })
      this.eventDispatcher(WsEvents.EnumTelemetrySubType.Init)
    }
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
}
