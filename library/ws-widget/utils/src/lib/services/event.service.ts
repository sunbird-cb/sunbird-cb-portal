import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { WsEvents } from './event.model'
import { UtilityService } from './utility.service'
/* tslint:disable*/
import _ from 'lodash'
import { environment } from 'src/environments/environment'
import moment from 'moment'
@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsSubject = new Subject<WsEvents.IWsEvents<any>>()
  public events$ = this.eventsSubject.asObservable()

  private eventsChatbotSubject = new Subject<WsEvents.IWsEvents<any>>()
  public chatbotEvents$ = this.eventsChatbotSubject.asObservable()

  private eventsGetStartSubject = new Subject<WsEvents.IWsEvents<any>>()
  public getStartEvents$ = this.eventsGetStartSubject.asObservable()

  private eventsPRSubject = new Subject<WsEvents.IWsEvents<any>>()
  public getPREvents$ = this.eventsPRSubject.asObservable()

  constructor(
    private utilitySvc: UtilityService,
  ) {
    // this.focusChangeEventListener()
  }

  dispatchEvent<T>(event: WsEvents.IWsEvents<T>) {
    event.pageContext = this.getContext(event.pageContext)
    this.eventsSubject.next(event)
  }

  dispatchChatbotEvent<T>(event: WsEvents.IWsEvents<T>) {
    this.eventsChatbotSubject.next(event)
  }

  dispatchGetStartedEvent<T>(event: WsEvents.IWsEvents<T>) {
    this.eventsGetStartSubject.next(event)
  }

  dispatchPlatformRatingEvent<T>(event: WsEvents.IWsEvents<T>) {
    this.eventsPRSubject.next(event)
  }


  // helper functions
  raiseInteractTelemetry(edata: WsEvents.ITelemetryEdata, object: any, pageContext?: WsEvents.ITelemetryPageContext) {
    this.dispatchEvent<WsEvents.IWsEventTelemetryInteract>({
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata,
        object,
        pageContext: this.getContext(pageContext),
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
  raiseCustomImpression(object: any, pageContext?: WsEvents.ITelemetryPageContext) {
    this.dispatchEvent<WsEvents.IWsEventTelemetryImpression>({
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        object,
        pageContext: this.getContext(pageContext),
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
  private getContext(pageContext: WsEvents.ITelemetryPageContext | undefined): WsEvents.ITelemetryPageContext {
    const routeDataContext = this.utilitySvc.routeData
    // initialize with the route data configuration - current route's pageID & module
    const finalContext: WsEvents.ITelemetryPageContext = {
      pageId: routeDataContext.pageId,
      module: routeDataContext.module,
    }
    if (pageContext) {
      // if context has pageIdExt, append it to the route's pageId
      if (pageContext.pageIdExt) {
        finalContext.pageId = `${routeDataContext.pageId}_${pageContext.pageIdExt}`
      } else if (pageContext.pageId) {
        // else context has pageId, override it to the final pageID
        finalContext.pageId = pageContext.pageId
      }
      // if context has module, override it to the final module
      if (pageContext.module) {
        finalContext.module = pageContext.module
      }
    }

    return finalContext
  }

  public handleTabTelemetry(subType: string, data: WsEvents.ITelemetryTabData, object?:any) {
    // raise a tab click interact event
    this.raiseInteractTelemetry(
      {
        subType,
        type: WsEvents.EnumInteractTypes.CLICK,
        id: `${_.camelCase(data.label)}-tab`,
      },
      {
        // context: {
        //   position: data.index,
        // },
        ...object
      },
      {
      pageIdExt: `${_.camelCase(data.label)}-tab`,
    })

    // raise a tab click impression event
    this.raiseCustomImpression({
      context: {
            position: data.index,
          },
          ...object
      },{
      pageIdExt: `${_.camelCase(data.label)}-tab`,
    })
  }

  getPublicUrl(url: string): string {
    const mainUrl = url.split('/content').pop() || ''
    return `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
  }

  allEventDateFormat(datetime: any) {
    const date = new Date(datetime).getDate()
    const year = new Date(datetime).getFullYear()
    const month = new Date(datetime).getMonth()
    const hours = new Date(datetime).getHours()
    const minutes = new Date(datetime).getMinutes()
    const seconds = new Date(datetime).getSeconds()
    const formatedDate = new Date(year, month, date, hours, minutes, seconds, 0)
    // let format = 'YYYY-MM-DD hh:mm a'
    // if (!timeAllow) {
    const format = 'YYYY-MM-DD'
    // }
    const readableDateMonth = moment(formatedDate).format(format)
    const finalDateTimeValue = `${readableDateMonth}`
    return finalDateTimeValue
  }

  compareDate(startDate: any) {
    const now = new Date()

    // tslint:disable-next-line:prefer-template
    const day =  ('0' + (new Date().getDate())).slice(-2)
    const year = new Date().getFullYear()
    // tslint:disable-next-line:prefer-template
    const month = ('0' + (now.getMonth() + 1)).slice(-2)
    const todaysdate = `${year}-${month}-${day}`
    if (startDate === todaysdate)  {
      return true
    }
    return false
  }

  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
 }
}
