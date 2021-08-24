import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss'],
})
export class CompetencyCardComponent implements OnInit {
  @Input() competency!: any
  viewChildren = false

  constructor() { }

  ngOnInit() {
    this.initData()
  }

  initData() {
    this.competency.contentData = [
      {
        'trackable': {
          'enabled': 'Yes',
          'autoBatch': 'Yes'
        },
        'identifier': 'do_113253022552432640127',
        'orgDetails': {
          'orgName': 'igot-karmayogi',
          'email': null,
        },
        'channel': '0131397178949058560',
        'organisation': [
          'igot-karmayogi'
        ],
        'description': 'summary',
        'mimeType': 'application/vnd.ekstep.content-collection',
        'pkgVersion': 1,
        'objectType': 'Content',
        'appIcon': 'https://igot.blob.core.windows.net/public/content/do_113253022552432640127/artifact/do_113253052815720448138_1617804298952_pnggrad16rgb1617804299081.thumb.png',
        'primaryCategory': 'Course',
        'leafNodesCount': 2,
        'name': 'title for course',
        'contentType': 'Course'
      }, {
        "trackable": {
          "enabled": "Yes",
          "autoBatch": "Yes"
        },
        "identifier": "do_11327642937307955214059",
        "orgDetails": {
          "orgName": "igot-karmayogi",
          "email": null
        },
        "channel": "0131397178949058560",
        "organisation": [
          "LBSNAA"
        ],
        "description": "By the end of this exercise, we will be able to understand about the definition of Economics in terms of GDP, GNP, Production possibility frontier & how the economy is important for public administrators and the assessment is available to check the knowledge.",
        "mimeType": "application/vnd.ekstep.content-collection",
        "pkgVersion": 1,
        "objectType": "Content",
        "appIcon": "https://igot.blob.core.windows.net/public/content/do_11327642937307955214059/artifact/do_11327642937389875214060_1620657882754_introtoeconomics11602650489417.thumb.jpg",
        "primaryCategory": "Course",
        "leafNodesCount": 7,
        "name": "Introduction to Economics",
        "contentType": "Course",
        "resourceType": "Course"
      }, {
        "trackable": {
          "enabled": "Yes",
          "autoBatch": "Yes"
        },
        "identifier": "do_11327642964236697614089",
        "orgDetails": {
          "orgName": "igot-karmayogi",
          "email": null
        },
        "channel": "0131397178949058560",
        "organisation": [
          "Ministry of Power"
        ],
        "description": "Geological Studies for Hydropower Projects",
        "mimeType": "application/vnd.ekstep.content-collection",
        "pkgVersion": 1,
        "objectType": "Content",
        "appIcon": "https://igot.blob.core.windows.net/public/content/do_11327642964236697614089/artifact/do_11327642964319436814090_1620657915620_hydroimage11618555286641.thumb.jpg",
        "primaryCategory": "Course",
        "leafNodesCount": 2,
        "name": "ENGINEERING GEOLOGICAL",
        "contentType": "Course",
        "resourceType": "Course"
      },
    ]
  }

}
