import { Component, OnInit, OnDestroy } from '@angular/core'
import { BrowseCompetencyService } from '../../services/browse-competency.service'
import { NSBrowseCompetency } from '../../models/competencies.model'
// tslint:disable
import _ from 'lodash'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'ws-app-competency-details',
  templateUrl: './competency-details.component.html',
  styleUrls: ['./competency-details.component.scss'],
})
export class CompetencyDetailsComponent implements OnInit, OnDestroy {
  private paramSubscription: Subscription | null = null
  competencyData: any
  filterForm: FormGroup | undefined
  facets: any
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Competencies' , url: '/app/learn/browse-by/competency', icon: '' },
  ]
  competencyName = ''
  courses: any[] = []
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
        facets: [
            'primaryCategory',
            'mimeType',
            'source',
            // 'competencies_v2.name',
            // 'competencies_v2.competencyType',
            // 'taxonomyPaths_v2.name',
        ],
    },
}
  constructor(
    private browseCompServ: BrowseCompetencyService,
    private activatedRoute: ActivatedRoute,
  ) {

   }

  ngOnInit() {
    this.filterForm = new FormGroup({
      filters: new FormControl(''),
    })
    this.paramSubscription = this.activatedRoute.params.subscribe(async params => {
      this.competencyName = _.get(params, 'competency')
      this.titles.push({ title: this.competencyName , url: 'none', icon: '' })
    })

    // Fetch initial data
    this.searchCompetency()
    this.getCbps()

  }

  searchCompetency(_filters?: any) {
    const searchJson = [
      { type: 'COMPETENCY', field: 'name', keyword: this.competencyName ? this.competencyName : '' },
      { type: 'COMPETENCY', field: 'status', keyword: 'VERIFIED' },
    ]
    const req = {
      searches: searchJson,
    }
    this.browseCompServ
      .searchCompetency(req)
      .subscribe((response: NSBrowseCompetency.ICompetencieResponse) => {
        if (response.statusInfo && response.statusInfo.statusCode === 200) {
          console.log('response.responseData :: ',response.responseData)
          if(response.responseData && response.responseData.length) {
            this.competencyData = response.responseData[0]
          }
        }
      })
  }

  getCbps() {
      this.searchReq.request.filters['competencies_v2.name'].splice(0, 1, this.competencyName)
      this.browseCompServ.fetchSearchData(this.searchReq).subscribe((res: any) => {
        if (res && res.result &&  res.result && res.result.content) {
          this.courses = res.result.content
        }
        if (res && res.result &&  res.result && res.result.facets) {
          this.facets = res.result.facets
        }
      })
  }
  

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
  }

}
