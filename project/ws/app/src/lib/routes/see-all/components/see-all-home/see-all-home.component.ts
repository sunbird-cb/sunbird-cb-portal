import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core'
import {
  ActivatedRoute
} from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash'
import {
  SeeAllService
} from '../../services/see-all.service'
import {
  NsContentStripWithTabs
} from '@sunbird-cb/collection/src/lib/content-strip-with-tabs/content-strip-with-tabs.model'
import {
  NsContent
} from '@sunbird-cb/collection/src/lib/_services/widget-content.model'
import {
  ConfigurationsService
} from '@sunbird-cb/utils'

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

  constructor(
    private activated: ActivatedRoute,
    // private router: Router,
    private seeAllSvc: SeeAllService,
    private configSvc: ConfigurationsService,
  ) {}

  async ngOnInit() {
    this.activated.queryParams.subscribe((res: any) => this.keyData = (res.key) ? res.key : '')
    const configData = await this.seeAllSvc.getSeeAllConfigJson().catch(_error => {})
    configData.homeStrips.forEach((ele: any) => {
      if (ele && ele.strips.length > 0) {
        ele.strips.forEach((subEle:any) => {
          if (subEle.key === this.keyData) {
            this.seeAllPageConfig = subEle
          }
        });
      }
    })
    this.contentDataList = this.transformSkeletonToWidgets(this.seeAllPageConfig)
    if (this.seeAllPageConfig.request && this.seeAllPageConfig.request.searchV6) {
      this.fetchFromSearchV6(this.seeAllPageConfig)
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
          batch: content.batch
        }),
        cardSubType: strip.stripConfig && strip.stripConfig.cardSubType,
        context: {
          pageSection: strip.key,
          position: idx
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

  async fetchFromSearchV6(strip: any, calculateParentStatus = true) {
    if (strip.request && strip.request.searchV6 && Object.keys(strip.request.searchV6).length) {
      // let originalFilters: any = []
      if (strip.request &&
        strip.request.searchV6 &&
        strip.request.searchV6.request &&
        strip.request.searchV6.request.filters) {
        // originalFilters = strip.request.searchV6.request.filters
        strip.request.searchV6.request.filters = this.checkForDateFilters(strip.request.searchV6.request.filters)
        strip.request.searchV6.request.filters = this.getFiltersFromArray(
          strip.request.searchV6.request.filters,
        )
      }
      // if (strip.tabs && strip.tabs.length) {
      //   // TODO: Have to extract requestRequired to outer level of tabs config
      //   const firstTab = strip.tabs[0]
      //   if (firstTab.requestRequired) {
      //     if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
      //       const allTabs = this.stripsResultDataMap[strip.key].tabs
      //       const currentTabFromMap = (allTabs && allTabs.length && allTabs[0]) as NsContentStripWithTabs.IContentStripTab

      //       this.getTabDataByNewReqSearchV6(strip, 0, currentTabFromMap, calculateParentStatus)
      //     }
      //   }

      // } else {
      try {
        const response = await this.searchV6Request(strip, strip.request, calculateParentStatus)
        // console.log('calling  after - response, ', response)
        if (response && response.results) {
          // console.log('calling  after-- ')
          // this.processStrip(
          //   strip,
          this.contentDataList = this.transformContentsToWidgets(response.results.result.content, strip)
          //   'done',
          //   calculateParentStatus,
          //   response.viewMoreUrl,
          // )
        } else {
          // this.processStrip(strip, [], 'error', calculateParentStatus, null)
        }
      } catch (error) {
        // Handle errors
        // console.error('Error:', error);
      }
      // }
    }
  }

  async searchV6Request(strip: NsContentStripWithTabs.IContentStripUnit,
    request: NsContentStripWithTabs.IContentStripUnit['request'],
    _calculateParentStatus: boolean
  ): Promise < any > {
    const originalFilters: any = []
    // console.log('calling -- ')
    return new Promise < any > ((resolve, reject) => {
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
            viewMoreUrl
          })
        }, (error: any) => {
          // this.processStrip(strip, [], 'error', calculateParentStatus, null)
          reject(error)
        }, )
      }
    })
  }

  async fetchFromTrendingContent(strip: NsContentStripWithTabs.IContentStripUnit, calculateParentStatus = true) {
    console.log('inside fetchFromTrendingContent')
    if (strip.request && strip.request.trendingSearch && Object.keys(strip.request.trendingSearch).length) {
      // if (!(strip.request.searchV6.locale && strip.request.searchV6.locale.length > 0)) {
      //   if (this.configSvc.activeLocale) {
      //     strip.request.searchV6.locale = [this.configSvc.activeLocale.locals[0]]
      //   } else {
      //     strip.request.searchV6.locale = ['en']
      //   }
      // }
      console.log('inside fetchFromTrendingContent if inside')
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
      // if (strip.tabs && strip.tabs.length) {
      //   // TODO: Have to extract requestRequired to outer level of tabs config
      //   const firstTab = strip.tabs[0]
      //   if (firstTab.requestRequired) {
      //     if (this.stripsResultDataMap[strip.key] && this.stripsResultDataMap[strip.key].tabs) {
      //       const allTabs = this.stripsResultDataMap[strip.key].tabs
      //       const currentTabFromMap = (allTabs && allTabs.length && allTabs[0]) as NsContentStripWithTabs.IContentStripTab

      //       this.getTabDataByNewReqTrending(strip, 0, currentTabFromMap, calculateParentStatus)
      //     }
      //   }

      // } else {
      try {
        const response = await this.trendingSearchRequest(strip, strip.request, calculateParentStatus)
        console.log('calling  after - response, ', response)
        if (response && response.results && response.results.response) {
          const content = response.results.response[strip.request.trendingSearch.responseKey] || []
          this.contentDataList = this.transformContentsToWidgets(content, strip)
          // console.log('calling  after-- ')
          // this.processStrip(
          //   strip,
          //   this.transformContentsToWidgets(content, strip),
          //   'done',
          //   calculateParentStatus,
          //   response.viewMoreUrl,
          // )
        } else {
          // this.processStrip(strip, [], 'done', calculateParentStatus, null)
        }
      } catch (error) {
        // Handle errors
        // this.processStrip(strip, [], 'error', calculateParentStatus, null)
      }
      // }
    }
  }

  async trendingSearchRequest(strip: NsContentStripWithTabs.IContentStripUnit,
    request: NsContentStripWithTabs.IContentStripUnit['request'],
    _calculateParentStatus: boolean
  ): Promise < any > {
    const originalFilters: any = []
    return new Promise < any > ((resolve, reject) => {
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
            viewMoreUrl
          })
        }, (error: any) => {
          if (error.error && error.error.status === 400) {
            // this.processStrip(strip, [], 'done', calculateParentStatus, null)
          }
          // this.processStrip(strip, [], 'done', calculateParentStatus, null)
          reject(error)
        }, )
      }
    })
  }

  onScrollEnd() {
  }

  ngOnDestroy() {}

}
