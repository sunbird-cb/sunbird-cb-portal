import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core'
import {
  ActivatedRoute,
} from '@angular/router'
// tslint:disable-next-line
import * as _ from 'lodash'
import { ConfigurationsService, EventService, MultilingualTranslationsService, WsEvents, NsContent } from '@sunbird-cb/utils-v2'
import { SeeAllService } from '../../services/see-all.service'
import { MatTabChangeEvent } from '@angular/material'
import { NsContentStripWithTabsAndPills } from '@sunbird-cb/consumption/lib/_common/strips/content-strip-with-tabs-pills/content-strip-with-tabs-pills.model'

@Component({
  selector: 'ws-app-see-all-with-pills',
  templateUrl: './see-all-with-pills.component.html',
  styleUrls: ['./see-all-with-pills.component.scss'],
})
export class SeeAllWithPillsComponent  implements OnInit, OnDestroy {

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
  pillSelected: any
  pillResults: any[] = []
  dynamicPillIndex = 0

  constructor(
    private activated: ActivatedRoute,
    // private router: Router,
    private seeAllSvc: SeeAllService,
    private configSvc: ConfigurationsService,
    private eventSvc: EventService,
    private langtranslations: MultilingualTranslationsService,
  ) {

  }

  async ngOnInit() {
    this.activated.queryParams.subscribe((res: any) => {
      this.keyData = (res.key) ? res.key : ''
      this.tabSelected = (res.tabSelected) ? res.tabSelected : ''
      this.pillSelected = (res.pillSelected) ? res.pillSelected : ''
    })
    const configData = await this.seeAllSvc.getSeeAllConfigJson().catch(_error => {})
    // configData.homeStrips.forEach((ele: any) => {
    //   if (ele && ele.strips.length > 0) {
    //     ele.strips.forEach((subEle: any) => {
    //       if (subEle.key === this.keyData) {
    //         this.seeAllPageConfig = subEle
    //       }
    //     })
    //   }
    // })
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
    if (!this.seeAllPageConfig) {
      if (configData) {
        configData.newHomeStrip.forEach((ele: any) => {
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
        this.dynamicTabIndex = _.findIndex(this.tabResults, (v: any) => v.value === this.tabSelected)
      }
      if (
        this.tabSelected &&
        this.seeAllPageConfig.tabs &&
        this.seeAllPageConfig.tabs.length
        ) {
          this.pillResults = this.seeAllPageConfig.tabs[this.dynamicTabIndex].pillsData
          this.dynamicPillIndex = _.findIndex(this.pillResults, (v: any) => v.value === this.pillSelected)
          this.seeAllPageConfig.tabs[this.dynamicTabIndex].pillsData[this.dynamicPillIndex]['selected'] = true
        }
    this.contentDataList = this.transformSkeletonToWidgets(this.seeAllPageConfig)

    if (this.seeAllPageConfig.request && this.seeAllPageConfig.key === 'forYou') {
      this.fetchForYouData(this.seeAllPageConfig)
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

  async searchV6Request(strip: NsContentStripWithTabsAndPills.IContentStripUnit,
                        request: NsContentStripWithTabsAndPills.IContentStripUnit['request'],
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

  async fetchFromTrendingContent(strip: NsContentStripWithTabsAndPills.IContentStripUnit, calculateParentStatus = true) {
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
               allTabs[this.dynamicTabIndex]) as NsContentStripWithTabsAndPills.IContentStripTab
            this.getTabDataByNewReqTrending(strip, this.dynamicTabIndex, 0, currentTabFromMap,
                                            calculateParentStatus)
          }
        }

      } else {
      try {
        const response = await this.trendingSearchRequest(strip, strip.request, calculateParentStatus)
        if (response && response.results && response.results.response) {
          const content = response.results.response[strip.request.trendingSearch.responseKey] || []
          this.contentDataList = this.transformContentsToWidgets(content, strip)
        }
      } catch (error) {}
      }
    }
  }

  onScrollEnd() {
    this.page += 1
    if (this.page <= this.totalPages) {
      if (this.contentDataList[0].widgetData.content) {
        if (this.seeAllPageConfig.request.searchV6) {
          this.offsetForPage = this.seeAllPageConfig.request.searchV6.request.limit + this.offsetForPage
          // this.fetchFromSearchV6(this.seeAllPageConfig)
        }
      }
    }
  }

  ngOnDestroy() {}

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label.toLowerCase(), type, '')
  }

  fetchForYouData(strip: NsContentStripWithTabsAndPills.IContentStripUnit) {
    if (strip && strip.type === 'forYou') {
      if (strip.tabs && strip.tabs.length) {
        const tabIndex: any = this.dynamicTabIndex || 0
        const pillIndex: any = this.dynamicPillIndex || 0
        const firstTab = strip.tabs[tabIndex]
        const pillData = firstTab.pillsData[pillIndex]
        if (pillData.requestRequired) {
          if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
            const allPills = this.seeAllPageConfig.tabs[tabIndex].pillsData
            const currenPillsFromMap = (allPills && allPills.length &&
              allPills[pillIndex]) as NsContentStripWithTabsAndPills.IContentStripTab
            if (currenPillsFromMap.request.searchV6) {
              this.getTabDataByNewReqSearchV6(strip, tabIndex, pillIndex, currenPillsFromMap, true)
            } else if (currenPillsFromMap.request.trendingSearch) {
              this.getTabDataByNewReqTrending(strip, tabIndex, pillIndex, currenPillsFromMap, true)
            }
          }
        }

      }
    }
  }

  async getTabDataByNewReqTrending(
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    tabIndex: number,
    pillIndex: number,
    currentTab: NsContentStripWithTabsAndPills.IContentStripTab,
    calculateParentStatus: boolean
  ) {
    try {
      const response = await this.trendingSearchRequest(strip, currentTab.request, calculateParentStatus)
      if (response && response.results && response.results.response) {
        const content = response.results.response[currentTab.value] || []
        const widgets = this.transformContentsToWidgets(content, strip)

        if (this.seeAllPageConfig  && this.seeAllPageConfig.tabs) {
          const allTabs = this.seeAllPageConfig.tabs
          const allPills = this.seeAllPageConfig.tabs[tabIndex].pillsData
          this.resetSelectedPill(allPills)
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            if (allPills && allPills.length && allPills[pillIndex]) {
              allPills[pillIndex] = {
                ...allPills[pillIndex],
                widgets,
                fetchTabStatus: 'done',
                selected: true,
              }
            }
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
              fetchTabStatus: 'done',
            }
          }
        }
      } else {
        if (this.seeAllPageConfig  && this.seeAllPageConfig.tabs) {
          const allTabs = this.seeAllPageConfig.tabs
          const allPills = this.seeAllPageConfig.tabs[tabIndex].pillsData
          this.resetSelectedPill(allPills)
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            if (allPills && allPills.length && allPills[pillIndex]) {
              allPills[pillIndex] = {
                ...allPills[pillIndex],
                widgets: [],
                fetchTabStatus: 'done',
                selected: true,
              }
            }
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets: [],
              fetchTabStatus: 'done',
            }
          }
        }
        // this.processStrip(strip, [], 'done', calculateParentStatus, null);
      }
    } catch (_error) {
      // Handle errors
      // this.processStrip(strip, [], 'error', calculateParentStatus, null);
    }
  }

  async getTabDataByNewReqSearchV6(
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    tabIndex: number,
    pillIndex: number,
    currentTab: NsContentStripWithTabsAndPills.IContentStripTab,
    calculateParentStatus: boolean
  ) {
    try {
      const response = await this.searchV6Request(strip, currentTab.request, calculateParentStatus)
      if (response && response.results) {
        const widgets = this.transformContentsToWidgets(response.results.result.content, strip)
        if (this.seeAllPageConfig  && this.seeAllPageConfig.tabs) {
          const allTabs = this.seeAllPageConfig.tabs
          const allPills = this.seeAllPageConfig.tabs[tabIndex].pillsData
          this.resetSelectedPill(allPills)
          if (allTabs && allTabs.length && allTabs[tabIndex]) {
            if (allPills && allPills.length && allPills[pillIndex]) {
              allPills[pillIndex] = {
                ...allPills[pillIndex],
                widgets,
                fetchTabStatus: 'done',
                selected: true,
              }
            }
            allTabs[tabIndex] = {
              ...allTabs[tabIndex],
              widgets,
              fetchTabStatus: 'done',
            }
          }
        }
      } else {
        // this.processStrip(strip, [], 'error', calculateParentStatus, null);
      }
    } catch (error) {
      // Handle errors
      // console.error('Error:', error);
    }
  }

  async trendingSearchRequest(strip: NsContentStripWithTabsAndPills.IContentStripUnit,
                              request: NsContentStripWithTabsAndPills.IContentStripUnit['request'],
                              _calculateParentStatus: boolean
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
          this.seeAllSvc.trendingContentSearch(request.trendingSearch).subscribe((result: any) => {
            let results: any = result
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

            const proccesedResult: any = []
            if (results && results.response && results.response.certifications) {
              results = { response: { certifications: proccesedResult } }
            }
            resolve({ results, viewMoreUrl })
          },                                                                     (error: any) => {
            if (error.error && error.error.status === 400) {
              // this.processStrip(strip, [], 'done', calculateParentStatus, null);
            }
            // this.processStrip(strip, [], 'done', calculateParentStatus, null)
            reject(error)
          })
        }
      })
    }
    resetSelectedPill(pillData: any) {
      if (pillData && pillData.length) {
        pillData.forEach((pill: any) => {
          pill['selected'] = false
        })
      }
    }

    pillClicked(stripMap: any,  pillIndex: any, tabIndex: any) {
      if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
        stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'inprogress'
        stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = true
        stripMap.showOnLoader = true
      }
      const currentTabFromMap: any = stripMap.tabs && stripMap.tabs[tabIndex]
      const currentPillFromMap: any = stripMap.tabs && stripMap.tabs[tabIndex].pillsData[pillIndex]
      const currentStrip = this.seeAllPageConfig

      if (currentStrip && currentTabFromMap && !currentTabFromMap.computeDataOnClick && currentPillFromMap) {
        if (currentPillFromMap.requestRequired && currentPillFromMap.request) {
          // call API to get tab data and process
          // this.processStrip(currentStrip, [], 'fetching', true, null)
          if (currentPillFromMap.request.searchV6) {
            this.getTabDataByNewReqSearchV6(currentStrip, tabIndex, pillIndex, currentPillFromMap, true)
          } else if (currentPillFromMap.request.trendingSearch) {
            this.getTabDataByNewReqTrending(currentStrip, tabIndex, pillIndex, currentPillFromMap, true)
          }
          // if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
          //   stripMap.tabs[tabEvent.index].tabLoading = false;
          // }

        stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false
        } else {
          // this.getTabDataByfilter(currentStrip, currentTabFromMap, true);
          // setTimeout(() => {

          //   if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
          //     stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'inprogress';
          //     stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false;
          //     stripMap.showOnLoader = false;
          //     this.resetSelectedPill(stripMap.tabs[tabIndex].pillsData)
          //     stripMap.tabs[tabIndex].pillsData[pillIndex]['selected']=true
          //   }
          // },         200);
        }
      }
    }
    public tabClicked(tabEvent: MatTabChangeEvent, stripMap: any, _stripKey: string, pillIndex: any) {
      if (stripMap && stripMap.tabs && stripMap.tabs[tabEvent.index]) {
        stripMap.tabs[tabEvent.index].pillsData[pillIndex].fetchTabStatus = 'inprogress'
        stripMap.tabs[tabEvent.index].pillsData[pillIndex].tabLoading = true
        stripMap.showOnLoader = true
      }
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

      const currentTabFromMap: any = stripMap.tabs && stripMap.tabs[tabEvent.index]
      const currentPillFromMap: any = stripMap.tabs && stripMap.tabs[tabEvent.index].pillsData[pillIndex]
      const currentStrip = this.seeAllPageConfig

      if (currentStrip && currentTabFromMap && !currentTabFromMap.computeDataOnClick && currentPillFromMap) {
        if (currentPillFromMap.requestRequired && currentPillFromMap.request) {
          // call API to get tab data and process
          // this.processStrip(currentStrip, [], 'fetching', true, null)
          if (currentPillFromMap.request.searchV6) {
            this.getTabDataByNewReqSearchV6(currentStrip, tabEvent.index, 0, currentPillFromMap, true)
          } else if (currentPillFromMap.request.trendingSearch) {
            this.getTabDataByNewReqTrending(currentStrip, tabEvent.index, 0, currentPillFromMap, true)
          }

        stripMap.tabs[tabEvent.index].pillsData[pillIndex].tabLoading = false
        }
      }
    }

    getSelectedPillIndex(tabdata: any) {
      if (tabdata.pillsData && tabdata.pillsData.length) {
        const index = tabdata.pillsData.findIndex((pill: any) => {
            return pill.selected
        })
        return index
      }
      return 0
    }
}
