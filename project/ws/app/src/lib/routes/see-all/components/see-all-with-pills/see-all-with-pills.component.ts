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
import { ConfigurationsService, EventService, MultilingualTranslationsService, WsEvents, NsContent, WidgetEnrollService } from '@sunbird-cb/utils-v2'
import { SeeAllService } from '../../services/see-all.service'
import { NsContentStripWithTabsAndPills } from '@sunbird-cb/consumption/lib/_common/strips/content-strip-with-tabs-pills/content-strip-with-tabs-pills.model'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { of } from 'rxjs'


@Component({
  selector: 'ws-app-see-all-with-pills',
  templateUrl: './see-all-with-pills.component.html',
  styleUrls: ['./see-all-with-pills.component.scss'],
})
export class SeeAllWithPillsComponent implements OnInit, OnDestroy {

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
  userSelectedTab: any
  dynamicTabIndex = 0
  pillSelected: any
  pillResults: any[] = []
  dynamicPillIndex = 0
  pageSize = 50

  constructor(
    private activated: ActivatedRoute,
    // private router: Router,
    private seeAllSvc: SeeAllService,
    private configSvc: ConfigurationsService,
    private eventSvc: EventService,
    private langtranslations: MultilingualTranslationsService,
    private enrollSvc: WidgetEnrollService,
  ) {

  }

  async ngOnInit() {
    let pageSubType = ''
    let pageType = ''
    this.activated.queryParams.subscribe((res: any) => {
      this.keyData = (res.key) ? res.key : ''
      this.tabSelected = (res.tabSelected) ? res.tabSelected : ''
      this.userSelectedTab = (res.tabSelected) ? res.tabSelected : ''
      this.pillSelected = (res.pillSelected) ? res.pillSelected : ''
      pageSubType = (res.pageSubType) ? res.pageSubType : ''
      pageType = (res.pageType) ? res.pageType : ''
    })
    const configData = await this.seeAllSvc.getSeeAllConfigJson(pageType, pageSubType).catch(_error => { })
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
      if (configData && configData.assessmentData) {
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
      this.resetSelectedPill(this.seeAllPageConfig.tabs[this.dynamicTabIndex].pillsData)
      this.seeAllPageConfig.tabs[this.dynamicTabIndex].pillsData[this.dynamicPillIndex]['selected'] = true
    }
    this.contentDataList = this.transformSkeletonToWidgets(this.seeAllPageConfig)

    if (this.seeAllPageConfig.request && this.seeAllPageConfig.key === 'forYou') {
      this.fetchForYouData(this.seeAllPageConfig)
    } else if (this.seeAllPageConfig.request && this.seeAllPageConfig.key === 'continueLearning') {
      const tabIndex: any = this.dynamicTabIndex || 0
      const pillIndex: any = this.dynamicPillIndex || 0
      this.fetchUserEnrolledData(this.seeAllPageConfig, tabIndex, pillIndex)
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
        cardSubType: strip.viewMoreUrl && strip.viewMoreUrl.loaderConfig
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
        cardSubType: strip.viewMoreUrl && strip.viewMoreUrl.stripConfig
          && strip.viewMoreUrl.stripConfig.cardSubType,
        context: {
          pageSection: strip.key,
          position: idx,
        },
        isiGOTSpecialization: this.userSelectedTab === 'igotSpecializations' ? true : false,
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
  ): Promise<any> {
    const originalFilters: any = []
    // console.log('calling -- ')
    return new Promise<any>((resolve, reject) => {
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
        }, (error: any) => {
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
        } catch (error) { }
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

  ngOnDestroy() { }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label.toLowerCase(), type, '')
  }

  async fetchForYouData(strip: NsContentStripWithTabsAndPills.IContentStripUnit) {
    if (strip && strip.type === 'forYou') {
      if (strip.tabs && strip.tabs.length) {
        const tabIndex: any = this.dynamicTabIndex || 0
        const pillIndex: any = this.dynamicPillIndex || 0
        const tabData = strip.tabs[tabIndex]
        const pillData = tabData.pillsData[pillIndex]
        if (pillData.requestRequired) {
          if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
            const allPills = this.seeAllPageConfig.tabs[tabIndex].pillsData
            const currenPillsFromMap = (allPills && allPills.length &&
              allPills[pillIndex]) as NsContentStripWithTabsAndPills.IContentStripTab
            if (currenPillsFromMap.request.searchV6) {
              this.getTabDataByNewReqSearchV6(strip, tabIndex, pillIndex, currenPillsFromMap, true)
            } else if (currenPillsFromMap.request.trendingSearch) {
              this.getTabDataByNewReqTrending(strip, tabIndex, pillIndex, currenPillsFromMap, true)
            } else if (currenPillsFromMap.request.microSearch) {
              this.getTabDataByNewReqMicroCreds(strip, tabIndex, pillIndex, currenPillsFromMap, true)
            }
            if (!currenPillsFromMap.request.microSearch) {
              await this.fetchMicroCredentialsList(strip)
            }
          }
        }

      }
    }
  }

  async fetchMicroCredentialsList(strip: NsContentStripWithTabsAndPills.IContentStripUnit) {
    if (strip && strip.tabs && strip.tabs.length) {
      const microTabIndex = strip.tabs.findIndex((tab: any) => tab.value === 'igotSpecializations')

      if (microTabIndex !== -1) {

        this.seeAllSvc.microCredentialsSearchWithoutUrl().subscribe((response: any) => {
          // Check if API returned data
          const hasData = response && response.result && response.result.content &&
            response.result.content.length > 0
          if (!hasData) {
            // Remove the igotSpecializations tab if no data
            if (strip && strip.tabs) {
              strip.tabs.splice(microTabIndex, 1)
            }

            // Update the seeAllPageConfig if it references the same tabs
            if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
              const configTabIndex = this.seeAllPageConfig.tabs.findIndex((tab: any) => tab.value === 'igotSpecializations')
              if (configTabIndex !== -1) {
                this.seeAllPageConfig.tabs.splice(configTabIndex, 1)
              }
            }
          }
        }, error => {
          console.error('Error fetching microcredentials', error)
          if (strip && strip.tabs) {
            strip.tabs.splice(microTabIndex, 1)
          }
          if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
            const configTabIndex = this.seeAllPageConfig.tabs.findIndex((tab: any) => tab.value === 'igotSpecializations')
            if (configTabIndex !== -1) {
              this.seeAllPageConfig.tabs.splice(configTabIndex, 1)
            }
          }
        })
      }
    }
  }

  async getTabDataByNewReqMicroCreds(
    strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    tabIndex: number,
    pillIndex: number,
    currentTab: NsContentStripWithTabsAndPills.IContentStripTab,
    calculateParentStatus: boolean
  ) {
    try {
      const response = await this.microCredentialsSearchRequest(strip, currentTab.request, calculateParentStatus)
      if (response && response.results && response.results.length) {
        const content = response.results || []
        const widgets = this.transformContentsToWidgets(content, strip)
        if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
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
        if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
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
      }
    } catch (_error) {
      if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
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

        if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
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
        if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
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
        if (this.seeAllPageConfig && this.seeAllPageConfig.tabs) {
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
        }, (error: any) => {
          if (error.error && error.error.status === 400) {
            // this.processStrip(strip, [], 'done', calculateParentStatus, null);
          }
          // this.processStrip(strip, [], 'done', calculateParentStatus, null)
          reject(error)
        })
      }
    })
  }

  async microCredentialsSearchRequest(strip: any,
    request: any,
    _calculateParentStatus: boolean
  ): Promise<any> {
    const originalFilters: any = []
    return new Promise<any>((resolve, reject) => {
      if (request && request.microSearch && request.microSearch.request && request.microSearch.request.url) {
        this.seeAllSvc.microCredentialsSearch(request.microSearch.request.url).subscribe((response: any) => {
          let results: any = response && response.result && response.result.content ? response.result.content : []
          const showViewMore = Boolean(
            results &&
            results.length > 5 &&
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
                    request.microSearch &&
                    request.microSearch.request &&
                    request.microSearch.request.filters
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
        }, (error: any) => {
          if (error.error && error.error.status === 400) {
            // this.processStrip(strip, [], 'done', calculateParentStatus, null);
          }
          //this.processStrip(strip, [], 'done', calculateParentStatus, null)
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

  pillClicked(stripMap: any, pillIndex: any, tabIndex: any) {
    this.pageSize = 50
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
        } else if (currentPillFromMap.request.microSearch) {
          this.getTabDataByNewReqMicroCreds(currentStrip, tabIndex, pillIndex, currentPillFromMap, true)
        } else if (currentPillFromMap.request.type === 'enrollment') {
          this.fetchFromInternalEnrollmentList(currentStrip, tabIndex, pillIndex, true)
          stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false
          stripMap.showOnLoader = false
        } else if (currentPillFromMap.request.type === 'eventEnrollment') {
          this.fetchEventEnrollmentList(currentStrip, tabIndex, pillIndex, true)
        }
        // if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
        //   stripMap.tabs[tabIndex].tabLoading = false;
        // }

        stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false
      } else {
        stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'done'
        stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false
        stripMap.showOnLoader = false
        this.resetSelectedPill(stripMap.tabs[tabIndex].pillsData)
        stripMap.tabs[tabIndex].pillsData[pillIndex]['selected'] = true
      }
    }
  }
  public tabClicked(tabIndex: any, stripMap: any, _stripKey: string, pillIndex: any) {

    this.pageSize = 50
    if (stripMap && stripMap.tabs && stripMap.tabs[tabIndex]) {
      stripMap.tabs[tabIndex].pillsData[pillIndex].fetchTabStatus = 'inprogress'
      stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = true
      stripMap.showOnLoader = true
      this.userSelectedTab = stripMap.tabs[tabIndex].value
    }
    const data: WsEvents.ITelemetryTabData = {
      label: `${stripMap.tabs[tabIndex].textLabel}`,
      index: tabIndex,
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

    const currentTabFromMap: any = stripMap.tabs && stripMap.tabs[tabIndex]
    const currentPillFromMap: any = stripMap.tabs && stripMap.tabs[tabIndex].pillsData[pillIndex]
    const currentStrip = this.seeAllPageConfig

    if (currentStrip && currentTabFromMap && !currentTabFromMap.computeDataOnClick && currentPillFromMap) {
      if (currentPillFromMap.requestRequired && currentPillFromMap.request) {
        // call API to get tab data and process
        // this.processStrip(currentStrip, [], 'fetching', true, null)
        if (currentPillFromMap.request.searchV6) {
          this.getTabDataByNewReqSearchV6(currentStrip, tabIndex, 0, currentPillFromMap, true)
        } else if (currentPillFromMap.request.trendingSearch) {
          this.getTabDataByNewReqTrending(currentStrip, tabIndex, 0, currentPillFromMap, true)
        } else if (currentPillFromMap.request.microSearch) {
          this.getTabDataByNewReqMicroCreds(currentStrip, tabIndex, 0, currentPillFromMap, true)
        } else if (currentPillFromMap.request.type === 'enrollment') {
          this.fetchFromInternalEnrollmentList(currentStrip, tabIndex, pillIndex, true)
          stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false
          stripMap.showOnLoader = false
        } else if (currentPillFromMap.request.type === 'eventEnrollment') {
          this.fetchEventEnrollmentList(currentStrip, tabIndex, pillIndex, true)
        }

        stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false
      } else if (currentTabFromMap.requestRequired && currentTabFromMap.request) {
        // call API to get tab data and process
        // this.processStrip(currentStrip, [], 'fetching', true, null)
        if (currentTabFromMap.request.enrollmentList) {
          this.fetchFromInternalEnrollmentList(currentStrip, tabIndex, pillIndex, true)
        } else if (currentTabFromMap.request.eventEnrollmentList) {
          this.fetchEventEnrollmentList(currentStrip, tabIndex, pillIndex, true)
        }

        stripMap.tabs[tabIndex].pillsData[pillIndex].tabLoading = false
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

  // MY learning Strip methods starts here
  fetchUserEnrolledData(strip: NsContentStripWithTabsAndPills.IContentStripUnit,
    tabIndex: number, pillIndex: any, calculateParentStatus = true) {
    if (strip.request && strip.request.enrollmentList
      && Object.keys(strip.request.enrollmentList).length) {
      if (strip && strip.tabs && strip.tabs.length && strip.tabs[tabIndex].pillsData) {
        if (strip.tabs[tabIndex].pillsData && strip.tabs[tabIndex].pillsData.length) {
          let currentPillFromMap: any = strip.tabs[tabIndex].pillsData[pillIndex]
          if (currentPillFromMap.request && currentPillFromMap.request.type === 'enrollment') {
            this.fetchFromInternalEnrollmentList(strip, tabIndex, pillIndex, calculateParentStatus)
          } else if (currentPillFromMap.request && currentPillFromMap.request.type === 'eventEnrollment') {
            this.fetchEventEnrollmentList(strip, tabIndex, pillIndex, calculateParentStatus)
          }
        }
      }
    }
  }


  fetchFromInternalEnrollmentList(strip: NsContentStripWithTabsAndPills.IContentStripUnit, tabIndex: number, pillIndex: number, calculateParentStatus = true) {
    if (strip.tabs && strip.tabs[tabIndex] && strip.tabs[tabIndex].pillsData && strip.tabs[tabIndex].pillsData[pillIndex]) {
      let currentPillFromMap: any = strip.tabs[tabIndex].pillsData[pillIndex]
      let userId = ''
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId
      }
      if (currentPillFromMap.request.payload
        && currentPillFromMap.request.payload.request
        && currentPillFromMap.request.payload.request.limit) {
        delete currentPillFromMap.request.payload.request.limit
      }
      let courses: any = []
      this.enrollSvc.fetchInternalEnrollmentData(userId, currentPillFromMap.request.payload).pipe(
        mergeMap((res: any) => {
          if (_.get(res, 'result.courses', []).length > 0 && _.get(this.configSvc, 'userProfile.userId') && _.get(currentPillFromMap, 'request.payload.request.status') === 'Completed') {
            const formContextList: any[] = []
            const formRefMap: Record<string, any> = {} // contextId -> course reference map

            // Build formBody and maintain reference map
            for (const course of res.result.courses) {
              const content = course.content
              if (content?.completionSurveyLink && content?.identifier) {
                const sID = content.completionSurveyLink.split('surveys/')
                const formId = sID[1]

                if (formId) {
                  formContextList.push({
                    formId,
                    contextId: content.identifier,
                  })
                  formRefMap[content.identifier] = course // direct reference to course
                }
              }
            }

            // If formContextList exists, make API call and wait for response
            if (formContextList.length) {
              const formBody = {
                userId: _.get(this.configSvc, 'userProfile.userId'),
                formContextList
              }

              return this.seeAllSvc.getApplicationsById(formBody).pipe(
                map((response) => {
                  const statusList = _.get(response, 'result.response', [])

                  // Update course with survey status
                  for (const status of statusList) {
                    const course = formRefMap[status.contextId]
                    if (course) {
                      course['surveyCompletionStatus'] = status.submitted
                    }
                  }

                  return res // Return the updated original response
                }),
                catchError((error) => {
                  console.error('Error fetching survey status:', error)
                  // Return the original response without survey status on error
                  return of(res)
                })
              )
            }
          }

          // Return existing response if no formContextList
          return of(res)
        })
      ).subscribe((res: any) => {
        if (res && res.result && res.result.courses && res.result.courses.length) {
          courses = [...courses, ...res.result.courses]
        }
        this.enrollSvc.fetchExternalEnrollmentData(currentPillFromMap.request.payload).subscribe((res: any) => {
          if (res && res.result && res.result.courses && res.result.courses.length) {
            courses = [...courses, ...res.result.courses]
          }
          this.formatNewEnrollmentData(strip, tabIndex, pillIndex, courses, calculateParentStatus)
        }, (_err: any) => {
          if (courses && courses.length) {
            courses = [...courses]
            this.formatNewEnrollmentData(strip, tabIndex, pillIndex, courses, calculateParentStatus)
          }
        })
      }, (_err: any) => {
        if (courses && courses.length) {
          courses = [...courses]
          this.formatNewEnrollmentData(strip, tabIndex, pillIndex, courses, calculateParentStatus)
        }
      })
    }
  }

  fetchEventEnrollmentList(strip: NsContentStripWithTabsAndPills.IContentStripUnit, tabIndex: number, pillIndex: number, calculateParentStatus = true) {
    if (strip.tabs && strip.tabs[tabIndex] && strip.tabs[tabIndex].pillsData && strip.tabs[tabIndex].pillsData[pillIndex]) {
      let currentPillFromMap: any = strip.tabs[tabIndex].pillsData[pillIndex]
      let userId = ''
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId
      }
      if (currentPillFromMap.request.payload
        && currentPillFromMap.request.payload.request
        && currentPillFromMap.request.payload.request.limit) {
        delete currentPillFromMap.request.payload.request.limit
      }
      this.enrollSvc.fetchEventsEnrollmentData(userId, currentPillFromMap.request.payload).subscribe((res: any) => {
        let events: any = []
        if (res && res.result && res.result.events && res.result.events.length) {
          events = [...events, ...res.result.events]
        }
        this.formatNewEnrollmentData(strip, tabIndex, pillIndex, events, calculateParentStatus)
      }, (_err: any) => {

      })
    }
  }

  formatNewEnrollmentData(strip: any, tabIndex: number, pillIndex: number, courses: any, _calculateParentStatus: any = true) {
    let content: any = []
    if (courses && courses.length) {
      content = courses.map((c: any) => {
        const contentTemp: any = c.content || c.event || {}
        contentTemp.completionPercentage = c.completionPercentage || c.progress || 0
        contentTemp.completionStatus = c.completionStatus || c.status || 0
        contentTemp.enrolledDate = c.enrolledDate || ''
        contentTemp.lastContentAccessTime = c.lastContentAccessTime || ''
        contentTemp.lastReadContentStatus = c.lastReadContentStatus || ''
        contentTemp.lastReadContentId = c.lastReadContentId || ''
        contentTemp.lrcProgressDetails = c.lrcProgressDetails || ''
        contentTemp.issuedCertificates = c.issuedCertificates || c.issued_certificates || []
        contentTemp.batchId = c.batchId || ''
        contentTemp.content = c.content || c.event || {}
        contentTemp.content.primaryCategory = c.content && c.content.primaryCategory || c.event && c.event.resourceType || ''
        contentTemp.cType = c.event ? 'event' : ''
        contentTemp.completedOn = c.completedOn || ''
        if (c.surveyCompletionStatus !== undefined) {
          contentTemp.surveyCompletionStatus = c.surveyCompletionStatus
        }
        return contentTemp
      })
    }

    let sortedContent: any = (content || []).sort((a: any, b: any) => {
      const dateA: any = new Date(a.lastContentAccessTime || 0)
      const dateB: any = new Date(b.lastContentAccessTime || 0)
      return dateB - dateA
    })

    if (strip && strip.tabs && strip.tabs.length) {
      if (strip.tabs[tabIndex].pillsData && strip.tabs[tabIndex].pillsData.length) {
        let currentPillFromMap: any = strip.tabs[tabIndex].pillsData[pillIndex]
        currentPillFromMap['fetchTabStatus'] = 'done'
        this.resetSelectedPill(strip.tabs[tabIndex].pillsData)
        strip.tabs[tabIndex].pillsData[pillIndex]['selected'] = true
        let widgets = this.transformContentsToWidgets(sortedContent, strip)
        strip.tabs[tabIndex].pillsData[pillIndex]['widgets'] = widgets

        this.resetSelectedPill(strip.tabs[tabIndex].pillsData)
        this.tabResults = strip.tabs
        strip.tabs[tabIndex].pillsData[pillIndex]['selected'] = true
        this.contentDataList = strip.tabs[tabIndex].pillsData[pillIndex].widgets
      }
    }
  }

  loadMore() {
    if (this.pageSize < this.contentDataList.length) {
      this.pageSize = this.pageSize + 50
    }
  }

}
