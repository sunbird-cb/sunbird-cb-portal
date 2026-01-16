import { Component, OnInit } from '@angular/core'
import { NSDiscussData } from '../../../discuss/models/discuss.model'
import { ActivatedRoute, Router } from '@angular/router'
import { UntypedFormControl } from '@angular/forms'
import { EventService } from '../../services/events.service'
import moment from 'moment'
import { ConfigurationsService, WsEvents, EventService as EventServiceGlobal, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs'
import { environment } from 'src/environments/environment'
import { TranslateService } from '@ngx-translate/core'
import * as _ from 'lodash'
import { GbSearchService } from '../../../search-v2/services/gb-search.service'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'ws-app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  data!: NSDiscussData.IDiscussionData
  queryControl = new UntypedFormControl('')
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
  karmayogiTalksEvents: any = []
  rajyaKarmayogiSaptahEvents:any = []
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
  todaysEventWidgetData: any
  todaysLiveEvents: any = []
  keySpeakerEvents: any = []
  keySpeakerEventWidget = false
  totalResults: any
  throttle = 20
  scrollDistance = 0.2
  limit = 20
  page = 0
  totalpages!: number | 0
  eventRequestObj = {
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
      limit: 20,
      offset: 0,
    },
  }
  newQueryParam: any
  allEventData: any = []
  showLoading = true
  currentQuery = ''
  public debounce = 500
  pageConfig: any = {}
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventSvc: EventService,
    private configSvc: ConfigurationsService,
    private eventService: EventServiceGlobal,
    private translate: TranslateService,
    private searchSrvc: GbSearchService,
    private langtranslations: MultilingualTranslationsService,
  ) {
    this.data = this.route.snapshot.data.topics.data
    this.paginationData = this.data.pagination
    this.categoryId = this.route.snapshot.data['eventsCategoryId'] || 1

    if (this.configSvc.userProfile) {
      this.departmentID = this.configSvc.userProfile.rootOrgId
    }
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
      lang = lang.replace(/\"/g, '')
      this.translate.use(lang)
    }
    this.pageConfig = this.route.parent && this.route.parent.snapshot.data.pageData.data
    this.eventWidgetData = (this.route.parent && this.route.parent.snapshot.data.pageData.data.eventStrips) || []
    this.todaysEventWidgetData = (this.route.parent && this.route.parent.snapshot.data.pageData.data.todaysEventStrips) || []

  }

  ngOnInit() {
    // this.route.queryParams.subscribe(x => {
    //   this.currentActivePage = x.page || 1
    //   this.refreshData(this.currentActivePage)
    // })
    this.queryControl.valueChanges
      .pipe(debounceTime(this.debounce), distinctUntilChanged())
      .subscribe(query => {
        if (query) {
          this.currentQuery = query
          this.updateQuery(query)
        } else {
          this.currentQuery = ''
          this.getEventsList()
        }

      })
    this.getKeySpeakerEventList()
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
      const requestPayload = {
        'request': {
          'fields': [
            'name',
            'appIcon',
            'instructions',
            'description',
            'purpose',
            'mimeType',
            'gradeLevel',
            'identifier',
            'medium',
            'pkgVersion',
            'board',
            'subject',
            'resourceType',
            'primaryCategory',
            'contentType',
            'channel',
            'organisation',
            'trackable',
            'license',
            'posterImage',
            'idealScreenSize',
            'learningMode',
            'creatorLogo',
            'duration',
            'version',
            'programDuration',
            'avgRating',
            'courseCategory',
            'secureSettings',
            'createdFor',
            'startDate',
            'endDate',
            'startTime',
            'endTime',
          ],
          'query': key ? key : '',
          'filters': {
            'courseCategory': [],
            'contentType': ['Event'],
            'status': ['Live'],
          },
          'sort_by': { 'lastUpdatedOn': 'desc' },
          'facets': ['mimeType'],
          'limit': 1000,
          'offset': 0,
        },
      }
      this.searchSrvc.fetchSearchDataByCategory(requestPayload).subscribe((response: any) => {
        if (response && response.result && response.result.Event && response.result.Event.length) {
          const allFilteredEvent = response.result.Event

            const data = allFilteredEvent
            const filterData: any = []
            const featuredEvents: any = []
            const curatedEvents: any = []
            const karmayogiSaptahEvents: any = []
            const rajyaKarmayogiSaptahEvents:any = []
            const karmayogiTalksEvents: any = []
            Object.keys(data).forEach((index: any) => {
              const obj = data[index]
              // const expiryEndTimeFormat = this.customDateFormat(obj.startDate, obj.endTime)
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
              const now = new Date()
              const today = moment(now).format('YYYY-MM-DD HH:mm')
              if (expiryStartTimeFormat < today) {
                eventDataObj.pastevent = true
              }
              filterData.push(eventDataObj)
              if (obj.createdFor && obj.createdFor[0] === this.departmentID) {
                featuredEvents.push(eventDataObj)
              }
              this.spvOrgId = environment.spvorgID
              if (obj.createdFor && obj.createdFor[0] === this.spvOrgId) {
                curatedEvents.push(eventDataObj)
              }
              if (obj.resourceType && obj.resourceType === 'Karmayogi Saptah') {
                karmayogiSaptahEvents.push(eventDataObj)
              }
              if (obj.resourceType && obj.resourceType === 'Karmayogi Talks') {
                karmayogiTalksEvents.push(eventDataObj)
              }
              if (obj.resourceType && obj.resourceType === 'Rajya Karmayogi Saptah') {
                rajyaKarmayogiSaptahEvents.push(eventDataObj)
              }

            })
            this.alltypeEvents = filterData
            this.karmayogiSaptahEvents = karmayogiSaptahEvents
            this.karmayogiTalksEvents = karmayogiTalksEvents
            this.featuredEvents = featuredEvents
            this.curatedEvents = curatedEvents
            this.rajyaKarmayogiSaptahEvents = rajyaKarmayogiSaptahEvents
          }

      })
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
    this.eventRequestObj = {
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
        limit: 20,
        offset: 0,
      },
    }
    this.eventSvc.getEventsList(this.eventRequestObj).subscribe((events: any) => {
      this.totalResults = events.result.count
      this.allEventData = events.result.Event
      this.setEventListData(this.allEventData)
    })
  }

  translateHub(hubName: string): string {
    const translationKey = hubName
    return this.translate.instant(translationKey)
  }

  setEventListData(eventObj: any) {
    if (eventObj !== undefined) {
      const data = this.allEventData
      this.allEvents['all'] = []
      this.allEvents['todayEvents'] = []
      this.allEvents['featuredEvents'] = []
      this.allEvents['curatedEvents'] = []
      this.allEvents['karmayogiSaptahEvents'] = []
      this.allEvents['karmayogiTalksEvents'] = []
      this.allEvents['rajyaKarmayogiSaptahEvents'] = []
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
        if (obj.resourceType && obj.resourceType === 'Karmayogi Talks') {
          this.allEvents['karmayogiTalksEvents'].push(eventDataObj)
        }
        if (obj.resourceType && obj.resourceType === 'Rajya Karmayogi Saptah') {
          this.allEvents['rajyaKarmayogiSaptahEvents'].push(eventDataObj)
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
      this.filter('rajyaKarmayogiSaptahEvents')
      this.filter('karmayogiTalksEvents')
    }
    this.totalpages = Math.ceil(this.totalResults / 20)
  }

  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }
  addCustomDateAndTime(eventData: any) {
    const eventDate = this.eventService.customDateFormat(eventData.event.startDate, eventData.event.startTime)
    const eventendDate = this.eventService.customDateFormat(eventData.event.endDate, eventData.event.endTime)
    eventData['eventCustomStartDate'] = eventDate
    eventData['eventCustomEndDate'] = eventendDate
  }

  filter(key: string | 'timestamp' | 'best' | 'saved') {
    let todaysLiveEvents: any = []
    let todayEvents: any[] = []
    let all: any[] = []
    let featuredEvents: any[] = []
    let curatedEvents: any[] = []
    let karmayogiSaptahEvents: any[] = []
    let rajyaKarmayogiSaptahEvents:any[] = []
    let karmayogiTalksEvents: any[] = []
    if (this.allEvents['all'] && this.allEvents['all'].length > 0) {
      this.allEvents['all'].forEach((event: any) => {
        this.addCustomDateAndTime(event)
        all.push(event)
      })
      all = this.sortEvents(all)
    }

    if (this.allEvents['todayEvents'] && this.allEvents['todayEvents'].length > 0) {
      this.allEvents['todayEvents'].forEach((event: any) => {
        let isEventLive: any = false
        this.addCustomDateAndTime(event)
        todayEvents.push(event)
        const now = new Date()
        const today = moment(now).format('YYYY-MM-DD HH:mm')
        if (moment(today).isBetween(event.eventCustomStartDate, event.eventCustomEndDate)) {
          isEventLive = true
          if (today >= event.eventCustomStartDate) {
            if (event.recordedLinks && event.recordedLinks.length > 0) {
              isEventLive = false
            }
          }
        } else if (today >= event.eventCustomEndDate) {
          isEventLive = false
        }
        if (isEventLive) {
          todaysLiveEvents.push(event)
        }
      })
      todayEvents = this.sortEvents(todayEvents)
      todaysLiveEvents = this.sortEvents(todaysLiveEvents)
    }

    if (this.allEvents['featuredEvents'] && this.allEvents['featuredEvents'].length > 0) {
      this.allEvents['featuredEvents'].forEach((event: any) => {
        this.addCustomDateAndTime(event)
        featuredEvents.push(event)
      })
      featuredEvents = this.sortEvents(featuredEvents)
    }
    if (this.allEvents['curatedEvents'] && this.allEvents['curatedEvents'].length > 0) {
      this.allEvents['curatedEvents'].forEach((event: any) => {
        this.addCustomDateAndTime(event)
        curatedEvents.push(event)
      })
      curatedEvents = this.sortEvents(curatedEvents)
    }

    if (this.allEvents['karmayogiSaptahEvents'] && this.allEvents['karmayogiSaptahEvents'].length > 0) {
      this.allEvents['karmayogiSaptahEvents'].forEach((event: any) => {
        event['isEventPast'] = false
        event['isEventLive'] = false
        event['isEventFuture'] = false
        this.addCustomDateAndTime(event)
        const now = new Date()
        const today = moment(now).format('YYYY-MM-DD HH:mm')
        if (moment(today).isBetween(event.eventCustomStartDate, event.eventCustomEndDate)) {
          event['isEventLive'] = true
          if (today >= event.eventCustomStartDate) {
            if (event.recordedLinks && event.recordedLinks.length > 0) {
              event['isEventLive'] = false
            }
          }
        } else if (today >= event.eventCustomEndDate) {
          event['isEventLive'] = false
          if (moment(today).isAfter(event.eventCustomEndDate) && moment(today).isAfter(event.eventCustomStartDate)) {
            event['isEventPast'] = true
          }
        } else {
          if (moment(today).isBefore(event.eventCustomStartDate) && moment(today).isBefore(event.eventCustomEndDate)) {
            event['isEventFuture'] = true
          }
        }
        karmayogiSaptahEvents.push(event)
      })

      let liveEvents: any = []
      let pastEvents: any = []
      let futureEvents: any = []

      liveEvents = karmayogiSaptahEvents.filter((pastEvent: any) => pastEvent.isEventLive)
      pastEvents = karmayogiSaptahEvents.filter((pastEvent: any) => pastEvent.isEventPast)
      futureEvents = karmayogiSaptahEvents.filter((futureEvent: any) => futureEvent.isEventFuture)
      liveEvents = this.sortEventsAsc(liveEvents)
      futureEvents = this.sortEventsAsc(futureEvents)
      pastEvents = this.sortEvents(pastEvents)
      karmayogiSaptahEvents = [...liveEvents, ...futureEvents, ...pastEvents]

    }
    if (this.allEvents['rajyaKarmayogiSaptahEvents'] && this.allEvents['rajyaKarmayogiSaptahEvents'].length > 0) {
      this.allEvents['rajyaKarmayogiSaptahEvents'].forEach((event: any) => {
        event['isEventPast'] = false
        event['isEventLive'] = false
        event['isEventFuture'] = false
        this.addCustomDateAndTime(event)
        const now = new Date()
        const today = moment(now).format('YYYY-MM-DD HH:mm')
        if (moment(today).isBetween(event.eventCustomStartDate, event.eventCustomEndDate)) {
          event['isEventLive'] = true
          if (today >= event.eventCustomStartDate) {
            if (event.recordedLinks && event.recordedLinks.length > 0) {
              event['isEventLive']  = false
            }
          }
        } else if (today >= event.eventCustomEndDate) {
          event['isEventLive']  = false
          if (moment(today).isAfter(event.eventCustomEndDate) && moment(today).isAfter(event.eventCustomStartDate)) {
            event['isEventPast'] = true
          }
        } else {
          if (moment(today).isBefore(event.eventCustomStartDate) && moment(today).isBefore(event.eventCustomEndDate)) {
            event['isEventFuture'] = true
          }
        }
        rajyaKarmayogiSaptahEvents.push(event)
      })

      let liveEvents: any = []
      let pastEvents: any = []
      let futureEvents: any = []

      liveEvents = rajyaKarmayogiSaptahEvents.filter((pastEvent: any) => pastEvent.isEventLive)
      pastEvents = rajyaKarmayogiSaptahEvents.filter((pastEvent: any) => pastEvent.isEventPast)
      futureEvents = rajyaKarmayogiSaptahEvents.filter((futureEvent: any) => futureEvent.isEventFuture)
      liveEvents = this.sortEventsAsc(liveEvents)
      futureEvents = this.sortEventsAsc(futureEvents)
      pastEvents = this.sortEvents(pastEvents)
      rajyaKarmayogiSaptahEvents  = [...liveEvents, ...futureEvents, ...pastEvents]

    }
    if (this.allEvents['karmayogiTalksEvents'] && this.allEvents['karmayogiTalksEvents'].length > 0) {
      this.allEvents['karmayogiTalksEvents'].forEach((event: any) => {
        event['isEventPast'] = false
        event['isEventLive'] = false
        event['isEventFuture'] = false
        this.addCustomDateAndTime(event)
        const now = new Date()
        const today = moment(now).format('YYYY-MM-DD HH:mm')
        if (moment(today).isBetween(event.eventCustomStartDate, event.eventCustomEndDate)) {
          event['isEventLive'] = true
          if (today >= event.eventCustomStartDate) {
            if (event.recordedLinks && event.recordedLinks.length > 0) {
              event['isEventLive'] = false
            }
          }
        } else if (today >= event.eventCustomEndDate) {
          event['isEventLive'] = false
          if (moment(today).isAfter(event.eventCustomEndDate) && moment(today).isAfter(event.eventCustomStartDate)) {
            event['isEventPast'] = true
          }
        } else {
          if (moment(today).isBefore(event.eventCustomStartDate) && moment(today).isBefore(event.eventCustomEndDate)) {
            event['isEventFuture'] = true
          }
        }
        karmayogiTalksEvents.push(event)
      })

      let liveEvents: any = []
      let pastEvents: any = []
      let futureEvents: any = []

      liveEvents = karmayogiTalksEvents.filter((pastEvent: any) => pastEvent.isEventLive)
      pastEvents = karmayogiTalksEvents.filter((pastEvent: any) => pastEvent.isEventPast)
      futureEvents = karmayogiTalksEvents.filter((futureEvent: any) => futureEvent.isEventFuture)
      liveEvents = this.sortEventsAsc(liveEvents)
      futureEvents = this.sortEventsAsc(futureEvents)
      pastEvents = this.sortEvents(pastEvents)
      karmayogiTalksEvents = [...liveEvents, ...futureEvents, ...pastEvents]

    }

    if (key) {
      this.currentFilter = key
      switch (key) {
        case 'all':
          this.alltypeEvents = all
          break
        case 'todayEvents':
          this.todaysEvents = todayEvents
          this.todaysLiveEvents = todaysLiveEvents
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
        case 'rajyaKarmayogiSaptahEvents':
          this.rajyaKarmayogiSaptahEvents = rajyaKarmayogiSaptahEvents
          break          
        case 'karmayogiTalksEvents':
          this.karmayogiTalksEvents = karmayogiTalksEvents
          break
      }
    }
  }

  sortEvents(eventData: any) {
    return eventData.sort((a: any, b: any) => {
      const firstDate: any = new Date(a.eventCustomStartDate)
      const secondDate: any = new Date(b.eventCustomStartDate)
      return secondDate > firstDate ? 1 : -1
    })
  }
  sortEventsAsc(eventData: any) {
    return eventData.sort((a: any, b: any) => {
      const firstDate: any = new Date(a.eventCustomStartDate)
      const secondDate: any = new Date(b.eventCustomStartDate)
      return secondDate < firstDate ? 1 : -1
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

  async getKeySpeakerEventList() {
    let orgId: any = ''
    if (environment && environment.spvorgID) {
      orgId = environment.spvorgID
    }
    const widgetData: any = await this.eventSvc.getKeySpeakerJson().catch(_error => { })
    this.keySpeakerEvents = widgetData && widgetData['keySpeakersEvents'] || []
    if (this.keySpeakerEvents && this.keySpeakerEvents.strips && this.keySpeakerEvents.strips.length) {
      if (this.keySpeakerEvents.strips[0] &&
        this.keySpeakerEvents.strips[0]['request'] &&
        this.keySpeakerEvents.strips[0]['request']['searchV6'] &&
        this.keySpeakerEvents.strips[0]['request']['searchV6']['request'] &&
        this.keySpeakerEvents.strips[0]['request']['searchV6']['request']['filters'] &&
        this.keySpeakerEvents.strips[0]['request']['searchV6']['request']['filters']['onBehalfOf']
      ) {
        this.keySpeakerEvents.strips[0]['request']['searchV6']['request']['filters']['onBehalfOf'] = orgId
      }
      this.keySpeakerEventWidget = this.keySpeakerEvents.strips.length
    }
  }

  onScrollEnd() {
    if (!this.currentQuery) {
      this.showLoading = true
      this.page += 1
      if (this.page <= this.totalpages && this.alltypeEvents.length < this.totalResults) {
        const queryparam = this.eventRequestObj
        queryparam.request.offset += 20
        this.eventSvc.getEventsList(queryparam).subscribe((events: any) => {
          this.showLoading = false
          this.allEventData = this.allEventData.concat(events.result.Event)
          this.setEventListData(this.allEventData)
        })
      } else {
        this.showLoading = false
      }
    } else {
      this.showLoading = false
    }

  }
  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  viewAll() {
    this.router.navigate(['/app/event-hub/view-all'], { queryParams: { resourceType: 'Karmayogi Talks' } })
  }

  seeAll(type: string) {
    this.router.navigate(['/app/event-hub/see-all'], { queryParams: { category: type } })
  }
}
