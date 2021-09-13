import { Component, OnInit, OnDestroy } from '@angular/core'
import { CompetenceService } from '../../services/competence.service'
// tslint:disable
import _ from 'lodash'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { NSCompetencie } from '../../models/competencies.model';

@Component({
  selector: 'ws-app-competency-detailed-view',
  templateUrl: './competency-detailed-view.component.html',
  styleUrls: ['./competency-detailed-view.component.scss']
})
export class CompetencyDetailedViewComponent implements OnInit, OnDestroy {

  private paramSubscription: Subscription | null = null
  competencyName: any = null
  type: any = 'COMPETENCY'
  competencyId: any = null
  competencyData: any = null
  constructor(
    private activatedRoute: ActivatedRoute,
    private competencySvc: CompetenceService,
  ) { }

  ngOnInit() {
    this.paramSubscription = this.activatedRoute.params.subscribe(async params => {
      this.competencyId = _.get(params, 'competencyId')
      this.competencyName = _.get(params, 'competencyName')
      // console.log("Name", this.competencyName)
    })


    this.competencySvc
      .fetchCompetencyDetails(this.competencyId, this.type)
      .subscribe((reponse: NSCompetencie.ICompetencieResponse) => {
        if (reponse.statusInfo && reponse.statusInfo.statusCode === 200) {
          this.competencyData = reponse.responseData
          console.log(this.competencyData)
        }
      })
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
  }

}
