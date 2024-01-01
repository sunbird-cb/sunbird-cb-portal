import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ws-cbp-plan-stats',
  templateUrl: './cbp-plan-stats.component.html',
  styleUrls: ['./cbp-plan-stats.component.scss']
})
export class CbpPlanStatsComponent implements OnInit {
  @Input() cbpCount: any
  @Input() cbpLoader: any
  filterList: any = [{id:'last3months', value: 'Last 3 months'},{id:'last6months', value: 'Last 6 months'},{id:'lastYear', value: 'Last year'}]

  constructor() { }

  ngOnInit() {
  }

}
