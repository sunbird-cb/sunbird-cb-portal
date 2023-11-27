import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core'
import {
  ActivatedRoute,
} from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash'
import {
  SeeAllService,
} from '../../services/see-all.service'
import {
  NsContentStripWithTabs,
} from '@sunbird-cb/collection/src/lib/content-strip-with-tabs/content-strip-with-tabs.model'
import {
  NsContent,
} from '@sunbird-cb/collection/src/lib/_services/widget-content.model'
import {
  ConfigurationsService, EventService, WsEvents
} from '@sunbird-cb/utils'
import { WidgetUserService } from '@sunbird-cb/collection/src/lib/_services/widget-user.service'
import { MatTabChangeEvent } from '@angular/material'

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

  constructor(
    private activated: ActivatedRoute,
    // private router: Router,
    private seeAllSvc: SeeAllService,
    private configSvc: ConfigurationsService,
    private userSvc: WidgetUserService,
    private eventSvc: EventService,
  ) {}

  async ngOnInit() {
    this.activated.queryParams.subscribe((res: any) => this.keyData = (res.key) ? res.key : '')
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
    this.contentDataList = this.transformSkeletonToWidgets(this.seeAllPageConfig)
    if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.searchV6) {
      this.fetchFromSearchV6(this.seeAllPageConfig)
      this.seeAllPageConfig.request.searchV6.request.filters = 
      this.checkForDateFilters(this.seeAllPageConfig.request.searchV6.request.filters)
    } else if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.trendingSearch) {
      this.fetchFromTrendingContent(this.seeAllPageConfig)
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
        cardSubType: strip.loaderConfig && strip.loaderConfig.cardSubType || 'card-portrait-skeleton',
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
        cardSubType: strip.stripConfig && strip.stripConfig.cardSubType,
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
    array.forEach((e: any, idx: number, arr: any[]) => (customFilter(e, idx, arr) ? inprogress : completed).push(e))
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

  public tabClicked(tabEvent: MatTabChangeEvent, stripMap: any, stripKey: string) {
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
        // this.processStrip(currentStrip, [], 'fetching', true, null)
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
      let tabResults: any[] = []
      const queryParams = _.get(strip.request.enrollmentList, 'queryParams')
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId
      }
      // tslint:disable-next-line: deprecation
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
            tabResults = this.splitEnrollmentTabsData(contentNew, strip)
            // this.processStrip(
            //   strip,
            //   this.transformContentsToWidgets(contentNew, strip),
            //   'done',
            //   calculateParentStatus,
            //   viewMoreUrl,
            //   tabResults
            // )
          } else {
            // this.processStrip(
            //   strip,
            //   this.transformContentsToWidgets(contentNew, strip),
            //   'done',
            //   calculateParentStatus,
            //   viewMoreUrl,
            // )
          }
        },
        () => {
          // this.processStrip(strip, [], 'error', calculateParentStatus, null)
        }
      )
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
      debugger
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
        if (response && response.results) {
          if (this.contentDataList[0].widgetData.content) {
            this.contentDataList = 
            _.concat(this.contentDataList, this.transformContentsToWidgets(response.results.result.content, strip))
          }else {
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
  ): Promise < any > {
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
          // if (viewMoreUrl && viewMoreUrl.queryParams) {
          //   viewMoreUrl.queryParams = viewMoreUrl.queryParams
          // }
          // console.log('returned results')
          resolve({
            results,
            viewMoreUrl,
          })
        },                                                  (error: any) => {
          // this.processStrip(strip, [], 'error', calculateParentStatus, null)
          reject(error)
        })
      }
    })
  }

  async fetchFromTrendingContent(strip: NsContentStripWithTabs.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.trendingSearch && Object.keys(strip.request.trendingSearch).length) {
      console.log('inside fetchFromTrendingContent if inside')
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
        const firstTab = strip.tabs[0]
        if (firstTab.requestRequired) {
          if (this.seeAllPageConfig.tabs) {
            const allTabs = this.seeAllPageConfig.tabs
            const currentTabFromMap = (allTabs && allTabs.length && allTabs[0]) as NsContentStripWithTabs.IContentStripTab

            this.getTabDataByNewReqTrending(strip, 0, currentTabFromMap, calculateParentStatus)
          }
        }

      } else {
      try {
        const response = await this.trendingSearchRequest(strip, strip.request, calculateParentStatus)
        console.log('calling  after - response, ', response)
        if (response && response.results && response.results.response) {
          // if (this.contentDataList[0].widgetData.content) {
          //   this.contentDataList = 
          //   _.concat(this.contentDataList, this.transformContentsToWidgets(response.results.result.content, strip))
          // }else {
          //   this.contentDataList = this.transformContentsToWidgets(response.results.result.content, strip)
          // }
          // this.totalCount = response.results.result.count
          // this.totalPages = Math.ceil(response.results.result.count / this.pagelimit)
          debugger
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
  ): Promise < any > {
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
            // this.processStrip(strip, [], 'done', calculateParentStatus, null)
          }
          // this.processStrip(strip, [], 'done', calculateParentStatus, null)
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
        let tabResults: any[] = []
        if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
          const allTabs = this.stripsResultDataMap[strip.key].tabs
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
            }
            tabResults = allTabs
          }
        }
        // this.processStrip(
        //   strip,
        //   widgets,
        //   'done',
        //   calculateParentStatus,
        //   response.viewMoreUrl,
        //   tabResults // tabResults as widgets
        // )
      } else {
        // this.processStrip(strip, [], 'error', calculateParentStatus, null)
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
        if (this.seeAllPageConfig.tabs) {
          const allTabs = this.seeAllPageConfig[strip.key].tabs
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
            }
            tabResults = allTabs
          }
        }
        debugger
        // console.log('tabResults -++++***--', tabResults)
        // console.log('calling  after-- ')
        // this.processStrip(
        //   strip,
        //   widgets,
        //   'done',
        //   calculateParentStatus,
        //   response.viewMoreUrl,
        //   tabResults // tabResults as widgets
        // )
      } else {
        // this.processStrip(strip, [], 'done', calculateParentStatus, null)
      }
    } catch (error) {
      // Handle errors
      // this.processStrip(strip, [], 'error', calculateParentStatus, null)
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

}
