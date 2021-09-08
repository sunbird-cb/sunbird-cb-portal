import { Component, OnInit, OnDestroy } from '@angular/core'
// tslint:disable
import _ from 'lodash'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ws-app-competency-detailed-view',
  templateUrl: './competency-detailed-view.component.html',
  styleUrls: ['./competency-detailed-view.component.scss']
})
export class CompetencyDetailedViewComponent implements OnInit, OnDestroy {

  private paramSubscription: Subscription | null = null
  competencyName: any = null
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.paramSubscription = this.activatedRoute.params.subscribe(async params => {
      this.competencyName = _.get(params, 'competencyName')
      console.log("Name", this.competencyName)
    })
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
  }

}
