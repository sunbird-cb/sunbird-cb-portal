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
        visibility: ['Default'],
        contentType: [
          'Course',
          'Learning Resource',
          'Resource',
        ],
        primaryCategory: ['Course', 'Learning Resource'],
      },
      query: '',
      sort_by: { lastUpdatedOn: '' },
      fields: [],
      facets: ['primaryCategory', 'mimeType'],
    },
  }
  totalResults: any
  defaultThumbnail = ''

  constructor(private searchSrvc: GbSearchService, private configSvc: ConfigurationsService, private router: Router) { }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    this.searchRequestObject.request.query = this.param
    this.getSearchedData()
  }

  getSearchedData() {
    const queryparam = this.searchRequestObject
    this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
      this.searchResults = response.result.content
      this.totalResults = response.result.count
    })
  }

  viewContent(content: any) {
    // const url = `/app/toc/${content.identifier}/overview?primaryCategory=${content.primaryCategory}`
    // this.router.navigate([url])

    this.router.navigate([`/app/toc/${content.identifier}/overview?primaryCategory=/${content.primaryCategory}`])

    // this.router.navigate([
    //   `${forPreview ? '/author' : '/app'}/toc/${resolveData.data.identifier}/${
    //   resolveData.data.children.length ? 'contents' : 'overview'
    //   }?primaryCategory=${resolveData.data.primaryCategory}`,
    // ])
  }
}
