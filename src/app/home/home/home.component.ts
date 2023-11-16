import { Component, OnInit } from '@angular/core'

const clientItem = [
  {
    "clientImageUrl": "assets/icons/top-providers/0d400bdf-4ad8-45bf-914c-be44018c2d07.png",
    "clientName": "Department for Promotion of Industry and Internal Trade",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/1becfffa-956e-48ba-8ffd-77c19cd720c8.jpeg",
    "clientName": "RAKNPA",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/1d76c041-a7c9-437c-94d9-36d997f3804c.jpeg",
    "clientName": "Lal Bahadur Shastri National Academy of Administration (LBSNAA)",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/1fb72c3f-1c96-4600-8e22-09871a85e6c4.jpeg",
    "clientName": "Ministry of Environment, Forest and Climate Change",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/6f046f76-b778-476a-987b-8669e106b44c.jpeg",
    "clientName": "ISTM",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/7f6df809-6930-44f4-abcf-c8297363d3e0.png",
    "clientName": "Department of Personnel and Training DoPT",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/7f8cab8e-9d22-44ba-a41e-83b907e5a5f0.jpeg",
    "clientName": "Indian Cybercrime Coordination Centre - I4C",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/33e9c66f-312f-4244-901e-7d7525ae8847.jpeg",
    "clientName": "Capacity Building Commission",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/36d93700-c43f-499e-ab3c-68ea76388a2a.png",
    "clientName": "Ministry of Railways",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/385ff4a0-41af-4114-8015-10d26c1e8af4.jpeg",
    "clientName": "World Bank",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/778b56bf-8946-45fe-87d3-358203f2faf4.png",
    "clientName": "Sashastra Seema Bal (SSB)",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/2862d2e5-473e-4c55-abaa-8a2f86e5eee4.jpeg",
    "clientName": "SVPNPA",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/53407dd6-d22c-4dba-a394-015fae667636.png",
    "clientName": "Microsoft",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/869960d7-2dc7-4205-8c4b-11321d901060.jpeg",
    "clientName": "Indian Institute of Public Administration",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/4183673f-9063-4fa9-bf84-1e8856c8e531.jpeg",
    "clientName": "Food Corporation of India (FCI)",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/a976f025-e990-49b0-a52a-9bd0a8e43584.jpeg",
    "clientName": "National Telecommunications Institute for Policy Research, Innovation and Training",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/abbb8f64-84db-4a92-85c9-1b394ffab71c.png",
    "clientName": "The Art of Living",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/b6bf0be6-7e29-4187-a29d-da6db1db7c69.jpeg",
    "clientName": "National Institute of Communication Finance",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/cf567f4c-d0fa-447f-aba4-cb378ea3c90d.png",
    "clientName": "Department of Posts",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/ef8a88cf-33cc-42de-bdc3-7deed1ab2418.png",
    "clientName": "IIMB",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/f445c11b-ff73-4ca4-9dea-8d8945d92a4a.png",
    "clientName": "Government e Market Place(GeM)",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/fc67226a-4bbc-449a-8c5c-e1b338716545.png",
    "clientName": "Bharat Sanchar Nigam Limited(BSNL)",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/fccdb487-a389-48d9-bce0-c4d64315b546.png",
    "clientName": "Defence Accounts Department (DAD)",
    "clientUrl": ""
  },
  {
    "clientImageUrl": "assets/icons/top-providers/fcde4c60-7ccd-456e-a5df-260dcfa2d3ee.png",
    "clientName": "Morarji Desai National Institute of Yoga (MDNIY)",
    "clientUrl": ""
  }
];
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
  homeConfig = {
    "insightOnRight": {
      "active" : false
    },
    "leftSection" : {
      "active":  true
    },
    "rightSection": {
      "active":  true
    }
  }
  constructor() { }

  ngOnInit() {
    this.clientList = clientItem
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
