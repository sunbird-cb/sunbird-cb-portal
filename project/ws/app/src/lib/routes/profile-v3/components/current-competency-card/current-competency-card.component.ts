import { Component, OnInit, Input } from '@angular/core'
import { CompLocalService } from '../../services/comp.service'
// tslint:disable-next-line
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'ws-app-current-competency-card',
  templateUrl: './current-competency-card.component.html',
  styleUrls: ['./current-competency-card.component.scss'],
})
export class CurrentCompetencyCardComponent implements OnInit {
  @Input() selectedCompetency: any
  @Input() competency!: any
  @Input() isSelected = false
  selectedLevelId: any
  compobj: any
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
    // tslint:disable-next-line:max-line-length
    this.selectedLevelId = this.selectedCompetency && this.selectedCompetency.competencySelfAttestedLevel ? this.selectedCompetency.competencySelfAttestedLevel : ''
    this.selectedLevelId = this.selectedLevelId ? String(this.selectedLevelId) : ''
  }

  selectLevel(complevel: any, competency: any) {
    this.compLocalService.autoSaveCurrent.next(true)
    this.selectedLevelId = (complevel.id || '').length === 1 ? parseInt(complevel.id || '', 10) : complevel.id
    this.selectedLevelId = this.selectedLevelId ? String(this.selectedLevelId) : ''
    // this.selectedCompId = competency.id
    // tslint:disable-next-line:max-line-length
    if (this.selectedCompetency && this.selectedCompetency.competencyCBPCompletionLevel &&
      this.selectedCompetency.competencyCBPCompletionLevel !== '') {
      this.compobj = {
        type: this.selectedCompetency.type,
        id: this.selectedCompetency.id,
        name: this.selectedCompetency.name,
        description: this.selectedCompetency.description,
        status: this.selectedCompetency.status,
        source: this.selectedCompetency.source,
        competencyType: this.selectedCompetency.competencyType,
        competencySelfAttestedLevel: complevel.id,
        competencySelfAttestedLevelValue: complevel.level,
        competencySelfAttestedLevelName: complevel.name,
        osid: this.selectedCompetency.osid,
        // tslint:disable-next-line:max-line-length
        competencyCBPCompletionLevel: this.selectedCompetency.competencyCBPCompletionLevel ? this.selectedCompetency.competencyCBPCompletionLevel : '',
        // tslint:disable-next-line:max-line-length
        competencyCBPCompletionLevelName: this.selectedCompetency.competencyCBPCompletionLevelName ? this.selectedCompetency.competencyCBPCompletionLevelName : '',
        // tslint:disable-next-line:max-line-length
        competencyCBPCompletionLevelValue: this.selectedCompetency.competencyCBPCompletionLevelValue ? this.selectedCompetency.competencyCBPCompletionLevelValue : '',
      }
    } else {
      this.compobj = {
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
        osid: competency.osid ? competency.osid : '',
       }
    }

    if (_.findIndex(this.compLocalService.currentComps.value, { id: competency.id }) === -1) {
      this.compLocalService.addcurrentComps(this.compobj)
      // this.selectedCompList.push(compobj)
      // this.selectedCompetency.emit(this.selectedCompList)
    } else {
      if (_.findIndex(this.compLocalService.currentComps.value, { id: competency.id }) !== -1) {
        // if (_.findIndex(this.compLocalService.currentComps.value, { competencySelfAttestedLevel: complevel.id }) !== -1) {
        //   this.compLocalService.removecurrentComps(this.compobj)
        // } else {
          this.compLocalService.removecurrentComps(this.compobj)
          this.compLocalService.addcurrentComps(this.compobj)
        // }
      }
    }
  }
}
