import { Component, OnInit, Input } from '@angular/core'
import { GbSearchService } from '../../services/gb-search.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-app-learn-search',
  templateUrl: './learn-search.component.html',
  styleUrls: ['./learn-search.component.scss'],
})
export class LearnSearchComponent implements OnInit {
  @Input() param: any
  searchResults: any = []
  searchRequestObject = {
    request: {
      filters: {
        contentType: [],
        primaryCategory: [],
        mimeType: [],
        source: [],
      },
      query: '',
      sort_by: { lastUpdatedOn: '' },
      fields: [],
      facets: [],
    },
  }
  totalResults: any
  defaultThumbnail = ''
  myFilters = []
  rfilter: any
  primaryCategoryType: any = []
  mimeType: any = []
  sourceType: any = []
  facets: any = []

  constructor(private searchSrvc: GbSearchService, private configSvc: ConfigurationsService, private router: Router) { }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.getSearchedData()
  }

  getSearchedData() {
    const queryparam = {
      request: {
        filters: {
          visibility: ['Default'],
          contentType: [
            'Course',
            'Learning Resource',
            'Resource',
          ],
          primaryCategory: ['Course', 'Learning Resource'],
        },
        query: this.param,
        sort_by: { lastUpdatedOn: '' },
        fields: [],
        facets: ['primaryCategory', 'mimeType', 'mediaType', 'source'],
      },
    }
    this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
      this.searchResults = response.result.content
      this.totalResults = response.result.count
      this.facets = response.result.facets
    })
  }

  viewContent(content: any) {
    // const url = `/app/toc/${content.identifier}/overview?primaryCategory=${content.primaryCategory}`

    // this.router.navigate([`/app/toc/${content.identifier}/overview?primaryCategory=/${content.primaryCategory}`])
    let url = `/app/toc/${content.identifier}/overview`
    url += content.primaryCategory ? `?primaryCategory=/${content.primaryCategory}` : ''
    this.router.navigate([url])

    // this.router.navigate([
    //   `${forPreview ? '/author' : '/app'}/toc/${resolveData.data.identifier}/${
    //   resolveData.data.children.length ? 'contents' : 'overview'
    //   }?primaryCategory=${resolveData.data.primaryCategory}`,
    // ])
  }

  applyFilter(filter: any) {
    if (filter && filter.length > 0) {
      this.myFilters = filter
      const queryparam = this.searchRequestObject
      queryparam.request.filters.primaryCategory = []
      queryparam.request.filters.mimeType = []
      queryparam.request.filters.source = []
      this.myFilters.forEach((mf: any) => {
        queryparam.request.query = this.param
        if (mf.mainType === 'primaryCategory') {
          this.primaryCategoryType.push(mf.name)
          queryparam.request.filters.primaryCategory = this.primaryCategoryType
        } else if (mf.mainType === 'mimeType') {
          this.mimeType.push(mf.name)
          queryparam.request.filters.mimeType = this.mimeType
        } else if (mf.mainType === 'source') {
          this.sourceType.push(mf.name)
          queryparam.request.filters.source = this.sourceType
        }
      })
      this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
        this.searchResults = response.result.content
        this.totalResults = response.result.count
        this.primaryCategoryType = []
        this.mimeType = []
        this.sourceType = []
      })
    } else {
      this.getSearchedData()
    }
  }

  removeFilter (mfilter: any) {
    this.rfilter = mfilter
  }
}
