import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { WsEvents } from './event.model'
import { UtilityService } from './utility.service'
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
  raiseInteractTelemetry(type: string, subType: string | undefined, object: any, context?: WsEvents.ITelemetryContext) {
    this.dispatchEvent<WsEvents.IWsEventTelemetryInteract>({
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        type,
        subType,
        object,
        context: this.getContext(context),
        eventSubType: WsEvents.EnumTelemetrySubType.Interact,
      },
      from: '',
      to: 'Telemetry',
    })
  }

  raiseFeedbackTelemetry(type: string, subType: string | undefined, object: any, from?: string) {
    this.dispatchEvent<WsEvents.IWsEventTelemetryInteract>({
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        type,
        subType,
        object,
        eventSubType: WsEvents.EnumTelemetrySubType.Feedback,
      },
      from: from || '',
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
}
