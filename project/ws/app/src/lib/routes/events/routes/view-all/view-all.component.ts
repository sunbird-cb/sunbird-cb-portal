import { Component, HostListener } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigurationsService, MultilingualTranslationsService, NsContent } from '@sunbird-cb/utils-v2'
import { EventService } from '../../services/events.service'
import * as _ from 'lodash'
import { DatePipe } from '@angular/common'
//import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { UntypedFormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { MobileFiltersComponent } from '../events/mobile-filters/mobile-filters.component'
import { MatSnackBar } from '@angular/material/snack-bar'
import { TranslateService } from '@ngx-translate/core'
import { Subject, Subscription } from 'rxjs'

@Component({
  selector: 'ws-app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss'],
  providers: [DatePipe]
})
export class ViewAllComponent {

  titles: any = []
  facetsData: any
  selectedFilters: any = {}
  contentDataList: any = []
  contnet: any = []
  startDate: any = ''
  endDate: any = ''
  currentPage: number = 0
  pageLimit: number = 9
  searchControl = new UntypedFormControl('')
  dataScription: Subscription | null = null
  isLoading = false
  total = 0
  showNextPage = false
  sortOptions: any = {
    startDate: 'desc'
  }
  pageConfigData: any = {}
  private scrollSubject = new Subject<Event>()
  selectedValue: any
  totalCount = 0
  totalEventsCount = 0
  orgId: any
  eventLinked: string[] = []

  constructor(private activateRoute: ActivatedRoute, private eventSvc: EventService,
    private datePipe: DatePipe, private bottomSheet: MatBottomSheet, private snackbar: MatSnackBar,
    private translate: TranslateService, private router: Router,
    private langtranslations: MultilingualTranslationsService,
    private configService: ConfigurationsService,
  ) {

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }

    this.titles = [
      { title: 'Events', url: '/app/event-hub/home', disableTranslate: true, icon: 'event' },
    ]
    this.scrollSubject.pipe(debounceTime(500)).subscribe((event: any) => {
      console.log("event ", event)
      this.onDebouncedScroll()
    })
  }

  @HostListener('window:scroll', ['$event'])

  onScroll(event: Event): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !this.isLoading && this.showNextPage
    ) {
      this.scrollSubject.next(event)
    }
  }

  onDebouncedScroll() {
    this.fetchData()
  }


  ngOnInit() {
    this.pageConfigData = this.activateRoute.snapshot.data['pageData'] && this.activateRoute.snapshot.data['pageData'].data || {}
    this.facetsData = _.get(this.pageConfigData, 'version2.filterFacetsData', {})
    this.orgId = _.get(this.configService, 'userProfile.userRootOrg.id', '')
    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe((data: any) => {
      this.router.navigate([], {
        relativeTo: this.activateRoute,
        queryParams: { query: data },
        queryParamsHandling: 'merge',
      })
      this.resetData()
      this.fetchData()
    })
    this.activateRoute.queryParamMap.subscribe(async (data: any) => {
      if (data.params && data.params.resourceType) {
        this.selectedFilters['resourceType'] = [data.params.resourceType]
        if (data.params.courseId) {
          this.selectedFilters['courseId'] = [data.params.courseId]
          try {
            const response = await this.eventSvc.getContentData(data.params.courseId).toPromise()
            this.eventLinked = _.get(response, 'result.content.eventLinked', [])
          } catch (error) {
            this.eventLinked = []
          }
        }
        if (data.params.tabSelected) {
          this.selectedFilters['tabSelected'] = data.params.tabSelected
        }
      }
      if (data.params && data.params.query) {
        this.searchControl.setValue(data.params.query)
      } else {
        this.searchControl.setValue(null)
      }
    })
    this.titles.push({ title: _.get(this.selectedFilters, 'resourceType[0]', 'All'), url: `none`, icon: '' },)
    this.fetchData()
  }

  returnZero() {
    return 0
  }

  generateRequestBody() {
    let requestBody: any = {
      locale: [
        'en',
      ],
      query: '',
      request: {
        query: this.searchControl && this.searchControl.value ? this.searchControl.value : '',
        filters: {
          status: ['Live'],
          contentType: 'Event',
          category: 'Event',
        },
        sort_by: this.sortOptions,
        limit: this.pageLimit || 9,
        offset: (this.pageLimit * this.currentPage) || 0
      },
    }
    if (this.selectedFilters?.resourceType?.includes('Samuhik Charcha')) {
      requestBody.request.filters = {
        ...requestBody.request.filters,
        createdFor: [this.orgId],
      }
      if (this.selectedFilters?.courseId && this.eventLinked.length) {
        requestBody.request.filters = {
          ...requestBody.request.filters,
          identifier: this.eventLinked,
        }
      }
      if (this.selectedFilters?.tabSelected) {
        if (this.selectedFilters.tabSelected.toLowerCase() === 'upcoming events') {
          requestBody.request.filters['endDateTime'] = {
            '>=': this.getCurrentTimeInUTC
          }
        } else if (this.selectedFilters.tabSelected.toLowerCase() === 'past events') {
          requestBody.request.filters['endDateTime'] = {
            '<': this.getCurrentTimeInUTC
          }
        }
      }
    }
    if (this.selectedFilters) {
      let startDate: any = ''
      let endDate: any = ''
      let startDateTimeInEpoch: any = ''
      let endDateTimeInEpoch: any = ''
      if (this.selectedFilters.eventDate && this.selectedFilters.eventDate.length) {
        if (this.selectedFilters.eventDate.includes('Today') && !this.selectedFilters.eventDate.includes('Tomorrow')) {
          startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        }
        if (!this.selectedFilters.eventDate.includes('Today') && this.selectedFilters.eventDate.includes('Tomorrow')) {
          let tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          startDate = this.datePipe.transform(tomorrow, 'yyyy-MM-dd')
          endDate = this.datePipe.transform(tomorrow, 'yyyy-MM-dd')
        }
        if (this.selectedFilters.eventDate.includes('Today') && this.selectedFilters.eventDate.includes('Tomorrow')) {
          const today = new Date()
          let tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          startDate = this.datePipe.transform(today, 'yyyy-MM-dd')
          endDate = this.datePipe.transform(tomorrow, 'yyyy-MM-dd')
        }
      }
      if (this.selectedFilters.dateRange && this.selectedFilters.dateRange.fromDate && this.selectedFilters.dateRange.toDate) {
        startDate = this.datePipe.transform(new Date(this.selectedFilters.dateRange.fromDate), 'yyyy-MM-dd')
        endDate = this.datePipe.transform(new Date(this.selectedFilters.dateRange.toDate), 'yyyy-MM-dd')
      }
      if (this.selectedFilters.eventStatus && this.selectedFilters.eventStatus.length && this.selectedFilters.eventStatus[0] === 'Upcoming') {
        const today = new Date()
        today.setDate(today.getDate() + 1)
        // startDate = this.datePipe.transform(today, 'yyyy-MM-dd')
        startDateTimeInEpoch = Date.UTC(new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
          new Date().getUTCHours(),
          new Date().getUTCMinutes(),
          new Date().getUTCSeconds(),
          new Date().getUTCMilliseconds())
      }
      if (this.selectedFilters.eventStatus && this.selectedFilters.eventStatus.length && this.selectedFilters.eventStatus[0] === 'Past Events') {
        const today = new Date()
        today.setDate(today.getDate() - 1)
        // endDate = this.datePipe.transform(today, 'yyyy-MM-dd')
        endDateTimeInEpoch = Date.UTC(new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
          new Date().getUTCHours(),
          new Date().getUTCMinutes(),
          new Date().getUTCSeconds(),
          new Date().getUTCMilliseconds())
      }
      if (this.selectedFilters.eventStatus && this.selectedFilters.eventStatus.length && this.selectedFilters.eventStatus[0] === 'Live Events') {
        const today = new Date()
        today.setDate(today.getDate())
        // startDate = this.datePipe.transform(today, 'yyyy-MM-dd')
        // endDate = this.datePipe.transform(today, 'yyyy-MM-dd')
        startDateTimeInEpoch = Date.UTC(new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
          new Date().getUTCHours(),
          new Date().getUTCMinutes(),
          new Date().getUTCSeconds(),
          new Date().getUTCMilliseconds())
        endDateTimeInEpoch = Date.UTC(new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
          new Date().getUTCHours(),
          new Date().getUTCMinutes(),
          new Date().getUTCSeconds(),
          new Date().getUTCMilliseconds())
      }

      requestBody = {
        ...requestBody,
        request: {
          ...requestBody.request,
          filters: {
            ...requestBody.request.filters,
            resourceType: this.selectedFilters.resourceType ? this.selectedFilters.resourceType : [],
            ...(startDate ? { "startDate": { ">=": [startDate] } } : {}),
            ...(endDate ? { "endDate": { "<=": [endDate] } } : {}),
            ...(startDateTimeInEpoch ? {
              "startDateTimeInEpoch":
                (_.get(this.selectedFilters, 'eventStatus[0]') === 'Upcoming' ? { ">=": [startDateTimeInEpoch] } : { "<=": [startDateTimeInEpoch] })
            } : {}),
            ...(endDateTimeInEpoch ? {
              "endDateTimeInEpoch":
                (_.get(this.selectedFilters, 'eventStatus[0]') === 'Past Events' ? { "<=": [endDateTimeInEpoch] } : { ">=": [endDateTimeInEpoch] })
            } : {}),
          },
        },
      }

    }
    return requestBody
  }

  get getCurrentTimeInUTC(): string {
    const currentDate = new Date()
    const isoString = currentDate.toISOString()
    return isoString.replace('Z', '+0000')
  }

  fetchData() {
    if (!this.isLoading) {
      this.contentDataList = [...this.contentDataList, ...this.transformSkeletonToWidgets(this.contnet)]
    }

    const requestBody = this.generateRequestBody()
    if (this.dataScription) {
      this.dataScription.unsubscribe()
      this.dataScription = null
    }
    this.isLoading = true
    this.dataScription = this.eventSvc.getEventsList(requestBody).subscribe((resp: any) => {
      let response: any = _.get(resp, 'result.Event', [])
      this.contentDataList = this.contentDataList.slice(0, -6)
      this.total = this.contentDataList.length
      this.totalCount = this.totalCount + response.length
      this.showNextPage = this.totalCount < _.get(resp, 'result.count', 0)
      this.totalEventsCount = _.get(resp, 'result.count', 0)
      if (response.length) {
        if (this.selectedFilters.eventStatus && this.selectedFilters.eventStatus.length) {
          response = this.processResult(response)
        }
        this.contentDataList = [...this.contentDataList, ...this.transformContentsToWidgets(response, {})]
        this.currentPage = this.currentPage + 1
      } else {
        this.contentDataList = [...this.contentDataList, ...this.transformContentsToWidgets([], {})]
      }
      this.isLoading = false
    }, error => {
      console.log("error", error)
      this.contentDataList = [...this.contentDataList, ...this.transformContentsToWidgets([], {})]
      this.isLoading = false
    })
  }

  isLiveEvent(event: any) {
    if (event.startDate && event.endDate && event.startTime && event.endTime) {
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

  processResult(events: any) {
    let processedEvents: any = []
    events.forEach((event: any) => {
      if (event.startDate && event.endDate && event.startTime && event.endTime) {
        // Conver current time into milliseconds
        let currentTime = new Date().getTime() / 1000
        // Combining date and time for start event
        let evenStarttDate = new Date(`${event.startDate} ${event.startTime}`).getTime() / 1000
        // Combining date and time for end event
        let eventEndDate = new Date(`${event.endDate} ${event.endTime}`).getTime() / 1000
        if (currentTime > eventEndDate) {
          if (this.selectedFilters.eventStatus.includes('Past Events')) {
            processedEvents.push(event)
          }
        } else if (currentTime <= eventEndDate && currentTime >= evenStarttDate) {
          if (this.selectedFilters.eventStatus.includes('Live Events')) {
            event.showLive = true
            processedEvents.push(event)
          }
        } else {
          if (this.selectedFilters.eventStatus.includes('Upcoming')) {
            processedEvents.push(event)
          }
        }
      }
    })
    return processedEvents
  }

  showAll(): boolean {
    if (this.selectedFilters.resourceType && this.selectedFilters.resourceType.length) {
      return true
    }
    if (this.selectedFilters.eventDate && this.selectedFilters.eventDate.length) {
      return true
    }
    if (this.selectedFilters.eventStatus && this.selectedFilters.eventStatus.length) {
      return true
    }
    if (this.selectedFilters.dateRange) {
      return true
    }
    return false
  }

  filterChange(data: any) {
    console.log(data)
    this.selectedFilters = data
    this.fetchData()
  }

  clearAll() {
    this.selectedFilters = {}
    this.startDate = ''
    this.endDate = ''
    this.selectedValue = null
    this.resetData()
    this.fetchData()
  }

  openBottomSheet(): void {
    const bottomSheetRef = this.bottomSheet.open(MobileFiltersComponent, {
      data: {
        facetsData: this.facetsData,
        selectedFilters: this.selectedFilters,
        clonedFilters: this.selectedFilters,
      },
      panelClass: 'filter-bottomsheet',
      disableClose: true
    })
    bottomSheetRef.afterDismissed().subscribe((result: any) => {
      if (result && result.action === 'apply') {
        this.selectedFilters = result.selectedFilters
        this.resetData()
        this.fetchData()
      }
    })
  }

  sortType(type: any) {
    if (type == 'asc') {
      this.sortOptions = { name: 'asc' }
      this.resetData()
      this.fetchData()
    } else if (type === 'short') {
      this.contentDataList = this.contentDataList.sort(
        (a: any, b: any) => a.widgetData.content.duration - b.widgetData.content.duration)
    } else {
      this.contentDataList = this.contentDataList.sort(
        (a: any, b: any) => b.widgetData.content.duration - a.widgetData.content.duration)
    }
  }

  customDate(dateRange: any) {
    return `${this.datePipe.transform(dateRange.fromDate, 'dd/MM/yyyy')} -
    ${this.datePipe.transform(dateRange.toDate, 'dd/MM/yyyy')}`
  }

  removeFilter(key: any, filter: any) {
    if (key === 'dateRange') {
      delete this.selectedFilters.dateRange
      this.startDate = ''
      this.endDate = ''
    } else if (key === 'resourceType') {
      this.selectedFilters = {
        ... this.selectedFilters,
        resourceType: this.selectedFilters.resourceType.filter((item: any) => item !== filter)
      }
    } else if (key === 'eventStatus') {
      const removeditems = this.selectedFilters.eventStatus.filter((item: any) => item !== filter)
      if (removeditems.length === 0) {
        delete this.selectedFilters.eventStatus
      } else {
        this.selectedFilters = {
          ... this.selectedFilters,
          eventStatus: removeditems
        }
      }
      this.selectedValue = null
    } else if (key === 'eventDate') {
      const removeditems = this.selectedFilters.eventDate.filter((item: any) => item !== filter)
      if (removeditems.length === 0) {
        delete this.selectedFilters.eventDate
      } else {
        this.selectedFilters = {
          ... this.selectedFilters,
          eventDate: this.selectedFilters.eventDate.filter((item: any) => item !== filter)
        }
      }
    }
    this.resetData()
    this.fetchData()
  }

  resetData() {
    if (this.dataScription) {
      this.dataScription.unsubscribe()
      this.dataScription = null
    }
    this.contentDataList = []
    this.currentPage = 0
    this.pageLimit = 9
    this.totalCount = 0
    this.total = 0
  }

  canCheck(key: any, keyData: any) {
    if (this.selectedFilters[key]) {
      return this.selectedFilters[key].includes(keyData.name)
    }
  }

  onDateChange(event: any, eType: any, facet: any) {
    if (eType.key === 'fromDate') {
      this.startDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')
    }
    if (eType.key === 'toDate') {
      this.endDate = this.datePipe.transform(event.value, 'yyyy-MM-dd')
    }
    if (this.startDate && this.endDate) {
      const date1 = new Date(this.startDate)
      const date2 = new Date(this.endDate)
      if (date1 > date2) {
        this.snackbar.open('Start date should not greater than end date.')
      } else {
        delete this.selectedFilters.eventDate
        delete this.selectedFilters.eventStatus
        this.selectedFilters[facet.key] = { fromDate: date1, toDate: date2 }
        this.resetData()
        this.fetchData()
        this.selectedValue = null
      }
    } else {
      if (!this.startDate) {
        this.snackbar.open('Choose a valid start date.')
      }
      if (!this.endDate) {
        this.snackbar.open('Choose a valid end date.')
      }
    }
  }

  changeStatus(value: any, key: any) {
    this.selectedFilters[key] = [value.name]
    delete this.selectedFilters.dateRange
    delete this.selectedFilters.eventDate
    this.startDate = ''
    this.endDate = ''
    this.resetData()
    this.fetchData()
  }

  changeSelection(event: any, key: any, keyData: any) {
    if (event) {
      if (['resourceType', 'eventDate'].includes(key)) {
        if (this.selectedFilters[key]) {
          let slected = this.selectedFilters[key]
          slected.push(keyData.name)
          this.selectedFilters[key] = slected
        } else {
          this.selectedFilters[key] = [keyData.name]
        }
        if (key === 'eventDate') {
          delete this.selectedFilters.eventStatus
          delete this.selectedFilters.dateRange
          this.startDate = ''
          this.endDate = ''
          this.selectedValue = null
        }
        if (key === 'eventStatus') {
          delete this.selectedFilters.dateRange
          delete this.selectedFilters.eventDate
          this.startDate = ''
          this.endDate = ''
        }
        delete this.selectedFilters.key
      }
    } else {
      if (['resourceType', 'eventDate'].includes(key)) {
        let filtered = this.selectedFilters[key].filter((item: any) => item !== keyData.name)
        if (filtered.length === 0) {
          delete this.selectedFilters[key]
        } else {
          this.selectedFilters[key] = filtered
        }
      }
    }
    this.resetData()
    this.fetchData()
  }

  getName(filters: any, filter: any) {
    if (filters.key === 'resourceType') {
      return filter
    } else if (filters.key === 'eventStatus' || filters.key === 'eventDate') {
      return this.translateLabels(this.toCamelCase(filter), 'events')
    }
  }

  toCamelCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, '')
  }


  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  private transformSkeletonToWidgets(
    strip: any
  ) {
    return [1, 2, 3, 4, 5, 6].map(_content => ({
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
          ...content,
          showLive: this.isLiveEvent(content),
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

