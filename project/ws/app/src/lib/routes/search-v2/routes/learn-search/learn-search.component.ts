import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core'
import { GbSearchService } from '../../services/gb-search.service'
import { ConfigurationsService, EventService, MultilingualTranslationsService, ValueService } from '@sunbird-cb/utils-v2'
import { ActivatedRoute, Router } from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
import { NsContent } from '@sunbird-cb/collection/src/public-api'

import { WidgetContentLibService } from '@sunbird-cb/consumption'
@Component({
  selector: 'ws-app-learn-search',
  templateUrl: './learn-search.component.html',
  styleUrls: ['./learn-search.component.scss'],
})
export class LearnSearchComponent implements OnInit, OnChanges, OnDestroy {
  @Input() param: any
  @Input() userValue = ''
  @Input() paramFilters: any = []
  @Input() filtersPanel!: string
  searchResults: any = []
  searchRequestObject = {
    request: {
      filters: {
        courseCategory: [],
        mimeType: [],
        source: [],
        mediaType: [],
        contentType: ['Course'],
        status: ['Live'],
        topics: [],
      },
      query: '',
      sort_by: { lastUpdatedOn: 'desc' },
      fields: [],
      facets: ['courseCategory', 'mimeType', 'source', 'competencies_v3.name', 'topics'],
      limit: 100,
      offset: 0,
      fuzzy: false,
    },
  }
  extSearchRequestObject = {
    filterCriteriaMap: {
    },
    requestedFields: [],
    pageNumber: 0,
    pageSize: 50,
    facets: [
      'topic',
    ],
    orderBy: 'createdOn',
    orderDirection: 'desc',
    searchString: '',
  }
  totalResults: any
  defaultThumbnail = ''
  myFilters: any = []
  rfilter: any
  primaryCategoryType: any = []
  contentType: any = [] // now using as primaryCategory
  mimeType: any = []
  sourceType: any = []
  mediaType: any = []
  competencNames: any = []
  facets: any = []
  throttle = 100
  scrollDistance = 0.2
  limit = 100
  page = 0
  totalpages!: number | 0
  newQueryParam: any

  sideNavBarOpened = true
  private defaultSideNavBarOpenedSubscription: any

  public screenSizeIsLtMedium = false
  isLtMedium$ = this.valueSvc.isLtMedium$
  statedata: {
    param: any, path: any
  } | undefined
  resultFacets: any = []
  facetsData: any = []
  veifiedKarmayogi = false

  constructor(
    private searchSrvc: GbSearchService,
    private configSvc: ConfigurationsService,
    private events: EventService,
    private activated: ActivatedRoute,
    private valueSvc: ValueService,
    private translate: TranslateService,
    private contSvc: WidgetContentLibService,
    private router: Router,
    private langtranslations: MultilingualTranslationsService,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
   }

  ngOnInit() {
    this.statedata = { param: this.param, path: 'Search' }
    const instanceConfig = this.configSvc.instanceConfig
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium

    })

    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    if (!this.activated.snapshot.data.searchPageData) {
      this.searchSrvc.getSearchConfig().then(data => {
        this.activated.snapshot.data = {
          searchPageData: { data },
        }
        this.facets = data.defaultsearch
      })
    } else {
      this.facets = this.activated.snapshot.data.searchPageData.data.defaultsearch
      if (this.param === 'moderatedCourses') {
        for (const key in this.facets[0].values) {
          if (this.facets[0].values[key].name === 'moderated courses') {
            this.facets[0].values[key].ischecked = true
            const obj = {
              mainType: 'primaryCategory',
              name: 'moderated courses',
              count: 0,
              ischecked: true,
            }
            this.myFilters.push(obj)
          }
        }
      }
    }
    // if (this.param) {
    //   this.getStartupData()

    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.profileDetails) {
      this.veifiedKarmayogi = this.configSvc.unMappedUser.profileDetails.profileStatus
        && this.configSvc.unMappedUser.profileDetails.profileStatus === 'VERIFIED' ? true : false
    }
    // for (const prop in changes) {
    if (changes.param.currentValue !== changes.param.previousValue) {
      this.statedata = { param: this.param, path: 'Search' }
      this.searchResults = []
      this.totalResults = 0

      if (this.myFilters && this.myFilters.length > 0) {
        // this.myFilters.forEach((fil: any) => {
        //   this.removeFilter(fil)
        // })
        this.applyFilter(this.myFilters)
        // this.formCourseCategory()
      } else {
        this.searchFreeTest()

      }
      // if(changes.param.previousValue) {
        // this.searchFreeTest()
      // }
    // }
  }
  }

  // ngOnChanges(props: SimpleChanges) {
  //   for (const prop in props) {
  //     if (prop === 'hierarchyMapData') {
  //       if(_.isEmpty(props['hierarchyMapData'].currentValue)){
  //         this.loadingOverallPRogress = true
  //       } else {
  //         const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
  //         this.activatedRoute.snapshot.queryParams.collectionId : ''
  //         this.ComputeCompletedNodesAndPercent(collectionId)
  //       }
  //     }
  //   }
  // }

  getFacets(facets: any) {
    facets.forEach((item: any) => {
      this.facets.forEach((fitem: any) => {
        if (item.name === fitem.name && item.name === 'source') {
          fitem.values = item.values
          fitem.values.forEach((val: any) => {
            const ispresent = this.myFilters.filter((x: any) => x.name === val.name)
            if (ispresent.length > 0) {
              val.ischecked = true
            } else  {
              val.ischecked = false
            }
          })
        }
      })
    })
  }

  getStartupData() {
    if (!this.paramFilters || this.paramFilters === 'undefined') {
      this.paramFilters = []
     }
     if (this.paramFilters && this.paramFilters.length > 0) {
       this.paramFilters.forEach((pf: any) => {
         const indx = this.myFilters.filter((x: any) => x.name === pf.name)
         if (indx.length === 0) {
           this.myFilters.push(pf)
         }
       })
      //  this.applyFilter(this.paramFilters)
     } else {
      this.searchFreeTest()
    }
  }

  searchFreeTest() {
    const emptyParam = {
      'request': {
        'query': this.param ? this.param : '',
        'filters': {
          'courseCategory': [],
          'contentType': ['Course'],
          'status': ['Live'] },
          'sort_by': { 'lastUpdatedOn': 'desc' },
          'facets': ['mimeType'],
          'limit': 100,
          'offset': 0,
        },
      }
    if (((this.myFilters && this.myFilters.length === 0) &&
    (typeof this.paramFilters === 'undefined') || (this.paramFilters && this.paramFilters.length === 0))) {

        // this.newQueryParam = emptyParam
        this.fetchSearchDataFun(emptyParam)
    }
  }

  applyFilter(filter: any) {
    // debugger
    // let isFilterCheccked = false
    let isModeratedFilterChecked = false
    if (filter && filter.length > 0) {
      this.myFilters = filter
      const queryparam = this.searchRequestObject
      queryparam.request.filters.courseCategory = []
      queryparam.request.filters.contentType = []
      queryparam.request.filters.mimeType = []
      queryparam.request.filters.source = []
      this.myFilters.forEach((mf: any) => {
        queryparam.request.query = this.param
        if (mf.mainType === 'contentType') {
          const indx = this.primaryCategoryType.filter((x: any) => x === mf.name && mf.name !== 'moderated courses')
          if (indx.length === 0) {

              this.primaryCategoryType.push(mf.name === 'Program' ? NsContent.ECourseCategory.INVITE_ONLY_PROGRAM : mf.name)
              queryparam.request.filters.courseCategory = this.primaryCategoryType
          }
          queryparam.request.filters.courseCategory = this.primaryCategoryType
        } else if (mf.mainType === 'primaryCategory') {
          const indx = this.primaryCategoryType.filter((x: any) => x === mf.name && mf.name !== 'moderated courses')
          if (indx.length === 0) {
            if (mf.name !== 'moderated courses') {
              this.primaryCategoryType.push(mf.name === 'Program' ? NsContent.ECourseCategory.INVITE_ONLY_PROGRAM : mf.name)
              queryparam.request.filters.courseCategory = this.primaryCategoryType
            }
          }
          queryparam.request.filters.courseCategory = this.primaryCategoryType
        } else if (mf.mainType === 'mimeType') {
          if (mf.name === 'Image') {
            this.mimeType.push('image/jpeg')
            this.mimeType.push('image/png')
          } else if (mf.name === 'Video') {
            this.mimeType.push('video/mp4')
            this.mimeType.push('video/x-youtube')
            this.mimeType.push('application/x-mpegURL')
          } else if (mf.name === 'Assessment') {
            this.mimeType.push('application/json')
            this.mimeType.push('application/quiz')
          } else if (mf.name === 'Interactive Content') {
            this.mimeType.push('application/vnd.ekstep.html-archive')
            this.mimeType.push('application/vnd.ekstep.ecml-archive')
          } else if (mf.name === 'Pratice / Final Assessment') {
            this.mimeType.push('application/vnd.sunbird.questionset')
          } else {
            this.mimeType.push(mf.name)
          }
          queryparam.request.filters.mimeType = this.mimeType
        } else if (mf.mainType === 'source') {
          this.sourceType.push(mf.name)
          queryparam.request.filters.source = this.sourceType
        } else if (mf.mainType === 'mediaType') {
          this.mediaType.push(mf.name)
          queryparam.request.filters.mediaType = this.mediaType
        } else if (mf.mainType === 'competencies_v3.name') {
          this.competencNames = (mf.values)
          // queryparam.request.filters['competencies_v3.name'] = mf.values
        } else if (mf.mainType === 'topics') {
          this.competencNames = (mf.values)
          queryparam.request.filters['topics'] = mf.values
        }
        if (mf.name === 'moderated courses') {
          isModeratedFilterChecked = true
        }
        // if (mf.name !== 'moderated courses') {
        //   isFilterCheccked = true
        // }
      })

      if (isModeratedFilterChecked) {
        this.primaryCategoryType.push('Course')
        queryparam.request.filters.courseCategory = this.primaryCategoryType
      } else if (queryparam.request.filters.courseCategory.length === 0 && !isModeratedFilterChecked) {
        this.primaryCategoryType.push('Course')
        this.primaryCategoryType.push('Program')
        this.primaryCategoryType.push('Standalone Assessment')
        queryparam.request.filters.courseCategory = this.primaryCategoryType
      }

      if (this.param && this.param !== 'moderatedCourses') {
        queryparam.request.query = this.param
      } else {
        queryparam.request.query = ''
      }
      // this.facets = []
      this.searchResults = []
      this.totalResults = 0
      // this.newQueryParam = queryparam

      if (this.param) {
        queryparam.request.query = this.param
      }
      this.fetchSearchDataFun(queryparam)
    } else {
      this.myFilters = filter
      this.searchFreeTest()
    }
  }

  fetchSearchDataFun(data: any) {
    data.request['fields'] = [
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
    ]
    this.newQueryParam = data
    let modifiedDataCount = 0
    if (data.request.filters.courseCategory.includes(NsContent.ECourseCategory.MODERATED_COURSE) ||
      data.request.filters.courseCategory.includes(NsContent.ECourseCategory.MODERATED_ASSESSEMENT) ||
      data.request.filters.courseCategory.includes(NsContent.ECourseCategory.MODERATED_PROGRAM)) {
        let orgId = ''
        if (!this.veifiedKarmayogi) {
          data.request.filters = { ...data.request.filters, 'secureSettings.isVerifiedKarmayogi': 'No' }
        }
        if (this.configSvc && this.configSvc.userProfile && this.configSvc.userProfile.rootOrgId) {
          orgId = this.configSvc.userProfile.rootOrgId
        }
        data.request.filters = { ...data.request.filters, 'secureSettings.organisation': orgId }
    }
    this.searchResults = []
    this.searchSrvc.fetchSearchDataByCategory(data).subscribe(async (response: any) => {
      if (response && response.result && response.result.count) {
        response.result.content.forEach((res: any) => {
          if (res.courseCategory === NsContent.ECourseCategory.MODERATED_COURSE ||
            res.courseCategory === NsContent.ECourseCategory.MODERATED_ASSESSEMENT ||
            res.courseCategory === NsContent.ECourseCategory.MODERATED_PROGRAM) {
              if (this.veifiedKarmayogi) {
                this.searchResults.push(res)
                modifiedDataCount = modifiedDataCount + 1
              } else {
                if (res.secureSettings && res.secureSettings.isVerifiedKarmayogi === 'No') {
                  this.searchResults.push(res)
                  modifiedDataCount = modifiedDataCount + 1
                }
              }
            } else {
              this.searchResults.push(res)
              modifiedDataCount = modifiedDataCount + 1
            }
        })
        this.searchResults = response.result.content
      }
      this.extSearchRequestObject.searchString = data.request.query
      const resExtSearch = await this.searchSrvc.fetchSearchDataforCios(this.extSearchRequestObject).toPromise().catch(_error => {})
      const checkQuey: any = this.activated.queryParams
      if ((this.myFilters && this.myFilters.length === 0) && (checkQuey && checkQuey._value && checkQuey._value.q)) {
        if (resExtSearch && resExtSearch.data && resExtSearch.data.length > 0) {
          resExtSearch.data.forEach((ele: any) => {
            this.searchResults.unshift(ele)
          })
        }
      }
      this.totalResults = (response.result.count) ? response.result.count : this.searchResults.length
      // this.facets = response.result.facets
      this.primaryCategoryType = []
      this.contentType = []
      this.mimeType = []
      this.sourceType = []
      this.mediaType = []
      this.paramFilters = []
      this.totalpages = Math.ceil(this.totalResults / 100)
      this.resultFacets.push(response.result.facets)
      this.getFacets(this.resultFacets)
    })
  }

  removeFilter(mfilter: any) {
    this.rfilter = mfilter
    this.searchSrvc.notifyOther(this.rfilter)
  }

  raiseTelemetry(content: any) {
    if (content) {
      this.events.raiseInteractTelemetry(
        {
          type: 'click',
          subType: `card-learnSearch`,
          id: `${_.camelCase(content.primaryCategory)}-card`,
        },
        {
          id: content.identifier || '',
          type: content.primaryCategory,
          rollup: {},
          ver: `${content.version}${''}`,
        },
        {
          pageIdExt: `${content.primaryCategory}-card`,
          module: content.primaryCategory,
      })
    }
  }

  onScrollEnd() {
    this.page += 1
    if (this.page <= this.totalpages && this.searchResults.length < this.totalResults) {
      const queryparam = this.newQueryParam
      queryparam.request.offset += 100
      this.searchSrvc.fetchSearchDataByCategory(queryparam).subscribe((response: any) => {
        const array2 = response.result.content
        this.searchResults = this.searchResults.concat(array2)
      })
    }
  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
  async getRedirectUrlData(content: any) {
    const urlData = await this.contSvc.getResourseLink(content)
    this.router.navigate(
      [urlData.url],
      {
        queryParams: urlData.queryParams,
      })
  }

  checkForCiosDuration(item: any) {
    if (item && item.contentId && item.contentId.includes('ext_')) {
      return item.duration * 60
    }
    return item.duration
  }
}
