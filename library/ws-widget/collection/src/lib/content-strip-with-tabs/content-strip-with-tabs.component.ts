import { Component, OnInit, Input, OnDestroy, HostBinding, EventEmitter, Output } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { NsContentStripWithTabs } from './content-strip-with-tabs.model'
// import { HttpClient } from '@angular/common/http'
import { WidgetContentService } from '../_services/widget-content.service'
import { NsContent } from '../_services/widget-content.model'
import {
  TFetchStatus,
  LoggerService,
  EventService,
  ConfigurationsService,
  UtilityService,
  WsEvents,
  MultilingualTranslationsService,
} from '@sunbird-cb/utils-v2'
import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { WidgetUserServiceLib } from '@sunbird-cb/consumption'
import { environment } from 'src/environments/environment'
// tslint:disable-next-line
import * as _ from 'lodash'
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs'
import { NsCardContent } from '../card-content-v2/card-content-v2.model'
import { ITodayEvents } from '@ws/app/src/lib/routes/events/models/event'
import { TranslateService } from '@ngx-translate/core'

interface IStripUnitContentData {
  key: string
  canHideStrip: boolean
  mode?: string
  showStrip: boolean
  widgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
  stripTitle: string
  stripTitleLink?: {
    link: string,
    icon: string
  },
  sliderConfig?: {
    showNavs: boolean,
    showDots: boolean,
    maxWidgets?: number
    cerificateCardMargin?: boolean
  },
  tabs?: NsContentStripWithTabs.IContentStripTab[] | undefined,
  stripName?: string
  stripLogo?: string
  description?: string
  stripInfo?: NsContentStripWithTabs.IStripInfo
  noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  showOnNoData: boolean
  showOnLoader: boolean
  showOnError: boolean
  loaderWidgets?: any
  stripBackground?: string
  secondaryHeading?: any
  viewMoreUrl: any

}

@Component({
  selector: 'ws-widget-content-strip-with-tabs',
  templateUrl: './content-strip-with-tabs.component.html',
  styleUrls: ['./content-strip-with-tabs.component.scss'],
})
export class ContentStripWithTabsComponent extends WidgetBaseComponent
  implements
  OnInit,
  OnDestroy,
  NsWidgetResolver.IWidgetData<NsContentStripWithTabs.IContentStripMultiple> {
  @Input() widgetData!: NsContentStripWithTabs.IContentStripMultiple
  @Output() emptyResponse = new EventEmitter<any>()
  @HostBinding('id')
  public id = `ws-strip-miltiple_${Math.random()}`
  stripsResultDataMap!: { [key: string]: IStripUnitContentData }
  stripsKeyOrder: string[] = []
  showAccordionData = true
  showParentLoader = false
  showParentError = false
  showParentNoData = false
  errorDataCount = 0
  noDataCount = 0
  successDataCount = 0
  contentAvailable = true
  baseUrl = this.configSvc.sitePath || ''
  veifiedKarmayogi = false
  environment!: any
  changeEventSubscription: Subscription | null = null
  defaultMaxWidgets = 12
  enrollInterval: any
  todaysEvents: any = []
  activeTabData: any

  constructor(
    // private contentStripSvc: ContentStripNewMultipleService,
    private contentSvc: WidgetContentService,
    private loggerSvc: LoggerService,
    private eventSvc: EventService,
    private configSvc: ConfigurationsService,
    public utilitySvc: UtilityService,
    // private http: HttpClient,
    // private searchServSvc: SearchServService,
    private userSvc: WidgetUserServiceLib,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    super()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
      lang = lang.replace(/\"/g, '')
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.environment = environment
    // const url = window.location.href
    this.initData()
  }

  ngOnDestroy() {
    if (this.changeEventSubscription) {
      this.changeEventSubscription.unsubscribe()
    }
  }

  showAccordion(key: string) {
    if (this.utilitySvc.isMobile && this.stripsResultDataMap[key].mode === 'accordion') {
      return this.showAccordionData
    }
    return true
  }

  setHiddenForStrip(key: string) {
    this.stripsResultDataMap[key].showStrip = false
    sessionStorage.setItem(`cstrip_${key}`, '1')
  }
  private getIfStripHidden(key: string): boolean {
    const storageItem = sessionStorage.getItem(`cstrip_${key}`)
    return Boolean(storageItem !== '1')
  }

  private initData() {
    this.stripsKeyOrder = this.widgetData && this.widgetData.strips && this.widgetData.strips.map(strip => strip.key) || []
    if (this.widgetData.loader && this.widgetData.strips.length) {
      this.showParentLoader = true
    }
    // Fetch the data
    for (const strip of this.widgetData.strips) {
      if (this.checkForEmptyWidget(strip)) {
        this.fetchStripFromRequestData(strip, false)
      } else {
        this.processStrip(strip, [], 'done', true, null)
      }
    }
    // Subscription for changes
    const keyAndEvent: { key: string; type: string; from: string }[] = this.widgetData.strips
      .map(strip => ({
        key: strip.key,
        type: (strip.refreshEvent && strip.refreshEvent.eventType) || '',
        from: (strip.refreshEvent && strip.refreshEvent.from.toString()) || '',
      }))
      .filter(({ key, type, from }) => key && type && from)
    const eventTypeSet = new Set(keyAndEvent.map(e => e.type))
    this.changeEventSubscription = this.eventSvc.events$
      .pipe(filter(event => eventTypeSet.has(event.eventType)))
      .subscribe(event => {
        keyAndEvent
          .filter(e => e.type === event.eventType && e.from === event.from)
          .map(e => e.key)
          .forEach(k => this.fetchStripFromKey(k, false))
      })
  }

  private fetchStripFromKey(key: string, calculateParentStatus = true) {
    const stripData = this.widgetData.strips.find(strip => strip.key === key)
    if (stripData) {
      this.fetchStripFromRequestData(stripData, calculateParentStatus)
    }
  }

  isStripShowing(data: any) {
    let count = 0
    if (data && data.key === this.environment.programStripKey && (!data.tabs || !data.tabs.length) &&
      data.stripTitle === this.environment.programStripName && data.widgets.length > 0) {
      data.widgets.forEach((key: any) => {
        if (key && key.widgetData.content.primaryCategory === this.environment.programStripPrimaryCategory) {
          count = count + 1
        }
      })
      if (count > 0) {
        data.showStrip = true
      } else {
        data.showStrip = false
      }
    }
    // console.log('data.key', data, data.key, data.widgets);
    return data.showStrip
  }

  get isMobile() {
    return this.utilitySvc.isMobile || false
  }

  getdata(data: IStripUnitContentData) {
    if (data.stripInfo) {
      return data.stripInfo.widget
    }
    return {}

  }
  checkCondition(wData: NsContentStripWithTabs.IContentStripMultiple, data: IStripUnitContentData) {
    if (wData.strips[0].stripConfig && wData.strips[0].stripConfig.hideShowAll) {
      return !wData.strips[0].stripConfig.hideShowAll
    }
    return wData.strips[0].viewMoreUrl && data.widgets && data.widgets.length >= 4
  }
  checkVisible(data: IStripUnitContentData) {
    return data.stripInfo && data.stripInfo.visibilityMode === 'visible'
  }

  getContineuLearningLenth(data: IStripUnitContentData) {
    return data.widgets ? data.widgets.length : 0
  }
  getLength(data: IStripUnitContentData) {
    if (!data.tabs || !data.tabs.length) {
      return data.widgets ? data.widgets.length : 0
    } {
      // if tabs are there check if each tab has widgets and get the tab with max widgets
      const tabWithMaxWidgets = data.tabs.reduce(
        (prev, current) => {
          if (!prev.widgets && !current.widgets) {
            return current
          }
          if (prev.widgets && current.widgets) {
            return (prev.widgets.length > current.widgets.length) ? prev : current
          }
          if (current.widgets && !prev.widgets) {
            return current
          }
          if (!current.widgets && prev.widgets) {
            return prev
          }
          return current
          // return (prev.widgets && current.widgets && (prev.widgets.length > current.widgets.length) ) ? prev : current
          // tslint:disable-next-line: align
        }, data.tabs[0])
      // if tabs has atleast 1 widgets then strip will show or else not
      return tabWithMaxWidgets.widgets ? tabWithMaxWidgets.widgets.length : 0
    }
  }

  private getFiltersFromArray(v6filters: any) {
    const filters: any = {}
    if (v6filters.constructor === Array) {
      v6filters.forEach(((f: any) => {
        Object.keys(f).forEach(key => {
          filters[key] = f[key]
        })
      }))
      return filters
    }
    return v6filters
  }

  private transformSearchV6FiltersV2(v6filters: any) {
    const filters: any = {}
    if (v6filters.constructor === Array) {
      v6filters.forEach(((f: any) => {
        Object.keys(f).forEach(key => {
          filters[key] = f[key]
        })
      }))
      return filters
    }
    return v6filters
  }

  checkForDateFilters(filters: any) {
    let userData: any
    if (this.configSvc.userProfile) {
      userData = this.configSvc.userProfile
    }

    if (filters && filters.hasOwnProperty('batches.endDate')) {
      // tslint:disable-next-line
      filters['batches.endDate']['>='] = eval(filters['batches.endDate']['>='])
    } else if (filters && filters.hasOwnProperty('batches.enrollmentEndDate')) {
      // tslint:disable-next-line
      filters['batches.enrollmentEndDate']['>='] = eval(filters['batches.enrollmentEndDate']['>='])
    } else if (filters.organisation &&
      filters.organisation.indexOf('<orgID>') >= 0
    ) {
      filters['organisation'] = userData && userData.rootOrgId

      if (filters && filters.hasOwnProperty('designation')) {
        filters['designation'] = userData.professionalDetails.length > 0 ?
          userData.professionalDetails[0].designation : ''
      }
    }
    return filters
  }

  private fetchStripFromRequestData(
    strip: NsContentStripWithTabs.IContentStripUnit,
    calculateParentStatus = true,
  ) {
    // setting initial values
    strip.loaderWidgets = this.transformSkeletonToWidgets(strip)
    this.processStrip(strip, [], 'fetching', false, null)
    this.fetchFromEnrollmentList(strip, calculateParentStatus)
    this.fetchFromSearchV6(strip, calculateParentStatus)
    this.fetchFromTrendingContent(strip, calculateParentStatus)
    this.fetchAllCbpPlans(strip, calculateParentStatus)
    // this.enrollInterval = setInterval(() => {
    //   this.fetchAllCbpPlans(strip, calculateParentStatus)
    // },                                1000)
  }

  fetchFromEnrollmentList(strip: NsContentStripWithTabs.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) {
      let userId = ''
      let content: NsContent.IContent[]
      let contentNew: NsContent.IContent[]
      let tabResults: any[] = []
      const queryParams = _.get(strip.request.enrollmentList, 'queryParams')
      // if (queryParams && queryParams.batchDetails) {
      //   if (!queryParams.batchDetails.includes('&retiredCoursesEnabled=true')) {
      //     queryParams.batchDetails += '&retiredCoursesEnabled=true'
      //   }
      // }
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId
      }
      // this.userSvc.resetTime('enrollmentService')
      // tslint:disable-next-line: deprecation
      this.userSvc.fetchUserBatchList(userId, queryParams).subscribe(
        (result: any) => {
          const courses = result && result.courses
          const showViewMore = Boolean(
            courses.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: (strip.viewMoreUrl && strip.viewMoreUrl.path) || '',
              queryParams: {
                q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
                f:
                  strip.request && strip.request.searchV6 && strip.request.searchV6.filters
                    ? JSON.stringify(
                      // this.searchServSvc.transformSearchV6Filters(
                      strip.request.searchV6.filters
                      // ),
                    )
                    : {},
              },
            }
            : null
          if (courses && courses.length) {
            content = courses.map((c: any) => {
              const contentTemp: NsContent.IContent = c.content
              contentTemp.completionPercentage = c.completionPercentage || c.progress || 0
              contentTemp.completionStatus = c.completionStatus || c.status || 0
              contentTemp.enrolledDate = c.enrolledDate || ''
              contentTemp.lastContentAccessTime = c.lastContentAccessTime || ''
              contentTemp.lastReadContentStatus = c.lastReadContentStatus || ''
              contentTemp.lastReadContentId = c.lastReadContentId || ''
              contentTemp.lrcProgressDetails = c.lrcProgressDetails || ''
              contentTemp.issuedCertificates = c.issuedCertificates || []
              contentTemp.batchId = c.batchId || ''
              return contentTemp
            })
          }
          // To filter content with completionPercentage > 0,
          // so that only those content will show in home page
          // continue learing strip
          // if (content && content.length) {
          //   contentNew = content.filter((c: any) => {
          //     /** commented as both are 0 after enrolll */
          //     if (c.completionPercentage && c.completionPercentage > 0) {
          //       return c
          //     }
          //   })
          // }

          // To sort in descending order of the enrolled date
          contentNew = (content || []).sort((a: any, b: any) => {
            const dateA: any = new Date(a.lastContentAccessTime || 0)
            const dateB: any = new Date(b.lastContentAccessTime || 0)
            return dateB - dateA
          })

          if (strip.tabs && strip.tabs.length) {
            tabResults = this.splitEnrollmentTabsData(contentNew, strip)
            this.processStrip(
              strip,
              this.transformContentsToWidgets(contentNew, strip),
              'done',
              calculateParentStatus,
              viewMoreUrl,
              tabResults
            )
          } else {
            this.processStrip(
              strip,
              this.transformContentsToWidgets(contentNew, strip),
              'done',
              calculateParentStatus,
              viewMoreUrl,
            )
          }
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        }
      )
    }
  }

  splitEnrollmentTabsData(contentNew: NsContent.IContent[], strip: NsContentStripWithTabs.IContentStripUnit) {
    const tabResults: any[] = []
    const splitData = this.getInprogressAndCompleted(
      contentNew,
      (e: any) => e.completionStatus === 1 || e.completionPercentage < 100,
      strip,
    )

    if (strip.tabs && strip.tabs.length) {
      for (let i = 0; i < strip.tabs.length; i += 1) {
        if (strip.tabs[i]) {
          tabResults.push(
            {
              ...strip.tabs[i],
              fetchTabStatus: 'done',
              ...(splitData.find(itmInner => {
                if (strip.tabs && strip.tabs[i] && itmInner.value === strip.tabs[i].value) {
                  return itmInner
                }
                return undefined
              })),
            }
          )
        }
      }
    }
    return tabResults
  }

  getInprogressAndCompleted(array: NsContent.IContent[],
                            customFilter: any,
                            strip: NsContentStripWithTabs.IContentStripUnit) {
    const inprogress: any[] = []
    const completed: any[] = []
    // array.forEach((e: any, idx: number, arr: any[]) => (customFilter(e, idx, arr) ? inprogress : completed).push(e))
    array.forEach((e, idx, arr) => {
    const status = e.status ? (e.status as string).toLowerCase() : ''
    const statusRetired = status === 'retired'
    if (customFilter(e, idx, arr)) {
    if (!statusRetired) {
      inprogress.push(e)
    }
   } else {
    completed.push(e)
   }
    })
    // Sort the completed array with 'Live' status first and 'Retired' status second
    completed.sort((a: any, b: any) => {
      const statusA = a.status ? a.status.toLowerCase() : ''
      const statusB = b.status ? b.status.toLowerCase() : ''
      if (statusA === 'live' && statusB !== 'live') {
        return -1
      }
      if (statusA !== 'live' && statusB === 'live') {
        return 1
      }
      if (statusA === 'retired' && statusB !== 'retired') {
        return 1
      }
      if (statusA !== 'retired' && statusB === 'retired') {
        return -1
      }
      return 0
    })
    return [
      { value: 'inprogress', widgets: this.transformContentsToWidgets(inprogress, strip) },
      { value: 'completed', widgets: this.transformContentsToWidgets(completed, strip) }]
  }

  async fetchFromSearchV6(strip: NsContentStripWithTabs.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.searchV6 && Object.keys(strip.request.searchV6).length) {
      // if (!(strip.request.searchV6.locale && strip.request.searchV6.locale.length > 0)) {
      //   if (this.configSvc.activeLocale) {
      //     strip.request.searchV6.locale = [this.configSvc.activeLocale.locals[0]]
      //   } else {
      //     strip.request.searchV6.locale = ['en']
      //   }
      // }
      let originalFilters: any = []
      // tslint:disable:no-console
      console.log(originalFilters)
      if (strip.request &&
        strip.request.searchV6 &&
        strip.request.searchV6.request &&
        strip.request.searchV6.request.filters) {
        originalFilters = strip.request.searchV6.request.filters
        strip.request.searchV6.request.filters = this.checkForDateFilters(strip.request.searchV6.request.filters)
        strip.request.searchV6.request.filters = this.getFiltersFromArray(
          strip.request.searchV6.request.filters,
        )
      }
      if (strip.tabs && strip.tabs.length) {
        // TODO: Have to extract requestRequired to outer level of tabs config
        const firstTab = strip.tabs[0]
        if (firstTab.requestRequired) {
          if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
            const allTabs = this.stripsResultDataMap[strip.key].tabs
            const currentTabFromMap = (allTabs && allTabs.length && allTabs[0]) as NsContentStripWithTabs.IContentStripTab

            this.getTabDataByNewReqSearchV6(strip, 0, currentTabFromMap, calculateParentStatus)
          }
        }

      } else {
        try {
          const response = await this.searchV6Request(strip, strip.request, calculateParentStatus)
          // console.log('calling  after - response, ', response)
          if (response && response.results) {
            // console.log('calling  after-- ')
            if (response.results.result.content) {
              this.processStrip(
                strip,
                this.transformContentsToWidgets(response.results.result.content, strip),
                'done',
                calculateParentStatus,
                response.viewMoreUrl,
              )
            } else if (response.results.result.Event) {
              this.processStrip(
                strip,
                this.transformEventsToWidgets(response.results.result.Event, strip),
                'done',
                calculateParentStatus,
                response.viewMoreUrl,
              )
            } else {
              this.emptyResponse.emit(true)
              this.processStrip(strip, [], 'error', calculateParentStatus, null)
            }

          } else {
            this.emptyResponse.emit(true)
            this.processStrip(strip, [], 'error', calculateParentStatus, null)
          }
        } catch (error) {
          // Handle errors
          // console.error('Error:', error);
        }
      }
    }
  }

  async searchV6Request(strip: NsContentStripWithTabs.IContentStripUnit,
                        request: NsContentStripWithTabs.IContentStripUnit['request'],
                        calculateParentStatus: boolean
  ): Promise<any> {
    const originalFilters: any = []
    return new Promise<any>((resolve, reject) => {
      if (request && request.searchV6) {
        this.contentSvc.searchV6(request.searchV6).subscribe(results => {
          const showViewMore = Boolean(
            results.result.content && results.result.content.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
              queryParams: {
                tab: 'Learn',
                q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
                f:
                  request &&
                    request.searchV6 &&
                    request.searchV6.request &&
                    request.searchV6.request.filters
                    ? JSON.stringify(
                      this.transformSearchV6FiltersV2(
                        originalFilters,
                      )
                    )
                    : {},
              },
            }
            : null
          // if (viewMoreUrl && viewMoreUrl.queryParams) {
          //   viewMoreUrl.queryParams = viewMoreUrl.queryParams
          // }
          resolve({ results, viewMoreUrl })
        },                                                   (error: any) => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
          reject(error)
        },
        )
      }
    })
  }

  async fetchFromTrendingContent(strip: NsContentStripWithTabs.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.trendingSearch && Object.keys(strip.request.trendingSearch).length) {
      // if (!(strip.request.searchV6.locale && strip.request.searchV6.locale.length > 0)) {
      //   if (this.configSvc.activeLocale) {
      //     strip.request.searchV6.locale = [this.configSvc.activeLocale.locals[0]]
      //   } else {
      //     strip.request.searchV6.locale = ['en']
      //   }
      // }
      let originalFilters: any = []
      // tslint:disable:no-console
      console.log(originalFilters)
      if (strip.request &&
        strip.request.trendingSearch &&
        strip.request.trendingSearch.request &&
        strip.request.trendingSearch.request.filters) {
        originalFilters = strip.request.trendingSearch.request.filters
        strip.request.trendingSearch.request.filters = this.checkForDateFilters(strip.request.trendingSearch.request.filters)
        strip.request.trendingSearch.request.filters = this.getFiltersFromArray(
          strip.request.trendingSearch.request.filters,
        )
      }
      if (strip.tabs && strip.tabs.length) {
        // TODO: Have to extract requestRequired to outer level of tabs config
        const firstTab = strip.tabs[0]
        if (firstTab.requestRequired) {
          if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
            const allTabs = this.stripsResultDataMap[strip.key].tabs
            const currentTabFromMap = (allTabs && allTabs.length && allTabs[0]) as NsContentStripWithTabs.IContentStripTab

            this.getTabDataByNewReqTrending(strip, 0, currentTabFromMap, calculateParentStatus)
          }
        }

      } else {
        try {
          const response = await this.trendingSearchRequest(strip, strip.request, calculateParentStatus)
          if (response && response.results && response.results.response) {
            const content = response.results.response[strip.request.trendingSearch.responseKey] || []
            this.processStrip(
              strip,
              this.transformContentsToWidgets(content, strip),
              'done',
              calculateParentStatus,
              response.viewMoreUrl || '',
            )
          } else {
            this.processStrip(strip, [], 'done', calculateParentStatus, null)
          }
        } catch (error) {
          // Handle errors
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        }
      }
    }
  }

  async trendingSearchRequest(strip: NsContentStripWithTabs.IContentStripUnit,
                              request: NsContentStripWithTabs.IContentStripUnit['request'],
                              calculateParentStatus: boolean
  ): Promise<any> {
    const originalFilters: any = []
    return new Promise<any>((resolve, reject) => {
      if (request && request.trendingSearch) {
        // check for the request if it has dynamic values]
        if (request.trendingSearch.request.filters.organisation &&
          request.trendingSearch.request.filters.organisation.indexOf('<orgID>') >= 0
        ) {
          let userRootOrgId
          if (this.configSvc.userProfile) {
            userRootOrgId = this.configSvc.userProfile.rootOrgId
          }
          request.trendingSearch.request.filters.organisation = userRootOrgId
        }
        this.contentSvc.trendingContentSearch(request.trendingSearch).subscribe(results => {
          const showViewMore = Boolean(
            results.result &&
            strip.request &&
            results.result[strip.request.trendingSearch.responseKey] &&
            results.result[strip.request.trendingSearch.responseKey].length > 5 &&
            strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
              queryParams: {
                tab: 'Learn',
                q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
                f:
                  request &&
                    request.trendingSearch &&
                    request.trendingSearch.request &&
                    request.trendingSearch.request.filters
                    ? JSON.stringify(
                      this.transformSearchV6FiltersV2(
                        originalFilters,
                      )
                    )
                    : {},
              },
            }
            : null
          resolve({ results, viewMoreUrl })
        },                                                                      (error: any) => {
          if (error.error && error.error.status === 400) {
            this.processStrip(strip, [], 'done', calculateParentStatus, null)
          }
          // this.processStrip(strip, [], 'done', calculateParentStatus, null)
          reject(error)
        },
        )
      }
    })
  }

  toggleInfo(data: IStripUnitContentData) {
    const stripInfo = this.stripsResultDataMap[data.key].stripInfo
    if (stripInfo) {
      if (stripInfo.mode !== 'below') {
        this.loggerSvc.warn(`strip info mode: ${stripInfo.mode} not implemented yet`)
        stripInfo.mode = 'below'
      }
      if (stripInfo.mode === 'below') {
        this.stripsResultDataMap[data.key].stripInfo = {
          ...stripInfo,
          visibilityMode: stripInfo.visibilityMode === 'hidden' ? 'visible' : 'hidden',
        }
      }
    }
  }

  private transformContentsToWidgets(
    contents: NsContent.IContent[],
    strip: NsContentStripWithTabs.IContentStripUnit,
  ) {
    return (contents || []).map((content, idx) => (
      content ? {
        widgetType: 'card',
        widgetSubType: 'cardContent',
        widgetHostClass: 'mb-2',
        widgetData: {
          content,
          ...(content.batch && { batch: content.batch }),
          cardSubType: strip.stripConfig && strip.stripConfig.cardSubType,
          cardCustomeClass: strip.customeClass ? strip.customeClass : '',
          context: { pageSection: strip.key, position: idx },
          intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
          deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
          contentTags: strip.stripConfig && strip.stripConfig.contentTags,
        },
      } : {
        widgetType: 'card',
        widgetSubType: 'cardContent',
        widgetHostClass: 'mb-2',
        widgetData: {},
      }
    ))
  }

  private transformEventsToWidgets(
    contents: ITodayEvents[],
    strip: NsContentStripWithTabs.IContentStripUnit,
  ) {
    this.eventSvc.setEventListData(contents)
    let eventData = strip.key === 'liveEvents' ? this.eventSvc.todaysLiveEvents :  this.eventSvc.todaysEvents
    if (strip.key === 'keySpeakersEvents') {
      eventData = this.eventSvc.keySpeakerEvents
    }
    return (eventData || []).map((content: any, idx: any) => (content ? {
      widgetType: 'card',
      widgetSubType: 'eventHubCard',
      widgetHostClass: 'mb-2',
      widgetData: {
        content,
        cardSubType: strip.stripConfig && strip.stripConfig.cardSubType,
        cardCustomeClass: strip.customeClass ? strip.customeClass : '',
        context: { pageSection: strip.key, position: idx },
        intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
        deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
        contentTags: strip.stripConfig && strip.stripConfig.contentTags,
      },
    } : {
      widgetType: 'card',
      widgetSubType: 'eventHubCard',
      widgetHostClass: 'mb-2',
      widgetData: {},
    }
    ))
  }
  private transformSkeletonToWidgets(
    strip: any
  ) {
    return [1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10].map(_content => ({
      widgetType: 'card',
      widgetSubType: strip.key.includes('events') || strip.key.includes('Events') ? 'eventHubCard' : 'cardContent',
      widgetHostClass: 'mb-2',
      widgetData: {
        cardSubType: strip.loaderConfig && strip.loaderConfig.cardSubType || 'card-standard-skeleton',
        cardCustomeClass: strip.customeClass ? strip.customeClass : '',
      },
    }))
  }

  private async processStrip(
    strip: NsContentStripWithTabs.IContentStripUnit,
    results: NsWidgetResolver.IRenderConfigWithAnyData[] = [],
    fetchStatus: TFetchStatus,
    calculateParentStatus = true,
    _viewMoreUrl: any,
    tabsResults?: NsContentStripWithTabs.IContentStripTab[] | undefined,
    // calculateParentStatus is used so that parents' status is not re-calculated if the API is called again coz of filters, etc.
  ) {
    const stripData = {
      viewMoreUrl: strip.viewMoreUrl,
      key: strip.key,
      canHideStrip: Boolean(strip.canHideStrip),
      showStrip: this.getIfStripHidden(strip.key),
      noDataWidget: strip.noDataWidget,
      errorWidget: strip.errorWidget,
      stripInfo: strip.info,
      stripTitle: strip.title,
      stripTitleLink: strip.stripTitleLink,
      disableTranslate: strip.disableTranslate,
      sliderConfig: strip.sliderConfig,
      tabs: tabsResults ? tabsResults : strip.tabs,
      stripName: strip.name,
      mode: strip.mode,
      stripConfig: strip.stripConfig,
      stripBackground: strip.stripBackground,
      secondaryHeading: strip.secondaryHeading,
      loaderWidgets: strip.loaderWidgets || [],
      widgets:
        fetchStatus === 'done'
          ? [
            ...(strip.preWidgets || []).map(w => ({
              ...w,
              widgetHostClass: `mb-2 ${w.widgetHostClass}`,
            })),
            ...results,
            ...(strip.postWidgets || []).map(w => ({
              ...w,
              widgetHostClass: `mb-2 ${w.widgetHostClass}`,
            })),
          ]
          : [],
      showOnNoData: Boolean(
        strip.noDataWidget &&
        !((strip.preWidgets || []).length + results.length + (strip.postWidgets || []).length) &&
        fetchStatus === 'done',
      ),
      showOnLoader: Boolean(strip.loader && fetchStatus === 'fetching'),
      showOnError: Boolean(strip.errorWidget && fetchStatus === 'error'),
    }
    // const stripData = this.stripsResultDataMap[strip.key]
    this.stripsResultDataMap = {
      ...this.stripsResultDataMap,
      [strip.key]: stripData,
    }
    if (!tabsResults) {
      if (
        calculateParentStatus &&
        (fetchStatus === 'done' || fetchStatus === 'error') &&
        stripData.widgets
      ) {
        this.checkParentStatus(fetchStatus, stripData.widgets.length)
      }
      if (calculateParentStatus && !(results && results.length > 0)) {
        this.contentAvailable = false
      } else if (results && results.length > 0) {
        this.contentAvailable = true
      }
    } else {
      this.contentAvailable = true
    }
  }
  private checkParentStatus(fetchStatus: TFetchStatus, stripWidgetsCount: number): void {
    if (fetchStatus === 'done' && !stripWidgetsCount) {
      this.noDataCount += 1
    } else if (fetchStatus === 'done' && stripWidgetsCount) {
      this.successDataCount += 1
    } else if (fetchStatus === 'error') {
      this.errorDataCount += 1
    }
    const settledCount = this.noDataCount + this.successDataCount + this.errorDataCount
    const totalCount = this.widgetData.strips.length
    if (this.successDataCount > 0 && settledCount < totalCount) {
      return
    }
    this.showParentLoader = settledCount !== totalCount
    this.showParentNoData =
      this.noDataCount > 0 && this.noDataCount + this.errorDataCount === totalCount
    this.showParentError = this.errorDataCount === totalCount
  }
  checkForEmptyWidget(strip: NsContentStripWithTabs.IContentStripUnit): boolean {
    if (
      strip.request &&
      ((strip.request.api && Object.keys(strip.request.api).length) ||
        (strip.request.search && Object.keys(strip.request.search).length) ||
        (strip.request.searchRegionRecommendation &&
          Object.keys(strip.request.searchRegionRecommendation).length) ||
        (strip.request.searchV6 && Object.keys(strip.request.searchV6).length) ||
        (strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) ||
        (strip.request.cbpList && Object.keys(strip.request.cbpList).length) ||
        (strip.request.trendingSearch && Object.keys(strip.request.trendingSearch).length)
      )
    ) {
      return true
    }
    return false
  }
  public tabClicked(tabEvent: MatTabChangeEvent, stripMap: IStripUnitContentData, stripKey: string) {
    const tabLabel = tabEvent.tab.textLabel.trim().toLowerCase()

    if (tabLabel && stripMap && stripMap.stripTitle) {
      const data: WsEvents.ITelemetryTabData = {
        label: `${tabEvent.tab.textLabel}`,
        index: tabEvent.index,
      }
      this.eventSvc.raiseInteractTelemetry(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          subType: stripMap.stripTitle,
          id: `${_.camelCase(data.label)}-tab`,
        },
        {},
        {
          module: WsEvents.EnumTelemetrymodules.HOME,
        }
      )
   }
    if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
      stripMap.tabs[tabEvent.index].fetchTabStatus = 'inprogress'
      stripMap.tabs[tabEvent.index]['tabLoading'] = true
      stripMap.showOnLoader = true
    }

    const currentTabFromMap: any = stripMap.tabs && stripMap.tabs[tabEvent.index]
    const currentStrip = this.widgetData.strips.find(s => s.key === stripKey)
    if (this.stripsResultDataMap[stripKey] && currentTabFromMap) {
      this.stripsResultDataMap[stripKey].viewMoreUrl.queryParams = {
        ...this.stripsResultDataMap[stripKey].viewMoreUrl.queryParams,
        tabSelected: currentTabFromMap.label,
      }
    }
    if (currentStrip && currentTabFromMap && !currentTabFromMap.computeDataOnClick) {
      if (currentTabFromMap.requestRequired && currentTabFromMap.request) {
        // call API to get tab data and process
        // this.processStrip(currentStrip, [], 'fetching', true, null)
        if (currentTabFromMap.request.searchV6) {
          this.getTabDataByNewReqSearchV6(currentStrip, tabEvent.index, currentTabFromMap, true)
        } else if (currentTabFromMap.request.trendingSearch) {
          this.getTabDataByNewReqTrending(currentStrip, tabEvent.index, currentTabFromMap, true)
        }
        if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
          stripMap.tabs[tabEvent.index]['tabLoading'] = false
        }
      } else {
        this.getTabDataByfilter(currentStrip, currentTabFromMap, true)
        setTimeout(() => {
          if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
              stripMap.tabs[tabEvent.index]['tabLoading'] = false
              stripMap.tabs[tabEvent.index].fetchTabStatus = 'done'
              stripMap.showOnLoader = false
          }
        },         200)
      }
    }
  }

  async getTabDataByNewReqSearchV6(
    strip: NsContentStripWithTabs.IContentStripUnit,
    tabIndex: number,
    currentTab: NsContentStripWithTabs.IContentStripTab,
    calculateParentStatus: boolean
  ) {
    try {
      const response = await this.searchV6Request(strip, currentTab.request, calculateParentStatus)
      if (response && response.results) {
        const widgets = this.transformContentsToWidgets(response.results.result.content, strip)
        let tabResults: any[] = []
        if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
          const allTabs = this.stripsResultDataMap[strip.key].tabs
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
              fetchTabStatus: 'done',
            }
            tabResults = allTabs
          }
        }
        this.processStrip(
          strip,
          widgets,
          'done',
          calculateParentStatus,
          response.viewMoreUrl,
          tabResults // tabResults as widgets
        )
      } else {
        this.processStrip(strip, [], 'error', calculateParentStatus, null)
      }
    } catch (error) {
      // Handle errors
      // console.error('Error:', error);
    }
  }

  async getTabDataByNewReqTrending(
    strip: NsContentStripWithTabs.IContentStripUnit,
    tabIndex: number,
    currentTab: NsContentStripWithTabs.IContentStripTab,
    calculateParentStatus: boolean
  ) {
    try {
      const response = await this.trendingSearchRequest(strip, currentTab.request, calculateParentStatus)
      if (response && response.results && response.results.response) {
        const content = response.results.response[currentTab.value] || []
        const widgets = this.transformContentsToWidgets(content, strip)
        // console.log('currentTab --- widgets', widgets)
        let tabResults: any[] = []
        if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
          const allTabs = this.stripsResultDataMap[strip.key].tabs
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
              fetchTabStatus: 'done',
            }
            tabResults = allTabs
          }
        }
        // console.log('tabResults -++++***--', tabResults)
        // console.log('calling  after-- ')
        this.processStrip(
          strip,
          widgets,
          'done',
          calculateParentStatus,
          response.viewMoreUrl,
          tabResults // tabResults as widgets
        )
      } else {
        this.processStrip(strip, [], 'done', calculateParentStatus, null)
      }
    } catch (error) {
      // Handle errors
      this.processStrip(strip, [], 'error', calculateParentStatus, null)
    }
  }

  getTabDataByfilter(
    strip: NsContentStripWithTabs.IContentStripUnit,
    currentTab: NsContentStripWithTabs.IContentStripTab,
    calculateParentStatus: boolean
  ) {
    // tslint:disable:no-console
    console.log('strip -- ', strip)
    // tslint:disable:no-console
    console.log('currentTab -- ', currentTab)
    // tslint:disable:no-console
    console.log('calculateParentStatus-- ', calculateParentStatus)
    // TODO: Write logic for individual filter if passed in config
    // add switch case based on config key passed
  }

  async fetchAllCbpPlans(strip: any, calculateParentStatus = true) {

    if (strip.request && strip.request.cbpList && Object.keys(strip.request.cbpList).length) {

      let courses: NsContent.IContent[]
      let tabResults: any[] = []
      const userId: any = this.configSvc.userProfile && this.configSvc.userProfile.userId
      const response = await this.userSvc.fetchCbpPlanList(userId).toPromise()
      if (response) {
            courses = response
            if (strip.tabs && strip.tabs.length) {
              tabResults = this.splitCbpTabsData(courses, strip)
              await this.processStrip(
                strip,
                this.transformContentsToWidgets(courses, strip),
                'done',
                calculateParentStatus,
                '',
                tabResults
              )
            } else {
              this.processStrip(
                strip,
                this.transformContentsToWidgets(courses, strip),
                'done',
                calculateParentStatus,
                'viewMoreUrl',
              )
            }
      }
      // this.userSvc.fetchCbpPlanList().subscribe( async  (res: any) => {
      //   if (res) {
      //     console.log(res,'===============================>')
      //     courses = res
      //     if (strip.tabs && strip.tabs.length) {
      //       tabResults = this.splitCbpTabsData(courses, strip)
      //       await this.processStrip(
      //         strip,
      //         this.transformContentsToWidgets(courses, strip),
      //         'done',
      //         calculateParentStatus,
      //         '',
      //         tabResults
      //       )
      //     } else {
      //       this.processStrip(
      //         strip,
      //         this.transformContentsToWidgets(courses, strip),
      //         'done',
      //         calculateParentStatus,
      //         'viewMoreUrl',
      //       )
      //     }
      //   }
      // },                                        (_err: any) => {

      // })

      clearInterval(this.enrollInterval)
    }
  }
  splitCbpTabsData(contentNew: NsContent.IContent[], strip: NsContentStripWithTabs.IContentStripUnit) {
    const tabResults: any[] = []
    const splitData = this.getTabsList(
      contentNew,
      strip,
    )
    if (strip.tabs && strip.tabs.length) {
      for (let i = 0; i < strip.tabs.length; i += 1) {
        if (strip.tabs[i]) {
          tabResults.push(
            {
              ...strip.tabs[i],
              fetchTabStatus: 'done',
              ...(splitData.find(itmInner => {
                if (strip.tabs && strip.tabs[i] && itmInner.value === strip.tabs[i].value) {
                  return itmInner
                }
                return undefined
              })),
            }
          )
        }
      }
    }
    return tabResults
  }

  getTabsList(array: NsContent.IContent[],
              strip: NsContentStripWithTabs.IContentStripUnit) {
    let all: any[] = []
    let upcoming: any[] = []
    let overdue: any[] = []
    array.forEach((e: any) => {
      all.push(e)
      if (e.planDuration === NsCardContent.ACBPConst.OVERDUE) {
        overdue.push(e)
      } else if (e.planDuration === NsCardContent.ACBPConst.UPCOMING || e.planDuration === NsCardContent.ACBPConst.SUCCESS) {
        upcoming.push(e)
      }
    })
    const allCompleted = all.filter((allData: any) => allData.contentStatus === 2)
    let allInCompleted = all.filter((allData: any) => allData.contentStatus < 2)

    let allCompletedOverDue = allCompleted.filter((allData: any) => allData.planDuration === NsCardContent.ACBPConst.OVERDUE)
    const allCompletedAll = allCompleted.filter((allData: any) =>  allData.planDuration !== NsCardContent.ACBPConst.OVERDUE)

    allCompletedOverDue = allCompletedOverDue.sort((a: any, b: any): any => {
      if (a.planDuration === NsCardContent.ACBPConst.OVERDUE && b.planDuration === NsCardContent.ACBPConst.OVERDUE) {
        const firstDate: any = new Date(a.endDate)
        const secondDate: any = new Date(b.endDate)
        return  firstDate > secondDate  ? -1 : 1
      }
    })

    allInCompleted = allInCompleted.sort((a: any, b: any): any => {
      if (a.planDuration === NsCardContent.ACBPConst.OVERDUE && b.planDuration === NsCardContent.ACBPConst.OVERDUE) {
        const firstDate: any = new Date(a.endDate)
        const secondDate: any = new Date(b.endDate)
        return  firstDate > secondDate  ? -1 : 1
      }
    })

    all = [...allInCompleted, ...allCompletedAll, ...allCompletedOverDue]

    overdue = overdue.filter((data: any): any => {
      return data.contentStatus < 2
    })

    overdue = overdue.sort((a: any, b: any): any => {
        const firstDate: any = new Date(a.endDate)
        const secondDate: any = new Date(b.endDate)
        return  firstDate > secondDate  ? -1 : 1
    })

    upcoming = upcoming.filter((data: any): any => {
      return data.contentStatus < 2
    })
    // this.getSelectedIndex(1)
    return [
      { value: 'upcoming', widgets: this.transformContentsToWidgets(upcoming, strip) },
      { value: 'overdue', widgets: this.transformContentsToWidgets(overdue, strip) },
      { value: 'completed', widgets: this.transformContentsToWidgets(allCompleted, strip) },
      { value: 'all', widgets: this.transformContentsToWidgets(all, strip) }]
  }

  getSelectedIndex(stripsResultDataMap: any, key: any): number {
    let returnValue = 0
    if (key === 'cbpPlan') {
      if (stripsResultDataMap.tabs.length) {
        // const data = stripsResultDataMap.tabs.filter((ele: any) => ele.value === 'upcoming')
        // returnValue = data[0].widgets && data[0].widgets.length > 0 ? 1 : 0
        const data = stripsResultDataMap.tabs.filter((ele: any) => ele.value === 'upcoming' || ele.value === 'overdue')
        returnValue = (data && data[0].widgets && data[0].widgets.length > 0) ? 0 :
        (data && data[1].widgets && data[1].widgets.length > 0) ? 1 : 2
      }
    }
    return returnValue
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  setActiveTabData(tabData: any) {
    this.activeTabData = tabData
  }

}
