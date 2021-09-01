import { Component, OnInit, Input } from '@angular/core'
import { BrowseCompetencyService } from '../../services/browse-competency.service'

@Component({
  selector: 'ws-app-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss'],
})
export class CompetencyCardComponent implements OnInit {
  @Input() competency!: any
  viewChildren = false

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
            'competencies_v2.name': [''],
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
            'competencies_v2.name',
            'competencies_v2.competencyType',
            'taxonomyPaths_v2.name',
        ],
    },
}

  constructor(
    private browseCompServ: BrowseCompetencyService
  ) { }

  ngOnInit() {
  }

  getCbps(viewChildren: boolean) {
    if (viewChildren) {
      this.searchReq.request.filters['competencies_v2.name'].splice(0, 1, this.competency.name)
      this.browseCompServ.fetchSearchData(this.searchReq).subscribe((res: any) => {
        if (res && res.result &&  res.result && res.result.content) {
          this.competency.contentData = res.result.content
        }
      })
    }
  }
}
