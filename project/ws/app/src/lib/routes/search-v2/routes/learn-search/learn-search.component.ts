import { Component, OnInit } from '@angular/core'
import { GbSearchService } from '../../services/gb-search.service'

@Component({
  selector: 'ws-app-learn-search',
  templateUrl: './learn-search.component.html',
  styleUrls: ['./learn-search.component.scss'],
})
export class LearnSearchComponent implements OnInit {
  searchRequestObject = {
    request: {
      filters: {
        visibility: ['Default'],
        contentType: [
          'Course',
          'Learning Resource',
          'Resource',
        ],
      },
      query: 'econo',
      sort_by: { lastUpdatedOn: 'desc' },
      fields: ['keywords'],
      facets: ['primaryCategory', 'mimeType'],
    },
  }

  constructor(private searchSrvc: GbSearchService) { }

  ngOnInit() {
    this.getSearchedData()
  }

  getSearchedData() {
    const queryparam = this.searchRequestObject
    this.searchSrvc.fetchSearchData(queryparam).subscribe((response: any) => {
      console.log('search response', response)
    })
  }

}
