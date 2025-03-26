import { Component, OnInit } from '@angular/core'
import { NSDiscussData } from '../../../discuss/models/discuss.model'
import { ActivatedRoute, Router } from '@angular/router'
import { FormControl } from '@angular/forms'
import { EventService } from '../../services/events.service'
import moment from 'moment'
import { ConfigurationsService, WsEvents, EventService as EventServiceGlobal } from '@sunbird-cb/utils-v2'
import { MatTabChangeEvent } from '@angular/material'
import { environment } from 'src/environments/environment'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  data!: NSDiscussData.IDiscussionData
  queryControl = new FormControl('')
  currentFilter = 'timestamp'
  pager = {}
  paginationData!: any
  currentActivePage!: any
  categoryId!: any
  fetchNewData = false
  allEvents: any = []
  todaysEvents: any = []
  featuredEvents: any = []
  curatedEvents: any = []
  karmayogiSaptahEvents: any = []
  alltypeEvents: any = []
  currentFilterSort = 'desc'
  departmentID: any
  spvOrgId: any
  sliderConfig = {
    showNavs: true,
    showDots: true,
    cerificateCardMargin: false,
    maxWidgets: 2,
  }
  eventWidgetData: any

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventSvc: EventService,
    private configSvc: ConfigurationsService,
    private eventService: EventServiceGlobal,
    private translate: TranslateService,
  ) {

    this.data = this.route.snapshot.data.topics.data
    this.paginationData = this.data.pagination
    this.categoryId = this.route.snapshot.data['eventsCategoryId'] || 1

    if (this.configSvc.userProfile) {
      this.departmentID = this.configSvc.userProfile.rootOrgId
    }

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    this.eventWidgetData = (this.route.parent && this.route.parent.snapshot.data.pageData.data.eventStrips) || []
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(x => {
    //   this.currentActivePage = x.page || 1
    //   this.refreshData(this.currentActivePage)
    // })
    this.getEventsList()
  }

  // filter(key: string | 'timestamp' | 'viewcount') {
  //   if (key) {
  //     this.currentFilter = key
  //     this.refreshData(this.currentActivePage)
  //   }
  // }
  updateQuery(key: string) {
    if (key) {

    }
  }

  // refreshData(page: any) {
  //   if (this.fetchNewData) {
  //     if (this.currentFilter === 'timestamp') {
  //       this.discussService.fetchSingleCategoryDetails(this.categoryId, page).subscribe(
  //         (data: any) => {
  //           this.data = data
  //           this.paginationData = data.pagination
  //         },
  //         (_err: any) => {
  //         })
  //     } else {
  //       this.discussService.fetchSingleCategoryDetailsSort(this.categoryId, 'voted', page).subscribe(
  //         (data: any) => {
  //           this.data = data
  //           this.paginationData = data.pagination
  //         },
  //         (_err: any) => {
  //         })
  //     }
  //   }
  // }

  navigateWithPage(page: any) {
    if (page !== this.currentActivePage) {
      this.router.navigate([`/app/event-hub/home`], { queryParams: { page } })
      this.fetchNewData = true
    }
  }

  getEventsList() {
    const requestObj = {
      locale: [
        'en',
      ],
      query: '',
      request: {
        query: '',
        filters: {
          status: ['Live'],
          contentType: 'Event',
          category: 'Event',
        },
        sort_by: {
          startDate: 'desc',
        },
      },
    }
    this.eventSvc.getEventsList(requestObj).subscribe((events: any) => {
      this.setEventListData(events)
    })
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
  }

  setEventListData(eventObj: any) {
    if (eventObj !== undefined) {
      const data = eventObj.result.Event
      this.allEvents['all'] = []
      this.allEvents['todayEvents'] = []
      this.allEvents['featuredEvents'] = []
      this.allEvents['curatedEvents'] = []
      this.allEvents['karmayogiSaptahEvents'] = []
      Object.keys(data).forEach((index: any) => {
        const obj = data[index]
        const expiryStartTimeFormat = this.customDateFormat(obj.startDate, obj.startTime)
        // const expiryEndTimeFormat = this.customDateFormat(obj.startDate, obj.endTime)
        const floor = Math.floor
        const hours = floor(obj.duration / 60)
        const minutes = obj.duration % 60
        const duration = (hours === 0) ? ((minutes === 0) ? '---' : `${minutes} minutes`) : (minutes === 0) ? (hours === 1) ?
          `${hours} hour` : `${hours} hours` : (hours === 1) ? `${hours} hour ${minutes} minutes` :
          `${hours} hours ${minutes} minutes`
        const creatordata = obj.creatorDetails !== undefined ? obj.creatorDetails : []
        const str = creatordata && creatordata.length > 0 ? creatordata.replace(/\\/g, '') : []
        const creatorDetails = str && str.length > 0 ? JSON.parse(str) : creatordata

        const stime = obj.startTime.split('+')[0]
        const hour = stime.substr(0, 2)
        const min = stime.substr(2, 3)
        const starttime = `${hour}${min}`

        const etime = obj.endTime.split('+')[0]
        const ehour = etime.substr(0, 2)
        const emin = etime.substr(2, 3)
        const endtime = `${ehour}${emin}`

        const eventDataObj = {
          event: obj,
          eventName: obj.name,
          eventStartTime: starttime,
          eventEndTime: endtime,
          eventStartDate: obj.startDate,
          eventCreatedOn: this.allEventDateFormat(obj.createdOn),
          eventDuration: duration,
          eventjoined: creatorDetails.length,
          eventThumbnail: obj.appIcon && (obj.appIcon !== null || obj.appIcon !== undefined) ?
            this.eventSvc.getPublicUrl(obj.appIcon) :
            '/assets/icons/Events_default.png',
          pastevent: false,
        }
        this.allEvents['all'].push(eventDataObj)
        const isToday = this.compareDate(obj.startDate)
        if (isToday) {
          this.allEvents['todayEvents'].push(eventDataObj)
        }
        if (obj.createdFor && obj.createdFor[0] === this.departmentID) {
          this.allEvents['featuredEvents'].push(eventDataObj)
        }
        this.spvOrgId = environment.spvorgID
        if (obj.createdFor && obj.createdFor[0] === this.spvOrgId) {
          this.allEvents['curatedEvents'].push(eventDataObj)
        }
        if (obj.resourceType && obj.resourceType === 'Karmayogi Saptah') {
          this.allEvents['karmayogiSaptahEvents'].push(eventDataObj)
        }

        const now = new Date()
        const today = moment(now).format('YYYY-MM-DD HH:mm')
        if (expiryStartTimeFormat < today) {
          eventDataObj.pastevent = true
        }
        // const isPast = this.compareDate(expiryStartTimeFormat);
        // (!isPast) ? this.allEvents['all'].push(eventDataObj) : this.allEvents['todayEvents'].push(eventDataObj)
      })
      this.filter('all')
      this.filter('todayEvents')
      this.filter('featuredEvents')
      this.filter('curatedEvents')
      this.filter('karmayogiSaptahEvents')
    }
  }

  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }
  addCustomDateAndTime (eventData: any) {
    const eventDate = this.eventService.customDateFormat(eventData.event.startDate, eventData.event.startTime)
    const eventendDate = this.eventService.customDateFormat(eventData.event.endDate, eventData.event.endTime)
    eventData['eventCustomStartDate'] = eventDate
    eventData['eventCustomEndDate'] = eventendDate
  }

  filter(key: string | 'timestamp' | 'best' | 'saved') {
    let todayEvents: any[] = []
    let all: any[] = []
    let featuredEvents: any[] = []
    let curatedEvents: any[] = []
    let karmayogiSaptahEvents: any[] = []
    if (this.allEvents['all'] && this.allEvents['all'].length > 0) {
      this.allEvents['all'].forEach((event: any) => {
        this.addCustomDateAndTime(event)
        all.push(event)
      })
      all = this.sortEvents(all)
    }

    if (this.allEvents['todayEvents'] && this.allEvents['todayEvents'].length > 0) {
      this.allEvents['todayEvents'].forEach((event: any) => {
        this.addCustomDateAndTime(event)
        todayEvents.push(event)
      })
      todayEvents = this.sortEvents(todayEvents)
    }

    if (this.allEvents['featuredEvents'] && this.allEvents['featuredEvents'].length > 0) {
      this.allEvents['featuredEvents'].forEach((event: any) => {
        this.addCustomDateAndTime(event)
        featuredEvents.push(event)
      })
      featuredEvents =  this.sortEvents(featuredEvents)
    }
    if (this.allEvents['curatedEvents'] && this.allEvents['curatedEvents'].length > 0) {
      this.allEvents['curatedEvents'].forEach((event: any) => {
        this.addCustomDateAndTime(event)
        curatedEvents.push(event)
      })
      curatedEvents =  this.sortEvents(curatedEvents)
    }

    if (this.allEvents['karmayogiSaptahEvents'] && this.allEvents['karmayogiSaptahEvents'].length > 0) {
      this.allEvents['karmayogiSaptahEvents'].forEach((event: any) => {
        this.addCustomDateAndTime(event)
        karmayogiSaptahEvents.push(event)
      })

      karmayogiSaptahEvents = this.sortEvents(karmayogiSaptahEvents)

    }

    if (key) {
      this.currentFilter = key
      switch (key) {
        case 'all':
          this.alltypeEvents = all
          break
        case 'todayEvents':
          this.todaysEvents = todayEvents
          break
        case 'featuredEvents':
          this.featuredEvents = featuredEvents
          break
        case 'curatedEvents':
          this.curatedEvents = curatedEvents
          break
        case 'karmayogiSaptahEvents':
          this.karmayogiSaptahEvents = karmayogiSaptahEvents
          break
      }
    }
  }

  sortEvents(eventData: any) {
    return eventData.sort((a: any, b: any) => {
      const firstDate: any = new Date(a.eventCustomStartDate)
      const secondDate: any = new Date(b.eventCustomStartDate)
      return  secondDate > firstDate  ? 1 : -1
    })
  }

  compareDate(startDate: any) {
    const now = new Date()
    // const today = moment(now).format('YYYY-MM-DD HH:mm')

    // tslint:disable-next-line:prefer-template
    const day = ('0' + (new Date().getDate())).slice(-2)
    const year = new Date().getFullYear()
    // tslint:disable-next-line:prefer-template
    const month = ('0' + (now.getMonth() + 1)).slice(-2)
    const todaysdate = `${year}-${month}-${day}`
    // return (startDate === todaysdate && (startime >= today || endtime <= today)) ? true : false
    // if (startDate === todaysdate && startime > today)  {
    //   return true
    // }
    // if (startDate === todaysdate && (today >= startime && today <= endtime))  {
    //   return true
    // }
    if (startDate === todaysdate) {
      return true
    }
    return false
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

  public tabClicked(tabEvent: MatTabChangeEvent) {
    const data: WsEvents.ITelemetryTabData = {
      label: `${tabEvent.tab.textLabel}`,
      index: tabEvent.index,
    }
    this.eventService.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.EVENTS_TAB,
        id: `${_.camelCase(data.label)}-tab`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    )
  }
}
