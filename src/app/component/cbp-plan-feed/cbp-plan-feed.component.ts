import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FilterComponent } from './../filter/filter.component';

@Component({
  selector: 'ws-cbp-plan-feed',
  templateUrl: './cbp-plan-feed.component.html',
  styleUrls: ['./cbp-plan-feed.component.scss']
})
export class CbpPlanFeedComponent implements OnInit {

  searchControl = new FormControl('')
  toggleFilter: boolean = false
  contentDataList : any = [
    {
        "widgetType": "card",
        "widgetSubType": "cardContent",
        "widgetHostClass": "mb-2 width-unset",
        "widgetData": {
            "content": {
                "trackable": {
                    "enabled": "Yes",
                    "autoBatch": "No"
                },
                "instructions": "<p>Advanced NLP</p>\n",
                "identifier": "do_113945118526799872147",
                "programDuration": 1,
                "purpose": "Advanced NLP",
                "channel": "0133783095823810560",
                "organisation": [
                    "Dept of Project management"
                ],
                "description": "Advanced NLP",
                "mimeType": "application/vnd.ekstep.content-collection",
                "posterImage": "https://portal.karmayogibm.nic.in/content-store/content/do_113926668087255040159/artifact/do_113926668087255040159_1700032725663_capture141700032725640.png",
                "idealScreenSize": "normal",
                "version": 2,
                "pkgVersion": 1,
                "objectType": "Content",
                "duration": "0",
                "license": "CC BY 4.0",
                "appIcon": "https://static.karmayogiprod.nic.in/igotbm/collection/do_113945118526799872147/artifact/do_113926668087255040159_1700032725663_capture141700032725640.thumb.png",
                "primaryCategory": "Blended Program",
                "name": "Advanced NLP",
                "contentType": "Course"
            },
            "cardCustomeClass":"width-unset",
            "cardSubType": "card-wide-v2",
            "context": {
                "pageSection": "blendedPrograms",
                "position": 0
            }
        }
    },
    {
        "widgetType": "card",
        "widgetSubType": "cardContent",
        "widgetHostClass": "mb-2",
        "widgetData": {
            "content": {
                "trackable": {
                    "enabled": "Yes",
                    "autoBatch": "No"
                },
                "instructions": "<p>Project management PMP BP</p>\n",
                "identifier": "do_113913337446875136123",
                "programDuration": 2,
                "purpose": "Project management PMP BP",
                "channel": "0133783095823810560",
                "organisation": [
                    "test"
                ],
                "description": "Project management PMP BP",
                "mimeType": "application/vnd.ekstep.content-collection",
                "posterImage": "https://portal.karmayogibm.nic.in/content-store/content/do_1138431455174656001138/artifact/do_1138431455174656001138_1689837099517_capture61689837100255.png",
                "idealScreenSize": "normal",
                "version": 2,
                "pkgVersion": 1,
                "objectType": "Content",
                "duration": "0",
                "license": "CC BY 4.0",
                "appIcon": "https://static.karmayogiprod.nic.in/igotbm/collection/do_113913337446875136123/artifact/do_1138431455174656001138_1689837099517_capture61689837100255.thumb.png",
                "primaryCategory": "Blended Program",
                "name": "Project management PMP BP",
                "contentType": "Course"
            },
            "cardCustomeClass":"width-unset",
            "cardSubType": "card-wide-v2",
            "context": {
                "pageSection": "blendedPrograms",
                "position": 1
            }
        }
    }
  ]
  constructor(private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
  }
  toggleFilterMethod(event: any) {
    console.log(event)
    this.toggleFilter = event
  }
  showBottomSheet(): void {
    this.bottomSheet.open(FilterComponent,{
      panelClass: 'filter-cbp',
      ariaLabel: 'Share on social media'
    });
  }
  openFilter() {
    if(window.screen.width < 768) {
      this.showBottomSheet()
    } else {
      this.toggleFilter = true
    }
  }
}
