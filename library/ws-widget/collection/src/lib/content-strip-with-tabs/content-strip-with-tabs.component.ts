import { Component, OnInit, Input, OnDestroy, HostBinding } from '@angular/core'
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
} from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
import { WidgetUserService } from '../_services/widget-user.service'
import { environment } from 'src/environments/environment'
// tslint:disable-next-line
import _ from 'lodash'
import { MatTabChangeEvent } from '@angular/material'

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
    showDots: boolean
  },
  tabs?: NsContentStripWithTabs.IcontentStripTab[] | undefined,
  stripName?: string
  stripLogo?: string
  description?: string
  stripInfo?: NsContentStripWithTabs.IStripInfo
  noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  showOnNoData: boolean
  showOnLoader: boolean
  showOnError: boolean
  stripBackground?: string
  viewMoreUrl: {
    path: string
    queryParams: any
  } | null
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

  constructor(
    // private contentStripSvc: ContentStripNewMultipleService,
    private contentSvc: WidgetContentService,
    private loggerSvc: LoggerService,
    private eventSvc: EventService,
    private configSvc: ConfigurationsService,
    public utilitySvc: UtilityService,
    // private http: HttpClient,
    // private searchServSvc: SearchServService,
    private userSvc: WidgetUserService,
  ) {
    super()
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
    this.stripsKeyOrder = this.widgetData.strips.map(strip => strip.key) || []
    if (this.widgetData.loader && this.widgetData.strips.length) {
      this.showParentLoader = true
    }
    // Fetch the data
    for (const strip of this.widgetData.strips) {
      console.log('strip', strip)
      if (this.checkForEmptyWidget(strip)) {
        this.fetchStripFromRequestData(strip)
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
    if (data && data.key === this.environment.programStripKey &&
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
    return wData.strips[0].viewMoreUrl && data.widgets && data.widgets.length >= 4
  }
  checkVisible(data: IStripUnitContentData) {
    return data.stripInfo && data.stripInfo.visibilityMode === 'visible'
  }

  getContineuLearningLenth(data: IStripUnitContentData) {
    return data.widgets ? data.widgets.length : 0
  }
  getLength(data: IStripUnitContentData) {
    return data.widgets ? data.widgets.length : 0
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
    if (filters && filters.hasOwnProperty('batches.endDate')) {
      // tslint:disable-next-line
      filters['batches.endDate']['>='] = eval(filters['batches.endDate']['>='])
    } else if (filters && filters.hasOwnProperty('batches.enrollmentEndDate')) {
      // tslint:disable-next-line
      filters['batches.enrollmentEndDate']['>='] = eval(filters['batches.enrollmentEndDate']['>='])
    }
    return filters
  }

  private fetchStripFromRequestData(
    strip: NsContentStripWithTabs.IContentStripUnit,
    calculateParentStatus = true,
  ) {
    // setting initial values
    this.processStrip(strip, [], 'fetching', false, null)
    this.fetchFromEnrollmentList(strip, calculateParentStatus)
    this.fetchFromSearchV6(strip, calculateParentStatus)
  }

  fetchFromEnrollmentList(strip: NsContentStripWithTabs.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) {
      let userId = ''
      let content: NsContent.IContent[]
      let contentNew: NsContent.IContent[]
      let tabResults: any[] = []
      const queryParams = _.get(strip.request.enrollmentList, 'queryParams')
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId
      }
      // tslint:disable-next-line: deprecation
      this.userSvc.fetchUserBatchList(userId, queryParams).subscribe(
        courses => {
          const showViewMore = Boolean(
            courses.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: '/app/search/learning',
              queryParams: {
                q: strip.request && strip.request.searchV6 && strip.request.searchV6.query,
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
            content = courses.map(c => {
              const contentTemp: NsContent.IContent = c.content
              contentTemp.completionPercentage = c.completionPercentage || c.progress || 0
              contentTemp.completionStatus = c.completionStatus || c.status || 0
              contentTemp.enrolledDate = c.enrolledDate || ''
              contentTemp.lastContentAccessTime = c.lastContentAccessTime || ''
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

          tabResults = this.splitEnrollmentTabsData(contentNew, strip)
          console.log('tabResults', tabResults)
          this.processStrip(
            strip,
            this.transformContentsToWidgets(contentNew, strip),
            'done',
            calculateParentStatus,
            viewMoreUrl,
            tabResults
          )
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
    );

    if (strip.tabs && strip.tabs.length) {
      for (let i = 0; i < strip.tabs.length; i++) {
        if (strip.tabs[i]) {
          tabResults.push(
            {
              ...strip.tabs[i],
              ...(splitData.find((itmInner) => {
                if (strip.tabs && strip.tabs[i] && itmInner.value === strip.tabs[i].value) {
                  return itmInner
                }
                return undefined
              }))
            }
          )
        }
      }
    }
    return tabResults
  }

  getInprogressAndCompleted(array: NsContent.IContent[], filter: any, strip: NsContentStripWithTabs.IContentStripUnit) {
    let inprogress: any[] = [], completed: any[] = [];
    array.forEach((e: any, idx: number, arr: any[]) => (filter(e, idx, arr) ? inprogress : completed).push(e));
    return [
      { value: 'inprogress', widgets: this.transformContentsToWidgets(inprogress, strip) },
      { value: 'completed', widgets: this.transformContentsToWidgets(completed, strip) }];
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
          console.log('inside erquest required')
          if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
            const allTabs = this.stripsResultDataMap[strip.key].tabs
            const currentTabFromMap = (allTabs && allTabs.length && allTabs[0]) as NsContentStripWithTabs.IcontentStripTab

            this.getTabDataByNewReq(strip, 0, currentTabFromMap, calculateParentStatus)
          }
        }

      } else {
        try {
          const response = await this.searchV6Request(strip, strip.request, calculateParentStatus)
          console.log('calling  after - response, ', response)
          if (response && response.results) {
            console.log('calling  after-- ')
            this.processStrip(
              strip,
              this.transformContentsToWidgets(response.results.result.content, strip),
              'done',
              calculateParentStatus,
              response.viewMoreUrl,
            )
          } else {
            this.processStrip(strip, [], 'error', calculateParentStatus, null)
          }
        } catch (error) {
          // Handle errors
          console.error('Error:', error);
        }
      }
    }
  }

  async searchV6Request(strip: NsContentStripWithTabs.IContentStripUnit,
    request: NsContentStripWithTabs.IContentStripUnit['request'],
    calculateParentStatus: boolean
  ): Promise<any> {
    let originalFilters: any = []
    console.log('calling -- ')
    return new Promise<any>((resolve, reject) => {
      if (request && request.searchV6) {
        this.contentSvc.searchV6(request.searchV6).subscribe(
          (results) => {
            const showViewMore = Boolean(
              results.result.content && results.result.content.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
            )
            const viewMoreUrl = showViewMore
              ? {
                path: '/app/globalsearch',
                queryParams: {
                  tab: 'Learn',
                  q: request && request.searchV6 && request.searchV6.request,
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
            console.log('returned results')
            resolve({ results, viewMoreUrl })
          },
          (error) => {
            this.processStrip(strip, [], 'error', calculateParentStatus, null)
            reject(error);
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
    return (contents || []).map((content, idx) => ({
      widgetType: 'card',
      widgetSubType: 'cardContent',
      widgetHostClass: 'mb-2',
      widgetData: {
        content,
        ...(content.batch && { batch: content.batch }),
        cardSubType: strip.stripConfig && strip.stripConfig.cardSubType,
        context: { pageSection: strip.key, position: idx },
        intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
        deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
        contentTags: strip.stripConfig && strip.stripConfig.contentTags,
      },
    }))
  }

  private async processStrip(
    strip: NsContentStripWithTabs.IContentStripUnit,
    results: NsWidgetResolver.IRenderConfigWithAnyData[] = [],
    fetchStatus: TFetchStatus,
    calculateParentStatus = true,
    viewMoreUrl: any,
    tabsResults?: any,
    // calculateParentStatus is used so that parents' status is not re-calculated if the API is called again coz of filters, etc.
  ) {
    const stripData = {
      viewMoreUrl,
      key: strip.key,
      canHideStrip: Boolean(strip.canHideStrip),
      showStrip: this.getIfStripHidden(strip.key),
      noDataWidget: strip.noDataWidget,
      errorWidget: strip.errorWidget,
      stripInfo: strip.info,
      stripTitle: strip.title,
      stripTitleLink: strip.stripTitleLink,
      sliderConfig: strip.sliderConfig,
      tabs: tabsResults ? tabsResults : strip.tabs,
      stripName: strip.name,
      mode: strip.mode,
      stripBackground: strip.stripBackground,
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
        (strip.request.ids && Object.keys(strip.request.ids).length) ||
        (strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) ||
        (strip.request.recommendedCourses && Object.keys(strip.request.recommendedCourses).length)
      )
    ) {
      return true
    }
    return false
  }

  public tabClicked(tabEvent: MatTabChangeEvent, stripMap: IStripUnitContentData, stripKey: string) {
    const data: WsEvents.ITelemetryTabData = {
      label: `${tabEvent.tab.textLabel}`,
      index: tabEvent.index,
    }
    this.eventSvc.handleTabTelemetry(
      WsEvents.EnumInteractSubTypes.HOME_PAGE_STRIP_TABS,
      data,
    )
    const currentTabFromMap = stripMap.tabs && stripMap.tabs[tabEvent.index]
    const currentStrip = this.widgetData.strips.find(s => s.key === stripKey)
    if (currentStrip && currentTabFromMap && !currentTabFromMap.computeDataOnClick) {
      if (currentTabFromMap.requestRequired && currentTabFromMap.request) {
        // call API to get tab data and process
        this.getTabDataByNewReq(currentStrip, tabEvent.index, currentTabFromMap, true)
      } else {
        this.getTabDataByfilter(currentStrip, currentTabFromMap, true)
      }
    }
    console.log('-----------------------------tabClicked tabEvent', tabEvent, stripMap.tabs)
  }

  async getTabDataByNewReq(
    strip: NsContentStripWithTabs.IContentStripUnit,
    tabIndex: number,
    currentTab: NsContentStripWithTabs.IcontentStripTab,
    calculateParentStatus: boolean
  ) {
    console.log('currentTab ---', currentTab)
    try {
      const response = await this.searchV6Request(strip, currentTab.request, calculateParentStatus)
      console.log('currentTab ---response', response)
      if (response && response.results) {
        const widgets = this.transformContentsToWidgets(response.results.result.content, strip)
        console.log('currentTab --- widgets', widgets)
        let tabResults: any[] = []
        if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
          const allTabs = this.stripsResultDataMap[strip.key].tabs
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets: widgets,
            }
            tabResults = allTabs
          }
        }
        console.log('tabResults -++++***--', tabResults)
        console.log('calling  after-- ')
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
      console.error('Error:', error);
    }
  }

  getTabDataByfilter(
    strip: NsContentStripWithTabs.IContentStripUnit,
    currentTab: NsContentStripWithTabs.IcontentStripTab,
    calculateParentStatus: boolean
  ) {
    console.log('strip -- ', strip)
    console.log('currentTab -- ', currentTab)
    console.log('calculateParentStatus-- ', calculateParentStatus)
    // TODO: Write logic for individual filter if passed in config 
    // add switch case based on config key passed
  }
}
