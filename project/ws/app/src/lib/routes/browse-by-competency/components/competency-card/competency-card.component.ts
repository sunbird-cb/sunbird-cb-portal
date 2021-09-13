import { Component, OnInit, Input } from '@angular/core'
import { BrowseCompetencyService } from '../../services/browse-competency.service'

@Component({
  selector: 'ws-app-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss'],
})
export class CompetencyCardComponent implements OnInit {
  @Input() competency!: any
  public displayLoader = false

  searchReq = {
    request: {
        filters: {
            primaryCategory: [
                'Course',
                'Program',
            ],
            status: [
                'Live',
            ],
            'competencies_v3.name': [''],
        },
        query: '',
        sort_by: {
            lastUpdatedOn: '',
        },
        fields: [],
        limit: 3,
        offset: 0,
        facets: [
            'primaryCategory',
            'mimeType',
            'source',
            'competencies_v3.name',
            'competencies_v3.competencyType',
            'taxonomyPaths_v2.name',
        ],
    },
}

  constructor(
    private browseCompServ: BrowseCompetencyService
  ) { }

  ngOnInit() {
    this.competency.viewChildren = false
  }

  getCbps(viewChildren: boolean) {
    if (viewChildren) {
      this.displayLoader = true
      this.searchReq.request.filters['competencies_v3.name'].splice(0, 1, this.competency.name)
      this.browseCompServ.fetchSearchData(this.searchReq).subscribe(
        (res: any) => {
          this.displayLoader = false
          if (res && res.result &&  res.result && res.result.content) {
            this.competency.contentData = res.result.content
          }
        },
        _err => this.displayLoader = false,
        () => this.displayLoader = false
      )
    }
  }
}
