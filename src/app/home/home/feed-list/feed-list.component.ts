import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss']
})
export class FeedListComponent implements OnInit {
  contentStripData = {};

  constructor() { }

  ngOnInit() {

    this.contentStripData = {
      "strips": [
        {
          "key": "continueLearning",
          "logo": "school",
          "title": "Go to Learn hub",
          "stripTitleLink": {
            "link": "/page/learn",
            "icon": "navigate_next"
          },
          "loader": true,
          "sliderConfig": {
            "showNavs" : false,
            "showDots": false
          },
          "stripBackground": "",
          "titleDescription": "Continue learning1",
          "stripConfig": {
            "cardSubType": "standard"
          },
          "viewMoreUrl": {
            "path": "/page/learn",
            "viewMoreText": "Show all",
            "queryParams": {}
          },
          "tabs": [
            {
              "label": "In progress",
              "value": "inprogress",
              "requestRequired": false
            },
            {
              "label": "Completed",
              "value": "completed",
              "requestRequired": false
            },
          ],
          "filters": [],
          "request": {
            "enrollmentList": {
              "path": "/apis/proxies/v8/learner/course/v1/user/enrollment/list/<id>",
              "queryParams": {
                "orgdetails": "orgName,email",
                "licenseDetails": "name,description,url",
                "fields": "contentType,name,channel,mimeType,appIcon,resourceType,identifier,trackable,objectType,organisation,pkgVersion,version,trackable,primaryCategory,posterImage,duration,creatorLogo,license,programDuration",
                "batchDetails": "name,endDate,startDate,status,enrollmentType,createdBy,certificates"
              }
            }
          }
        },
        {
          "key": "trendingInDepartment",
          "logo": "school",
          "title": "Trending in your department",
          "stripTitleLink": {
            "link": "",
            "icon": ""
          },
          "sliderConfig": {
            "showNavs" : true,
            "showDots": true
          },
          "stripBackground": "",
          "titleDescription": "Trending in your department",
          "stripConfig": {
            "cardSubType": "standard"
          },
          "viewMoreUrl": {
            "path": "/page/learn",
            "viewMoreText": "Show all",
            "queryParams": {}
          },
          "tabs": [
            {
              "label": "Courses",
              "value": "courses",
              "requestRequired": true,
              "request": {
                "enrollmentList": {
                  "path": "/apis/proxies/v8/learner/course/v1/user/enrollment/list/<id>",
                  "queryParams": {
                    "orgdetails": "orgName,email",
                    "licenseDetails": "name,description,url",
                    "fields": "contentType,name,channel,mimeType,appIcon,resourceType,identifier,trackable,objectType,organisation,pkgVersion,version,trackable,primaryCategory,posterImage,duration,creatorLogo,license,programDuration",
                    "batchDetails": "name,endDate,startDate,status,enrollmentType,createdBy,certificates"
                  }
                }
              }
            },
            {
              "label": "Programs",
              "value": "programs",
              "requestRequired": true,
              "request": {
                "enrollmentList": {
                  "path": "/apis/proxies/v8/learner/course/v1/user/enrollment/list/<id>",
                  "queryParams": {
                    "orgdetails": "orgName,email",
                    "licenseDetails": "name,description,url",
                    "fields": "contentType,name,channel,mimeType,appIcon,resourceType,identifier,trackable,objectType,organisation,pkgVersion,version,trackable,primaryCategory,posterImage,duration,creatorLogo,license,programDuration",
                    "batchDetails": "name,endDate,startDate,status,enrollmentType,createdBy,certificates"
                  }
                }
              }
            },
          ],
          "filters": [],
          "request": {
            "enrollmentList": {
              "path": "/apis/proxies/v8/learner/course/v1/user/enrollment/list/<id>",
              "queryParams": {
                "orgdetails": "orgName,email",
                "licenseDetails": "name,description,url",
                "fields": "contentType,name,channel,mimeType,appIcon,resourceType,identifier,trackable,objectType,organisation,pkgVersion,version,trackable,primaryCategory,posterImage,duration,creatorLogo,license,programDuration",
                "batchDetails": "name,endDate,startDate,status,enrollmentType,createdBy,certificates"
              }
            }
          }
        },
        {
          "key": "blendedPrograms",
          "logo": "school",
          "title": "Blended Program",
          "stripTitleLink": {
            "link": "",
            "icon": ""
          },
          "sliderConfig": {
            "showNavs" : true,
            "showDots": true
          },
          "stripBackground": "",
          "titleDescription": "Blended Program",
          "stripConfig": {
            "cardSubType": "standard"
          },
          "viewMoreUrl": {
            "path": "/page/learn",
            "viewMoreText": "Show all",
            "queryParams": {}
          },
          "tabs": [],
          "filters": [],
          "request": {
            "searchV6": {
              "request": {
                "filters": {
                  "primaryCategory": [
                    "Blended Program"
                  ],
                  "contentType": [
                    "Course"
                  ],
                  "batches.endDate": { ">=": "new Date().toISOString().substring(0,10)" }
                },
                "offset": 0,
                "limit": 20,
                "query": "",
                "sort_by": {
                  "lastUpdatedOn": "desc"
                },
                "fields": [
                  "name",
                  "appIcon",
                  "instructions",
                  "description",
                  "purpose",
                  "mimeType",
                  "gradeLevel",
                  "identifier",
                  "medium",
                  "pkgVersion",
                  "board",
                  "subject",
                  "resourceType",
                  "primaryCategory",
                  "contentType",
                  "channel",
                  "organisation",
                  "trackable",
                  "license",
                  "posterImage",
                  "idealScreenSize",
                  "learningMode",
                  "creatorLogo",
                  "duration",
                  "version",
                  "programDuration"
                ]
              }
            }
          }
        },
      ]
    }
  }
}
