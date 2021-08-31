import { Component, OnInit, OnDestroy } from '@angular/core'
import { BrowseCompetencyService } from '../../services/browse-competency.service'
import { NSBrowseCompetency } from '../../models/competencies.model'
// tslint:disable
import _ from 'lodash'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ws-app-competency-details',
  templateUrl: './competency-details.component.html',
  styleUrls: ['./competency-details.component.scss'],
})
export class CompetencyDetailsComponent implements OnInit, OnDestroy {
  private paramSubscription: Subscription | null = null
  competencyData: any
  titles = [
    { title: 'Learn', url: '/page/learn', icon: 'school' },
    { title: 'All Competencies' , url: '/app/learn/browse-by/competency', icon: '' },
  ]
  competencyName = ''
  courses: any[] = []
  constructor(
    private browseCompServ: BrowseCompetencyService,
    private activatedRoute: ActivatedRoute,
  ) {

   }

  ngOnInit() {
    this.paramSubscription = this.activatedRoute.params.subscribe(async params => {
      this.competencyName = _.get(params, 'competency')
      this.titles.push({ title: this.competencyName , url: 'none', icon: '' })
    })

    // Fetch initial data
    this.searchCompetency()

    this.initData()
  }

  initData() {
    this.courses = [
      {
        trackable: {
          enabled: 'Yes',
          autoBatch: 'Yes',
        },
        identifier: 'do_113253022552432640127',
        orgDetails: {
          orgName: 'igot-karmayogi',
          email: null,
        },
        channel: '0131397178949058560',
        organisation: [
          'igot-karmayogi',
        ],
        description: 'summary',
        mimeType: 'application/vnd.ekstep.content-collection',
        pkgVersion: 1,
        objectType: 'Content',
        appIcon: 'https://igot.blob.core.windows.net/public/content/do_113253022552432640127/artifact/do_113253052815720448138_1617804298952_pnggrad16rgb1617804299081.thumb.png',
        primaryCategory: 'Course',
        leafNodesCount: 2,
        name: 'title for course',
        contentType: 'Course',
      }, {
        'trackable': {
          'enabled': 'Yes',
          'autoBatch': 'Yes'
        },
        'identifier': 'do_11327642937307955214059',
        'orgDetails': {
          'orgName': 'igot-karmayogi',
          'email': null,
        },
        'channel': '0131397178949058560',
        'organisation': [
          'LBSNAA'
        ],
        'description': 'By the end of this exercise, we will be able to understand about the definition of Economics in terms of GDP, GNP, Production possibility frontier & how the economy is important for public administrators and the assessment is available to check the knowledge.',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'pkgVersion': 1,
        'objectType': 'Content',
        'appIcon': 'https://igot.blob.core.windows.net/public/content/do_11327642937307955214059/artifact/do_11327642937389875214060_1620657882754_introtoeconomics11602650489417.thumb.jpg',
        'primaryCategory': 'Course',
        'leafNodesCount': 7,
        'name': 'Introduction to Economics',
        'contentType': 'Course',
        'resourceType': 'Course'
      }, {
        'trackable': {
          'enabled': 'Yes',
          'autoBatch': 'Yes'
        },
        'identifier': 'do_11327642964236697614089',
        'orgDetails': {
          'orgName': 'igot-karmayogi',
          'email': null,
        },
        'channel': '0131397178949058560',
        'organisation': [
          'Ministry of Power'
        ],
        'description': 'Geological Studies for Hydropower Projects',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'pkgVersion': 1,
        'objectType': 'Content',
        'appIcon': 'https://igot.blob.core.windows.net/public/content/do_11327642964236697614089/artifact/do_11327642964319436814090_1620657915620_hydroimage11618555286641.thumb.jpg',
        'primaryCategory': 'Course',
        'leafNodesCount': 2,
        'name': 'ENGINEERING GEOLOGICAL',
        'contentType': 'Course',
        'resourceType': 'Course'
      },
    ]
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

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
  }

}
