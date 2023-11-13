import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit { 
  widgetData = {};  
  sliderData = {}; 
  contentStripData = {};
  discussStripData = {};
  networkStripData = {};
  carrierStripData = {}; 
 
  constructor() { }

  ngOnInit() {
    this.widgetData = {
      "widgets": [
        [
          {
            "dimensions": {},
            "className": "",
            "widget": {
              "widgetType": "card",
              "widgetSubType": "cardHomeNotify",
              "widgetData": {}
            }
          }
        ],
        [
          {
            "dimensions": {},
            "className": "ws-mat-primary-lite-background-important new-box-hubs",
            "widget": {
              "widgetType": "card",
              "widgetSubType": "cardHomeHubs",
              "widgetData": {}
            }
          }
        ],             
        [
          {
            "dimensions": {
              "small": 12,
              "medium": 2
            },
            "className": "",
            "widget": {
              "widgetType": "menus",
              "widgetSubType": "leftMenu",
              "widgetData": [
                {
                  "name": "Users",
                  "key": "users",
                  "render": true,
                  "badges": {
                    "enabled": false,
                    "uri": ""
                  },
                  "enabled": true,
                  "routerLink": "/app/home"
                },
                {
                  "name": "Roles and Access",
                  "key": "roles-access",
                  "render": true,
                  "badges": {
                    "enabled": false,
                    "uri": ""
                  },
                  "enabled": true,
                  "routerLink": "/app/home/roles-access"
                },
                {
                  "name": "Approvals",
                  "key": "approvals",
                  "render": true,
                  "badges": {
                    "enabled": false,
                    "uri": ""
                  },
                  "enabled": true,
                  "routerLink": "/app/home/approvals"
                },
                {
                  "name": "Competencies",
                  "key": "competencies",
                  "render": true,
                  "badges": {
                    "enabled": false,
                    "uri": ""
                  },
                  "enabled": true,
                  "routerLink": "/app/notifications"
                },
                {
                  "name": "About",
                  "key": "about",
                  "render": true,
                  "badges": {
                    "enabled": false,
                    "uri": ""
                  },
                  "enabled": true,
                  "routerLink": "/app/notifications"
                }
              ]
            }
          },
          {
            "dimensions": {
              "small": 12,
              "medium": 10
            },
            "className": "",
            "widget": {
              "widgetType": "contentStrip",
              "widgetSubType": "contentStripMultipleNew",
              "widgetData": {
                "strips": []
              }
            }
          }
        ]
      ]
    };

    this.discussStripData = {
      "strips": [
        {
          "key": "discuss",
          "logo": "forum",
          "title": "discuss",
          "stripBackground": "assets/instances/eagle/background/discuss.svg",
          "titleDescription": "Trending discussions",
          "stripConfig": {
            "cardSubType": "cardHomeDiscuss"
          },
          "viewMoreUrl": {
            "path": "/app/discuss/home",
            "viewMoreText": "Discuss",
            "queryParams": {}
          },
          "filters": [],
          "request": {
            "api": {
              "path": "/apis/proxies/v8/discussion/recent",
              "queryParams": {}
            }
          }
        }
      ]
    };

    this.networkStripData = {
      "strips": [
        {
          "key": "network",
          "logo": "group",
          "title": "network",
          "stripBackground": "assets/instances/eagle/background/network.svg",
          "titleDescription": "Connect with people you may know",
          "stripConfig": {
            "cardSubType": "cardHomeNetwork"
          },
          "viewMoreUrl": {
            "path": "/app/network-v2",
            "viewMoreText": "Network",
            "queryParams": {}
          },
          "filters": [],
          "request": {
            "api": {
              "path": "/apis/protected/v8/connections/v2/connections/recommended/userDepartment",
              "queryParams": ""
            }
          }
        }
      ]
    };

    this.carrierStripData = {
      "widgets": 
      [
        {
          "dimensions": {},
          "className": "",
          "widget": {
            "widgetType": "carrierStrip",
            "widgetSubType": "CarrierStripMultiple",
            "widgetData": {
              "strips": [
                {
                  "key": "Career",
                  "logo": "work",
                  "title": "Careers",
                  "stripBackground": "assets/instances/eagle/background/careers.svg",
                  "titleDescription": "Latest openings",
                  "stripConfig": {
                    "cardSubType": "cardHomeCarrier"
                  },
                  "viewMoreUrl": {
                    "path": "/app/careers/home",
                    "viewMoreText": "Career",
                    "queryParams": {}
                  },
                  "filters": [],
                  "request": {
                    "api": {
                      "path": "/apis/protected/v8/discussionHub/categories/1",
                      "queryParams": {}
                    }
                  }
                }
              ]
            }
          }
        }
      ],
    };

    this.sliderData = [
      {
        "banners": {
          "l": "assets/instances/eagle/banners/home/1/l.jpg",
          "m": "assets/instances/eagle/banners/home/1/m.jpg",
          "s": "assets/instances/eagle/banners/home/1/s.jpg",
          "xl": "assets/instances/eagle/banners/home/1/xl.jpg",
          "xs": "assets/instances/eagle/banners/home/1/xs.jpg",
          "xxl": "assets/instances/eagle/banners/home/1/xxl.jpg"
        },
        "redirectUrl": "/app/globalsearch",
        "queryParams": {
          "tab": "Learn",
          "q": "Salesforce",
          "lang": "en",
          "f": "{}"
        },
        "title": ""
      },
      {
        "banners": {
          "l": "assets/instances/eagle/banners/orgs/l.png",
          "m": "assets/instances/eagle/banners/orgs/m.png",
          "s": "assets/instances/eagle/banners/orgs/s.png",
          "xl": "assets/instances/eagle/banners/orgs/xl.png",
          "xs": "assets/instances/eagle/banners/orgs/xs.png",
          "xxl": "assets/instances/eagle/banners/orgs/xxl.png"
        },
        "redirectUrl": "/app/organisation/dopt",
        "queryParams": {
          "tab": "Learn",
          "q": "Salesforce",
          "lang": "en",
          "f": "{}"
        },
        "title": ""
      }
    ]  
  }

  handleButtonClick(): void {
    console.log("Working!!!"); 
  } 

}
