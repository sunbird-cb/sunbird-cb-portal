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
          "sliderConfig": {
            "showNavs" : true,
            "showDots": true
          },
          "stripBackground": "",
          "titleDescription": "Continue learning1",
          "stripConfig": {
            "cardSubType": "standard"
          },
          "viewMoreUrl": {
            "path": "/page/learn",
            "viewMoreText": "Learn",
            "queryParams": {}
          },
          "tabs": [
            {
              "label": "In progress",
              "value": "inprogress",
            },
            {
              "label": "Completed",
              "value": "completed"
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
        }
      ]
    }
  }
}
