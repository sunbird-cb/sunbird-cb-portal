import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'
import { GbSearchService } from '../../services/gb-search.service'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-app-learn-search',
  templateUrl: './learn-search.component.html',
  styleUrls: ['./learn-search.component.scss'],
})
export class LearnSearchComponent implements OnInit, OnChanges {
  @Input() param: any
  @Input() paramFilters: any = []
  searchResults: any = []
  searchRequestObject = {
    request: {
      filters: {
        contentType: [],
        primaryCategory: [],
        mimeType: [],
        source: [],
        mediaType: [],
      },
      query: '',
      sort_by: { lastUpdatedOn: '' },
      fields: [],
      facets: ['contentType', 'mimeType', 'source'],
    },
  }
  totalResults: any
  defaultThumbnail = ''
  myFilters: any = []
  rfilter: any
  primaryCategoryType: any = []
  contentType: any = []
  mimeType: any = []
  sourceType: any = []
  mediaType: any = []
  facets: any = []

  constructor(private searchSrvc: GbSearchService, private configSvc: ConfigurationsService) {}

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.getSearchedData()
  }

  ngOnChanges(changes: SimpleChanges) {
      if (changes.param.currentValue) {
        this.getSearchedData()
      }
  }

  getSearchedData() {
    const queryparam = {
      request: {
        filters: {
          visibility: ['Default'],
          contentType: [
            'Course',
            'Course Unit',
            'Resource',
          ],
        },
        query: this.param,
        sort_by: { lastUpdatedOn: '' },
        fields: [],
        facets: ['contentType', 'mimeType', 'source'],
      },
    }
    if (this.paramFilters && this.paramFilters.length > 0) {
        // queryparam.request.filters = this.paramFilters
      //   if (this.paramFilters.contentType) {
      //     const pf = {
      //       mainType:  'contentType',
      //       name: this.paramFilters.contentType[0].toLowerCase(),
      //       count: '',
      //       ischecked: true,
      //     }
      //     this.paramFilters = pf
      //     this.searchSrvc.addFilter(pf)
      //     this.myFilters.push(pf)
      //   }
      // }
      this.paramFilters.forEach((pf: any) => {
        this.myFilters.push(pf)
      })
      this.applyFilter(this.paramFilters)
    } else {
      this.facets = []
      this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
        this.searchResults = response.result.content
        this.totalResults = response.result.count
        this.facets = response.result.facets
        this.paramFilters = []
      })
    }
  }

  // viewContent(content: any) {
    // this.router.navigate([`/app/toc/${content.identifier}/overview?primaryCategory=/${content.primaryCategory}`])
  // }

  applyFilter(filter: any) {
    if (filter && filter.length > 0) {
      this.myFilters = filter
      const queryparam = this.searchRequestObject
      queryparam.request.filters.primaryCategory = []
      queryparam.request.filters.contentType = []
      queryparam.request.filters.mimeType = []
      queryparam.request.filters.source = []
      this.myFilters.forEach((mf: any) => {
        queryparam.request.query = this.param
        if (mf.mainType === 'contentType') {
          this.contentType.push(mf.name)
          queryparam.request.filters.contentType = this.contentType
        } else
        if (mf.mainType === 'primaryCategory') {
          this.primaryCategoryType.push(mf.name)
          queryparam.request.filters.primaryCategory = this.primaryCategoryType
        } else if (mf.mainType === 'mimeType') {
          this.mimeType.push(mf.name)
          queryparam.request.filters.mimeType = this.mimeType
        } else if (mf.mainType === 'source') {
          this.sourceType.push(mf.name)
          queryparam.request.filters.source = this.sourceType
        }  else if (mf.mainType === 'mediaType') {
          this.mediaType.push(mf.name)
          queryparam.request.filters.mediaType = this.mediaType
        }
      })
      this.facets = []
      this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
        this.searchResults = response.result.content
        this.totalResults = response.result.count
        this.facets = response.result.facets
        this.primaryCategoryType = []
        this.contentType = []
        this.mimeType = []
        this.sourceType = []
        this.mediaType = []
        this.paramFilters = []
      })
    } else {
      this.myFilters = []
      this.getSearchedData()
    }
  }

  removeFilter (mfilter: any) {
    this.rfilter = mfilter
    this.searchSrvc.notifyOther(this.rfilter)
  }
}
