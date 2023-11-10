import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators'
import { HeaderService } from './header.service';

import {
  ValueService,
} from '@sunbird-cb/utils'
@Component({
  selector: 'ws-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isXSmall$ = this.valueSvc.isXSmall$
  isNavBarRequired = true
  showNavbar = true
  widgetData = {};
  constructor(private valueSvc: ValueService,public headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.showNavbarDisplay$.pipe(delay(500)).subscribe(display => {
      this.showNavbar = display
    }) 
    

    this.widgetData = { 
      "widgets": [        
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
  }

  get navBarRequired(): boolean {
    return this.isNavBarRequired
  }
  get isShowNavbar(): boolean {
    return this.showNavbar
  }

}
