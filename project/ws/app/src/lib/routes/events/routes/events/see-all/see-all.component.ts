import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../../services/events.service';
import { MultilingualTranslationsService, NsContent, WsEvents } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash'
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { EventService as libEventService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-see-all',
  templateUrl: './see-all.component.html',
  styleUrls: ['./see-all.component.scss']
})
export class SeeAllComponent {
  titles: any = []
  contentDataList: any = []
  contnet: any = []
  category: string = ''
  constructor(
    private activateRoute: ActivatedRoute,
    private translate: TranslateService,
    private eventSvc: EventService,
    private langtranslations: MultilingualTranslationsService,
    private events: libEventService,
  ) {
    this.titles = [
      { title: 'events', url: '/app/event-hub/home', icon: 'event' },
    ]
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }
  ngOnInit() {
    this.activateRoute.queryParamMap.subscribe((data: any) => {
      if (data.params.category) {
        this.category = data.params.category
        this.titles.push({
          title: this.translateLabels(this.category, 'events', ''), url: `none`, icon: ''
        })
      }
    })
    if (this.category === 'featuredEvents' || this.category === 'trendingEvents') {
      this.contentDataList = this.transformSkeletonToWidgets(this.contnet)
      this.apiCall().pipe(
        map(response => {
          return _.get(response, 'result.events', [])
        }),
        catchError(error => {
          console.error('Error in API 1:', error)
          this.contentDataList = this.transformContentsToWidgets([], {})
          return of(null)
        })
      ).subscribe(ids => {
        if (ids.length) {
          this.fetchData(ids);
        } else {
          this.contentDataList = this.transformContentsToWidgets([], {})
        }
      })
    }
  }

  apiCall() {
    if (this.category === 'featuredEvents') {
      return this.eventSvc.getFeaturedEvents()
    } else {
      return this.eventSvc.getTrendingEvents()
    }
  }
  fetchData(response: any) {
    let requestBody: any = {
      locale: [
        'en',
      ],
      query: '',
      request: {
        query: '',
        filters: {
          status: ['Live'],
          contentType: 'Event',
          identifier: response
        },
        sort_by: {
          startDate: 'desc',
        },
        limit: 500,
      },
    }
    this.eventSvc.getEventsList(requestBody).subscribe((resp: any) => {
      let events: any = _.get(resp, 'result.Event', [])
      if (events.length) {
        let proccessedEvents: any = []
        response.forEach((id: any) => {
          const event = events.find((e: any) => e.identifier === id)
          if (event) {
            proccessedEvents.push({ event: event })
          }
        })
        this.contentDataList = this.transformContentsToWidgets(proccessedEvents, {})
      } else {
        this.contentDataList = this.transformContentsToWidgets([], {})
      }
    }, error => {
      console.log("error", error)
      this.contentDataList = this.transformContentsToWidgets([], {})
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
    let subType = ''
    if (this.category === 'featuredEvents') {
      subType = 'featured-events'
    } else if (this.category === 'trendingEvents') {
      subType = 'trending-events'
    } else {
      subType = 'recommended-events'
    }
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: subType,
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

  transformSkeletonToWidgets(
    strip: any
  ) {
    return [1, 2, 3, 4, 5, 6, 7, 8].map(_content => ({
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

  transformContentsToWidgets(
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
