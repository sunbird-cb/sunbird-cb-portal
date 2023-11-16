import { Component, Input, OnInit } from '@angular/core';
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
  @Input() headerFooterConfigData:any;
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
        ] 
      ]
    };
  } 

  ngOnChanges() {
    console.log('headerFooterConfigData', this.headerFooterConfigData);
  }

  get navBarRequired(): boolean {
    return this.isNavBarRequired 
  }
  get isShowNavbar(): boolean {
    return this.showNavbar
  }

}
