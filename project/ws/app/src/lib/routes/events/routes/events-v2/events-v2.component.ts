import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import * as _ from 'lodash'
import { EventsEngagementComponent } from '../events-engagement/events-engagement.component';
import { EventsCalendarComponent } from '../events-calendar/events-calendar.component';
import { EventService } from '../../services/events.service';
import { WsEvents, EventService as libEventService } from '@sunbird-cb/utils-v2'
import { NsWidgetResolver } from 'library/ws-widget/resolver/src/public-api'
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-events-v2',
  templateUrl: './events-v2.component.html',
  styleUrls: ['./events-v2.component.scss']
})
export class EventsV2Component {

  eventsHome!: NsWidgetResolver.IWidgetData<any>
  banner!: NsWidgetResolver.IWidgetData<any>
  engagementDetails: any = {
  }

  searchControl = new FormControl()

  constructor(
    private activatedRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private eventsService: EventService,
    private router: Router,
    private events: libEventService,
    private langtranslations: MultilingualTranslationsService,
  ) {
    this.activatedRoute.data.subscribe(data => {
      if (data && data.pageData) {
        _.get(data, 'pageData.data.version2.sectionList', []).forEach((section: any) => {
          if (section.key === 'eventsHome') {
            this.eventsHome = section
          } else if (section.key === 'banner') {
            this.banner = section
          }
        });
      }
    })
  }

  ngOnInit(): void {
    this.getEventsEngagemeants()
  }

  getEventsEngagemeants() {
    this.eventsService.getEventEngagements().pipe(map((res: any) => {
      let result: any = {}
      if (_.get(res, 'result.userEventEnrolmentInfo')) {
        result = _.get(res, 'result.userEventEnrolmentInfo')
        if (result['hoursSpentOnEvents']) {
          result['hoursSpentOnEvents'] = this.convertMinutesToHoursAndMinutes(result['hoursSpentOnEvents'])
        }
      }
      return result
    })).subscribe({
      next: (res: any) => {
        if (res) {
          this.engagementDetails = res
        }
      }, error: (error: HttpErrorResponse) => {
        if (error) { }
      }
    })
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  convertMinutesToHoursAndMinutes(minutes: number): string {
    let convertedTime = '0h 0m'
    if (minutes) {
      const hours = Math.floor(minutes / 3600)
      const remainingMinutes = Math.round(((minutes % 3600) / 60))
      convertedTime = `${hours}h ${remainingMinutes}m`
    }
    return convertedTime
  }

  openEventEngagementBottomSheet() {
    this.bottomSheet.open(EventsEngagementComponent, {
      data: {
        engagements: _.get(this.eventsHome, 'data.leftSection.data.myEngagements', {}),
        engagementDetails: this.engagementDetails
      },
      panelClass: 'events-bottomsheet',
    })
  }

  openEventCalendartBottomSheet() {
    this.bottomSheet.open(EventsCalendarComponent, {
      panelClass: 'events-bottomsheet',
      data: _.get(this.eventsHome, 'data.leftSection.data.eventsCalendar', {})
    })
  }

  navigate(browseData: any) {
    if (browseData && browseData.key) {
      if (browseData.key !== 'all') {
        this.router.navigate(['/app/event-hub/view-all'], { queryParams: { resourceType: browseData.key } })
      } else {
        this.router.navigate(['/app/event-hub/view-all'])
      }
    }
  }

  searchEvents(event: any) {
    if (event.target && event.target.value) {
      this.router.navigate(['/app/event-hub/view-all'], { queryParams: { query: event.target.value } })
    }
  }

  raiseTelemetryInteratEvent(event: any) {
    let subType = 'my-events'
    switch (_.get(event, 'context.pageSection')) {
      case 'myEvents':
        subType = 'my-events'
        break
      case 'recommendedEvents':
        subType = 'recommended-events'
        break
      case 'trendingEvents':
        subType = 'trending-events'
        break
      case 'featuredEvents':
        subType = 'featured-events'
        break
    }
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: subType,
        id: "card-content",
      },
      {
        id: _.get(event, 'content.contentId'),
        type: "event"
      },
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    )
  }

}
