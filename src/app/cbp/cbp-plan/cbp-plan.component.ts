import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WidgetUserService } from '@sunbird-cb/collection/src/public-api';
@Component({
  selector: 'ws-cbp-plan',
  templateUrl: './cbp-plan.component.html',
  styleUrls: ['./cbp-plan.component.scss']
})
export class CbpPlanComponent implements OnInit {
  cbpConfig: any
  constructor(
    private activatedRoute:ActivatedRoute,
    private widgetSvc: WidgetUserService
    ) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.data.pageData) {
      this.cbpConfig = this.activatedRoute.snapshot.data.pageData.data.cbpConfig
     // this.cbpConfig = this.activatedRoute.snapshot.data.pageData.data.cbpConfig; 
    }
    this.getCbPlans()
  }

  getCbPlans() {
    this.widgetSvc.fetchCbpPlanList().subscribe((res:any)=> {
      console.log('res',res)
    })
  }

}
