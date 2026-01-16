import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { SeeAllService } from '../../services/see-all.service'
import { CommonMethodsService, WidgetContentLibService } from '@sunbird-cb/consumption'


const configMap: any = {
  extContent: {
    name: "Cohort Insights",
    url: '/apis/proxies/v8/cios/v1/search/content',
    request: {
      filterCriteriaMap: {
      },
      requestedFields: [],
      pageNumber: 0,
      pageSize: 10,
      facets: ['topic'],
      orderBy: 'createdOn',
      orderDirection: 'desc',
      searchString: ''
    }
  },
  extContentAssigned: {
    name: "Assigned Contents",
    url: 'apis/proxies/v8/user/v1/assigned/externalcourses',
    isGetApi: false,  // POST API but with local search (no pagination)
    isLocalSearch: true,  // Flag to indicate local search only
    request: {
      "partnerId": ""
    }
  }
}
@Component({
  selector: 'ws-app-see-all-dynamic',
  templateUrl: './see-all-dynamic.component.html',
  styleUrls: ['./see-all-dynamic.component.scss']
})
export class SeeAllDynamicComponent implements OnInit, OnDestroy {
  contentItems: any[] = []
  originalContentItems: any[] = []
  scrollDistance = 2  // Distance from bottom to trigger load
  throttle = 300  // Throttle scroll events
  pageSize = 10  // Items per page
  currentPageNumber = 0  // For server-side pagination
  totalCount = 0  // Server-provided total count
  sortKey = 'name'
  sortOrder: 'asc' | 'desc' = 'asc'
  loading = false
  isLoadingMore = false  // Track infinite scroll loading state
  customOptions: any[] = []
  contentName: string = ''
  searchString: string = ''
  configKey: string = ''
  filterProvider: string = ''
  apiConfig: any = null
  isGetApi = false

  private destroy$ = new Subject<void>()

  constructor(
    private activatedRoute: ActivatedRoute,
    private seeAllService: SeeAllService,
    private translate: TranslateService,
    private commonSvc: CommonMethodsService,
    private router: Router,
    private contSvc: WidgetContentLibService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    this.customOptions = [
      { name: 'Most Relevant', value: 'most_relevant' },
      { name: 'Recently Added (Newest)', value: 'recently_added_newest' },
      { name: 'Highest Rated', value: 'highest_rated' },
      { name: 'A-Z', value: 'a-z' },
      { name: 'Z-A', value: 'z-a' }
    ]
  }

  ngOnInit() {
    this.contentName = this.activatedRoute?.snapshot?.queryParams['providerName'] ?
      `${this.activatedRoute?.snapshot?.queryParams['providerName']} Contents` : 'Explore all the contents'
    this.configKey = this.activatedRoute?.snapshot?.queryParams['key'] || 'extContent'
    this.filterProvider = this.activatedRoute?.snapshot?.queryParams['provider'] || 'PEDGOG'

    // Load configuration from service
    this.loadConfiguration()
    this.fetchContent()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadConfiguration() {
    // Get config from local configMap
    const getConfigData = this.activatedRoute?.snapshot?.data['pageData']?.data || configMap
    this.apiConfig = getConfigData[this.configKey]

    if (!this.apiConfig) {
      return
    }

    // Clone the config to avoid mutating the original
    this.apiConfig = JSON.parse(JSON.stringify(this.apiConfig))

    // Update the filter criteria with the provider from URL if present (only for POST APIs with request object)
    if (this.filterProvider && this.apiConfig.request && this.apiConfig.request.filterCriteriaMap) {
      this.apiConfig.request.filterCriteriaMap['contentPartner.id'] = this.filterProvider
    }
    if (this.filterProvider && this.apiConfig.request) {
      this.apiConfig.request.partnerId = this.filterProvider
    }
  }

  fetchContent(isLoadMore = false) {
    if (!this.apiConfig) {
      return
    }

    const isFirstLoad = !isLoadMore
    if (isFirstLoad) {
      this.loading = true
      this.currentPageNumber = 0
      this.contentItems = []
      this.originalContentItems = []
    } else {
      this.isLoadingMore = true
    }

    const url = this.apiConfig.url
    const request = this.apiConfig.request
    const isLocalSearchApi = this.apiConfig.isLocalSearch === true

    // Check if this is a GET API - first check explicit flag, then check if request is empty
    this.isGetApi = this.apiConfig.isGetApi === true || !request || Object.keys(request).length === 0

    if (this.isGetApi) {
      this.seeAllService
        .fetchDynamicContent(url, {}, true)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            // Handle different response formats
            const data = res?.result?.content || res?.content || res?.data || res || []
            const transformed = this.commonSvc.transformContentsToWidgetsWithoutStrip(data)
            // Store original data for search filtering
            this.originalContentItems = [...transformed]
            this.contentItems = [...transformed]
            // Capture server-provided total count
            this.totalCount = res?.result?.totalCount || res?.totalCount || transformed.length
            this.applyLocalSearch()
            this.applySort()
            this.loading = false
            this.isLoadingMore = false
          },
          (_err) => {
            this.contentItems = []
            this.originalContentItems = []
            this.totalCount = 0
            this.loading = false
            this.isLoadingMore = false
          }
        )
    } else if (isLocalSearchApi) {
      const localSearchRequest = JSON.parse(JSON.stringify(request))
      // Don't add pageNumber, searchString, or pageSize for local search APIs

      this.seeAllService
        .fetchDynamicContent(url, localSearchRequest, false)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            // Handle different response formats
            const data = res?.result?.content || res?.content || res?.data || []
            const transformed = this.commonSvc.transformContentsToWidgetsWithoutStrip(data)
            // Store original data for search filtering
            this.originalContentItems = [...transformed]
            this.contentItems = [...transformed]
            // Capture server-provided total count
            this.totalCount = res?.result?.totalCount || res?.totalCount || transformed.length
            this.applyLocalSearch()
            this.applySort()
            this.loading = false
            this.isLoadingMore = false
          },
          (_err) => {
            this.contentItems = []
            this.originalContentItems = []
            this.totalCount = 0
            this.loading = false
            this.isLoadingMore = false
          }
        )
    } else {
      // For POST APIs with server-side pagination - use server-side pagination with infinite scroll
      const postRequest = JSON.parse(JSON.stringify(request))
      postRequest.searchString = this.searchString
      postRequest.pageNumber = this.currentPageNumber
      postRequest.pageSize = this.pageSize

      this.seeAllService
        .fetchDynamicContent(url, postRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            // Handle different response formats
            const data = res?.result?.content || res?.content || res?.data || []
            const transformed = this.commonSvc.transformContentsToWidgetsWithoutStrip(data)
            // Capture server-provided total count
            this.totalCount = res?.result?.totalCount || res?.totalCount || res?.result?.content?.length || 0

            if (isLoadMore) {
              // Append new items for infinite scroll
              this.contentItems = [...this.contentItems, ...transformed]
            } else {
              // Replace all items on first load
              this.contentItems = transformed
            }

            this.applySort()
            this.loading = false
            this.isLoadingMore = false
          },
          (_err) => {
            if (!isLoadMore) {
              this.contentItems = []
            }
            this.totalCount = 0
            this.loading = false
            this.isLoadingMore = false
          }
        )
    }
  }

  applyLocalSearch() {
    // Filter content based on search string (local search)
    if (!this.searchString || this.searchString.trim() === '') {
      // Restore original data when search is empty
      this.contentItems = [...this.originalContentItems]
      return
    }

    const searchTerm = this.searchString.toLowerCase()
    this.contentItems = this.originalContentItems.filter((item: any) => {
      return (
        (item.name && item.name.toLowerCase().includes(searchTerm)) ||
        (item.title && item.title.toLowerCase().includes(searchTerm)) ||
        (item.description && item.description.toLowerCase().includes(searchTerm)) ||
        (item.widgetData?.content?.name && item.widgetData.content.name.toLowerCase().includes(searchTerm))
      )
    })
  }

  applySort() {
    this.contentItems.sort((a, b) => {
      let valA = a[this.sortKey]
      let valB = b[this.sortKey]

      if (this.sortKey === 'avgRating') {
        valA = Number(valA) || 0
        valB = Number(valB) || 0
      } else if (this.sortKey === 'createdOn') {
        valA = new Date(valA).getTime() || 0
        valB = new Date(valB).getTime() || 0
      } else {
        valA = (valA || '').toString().toLowerCase()
        valB = (valB || '').toString().toLowerCase()
      }

      if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }

  setSort(key: string) {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortKey = key
      this.sortOrder = 'asc'
    }
    this.applySort()
  }

  onScrollEnd() {
    // Check if we have more items to load
    if (this.isLoadingMore || this.loading) {
      return  // Already loading
    }

    const totalLoaded = this.contentItems.length
    if (totalLoaded >= this.totalCount) {
      return  // All items loaded
    }

    // Load next page
    this.currentPageNumber += 1
    this.fetchContent(true)  // Pass true to indicate this is a load-more request
  }

  onChangeSortSearch(event: any) {
    if (event === 'most_relevant') {
      // No specific sort for most relevant
    } else if (event === 'recently_added_newest') {
      this.sortKey = 'createdOn'
      this.sortOrder = 'desc'
    } else if (event === 'highest_rated') {
      this.sortKey = 'avgRating'
      this.sortOrder = 'desc'
    } else if (event === 'a-z') {
      this.sortKey = 'name'
      this.sortOrder = 'asc'
    } else if (event === 'z-a') {
      this.sortKey = 'name'
      this.sortOrder = 'desc'
    }
    this.applySort()
  }

  onSearch(searchValue: string) {
    this.searchString = searchValue
    const isLocalSearchApi = this.apiConfig.isLocalSearch === true

    if (this.isGetApi || isLocalSearchApi) {
      // For GET APIs and Local Search APIs - apply local search on already fetched data
      this.applyLocalSearch()
      this.applySort()
    } else {
      // For POST APIs - fetch from API with search string (reset to first page)
      this.fetchContent(false)
    }
  }

  clearSearch() {
    this.searchString = ''
    const isLocalSearchApi = this.apiConfig.isLocalSearch === true

    if (this.isGetApi || isLocalSearchApi) {
      // For GET APIs and Local Search APIs - restore full data
      this.applyLocalSearch()
      this.applySort()
    } else {
      // For POST APIs - fetch all data from first page
      this.fetchContent(false)
    }
  }
  async getRedirectUrlData(content: any) {
    if (content.externalId) {
      this.router.navigate(
        [`app/toc/ext/${content.contentId}`])
    } else {
      let urlData = await this.contSvc.getResourseLink(content)
      const queryParams = {
        ...urlData.queryParams,
      }
      this.router.navigate(
        [urlData.url],
        // { queryParams: urlData.queryParams }
        { queryParams }
      )
    }

  }
}
