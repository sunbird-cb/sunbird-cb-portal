import { Component, OnInit, Input, OnDestroy, HostBinding } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { NsContentStripMultiple } from './content-strip-multiple.model'
import { ContentStripMultipleService } from './content-strip-multiple.service'
import { WidgetContentService } from '../_services/widget-content.service'
import { NsContent } from '../_services/widget-content.model'
import {
  TFetchStatus,
  LoggerService,
  EventService,
  ConfigurationsService,
  UtilityService,
} from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'
// import { NSSearch } from '@sunbird-cb/utils/src/lib/services/widget-search.model'
import { WidgetUserService } from '../_services/widget-user.service'
// tslint:disable-next-line
import _ from 'lodash'
import { HttpClient } from '@angular/common/http'
interface IStripUnitContentData {
  key: string
  canHideStrip: boolean
  mode?: string
  showStrip: boolean
  widgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
  stripTitle: string
  stripName?: string
  stripInfo?: NsContentStripMultiple.IStripInfo
  noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
  showOnNoData: boolean
  showOnLoader: boolean
  showOnError: boolean
  stripBackground?: string
  viewMoreUrl?: {
    path: string
    queryParams: any
  }
}
@Component({
  selector: 'ws-widget-content-strip-multiple',
  templateUrl: './content-strip-multiple.component.html',
  styleUrls: ['./content-strip-multiple.component.scss'],
})
export class ContentStripMultipleComponent extends WidgetBaseComponent
  implements
  OnInit,
  OnDestroy,
  NsWidgetResolver.IWidgetData<NsContentStripMultiple.IContentStripMultiple> {
  @Input() widgetData!: NsContentStripMultiple.IContentStripMultiple
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
  searchArray = ['preview', 'channel', 'author']
  contentAvailable = true
  isFromAuthoring = false
  baseUrl = this.configSvc.sitePath || ''

  changeEventSubscription: Subscription | null = null

  constructor(
    private contentStripSvc: ContentStripMultipleService,
    private contentSvc: WidgetContentService,
    private loggerSvc: LoggerService,
    private eventSvc: EventService,
    private configSvc: ConfigurationsService,
    protected utilitySvc: UtilityService,
    private userSvc: WidgetUserService,
    private http: HttpClient,
  ) {
    super()
  }

  ngOnInit() {
    const url = window.location.href
    this.isFromAuthoring = this.searchArray.some((word: string) => {
      return url.indexOf(word) > -1
    })
    this.initData()
  }

  ngOnDestroy() {
    if (this.changeEventSubscription) {
      this.changeEventSubscription.unsubscribe()
    }
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
  checkCondition(wData: NsContentStripMultiple.IContentStripMultiple, data: IStripUnitContentData) {
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
  private initData() {
    this.stripsKeyOrder = this.widgetData.strips.map(strip => strip.key) || []
    if (this.widgetData.loader && this.widgetData.strips.length) {
      this.showParentLoader = true
    }
    // Fetch the data
    for (const strip of this.widgetData.strips) {
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
  // private transformSearchV6Filters(v6filters: NSSearch.ISearchV6Filters[]) {
  //   const filters: any = {}
  //   v6filters.forEach((f => {
  //     if (f.andFilters) {
  //       f.andFilters.forEach((andFilter: any) => {
  //         Object.keys(andFilter).forEach(key => {
  //           filters[key] = andFilter[key]
  //         })

  //       })
  //     }
  //   }))
  //   return filters
  // }

  identify(index: number, item: any) {
    if (index >= 0) { }
    return item
  }
  tracker(index: number, item: any) {
    if (index >= 0) { }
    return _.get(item, 'widgetData.content.identifier')
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

  private fetchStripFromRequestData(
    strip: NsContentStripMultiple.IContentStripUnit,
    calculateParentStatus = true,
  ) {
    // setting initial values
    this.processStrip(strip, [], 'fetching', false, null)
    this.fetchFromApi(strip, calculateParentStatus)
    this.fetchFromSearch(strip, calculateParentStatus)
    this.fetchFromSearchRegionRecommendation(strip, calculateParentStatus)
    this.fetchFromSearchV6(strip, calculateParentStatus)
    this.fetchFromIds(strip, calculateParentStatus)
    this.fetchFromEnrollmentList(strip, calculateParentStatus)
    this.fetchRelatedCBP(strip, calculateParentStatus)
    this.fetchRecommendedCourses(strip, calculateParentStatus)
    this.fetchMandatoryCourses(strip, calculateParentStatus)
    this.fetchBasedOnInterest(strip, calculateParentStatus)
  }
  fetchFromApi(strip: NsContentStripMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.api && Object.keys(strip.request.api).length) {
      this.contentStripSvc.getContentStripResponseApi(strip.request.api).subscribe(
        result => {
          let results: any
          const isPublic = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
          if (strip.request && strip.request.api
            && strip.request.api.path.indexOf('/api/course/v1/explore') !== -1
            && isPublic) {
            results = {
              contents: _.get(result, 'result.content'),
              hasMore: false,
            }
          }
          this.processStrip(
            strip,
            this.transformContentsToWidgets(results.contents, strip),
            'done',
            calculateParentStatus,
            null,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        },
      )
    }
  }
  fetchFromSearch(strip: NsContentStripMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.search && Object.keys(strip.request.search).length) {
      if (this.configSvc.activeLocale) {
        strip.request.search.locale = [this.configSvc.activeLocale.locals[0]]
      } else {
        strip.request.search.locale = ['en']
      }
      this.contentSvc.search(strip.request.search).subscribe(
        results => {
          const showViewMore = Boolean(
            results.result.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: '/app/globalsearch',
              queryParams: {
                tab: 'Learn',
                q: strip.request && strip.request.search && strip.request.search.query,
                f: JSON.stringify(
                  strip.request && strip.request.search && strip.request.search.filters,
                ),
              },
            }
            : null
          this.processStrip(
            strip,
            this.transformContentsToWidgets(results.result, strip),
            'done',
            calculateParentStatus,
            viewMoreUrl,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        },
      )
    }
  }
  fetchFromSearchRegionRecommendation(
    strip: NsContentStripMultiple.IContentStripUnit,
    calculateParentStatus = true,
  ) {
    if (
      strip.request &&
      strip.request.searchRegionRecommendation &&
      Object.keys(strip.request.searchRegionRecommendation).length
    ) {
      this.contentSvc
        .searchRegionRecommendation(strip.request.searchRegionRecommendation)
        .subscribe(
          results => {
            this.processStrip(
              strip,
              this.transformContentsToWidgets(results.contents, strip),
              'done',
              calculateParentStatus,
              null,
            )
          },
          () => {
            this.processStrip(strip, [], 'error', calculateParentStatus, null)
          },
        )
    }
  }
  fetchFromSearchV6(strip: NsContentStripMultiple.IContentStripUnit, calculateParentStatus = true) {
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
        strip.request.searchV6.request.filters = this.getFiltersFromArray(
          strip.request.searchV6.request.filters,
        )
      }
      this.contentSvc.searchV6(strip.request.searchV6).subscribe(
        results => {
          const showViewMore = Boolean(
            results.result.content.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: '/app/globalsearch',
              queryParams: {
                tab: 'Learn',
                q: strip.request && strip.request.searchV6 && strip.request.searchV6.request,
                f:
                  strip.request &&
                    strip.request.searchV6 &&
                    strip.request.searchV6.request &&
                    strip.request.searchV6.request.filters
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
          this.processStrip(
            strip,
            this.transformContentsToWidgets(results.result.content, strip),
            'done',
            calculateParentStatus,
            viewMoreUrl,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        },
      )
    }
  }
  fetchFromIds(strip: NsContentStripMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.ids && Object.keys(strip.request.ids).length) {
      this.contentSvc.fetchMultipleContent(strip.request.ids).subscribe(
        results => {
          this.processStrip(
            strip,
            this.transformContentsToWidgets(results, strip),
            'done',
            calculateParentStatus,
            null,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        },
      )
    }
  }

  fetchFromEnrollmentList(strip: NsContentStripMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) {
      let userId = ''
      let content: NsContent.IContent[]
      let contentNew: NsContent.IContent[]
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
            const dateA: any = new Date(a.enrolledDate || 0)
            const dateB: any = new Date(b.enrolledDate || 0)
            return dateB - dateA
          })
          this.processStrip(
            strip,
            this.transformContentsToWidgets(contentNew, strip),
            'done',
            calculateParentStatus,
            viewMoreUrl,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        }
      )
    }
  }

  fetchRecommendedCourses(strip: NsContentStripMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.recommendedCourses && Object.keys(strip.request.recommendedCourses).length) {
      // Competency based recommendations start
      if (this.configSvc.userProfileV2 &&
        this.configSvc.userProfileV2.competencies &&
        this.configSvc.userProfileV2.competencies.length) {
        const userCompetenies = this.configSvc.userProfileV2.competencies

        this.http
          .get(`${strip.request.masterCompetency.request.url}/${strip.request.masterCompetency.request.filename}`)
          .subscribe((masterCompetencies: any) => {
            const competencyDiff = masterCompetencies.filter((a: any) => !userCompetenies.some((b: any) => a.name === b.name))
            const competencyDiffNames = _.map(competencyDiff, 'name')
            const originalFilters: any = strip.request &&
              strip.request.recommendedCourses &&
              strip.request.recommendedCourses.request.filters
            originalFilters['competencies_v3.name'] = competencyDiffNames
            if (strip.request) {
              strip.request.recommendedCourses.request.filters = this.getFiltersFromArray(
                originalFilters,
              )
            }
            this.contentSvc.searchV6(strip.request && strip.request.recommendedCourses).subscribe(
              results => {
                const showViewMore = Boolean(
                  results.result && results.result.content && results.result.content.length > 4 &&
                  strip.stripConfig && strip.stripConfig.postCardForSearch,
                )
                const viewMoreUrl: any = showViewMore
                  ? {
                    tab: 'Learn',
                    path: strip.viewMoreUrl && strip.viewMoreUrl.path,
                    viewMoreText: (strip.viewMoreUrl && strip.viewMoreUrl.viewMoreText) || '',
                    queryParams: {
                      filtersPanel: 'hide',
                      q: `${strip.request && strip.request.recommendedCourses && strip.request.recommendedCourses.query}`,
                      f:
                        strip.request &&
                          strip.request.recommendedCourses &&
                          strip.request.recommendedCourses.request &&
                          strip.request.recommendedCourses.request.filters
                          ? JSON.stringify(
                            this.transformSearchV6FiltersV2(
                              originalFilters,
                            )
                          )
                          : {},
                    },
                  }
                  : null

                strip.viewMoreUrl = viewMoreUrl
                this.processStrip(
                  strip,
                  this.transformContentsToWidgets(results.result.content, strip),
                  'done',
                  calculateParentStatus,
                  viewMoreUrl,
                )
              },
              () => {
                this.processStrip(strip, [], 'error', calculateParentStatus, null)
              },
            )
          },         () => {
            this.processStrip(strip, [], 'error', calculateParentStatus, null)
          })
      }
      // Competency based recommendations end
    }
  }

  fetchBasedOnInterest(strip: NsContentStripMultiple.IContentStripUnit, calculateParentStatus = true) {
    // topics based recommendations start
    if (strip.request && strip.request.basedOnInterest && Object.keys(strip.request.basedOnInterest).length) {
      if (this.configSvc.userProfileV2) {

        const systemTopics = this.configSvc.userProfileV2.systemTopics &&
          this.configSvc.userProfileV2.systemTopics.map((st: any) => st.identifier)

        const desiredTopics = this.configSvc.userProfileV2.desiredTopics && this.configSvc.userProfileV2.desiredTopics
        if ((systemTopics && systemTopics.length) || (desiredTopics && desiredTopics.length)) {
          const originalFilters: any = strip.request &&
            strip.request.basedOnInterest &&
            strip.request.basedOnInterest.request.filters
          originalFilters['topics'] = [...systemTopics, ...desiredTopics]
          if (strip.request) {
            strip.request.basedOnInterest.request.filters = this.getFiltersFromArray(
              originalFilters,
            )
          }
          this.contentSvc.searchV6(strip.request && strip.request.basedOnInterest).subscribe(
            results => {
              const showViewMore = Boolean(
                results.result && results.result.content && results.result.content.length > 4 &&
                strip.stripConfig && strip.stripConfig.postCardForSearch,
              )
              const viewMoreUrl: any = showViewMore
                ? {
                  tab: 'Learn',
                  path: strip.viewMoreUrl && strip.viewMoreUrl.path,
                  viewMoreText: (strip.viewMoreUrl && strip.viewMoreUrl.viewMoreText) || '',
                  queryParams: {
                    filtersPanel: 'hide',
                    q: `${strip.request && strip.request.basedOnInterest && strip.request.basedOnInterest.query}`,
                    f:
                      strip.request &&
                        strip.request.basedOnInterest &&
                        strip.request.basedOnInterest.request &&
                        strip.request.basedOnInterest.request.filters
                        ? JSON.stringify(
                          this.transformSearchV6FiltersV2(
                            originalFilters,
                          )
                        )
                        : {},
                  },
                }
                : null

              strip.viewMoreUrl = viewMoreUrl
              this.processStrip(
                strip,
                this.transformContentsToWidgets(results.result.content, strip),
                'done',
                calculateParentStatus,
                viewMoreUrl,
              )
            },
            () => {
              this.processStrip(strip, [], 'error', calculateParentStatus, null)
            },
          )
        }
      }
    }
    // topics based recommendations start
  }

  fetchMandatoryCourses(strip: NsContentStripMultiple.IContentStripUnit, calculateParentStatus = true) {
    if (strip.request && strip.request.mandatoryCourses && Object.keys(strip.request.mandatoryCourses).length) {
      let userId = ''
      let content: NsContent.IContent[] = []
      let contentNew: NsContent.IContent[] = []
      const queryParams = _.get(strip.request.enrollmentList, 'queryParams')
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId
      }
      const originalFilters: any = strip.request &&
        strip.request.mandatoryCourses &&
        strip.request.mandatoryCourses.request.filters
      strip.request.mandatoryCourses.request.filters = this.getFiltersFromArray(
        originalFilters,
      )

      this.userSvc.fetchUserBatchList(userId, queryParams).subscribe(
        (courses: any) => {
          const goals = courses.reduce((acc: any[], cur: any) => {
            if (cur && cur.content && cur.content.primaryCategory === NsContent.EPrimaryCategory.MANDATORY_COURSE_GOAL) {
              acc.push(cur)
              return acc
            }
            return acc
            // tslint:disable-next-line: align
          }, [])
          const showViewMore = Boolean(
            goals.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: '/app/learn/mandatory-course',
              queryParams: {
                tab: 'Learn',
                q: strip.request && strip.request.mandatoryCourses && strip.request.mandatoryCourses.query,
                f:
                  strip.request && strip.request.mandatoryCourses && strip.request.mandatoryCourses.filters
                    ? JSON.stringify(
                      // this.searchServSvc.transformmandatoryCoursesFilters(
                      strip.request.mandatoryCourses.filters
                      // ),
                    )
                    : {},
              },
            }
            : null
          if (goals && goals.length) {
            content = goals.map((c: any) => {
              const contentTemp: NsContent.IContent = c.content
              contentTemp.batch = c.batch
              contentTemp.completionPercentage = c.completionPercentage || 0
              contentTemp.completionStatus = c.completionStatus || 0
              return contentTemp
            })
          }
          // To filter content with completionPercentage > 0,
          // so that only those content will show in home page
          // continue learing strip
          // if (content && content.length) {
          //   contentNew = content.filter((c: any) => {
          //     if (c.completionPercentage && c.completionPercentage > 0) {
          //       return c
          //     }
          //   })
          // }

          // To sort in descending order of the enrolled date
          if (content && content.length) {
            contentNew = (content || []).sort((a: any, b: any) => {
              const dateA: any = new Date(a.enrolledDate || 0)
              const dateB: any = new Date(b.enrolledDate || 0)
              return dateB - dateA
            })
          }

          this.processStrip(
            strip,
            this.transformContentsToWidgets(contentNew, strip),
            'done',
            calculateParentStatus,
            viewMoreUrl,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        }
      )
    }
  }

  fetchRelatedCBP(strip: any, calculateParentStatus = true) {
    if (strip.request && strip.request.comprelatedCbp && Object.keys(strip.request.comprelatedCbp).length) {
      // let userId = ''
      // let content: NsContent.IContent[]
      // let contentNew: NsContent.IContent[]
      const searchRequest = strip.payload
      // if (this.configSvc.userProfile) {
      //   userId = this.configSvc.userProfile.userId
      // }
      let originalFilters: any = []
      originalFilters = searchRequest.request.filters
      this.contentSvc.searchRelatedCBPV6(searchRequest).subscribe(
        results => {
          const showViewMore = Boolean(
            results.result.content.length > 5 && strip.stripConfig && strip.stripConfig.postCardForSearch,
          )
          const viewMoreUrl = showViewMore
            ? {
              path: '/app/globalsearch',
              queryParams: {
                tab: 'Learn',
                q: strip.request && strip.request.searchV6 && strip.request.searchV6.request,
                f:
                  searchRequest.request &&
                    searchRequest.request.filters
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
          this.processStrip(
            strip,
            this.transformContentsToWidgets(results.result.content, strip),
            'done',
            calculateParentStatus,
            viewMoreUrl,
          )
        },
        () => {
          this.processStrip(strip, [], 'error', calculateParentStatus, null)
        },
      )
    }
  }

  private transformContentsToWidgets(
    contents: NsContent.IContent[],
    strip: NsContentStripMultiple.IContentStripUnit,
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

  private async processStrip(
    strip: NsContentStripMultiple.IContentStripUnit,
    results: NsWidgetResolver.IRenderConfigWithAnyData[] = [],
    fetchStatus: TFetchStatus,
    calculateParentStatus = true,
    viewMoreUrl: any,
    // calculateParentStatus is used so that parents' status is not re-calculated if the API is called again coz of filters, etc.
  ) {
    // this.stripsResultDataMap[strip.key]
    if (results.length && strip.fetchLikes) {
      await this.processContentLikes(results)
    }
    const stripData = {
      viewMoreUrl,
      key: strip.key,
      canHideStrip: Boolean(strip.canHideStrip),
      showStrip: this.getIfStripHidden(strip.key),
      noDataWidget: strip.noDataWidget,
      errorWidget: strip.errorWidget,
      stripInfo: strip.info,
      stripTitle: strip.title,
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

  checkForEmptyWidget(strip: NsContentStripMultiple.IContentStripUnit): boolean {
    if (
      strip.request &&
      ((strip.request.api && Object.keys(strip.request.api).length) ||
        (strip.request.search && Object.keys(strip.request.search).length) ||
        (strip.request.searchRegionRecommendation &&
          Object.keys(strip.request.searchRegionRecommendation).length) ||
        (strip.request.searchV6 && Object.keys(strip.request.searchV6).length) ||
        (strip.request.ids && Object.keys(strip.request.ids).length) ||
        (strip.request.enrollmentList && Object.keys(strip.request.enrollmentList).length) ||
        (strip.request.comprelatedCbp && Object.keys(strip.request.comprelatedCbp).length) ||
        (strip.request.recommendedCourses && Object.keys(strip.request.recommendedCourses).length) ||
        (strip.request.mandatoryCourses && Object.keys(strip.request.mandatoryCourses).length) ||
        (strip.request.basedOnInterest && Object.keys(strip.request.basedOnInterest).length)
      )
    ) {
      return true
    }
    return false
  }

  processContentLikes(results: NsWidgetResolver.IRenderConfigWithAnyData[]): Promise<any> {
    const contentIds = {
      content_id:
        results.map(result => result.widgetData && result.widgetData.content.identifier) || [],
    }
    return this.contentSvc
      .fetchContentLikes(contentIds)
      .then(likeHash => {
        const likes = likeHash
        results.forEach(result => {
          result.widgetData.likes = likes[result.widgetData.content.identifier] || 0
        })
      })
      .catch(_err => { })
      .finally(() => Promise.resolve())
  }
}
