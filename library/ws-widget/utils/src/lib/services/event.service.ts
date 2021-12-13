import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { WsEvents } from './event.model'
import { UtilityService } from './utility.service'
/* tslint:disable*/
import _ from 'lodash'
@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsSubject = new Subject<WsEvents.IWsEvents<any>>()
  public events$ = this.eventsSubject.asObservable()

  constructor(
    private utilitySvc: UtilityService,
  ) {
    // this.focusChangeEventListener()
  }

  dispatchEvent<T>(event: WsEvents.IWsEvents<T>) {
    this.eventsSubject.next(event)
  }

  // helper functions
  raiseInteractTelemetry(edata: WsEvents.ITelemetryEdata, object: any, context?: WsEvents.ITelemetryContext) {
    this.dispatchEvent<WsEvents.IWsEventTelemetryInteract>({
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata,
        object,
        context: this.getContext(context),
        eventSubType: WsEvents.EnumTelemetrySubType.Interact,
      },
      from: '',
      to: 'Telemetry',
    })
  }

  raiseFeedbackTelemetry(edata: WsEvents.ITelemetryEdata, object: any, from?: string) {
    this.dispatchEvent<WsEvents.IWsEventTelemetryInteract>({
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata,
        object,
        eventSubType: WsEvents.EnumTelemetrySubType.Feedback,
      },
      from: from || '',
      to: 'Telemetry',
    })
  }

  // Raise custom impression events eg:on tab change
  raiseCustomImpression(context?: WsEvents.ITelemetryContext) {
    this.dispatchEvent<WsEvents.IWsEventTelemetryImpression>({
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        context: this.getContext(context),
        eventSubType: WsEvents.EnumTelemetrySubType.Impression,
      },
      from: '',
      to: 'Telemetry',
    })
  }

  // private focusChangeEventListener() {
  //   fromEvent(window, 'focus').subscribe(() => {
  //     this.raiseInteractTelemetry('focus', 'gained', {})
  //   })
  //   fromEvent(window, 'blur').subscribe(() => {
  //     this.raiseInteractTelemetry('focus', 'lost', {})
  //   })
  // }

  // Method to get the context information about the telemetry interact event
  private getContext(context: WsEvents.ITelemetryContext | undefined): WsEvents.ITelemetryContext {
    const routeDataContext = this.utilitySvc.routeData
    // initialize with the route data configuration - current route's pageID & module
    const finalContext: WsEvents.ITelemetryContext = {
      pageId: routeDataContext.pageId,
      module: routeDataContext.module,
    }
    if (context) {
      // if context has pageIdExt, append it to the route's pageId
      if (context.pageIdExt) {
        finalContext.pageId = `${routeDataContext.pageId}_${context.pageIdExt}`
      } else if (context.pageId) {
        // else context has pageId, override it to the final pageID
        finalContext.pageId = context.pageId
      }
      // if context has module, override it to the final module
      if (context.module) {
        finalContext.module = context.module
      }
    }

    return finalContext
  }

  public handleTabTelemetry(subType: string, data: WsEvents.ITelemetryTabData) {
    // raise a tab click interact event
    this.raiseInteractTelemetry(
      {
        subType,
        type: WsEvents.EnumInteractTypes.CLICK,
      },
      {
        id: `${_.camelCase(data.label)}`,
        context: {
          position: data.index,
        },
      },
      {
      pageIdExt: `${_.camelCase(data.label)}-tab`,
    })

    // raise a tab click impression event
    this.raiseCustomImpression({
      pageIdExt: `${_.camelCase(data.label)}-tab`,
    })
  }
}
