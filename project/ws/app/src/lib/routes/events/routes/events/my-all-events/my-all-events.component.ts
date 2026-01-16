import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../../services/events.service';
import { ConfigurationsService, MultilingualTranslationsService, NsContent, WsEvents } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash'
import { EventService as libEventService } from '@sunbird-cb/utils-v2'
//import { DatePipe } from '@angular/common';

@Component({
  selector: 'ws-app-my-all-events',
  templateUrl: './my-all-events.component.html',
  styleUrls: ['./my-all-events.component.scss']
})
export class MyAllEventsComponent {
  titles: any = []
  contentDataList: any = []
  contnet: any = []
  tabSelected: string = ''
  tabIndex = 0
  isLoading = false
  response: any = []
  past: any = []
  upcoming: any = []
  today: any = []
  constructor(
    private activateRoute: ActivatedRoute,
    private translate: TranslateService,
    private eventSvc: EventService,
    private langtranslations: MultilingualTranslationsService,
    private events: libEventService,
    private configSvc: ConfigurationsService,
    //private datePipe: DatePipe,
  ) {
    this.titles = [
      { title: 'events', url: '/app/event-hub/home', icon: 'event' },
      { title: this.translateLabels("myEvents", 'events', ''), url: `none`, icon: '' }
    ]
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }
  ngOnInit() {
    this.activateRoute.queryParamMap.subscribe((data: any) => {
      this.tabSelected = _.get(data, 'params.tabSelected', 'today')
    })
    this.fetchData()
  }

  fetchData() {
    if (!this.isLoading) {
      this.contentDataList = [...this.contentDataList, ...this.transformSkeletonToWidgets(this.contnet)]
    }
    console.log("tabSelected ", this.tabSelected)
    if (this.tabSelected === 'today') {
      this.tabIndex = 0
    } else if (this.tabSelected === 'upcoming') {
      this.tabIndex = 1
    } else if (this.tabSelected === 'past') {
      this.tabIndex = 2
    }
    const requestBody = {
      request: {
        retiredCoursesEnabled: true,
        status: 'All',
      }
    }
    this.isLoading = true
    if (_.get(this.configSvc, 'userProfile.userId')) {
      this.eventSvc.myEvents(_.get(this.configSvc, 'userProfile.userId'), requestBody).subscribe((resp: any) => {
        this.response = _.get(resp, 'result.events', [])
        this.contentDataList = this.contentDataList.slice(0, -12)
        if (this.response.length) {
          console.log("response", this.response)
          const processedEvents = this.processResult(this.response)
          this.contentDataList = [...this.contentDataList, ...this.transformContentsToWidgets(processedEvents, {})]
        } else {
          this.contentDataList = [...this.contentDataList, ...this.transformContentsToWidgets([], {})]
        }
        this.isLoading = false
      }, error => {
        console.log("error", error)
        this.contentDataList = this.contentDataList.slice(0, -12)
        this.contentDataList = [...this.contentDataList, ...this.transformContentsToWidgets([], {})]
        this.isLoading = false
      })
    }
  }

  processResult(resp: any) {
    let processedEvents: any = []
    this.upcoming = []
    this.past = []
    this.today = []
    resp.forEach((resp: any) => {
      if (resp.event && resp.event.startDate) {
        const eventDetails = resp.event
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const eventDate = new Date(_.get(eventDetails, 'startDate'))
        eventDate.setHours(0, 0, 0, 0)
        if (today.getTime() === eventDate.getTime()) {
          this.today.push(resp)
        } else if (today.getTime() < eventDate.getTime()) {
          this.upcoming.push(resp)
        } else if (today.getTime() > eventDate.getTime()) {
          this.past.push(resp)
        }
      }
    })
    switch (this.tabIndex) {
      case 0:
        processedEvents = this.today
        break
      case 1:
        processedEvents = this.upcoming
        break
      case 2:
        processedEvents = this.past
        break
    }
    return this.sortData(processedEvents)
  }


  sortData(data: any) {
    return data.sort((a: any, b: any) => {
      const dateA = new Date(`${a.event.startDate}T${a.event.startTime}`);
      const dateB = new Date(`${b.event.startDate}T${b.event.startTime}`);
      return this.tabIndex === 2 ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })
  }

  isLiveEvent(event: any) {
    if (event && event.startDate && event.endDate && event.startTime && event.endTime) {
      // Conver current time into milliseconds
      let currentTime = new Date().getTime() / 1000
      // Combining date and time for start event
      let evenStarttDate = new Date(`${event.startDate} ${event.startTime}`).getTime() / 1000
      // Combining date and time for end event
      let eventEndDate = new Date(`${event.endDate} ${event.endTime}`).getTime() / 1000
      return (currentTime <= eventEndDate && currentTime >= evenStarttDate)
    }
    return false
  }

  translateLabels(label: string, type: any, subtype: any) {
    return this.langtranslations.translateActualLabel(label, type, subtype)
  }

  raiseTelemetry(event: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'my-events',
        id: "card-content",
      },
      {
        id: _.get(event, 'widgetData.content.identifier', ''),
        type: "event"
      },
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    )
  }

  tabClick(tab: any) {
    this.tabIndex = tab.index
    if (tab.index === 0) {
      this.tabSelected = 'today'
    } else if (tab.index === 1) {
      this.tabSelected = 'upcoming'
    } else if (tab.index === 2) {
      this.tabSelected = 'past'
    }
    this.resetData()
    //this.fetchData()
    this.contentDataList = this.contentDataList.slice(0, -12)
    if (this.response.length) {
      console.log("response", this.response)
      const processedEvents = this.processResult(this.response)
      this.contentDataList = [...this.contentDataList, ...this.transformContentsToWidgets(processedEvents, {})]
    } else {
      this.contentDataList = [...this.contentDataList, ...this.transformContentsToWidgets([], {})]
    }
    this.isLoading = false
  }

  resetData() {
    this.contentDataList = []
  }

  private transformSkeletonToWidgets(
    strip: any
  ) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(_content => ({
      widgetType: 'card',
      widgetSubType: 'cardContent',
      widgetHostClass: 'mb-2',
      widgetData: {
        cardSubType: strip.viewMoreUrl && strip.viewMoreUrl.loaderConfig
          && strip.viewMoreUrl.loaderConfig.cardSubType || 'card-event-v2-skeleton',
        cardCustomeClass: strip.customeClass ? strip.customeClass : 'card-resource-container-small',
      },
    }))
  }

  private transformContentsToWidgets(
    contents: NsContent.IContent[],
    strip: any,
  ) {
    return (contents || []).map((content, idx) => ({
      widgetType: 'card',
      widgetSubType: 'cardContent',
      widgetHostClass: 'mb-2',
      widgetData: {
        content: {
          ...content.event,
          showLive: this.isLiveEvent(content.event),
        },
        ...(content.batch && {
          batch: content.batch,
        }),
        cardSubType: 'card-event-v2',
        context: {
          pageSection: strip.key,
          position: idx,
        },
        cardCustomeClass: strip.customeClass ? strip.customeClass : 'card-resource-container-small',
        intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
        deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
        contentTags: strip.stripConfig && strip.stripConfig.contentTags,
      },
    }))
  }

}
