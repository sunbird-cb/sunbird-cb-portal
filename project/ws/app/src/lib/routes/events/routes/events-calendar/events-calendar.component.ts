import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { EventService } from '../../services/events.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import * as _ from 'lodash'
import { ConfigurationsService, WsEvents } from '@sunbird-cb/utils-v2';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { EventService as libEventService } from '@sunbird-cb/utils-v2'


@Component({
  selector: 'ws-app-events-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.scss']
})
export class EventsCalendarComponent implements OnInit {
  @Input() eventCalendarDetails: any
  selected = new Date();
  selectedDateText = 'Today'
  currentMonth = new Date();
  currentMonthYearText = ''
  daysInMonth: {
    date: Date,
    isPrevisDate: Boolean,
    hasRegisteredEvent: Boolean,
    isCurrentMonth: Boolean
  }[] = [];
  calandarLoaders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  userEventsList: any = []
  selectedDateEvents: any = []
  calendarLoading = false
  showAllEvents = false
  bottomSheet = false
  isPreviesDate = false

  constructor(
    private datePipe: DatePipe,
    private eventService: EventService,
    private matSnackBar: MatLegacySnackBar,
    private configSvc: ConfigurationsService,
    private router: Router,
    private bottomSheetRef: MatBottomSheetRef<any>,
    @Inject(MAT_BOTTOM_SHEET_DATA) @Optional() public data: any = null,
    private langtranslations: MultilingualTranslationsService,
    private events: libEventService,
  ) {
    if (Object.keys(this.data).length !== 0) {
      this.eventCalendarDetails = this.data
      this.bottomSheet = true
      this.showAllEvents = true
    }
  }

  ngOnInit() {
    const loadTodayEvents = true
    this.getEnrolledEvents(loadTodayEvents)
    this.selected = new Date()
    this.selected.setHours(0, 0, 0, 0)
    // this.selectedDateText = this.datePipe.transform(this.selected, 'dd MMM yyyy') as string
    this.currentMonthYearText = this.datePipe.transform(this.currentMonth, 'MMM yyyy') as string;
  }

  getEnrolledEvents(loadTodayEvents = false) {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = this.datePipe.transform(new Date(year, month, 1), 'yyyy-MM-dd');
    const lastDay = this.datePipe.transform(new Date(year, month + 1, 0), 'yyyy-MM-dd');
    const requestBody = {
      request: {
        retiredCoursesEnabled: true,
        status: 'All',
        calendarEventEnabled: true,
        eventStartDate: firstDay,
        eventEndDate: lastDay
      }
    }
    this.userEventsList = []
    this.calendarLoading = true

    if (_.get(this.configSvc, 'userProfile.userId')) {
      this.eventService.getUserEnrollEvents(_.get(this.configSvc, 'userProfile.userId'), requestBody).subscribe({
        next: (res: any) => {
          this.userEventsList = _.get(res, 'result.events')
          this.generateCalendarDays();
          if (loadTodayEvents) {
            this.getSelectedDateEvents()
          }
        },
        error: (error: HttpErrorResponse) => {
          this.generateCalendarDays();
          const errorMessage = _.get(error, 'error.message', 'Something went wrong please try again')
          this.openSnackBar(errorMessage)
        }
      })
    }
  }

  generateCalendarDays() {
    this.daysInMonth = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add padding for days from previous month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const date = new Date(year, month, -i)
      const details: {
        date: Date,
        isPrevisDate: Boolean,
        hasRegisteredEvent: Boolean,
        isCurrentMonth: Boolean
      } = {
        date: date,
        hasRegisteredEvent: this.hasEvent(date),
        isPrevisDate: date.getTime() < today.getTime(),
        isCurrentMonth: false
      }
      this.daysInMonth.unshift(details);
    }

    const lastDayOfMonth = lastDay.getDate()
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const date = new Date(year, month, i)
      const details: {
        date: Date,
        isPrevisDate: Boolean,
        hasRegisteredEvent: Boolean,
        isCurrentMonth: Boolean
      } = {
        date: date,
        hasRegisteredEvent: this.hasEvent(date),
        isPrevisDate: date.getTime() < today.getTime(),
        isCurrentMonth: true
      }
      this.daysInMonth.push(details);
    }
    this.calendarLoading = false
  }

  hasEvent(dateToCheck: Date): boolean {
    let hasEvent = false
    if (this.userEventsList && this.userEventsList.length) {
      this.userEventsList.forEach((event: any) => {
        if (_.get(event, 'event.startDate')) {
          const eventData = new Date(_.get(event, 'event.startDate'))
          eventData.setHours(0, 0, 0, 0)
          if (dateToCheck.getTime() === eventData.getTime()) {
            hasEvent = true
            return hasEvent
          }
        }
      })
    }
    return hasEvent
  }

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.currentMonthYearText = this.datePipe.transform(this.currentMonth, 'MMM yyyy') as string;
    this.getEnrolledEvents();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.currentMonthYearText = this.datePipe.transform(this.currentMonth, 'MMM yyyy') as string;
    this.getEnrolledEvents();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  selectDate(dateDetails: any) {
    this.showAllEvents = false
    this.selected = dateDetails.date;
    this.isPreviesDate = dateDetails.isPrevisDate
    if (this.bottomSheet) {
      this.showAllEvents = true
    } else {
      this.showAllEvents = false
    }
    const formattedSelectedDate = this.datePipe.transform(this.selected, 'dd MMM yyyy')
    const formattedToday = this.datePipe.transform(new Date(), 'dd MMM yyyy');
    if (formattedSelectedDate === formattedToday) {
      this.selectedDateText = 'Today'
    } else {
      this.selectedDateText = formattedSelectedDate as string
    }
    this.getSelectedDateEvents()
  }

  getSelectedDateEvents() {
    this.selectedDateEvents = []
    if (this.userEventsList && this.userEventsList.length) {
      this.userEventsList.forEach((event: any) => {
        if (_.get(event, 'event.startDate')) {
          const eventData = new Date(_.get(event, 'event.startDate'))
          eventData.setHours(0, 0, 0, 0)
          if (this.selected.getTime() === eventData.getTime()) {
            const eventDetails = JSON.parse(JSON.stringify(_.get(event, 'event')))
            const eventStartDateTime = _.get(eventDetails, 'startDateTime', this.convertToUTC(_.get(eventDetails, 'startDate'), _.get(eventDetails, 'startTime')))
            const eventEndDateTime = _.get(eventDetails, 'endDateTime', this.convertToUTC(_.get(eventDetails, 'endDate'), _.get(eventDetails, 'endTime')))
            if (eventStartDateTime && eventEndDateTime) {
              const currentTime = new Date();
              const startTime = new Date(eventStartDateTime);
              const endTime = new Date(eventEndDateTime);
              eventDetails['startTime'] = this.datePipe.transform(eventStartDateTime, 'hh:mm a')
              eventDetails['isLive'] = currentTime >= startTime && currentTime <= endTime
            }
            if (eventDetails['isLive']) {
              this.selectedDateEvents.unshift(eventDetails)
            } else {
              this.selectedDateEvents.push(eventDetails)
            }
          }
        }
      })
    }
  }

  convertToUTC(date: string, time: string): string {
    if (date && time) {
      const isoString = `${date}T${time}`;
      const localDate = new Date(isoString);
      const utcDate = localDate.toISOString();
      const formattedDate = utcDate.replace('Z', '+0000');
      return formattedDate;
    }
    return ''
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  redirectTo(myEvent: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'calendar-section',
        id: "card-content",
      },
      {
        id: _.get(myEvent, 'identifier'),
        type: "event"
      },
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    )
    if (this.bottomSheetRef && this.bottomSheet) {
      this.bottomSheetRef.dismiss()
    }

    this.router.navigate([`/app/event-hub/home/${myEvent.identifier}`])
  }

  private openSnackBar(message: string) {
    this.matSnackBar.open(message)
  }

  closeDiaolg() {
    this.bottomSheetRef.dismiss()
  }

}
