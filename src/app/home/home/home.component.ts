import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';
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
  clientList: {} | undefined
  homeConfig: any = {}; 
  constructor(private activatedRoute:ActivatedRoute) { }

  ngOnInit() { 
    if(this.activatedRoute.snapshot.data.pageData) {
      console.log('homaPageJsonData',this.activatedRoute.snapshot.data.pageData);
      this.homeConfig = this.activatedRoute.snapshot.data.pageData.data.homeConfig; 
    }

    this.clientList = this.activatedRoute.snapshot.data.pageData.data.clientList;
    this.widgetData = this.activatedRoute.snapshot.data.pageData.data.hubsData;

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

    this.sliderData = this.activatedRoute.snapshot.data.pageData.data.sliderData;
  }

  handleButtonClick(): void {
    console.log("Working!!!");
  
  }

}
