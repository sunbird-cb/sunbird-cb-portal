import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core'
import {
  ActivatedRoute,
  Router,
} from '@angular/router'
// tslint:disable-next-line
import * as _ from 'lodash'
import { ConfigurationsService, EventService, MultilingualTranslationsService, WsEvents, NsContent } from '@sunbird-cb/utils-v2'
import { SeeAllService } from '../../services/see-all.service'
import { MatTabChangeEvent } from '@angular/material'
import { NsContentStripWithTabs } from '@sunbird-cb/collection/src/lib/content-strip-with-tabs/content-strip-with-tabs.model'
import { WidgetContentLibService, WidgetUserServiceLib } from '@sunbird-cb/consumption'

@Component({
  selector: 'ws-app-see-all-home',
  templateUrl: './see-all-home.component.html',
  styleUrls: ['./see-all-home.component.scss'],
})
export class SeeAllHomeComponent implements OnInit, OnDestroy {

  seeAllPageConfig: any
  keyData: any
  contentDataList: any = []
  throttle = 100
  scrollDistance = 0.2
  offsetForPage = 0
  totalCount = 0
  page = 1
  totalPages = 0
  tabResults: any[] = []
  tabSelected: any
  dynamicTabIndex = 0
  isCoisContent = false

  constructor(
    private activated: ActivatedRoute,
    private router: Router,
    private seeAllSvc: SeeAllService,
    private configSvc: ConfigurationsService,
    private userSvc: WidgetUserServiceLib,
    private eventSvc: EventService,
    private langtranslations: MultilingualTranslationsService,
    public consumWidgetSvc: WidgetContentLibService,
  ) {

  }

  async ngOnInit() {
    this.activated.queryParams.subscribe((res: any) => {
      this.keyData = (res.key) ? res.key : ''
      this.tabSelected = (res.tabSelected) ? res.tabSelected : ''
    })
    const configData = await this.seeAllSvc.getSeeAllConfigJson().catch(_error => {})
    configData.homeStrips.forEach((ele: any) => {
      if (ele && ele.strips.length > 0) {
        ele.strips.forEach((subEle: any) => {
          if (subEle.key === this.keyData) {
            this.seeAllPageConfig = subEle
          }
        })
      }
    })
    if (!this.seeAllPageConfig) {
      if (configData) {
        configData.assessmentData.forEach((ele: any) => {
          if (ele && ele.strips && ele.strips.length > 0) {
            ele.strips.forEach((subEle: any) => {
              if (subEle.key === this.keyData) {
                this.seeAllPageConfig = subEle
              }
            })
          }
        })
      }
    }
    if (
      this.tabSelected &&
      this.seeAllPageConfig.tabs &&
      this.seeAllPageConfig.tabs.length
      ) {
        this.tabResults = this.seeAllPageConfig.tabs
        this.dynamicTabIndex = _.findIndex(this.tabResults, (v: any) => v.label === this.tabSelected)
      }
    this.contentDataList = this.transformSkeletonToWidgets(this.seeAllPageConfig)
    if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.searchV6) {
      this.fetchFromSearchV6(this.seeAllPageConfig)
      this.seeAllPageConfig.request.searchV6.request.filters =
      this.checkForDateFilters(this.seeAllPageConfig.request.searchV6.request.filters)
    } else if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.trendingSearch) {
      this.fetchFromTrendingContent(this.seeAllPageConfig)
    } else if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.enrollmentList) {
      this.fetchFromEnrollmentList(this.seeAllPageConfig)
    } else if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.ciosContent) {
      this.isCoisContent = true
      this.fetchCiosContentData(this.seeAllPageConfig)
    }
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

  private transformSkeletonToWidgets(
    strip: any
  ) {
    return [1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10].map(_content => ({
      widgetType: 'card',
      widgetSubType: 'cardContent',
      widgetHostClass: 'mb-2',
      widgetData: {
        cardSubType: strip.viewMoreUrl &&  strip.viewMoreUrl.loaderConfig
        && strip.viewMoreUrl.loaderConfig.cardSubType || 'card-portrait-skeleton',
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
        content,
        ...(content.batch && {
          batch: content.batch,
        }),
        cardSubType: strip.viewMoreUrl &&  strip.viewMoreUrl.stripConfig
        && strip.viewMoreUrl.stripConfig.cardSubType,
        context: {
          pageSection: strip.key,
          position: idx,
        },
        intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
        deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
        contentTags: strip.stripConfig && strip.stripConfig.contentTags,
      },
    }))
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

  getInprogressAndCompleted(array: NsContent.IContent[],
                            customFilter: any,
                            strip: NsContentStripWithTabs.IContentStripUnit) {
    const inprogress: any[] = []
    const completed: any[] = []
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
    // Sort the completed array with 'live' status first and 'Retired' status second
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

  public tabClicked(tabEvent: MatTabChangeEvent, stripMap: any) {
    const data: WsEvents.ITelemetryTabData = {
      label: `${tabEvent.tab.textLabel}`,
      index: tabEvent.index,
    }
    this.eventSvc.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.HOME_PAGE_STRIP_TABS,
        id: `${_.camelCase(data.label)}-tab`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
    const currentTabFromMap = stripMap.tabs && stripMap.tabs[tabEvent.index]
    const currentStrip = stripMap
    if (currentStrip && currentTabFromMap && !currentTabFromMap.computeDataOnClick) {
      if (currentTabFromMap.requestRequired && currentTabFromMap.request) {
        // call API to get tab data and process
        if (currentTabFromMap.request.searchV6) {
          this.getTabDataByNewReqSearchV6(currentStrip, tabEvent.index, currentTabFromMap, true)
        } else if (currentTabFromMap.request.trendingSearch) {
          this.getTabDataByNewReqTrending(currentStrip, tabEvent.index, currentTabFromMap, true)
        }
      }
    }
  }

  fetchFromEnrollmentList(strip: NsContentStripWithTabs.IContentStripUnit, _calculateParentStatus = true) {
    if (strip.request && strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) {
      let userId = ''
      let content: NsContent.IContent[]
      let contentNew: NsContent.IContent[]
      this.tabResults = []
      const queryParams = _.get(strip.request.enrollmentList, 'queryParams')
      // if (queryParams && queryParams.batchDetails) {
      //   if (!queryParams.batchDetails.includes('&retiredCoursesEnabled=true')) {
      //     queryParams.batchDetails += '&retiredCoursesEnabled=true'
      //   }
      // }
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId
      }
      // tslint:disable-next-line: deprecation
      // this.userSvc.resetTime('enrollmentService')
      this.userSvc.fetchUserBatchList(userId, queryParams).subscribe(
        (result: any) => {
          const courses = result && result.courses
          if (courses && courses.length) {
            content = courses.map((c: any) => {
              const contentTemp: NsContent.IContent = c.content
              contentTemp.completionPercentage = c.completionPercentage || c.progress || 0
              contentTemp.completionStatus = c.completionStatus || c.status || 0
              contentTemp.enrolledDate = c.enrolledDate || ''
              contentTemp.lastContentAccessTime = c.lastContentAccessTime || ''
              contentTemp.issuedCertificates = c.issuedCertificates || []
              return contentTemp
            })
          }

          // To sort in descending order of the enrolled date
          contentNew = (content || []).sort((a: any, b: any) => {
            const dateA: any = new Date(a.lastContentAccessTime || 0)
            const dateB: any = new Date(b.lastContentAccessTime || 0)
            return dateB - dateA
          })
          if (strip.tabs && strip.tabs.length) {
            this.tabResults = this.splitEnrollmentTabsData(contentNew, strip)
            this.dynamicTabIndex = _.findIndex(this.tabResults, (v: any) => v.label === this.tabSelected)
          } else {
          }
        },
        () => {
        }
      )
    }
  }

  async fetchCiosContentData(strip: any, calculateParentStatus = true) {
    if (strip.request && strip.request.ciosContent && Object.keys(strip.request.ciosContent).length) {
      // let originalFilters: any = [];
      // if (strip.request &&
      //   strip.request.ciosContent &&
      //   strip.request.ciosContent.filterCriteriaMap) {
      //   originalFilters = strip.request.ciosContent.filterCriteriaMap;
      //   strip.request.ciosContent.filterCriteriaMap = this.postMethodFilters(strip.request.ciosContent.filterCriteriaMap);
      // }
      try {
        const response = await this.postRequestMethod(strip, strip.request.ciosContent, strip.request.apiUrl, calculateParentStatus)
        if (response && response.results) {
          if (response.results.data && response.results.data.length) {
            this.contentDataList = this.transformContentsToWidgets(response.results.data, strip)
          }
        }
      } catch (error) {
        // this.emptyResponse.emit(true)
        // Handle errors
        // console.error('Error:', error);
      }
    }
  }

  async fetchFromSearchV6(strip: any, calculateParentStatus = true) {
    if (strip.request && strip.request.searchV6 && Object.keys(strip.request.searchV6).length) {
      // let originalFilters: any = []
      if (strip.request &&
        strip.request.searchV6 &&
        strip.request.searchV6.request &&
        strip.request.searchV6.request.filters) {
        // originalFilters = strip.request.searchV6.request.filters
        // strip.request.searchV6.request.filters = this.checkForDateFilters(strip.request.searchV6.request.filters)
        strip.request.searchV6.request.filters = this.getFiltersFromArray(
          strip.request.searchV6.request.filters,
        )
        strip.request.searchV6.request.offset = this.offsetForPage
      }
      if (strip.tabs && strip.tabs.length) {
        const firstTab = strip.tabs[this.dynamicTabIndex]
        if (firstTab.requestRequired) {
          if (this.seeAllPageConfig.tabs) {
            const allTabs = this.seeAllPageConfig.tabs
            const currentTabFromMap = (allTabs && allTabs.length &&
               allTabs[this.dynamicTabIndex]) as NsContentStripWithTabs.IContentStripTab
            this.getTabDataByNewReqSearchV6(strip, this.dynamicTabIndex,
                                            currentTabFromMap, calculateParentStatus)
          }
        }

      } else {
      try {
        const response = await this.searchV6Request(strip, strip.request, calculateParentStatus)
        if (response && response.results) {
          if (this.contentDataList[0].widgetData.content) {
            this.contentDataList =
            _.concat(this.contentDataList, this.transformContentsToWidgets(response.results.result.content, strip))
          } else {
            this.contentDataList = this.transformContentsToWidgets(response.results.result.content, strip)
          }
          this.totalCount = response.results.result.count
          this.totalPages = Math.ceil(response.results.result.count / strip.request.searchV6.request.limit)
        }
      } catch (error) {}
      }
    }
  }

  async searchV6Request(strip: NsContentStripWithTabs.IContentStripUnit,
                        request: NsContentStripWithTabs.IContentStripUnit['request'],
                        _calculateParentStatus: boolean
  ): Promise <any> {
    const originalFilters: any = []
    // console.log('calling -- ')
    return new Promise <any>((resolve, reject) => {
      if (request && request.searchV6) {
        this.seeAllSvc.searchV6(request.searchV6).subscribe(results => {
          const showViewMore = Boolean(
            results.result.content && results.result.content.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore ?
            {
              path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
              queryParams: {
                tab: 'Learn',
                q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
                f: request &&
                  request.searchV6 &&
                  request.searchV6.request &&
                  request.searchV6.request.filters ?
                  JSON.stringify(
                    this.transformSearchV6FiltersV2(
                      originalFilters,
                    )
                  ) :
                  {},
              },
            } :
            null
          resolve({
            results,
            viewMoreUrl,
          })
        },                                                  (error: any) => {
          reject(error)
        })
      }
    })
  }

  async fetchFromTrendingContent(strip: NsContentStripWithTabs.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.trendingSearch && Object.keys(strip.request.trendingSearch).length) {
      // let originalFilters: any = []
      if (strip.request &&
        strip.request.trendingSearch &&
        strip.request.trendingSearch.request &&
        strip.request.trendingSearch.request.filters) {
        // originalFilters = strip.request.trendingSearch.request.filters
        strip.request.trendingSearch.request.filters = this.checkForDateFilters(strip.request.trendingSearch.request.filters)
        strip.request.trendingSearch.request.filters = this.getFiltersFromArray(
          strip.request.trendingSearch.request.filters,
        )
      }
      if (strip.tabs && strip.tabs.length) {
        // TODO: Have to extract requestRequired to outer level of tabs config
        const firstTab = strip.tabs[this.dynamicTabIndex]
        if (firstTab.requestRequired) {
          if (this.seeAllPageConfig.tabs) {
            const allTabs = this.seeAllPageConfig.tabs
            const currentTabFromMap = (allTabs && allTabs.length &&
               allTabs[this.dynamicTabIndex]) as NsContentStripWithTabs.IContentStripTab
            this.getTabDataByNewReqTrending(strip, this.dynamicTabIndex, currentTabFromMap,
                                            calculateParentStatus)
          }
        }

      } else {
      try {
        const response = await this.trendingSearchRequest(strip, strip.request, calculateParentStatus)
        if (response && response.results && response.results.response) {
          // if (this.contentDataList[0].widgetData.content) {
          //   this.contentDataList =
          //   _.concat(this.contentDataList, this.transformContentsToWidgets(response.results.result.content, strip))
          // }else {
          //   this.contentDataList = this.transformContentsToWidgets(response.results.result.content, strip)
          // }
          // this.totalCount = response.results.result.count
          // this.totalPages = Math.ceil(response.results.result.count / this.pagelimit)
          const content = response.results.response[strip.request.trendingSearch.responseKey] || []
          this.contentDataList = this.transformContentsToWidgets(content, strip)
        }
      } catch (error) {}
      }
    }
  }

  async trendingSearchRequest(strip: NsContentStripWithTabs.IContentStripUnit,
                              request: NsContentStripWithTabs.IContentStripUnit['request'],
                              _calculateParentStatus: boolean
  ): Promise <any> {
    const originalFilters: any = []
    return new Promise <any>((resolve, reject) => {
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
        request.trendingSearch['request']['limit'] = 50
        this.seeAllSvc.trendingContentSearch(request.trendingSearch).subscribe(results => {
          const showViewMore = Boolean(
            results.result &&
            strip.request &&
            results.result[strip.request.trendingSearch.responseKey] &&
            results.result[strip.request.trendingSearch.responseKey].length > 5 &&
            strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore ?
            {
              path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
              queryParams: {
                tab: 'Learn',
                q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
                f: request &&
                  request.trendingSearch &&
                  request.trendingSearch.request &&
                  request.trendingSearch.request.filters ?
                  JSON.stringify(
                    this.transformSearchV6FiltersV2(
                      originalFilters,
                    )
                  ) :
                  {},
              },
            } :
            null
          resolve({
            results,
            viewMoreUrl,
          })
        },                                                                     (error: any) => {
          if (error.error && error.error.status === 400) {
          }
          reject(error)
        })
      }
    })
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
        this.tabResults = []
        if (this.seeAllPageConfig.tabs) {
          const allTabs = this.seeAllPageConfig.tabs
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
            }
            this.tabResults = allTabs
          }
        }
      } else {
      }
    } catch (error) {
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
        this.tabResults = []
        if (this.seeAllPageConfig.tabs) {
          const allTabs = this.seeAllPageConfig.tabs
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
            }
            this.tabResults = allTabs
          }
        }
      }
    } catch (error) {
    }
  }

  onScrollEnd() {
    this.page += 1
    if (this.page <= this.totalPages) {
      if (this.contentDataList[0].widgetData.content) {
        if (this.seeAllPageConfig.request.searchV6) {
          this.offsetForPage = this.seeAllPageConfig.request.searchV6.request.limit + this.offsetForPage
          this.fetchFromSearchV6(this.seeAllPageConfig)
        }
      }
    }
  }

  ngOnDestroy() {}

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label.toLowerCase(), type, '')
  }
  async postRequestMethod(strip: NsContentStripWithTabs.IContentStripUnit,
                          request: NsContentStripWithTabs.IContentStripUnit['request'],
                          apiUrl: string,
                          _calculateParentStatus: boolean
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (request && request) {
        this.consumWidgetSvc.postApiMethod(apiUrl, request).subscribe(results => {
          if (results && results.data) {
            const showViewMore = Boolean(
              results.data && results.data.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
            )
            const viewMoreUrl = showViewMore ? {
              path: strip.viewMoreUrl && strip.viewMoreUrl.path || '',
              queryParams: {
                tab: 'Learn',
                q: strip.viewMoreUrl && strip.viewMoreUrl.queryParams,
                f: {},
              },
            }
              : null
            resolve({ results, viewMoreUrl })
          }
        },                                                            (error: any) => {
          // this.processStrip(strip, [], 'error', calculateParentStatus, null);
          reject(error)
        },
        )
      }
    })
  }

  takeExtClickAction(_item: any) {
    if (_item.externalId) {
      this.router.navigate(
        [`app/toc/ext/${_item.contentId}`])
    }
  }

}
