import { Component, OnInit, Input } from '@angular/core'
import { CompLocalService } from '../../services/comp.service'
// tslint:disable-next-line
import _ from 'lodash'
@Component({
  selector: 'ws-app-current-competency-card',
  templateUrl: './current-competency-card.component.html',
  styleUrls: ['./current-competency-card.component.scss'],
})
export class CurrentCompetencyCardComponent implements OnInit {
  @Input() selectedLevelId: any
  @Input() competency!: any
  @Input() isSelected = false
  // @Output() selectedCompetency = new EventEmitter<any>()
  constructor(private compLocalService: CompLocalService) { }

  ngOnInit() {
    // this.compLocalService.currentComps.subscribe(comp=>{
    //   _.each
    //   this.selectedCompId=comp.
    // })
  }

  selectLevel(complevel: any, competency: any) {
    this.compLocalService.autoSaveCurrent.next(true)
    this.selectedLevelId = (complevel.id || '').length === 1 ? parseInt(complevel.id || '', 10) : complevel.id
    // this.selectedCompId = competency.id
    const compobj = {
      type: competency.type,
      id: competency.id,
      name: competency.name,
      description: competency.description,
      status: competency.status,
      source: competency.source,
      competencyType: competency.additionalProperties.competencyType,
      competencySelfAttestedLevel: complevel.id,
      competencySelfAttestedLevelValue: complevel.level,
      competencySelfAttestedLevelName: complevel.name,
      osid: competency.osid,
    }
    if (_.findIndex(this.compLocalService.currentComps.value, { id: competency.id }) === -1) {
      this.compLocalService.addcurrentComps(compobj)
      // this.selectedCompList.push(compobj)
      // this.selectedCompetency.emit(this.selectedCompList)
    } else {
      if (_.findIndex(this.compLocalService.currentComps.value, { id: competency.id }) !== -1) {
        if (_.findIndex(this.compLocalService.currentComps.value, { competencySelfAttestedLevel: complevel.id }) !== -1) {
          this.compLocalService.removecurrentComps(compobj)
        } else {
          this.compLocalService.removecurrentComps(compobj)
          this.compLocalService.addcurrentComps(compobj)
        }
      }
    }
  }
}
