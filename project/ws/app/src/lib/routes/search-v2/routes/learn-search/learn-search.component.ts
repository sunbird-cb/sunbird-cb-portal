import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'
import { GbSearchService } from '../../services/gb-search.service'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils'

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

  constructor(
    private searchSrvc: GbSearchService,
    private configSvc: ConfigurationsService,
    private events: EventService
  ) { }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.getFacets()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.param.currentValue) {
      this.searchResults = []
      this.totalResults = 0
      if (this.myFilters && this.myFilters.length > 0) {
        this.myFilters.forEach((fil: any) => {
          this.removeFilter(fil)
        })
      }
      this.getStartupData()
    }
  }

  getFacets() {
    const queryparam = {
      request: {
        filters: {
          visibility: ['Default'],
          contentType: [
            'Course',
            'Resource',
          ],
        },
        sort_by: { lastUpdatedOn: '' },
        fields: [],
        facets: ['contentType', 'mimeType', 'source'],
      },
    }
    this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
      this.facets = response.result.facets
      this.getStartupData()
    })
  }

  getStartupData() {
    if (!this.paramFilters || this.paramFilters === 'undefined') {
      this.paramFilters = [{
         mainType:  'contentType',
         name: 'course',
         count: '',
         ischecked: true,
       }]
     }
     if (this.paramFilters && this.paramFilters.length > 0) {
       this.paramFilters.forEach((pf: any) => {
         const indx = this.myFilters.filter((x: any) => x.name === pf.name)
         if (indx.length === 0) {
           this.myFilters.push(pf)
         }
       })
       this.applyFilter(this.paramFilters)
     } else {
       this.getSearchedData()
     }
  }

  getSearchedData() {
    if (this.myFilters.length === 0) {
      const queryparam = {
        request: {
          filters: {
            contentType: [
              'Course',
              // 'Course Unit',
              'Resource',
            ],
          },
          query: this.param,
          sort_by: { lastUpdatedOn: '' },
          fields: [],
          facets: ['contentType', 'mimeType', 'source'],
        },
      }
      this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
        this.searchResults = response.result.content
        this.totalResults = response.result.count
        // this.facets = response.result.facets
        this.paramFilters = []
      })
    }
    // if ((this.paramFilters && this.paramFilters.length > 0) || (this.myFilters && this.myFilters.length > 0)) {
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
      // this.paramFilters.forEach((pf: any) => {
      //   const indx = this.myFilters.filter((x: any) => x.name === pf.name)
      //   if (indx.length === 0) {
      //     this.myFilters.push(pf)
      //   }
      // })
      // this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
        // this.facets = response.result.facets
        // if (response) { }
        // this.applyFilter(this.paramFilters)
      // })
    // }
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
          const indx = this.contentType.filter((x: any) => x === mf.name)
          if (indx.length === 0) {
            this.contentType.push(mf.name)
            queryparam.request.filters.contentType = this.contentType
          }
          queryparam.request.filters.contentType = this.contentType
        } else if (mf.mainType === 'primaryCategory') {
          this.primaryCategoryType.push(mf.name)
          queryparam.request.filters.primaryCategory = this.primaryCategoryType
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
        }
      })

      if (queryparam.request.filters.contentType.length === 0) {
        this.contentType.push('Course')
        this.contentType.push('Resource')
        queryparam.request.filters.contentType = this.contentType
      }

      if (this.param) {
        queryparam.request.query = this.param
      }
      // this.facets = []
      this.searchResults = []
      this.totalResults = 0
      this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
        this.searchResults = response.result.content
        this.totalResults = response.result.count
        // this.facets = response.result.facets
        this.primaryCategoryType = []
        this.contentType = []
        this.mimeType = []
        this.sourceType = []
        this.mediaType = []
        this.paramFilters = []
      })
    } else {
      this.myFilters = filter
      this.getSearchedData()
    }
  }

  removeFilter(mfilter: any) {
    this.rfilter = mfilter
    this.searchSrvc.notifyOther(this.rfilter)
  }

  raiseTelemetry(content: any) {
    if (content) {
      this.events.raiseInteractTelemetry('click', `card-learnSearch`, {
        contentId: content.identifier || '',
        contentType: content.contentType,
        rollup: {},
        ver: content.version,
      })
    }
  }
}
