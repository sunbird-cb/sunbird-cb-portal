import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'ws-cbp-plan',
  templateUrl: './cbp-plan.component.html',
  styleUrls: ['./cbp-plan.component.scss']
})
export class CbpPlanComponent implements OnInit {
  cbpConfig: any = {
    "insightOnRight": {
      "active" : false
    },
    "leftSection" : {
      "active":  true
    },
    "rightSection": {
      "active":  true
    },
    "discussHub": {
      "active": true,
      "updatePosts": {
        "active": true
      },
      "trendingDiscussions": {
        "active": true
      }
    },
    "networkHub": {
      "active": true,
      "recentRequests": {
        "active": true
      },
      "networkSuggestions": {
        "active": true
      }
    }
  };
  constructor(private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.data.pageData) {
      console.log(this.activatedRoute.snapshot.data);
     // this.cbpConfig = this.activatedRoute.snapshot.data.pageData.data.cbpConfig; 
    }
  }

}
