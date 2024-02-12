import { Component, OnInit, Input } from '@angular/core'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { CompLocalService } from '../../services/comp.service'
// tslint:disable-next-line
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'ws-app-desiredcomptency-card',
  templateUrl: './desiredcomptency-card.component.html',
  styleUrls: ['./desiredcomptency-card.component.scss'],
})
export class DesiredcomptencyCardComponent implements OnInit {
  @Input() selectedLevelId: any
  // @Input() selectedCompId: any
  @Input() competency!: NSProfileDataV3.ICompetencie
  @Input() isSelected = false
  // @Output() selectedCompetency = new EventEmitter<any>()
  constructor(private compLocalService: CompLocalService, private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
   }

  ngOnInit() {
    // this.compLocalService.currentComps.subscribe(comp=>{
    //   _.each
    //   this.selectedCompId=comp.
    // })
  }

  selectLevel(complevel: any, competency: any) {
    this.selectedLevelId = undefined
    this.compLocalService.autoSaveDesired.next(true)
    this.selectedLevelId = complevel.id
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
    if (_.findIndex(this.compLocalService.desiredComps.value, { id: competency.id }) === -1) {
      this.compLocalService.addDesiredComps(compobj)
      // this.selectedCompList.push(compobj)
      // this.selectedCompetency.emit(this.selectedCompList)
    } else {
      if (_.findIndex(this.compLocalService.desiredComps.value, { id: competency.id }) !== -1) {
        // if (_.findIndex(this.compLocalService.desiredComps.value, { competencySelfAttestedLevel: complevel.id }) !== -1) {
        //   this.compLocalService.removeDesiredComps(compobj)
        // } else {
          this.compLocalService.removeDesiredComps(compobj)
          this.compLocalService.addDesiredComps(compobj)
        // }
      }
    }
  }
}
