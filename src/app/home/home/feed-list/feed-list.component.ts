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
            "showDots": false,
            "maxWidgets": 2,
          },
          "stripBackground": "",
          "titleDescription": "My Learning",
          "stripConfig": {
            "cardSubType": "standard"
          },
          "viewMoreUrl": {
            "path": "/page/learn",
            "viewMoreText": "Show all",
            "queryParams": {}
          },
          "secondaryHeading" : {
            "title": "My learning",
            "viewMoreUrl": {
              "path": "/page/learn",
              "viewMoreText": "Show all",
              "queryParams": {}
            },
          },

          "tabs": [
            {
              "label": "In progress",
              "value": "inprogress",
              "computeDataOnClick": false,
              "showTabDataCount": true,
              "requestRequired": false,
              "maxWidgets": 2,
            },
            {
              "label": "Completed",
              "value": "completed",
              "computeDataOnClick": false,
              "showTabDataCount": true,
              "requestRequired": false,
              "maxWidgets": 2,
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
            "showDots": true,
            "maxWidgets": 12,
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
          "noDataWidget": {
            "widgetData": {
              "errorType": "contentUnavailable"
            },
            "widgetSubType": "errorResolver",
            "widgetType": "errorResolver"
          },
          "loader": true,
          "errorWidget": {
            "widgetData": {
              "errorType": "internalServer"
            },
            "widgetSubType": "errorResolver",
            "widgetType": "errorResolver"
          },
          "tabs": [
            {
              "label": "Courses",
              "value": "courses",
              "computeDataOnClick": false,
              "computeDataOnClickKey": '',
              "requestRequired": true,
              "showTabDataCount": false,
              "maxWidgets": 12,
              "request": {
                "trendingSearch": {
                  "request": {
                      "filters": {
                        "primaryCategory": [
                            "courses",
                        ],
                        "organisation": "<orgID>"
                      },
                      "limit": 15
                  }
                }
              }
            },
            {
              "label": "Programs",
              "value": "programs",
              "computeDataOnClick": false,
              "computeDataOnClickKey": '',
              "requestRequired": true,
              "showTabDataCount": false,
              "maxWidgets": 12,
              "request": {
                "trendingSearch": {
                  "request": {
                      "filters": {
                        "primaryCategory": [
                            "programs",
                        ],
                        "organisation": "<orgID>"
                      },
                      "limit": 15
                  }
                }
              }
            },
          ],
          "filters": [],
          "request": {
            "trendingSearch": {
              "request": {
                    "filters": {
                      "primaryCategory": [
                          "programs",
                          "courses",
                      ],
                      "organisation": "across"
                  },
                  "limit": 15
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
            "showDots": true,
            "maxWidgets": 12,
          },
          "loader": true,
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
        {
          "key": "trendingAcrossDepartment",
          "logo": "school",
          "title": "Trending across department",
          "stripTitleLink": {
            "link": "",
            "icon": ""
          },
          "sliderConfig": {
            "showNavs" : true,
            "showDots": true,
            "maxWidgets": 12,
          },
          "stripBackground": "",
          "titleDescription": "Trending across department",
          "stripConfig": {
            "cardSubType": "standard"
          },
          "viewMoreUrl": {
            "path": "/page/learn",
            "viewMoreText": "Show all",
            "queryParams": {}
          },
          "noDataWidget": {
            "widgetData": {
              "errorType": "contentUnavailable"
            },
            "widgetSubType": "errorResolver",
            "widgetType": "errorResolver"
          },
          "loader": true,
          "errorWidget": {
            "widgetData": {
              "errorType": "internalServer"
            },
            "widgetSubType": "errorResolver",
            "widgetType": "errorResolver"
          },
          "tabs": [
            {
              "label": "Courses",
              "value": "courses",
              "computeDataOnClick": false,
              "computeDataOnClickKey": '',
              "requestRequired": true,
              "showTabDataCount": false,
              "maxWidgets": 12,
              "request": {
                "trendingSearch": {
                  "request": {
                      "filters": {
                        "primaryCategory": [
                            "courses",
                        ],
                        "organisation": "across"
                      },
                      "limit": 15
                  }
                }
              }
            },
            {
              "label": "Programs",
              "value": "programs",
              "computeDataOnClick": false,
              "computeDataOnClickKey": '',
              "requestRequired": true,
              "showTabDataCount": false,
              "maxWidgets": 12,
              "request": {
                "trendingSearch": {
                  "request": {
                      "filters": {
                        "primaryCategory": [
                            "programs",
                        ],
                        "organisation": "across"
                      },
                      "limit": 15
                  }
                }
              }
            },
          ],
          "filters": [],
          "request": {
            "trendingSearch": {
              "request": {
                    "filters": {
                      "primaryCategory": [
                          "programs",
                          "courses",
                      ],
                      "organisation": "across"
                  },
                  "limit": 15
              }
            }
          }
        },
        {
          "key": "learnUnder30Min",
          "logo": "school",
          "title": "Learning under 30 min",
          "stripTitleLink": {
            "link": "",
            "icon": ""
          },
          "sliderConfig": {
            "showNavs" : true,
            "showDots": true,
            "maxWidgets": 12,
          },
          "loader": true,
          "stripBackground": "",
          "titleDescription": "Learning under 30 min",
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
                    "Course",
                    "Program"
                  ],
                  "duration":{"<=":"1800000"},
                },
                "offset": 0,
                "limit": 15,
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
        {
          "key": "certificationsOfWeek",
          "logo": "school",
          "title": "Certifications of the week",
          "stripTitleLink": {
            "link": "",
            "icon": ""
          },
          "sliderConfig": {
            "showNavs" : true,
            "showDots": true,
            "maxWidgets": 12,
          },
          "loader": true,
          "stripBackground": "",
          "titleDescription": "Certifications of the week",
          "stripConfig": {
            "cardSubType": "card-wide"
          },
          "viewMoreUrl": {
            "path": "/page/learn",
            "viewMoreText": "Show all",
            "queryParams": {}
          },
          "tabs": [],
          "filters": [],
          "request": {
            "trendingSearch": {
              "request": {
                    "filters": {
                      "primaryCategory": [
                          "certifications",
                      ],
                      "organisation": "across"
                  },
                  "limit": 15
              },
              "responseKey": "certifications"
            }
          }
        },
      ]
    }
  }
}
