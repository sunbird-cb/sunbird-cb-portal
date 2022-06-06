import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'ws-app-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss'],
})
export class CompetencyCardComponent implements OnInit {
  selectedLevelId: any
  selectedCompId: any
  selectedCompList: any = []
  @Input() competenciesData!: any
  @Output() selectedCompetency = new EventEmitter<any>()

  constructor() { }

  ngOnInit() {
  }

  selectLevel(complevel: any, competency: any) {
    this.selectedLevelId = complevel.id
    this.selectedCompId = competency.id

    if (this.selectedCompList.indexOf(competency.id) === -1) {
      const compobj = {
        type: competency.type,
        id: competency.id,
        name: competency.name,
        description: competency.description,
        status: competency.status,
        source: competency.source,
        competencyType: competency.additionalProperties.competencyType,
        competencySelfAttestedLevel: complevel.id,
        competencySelfAttestedLevelValue: complevel.name,
        osid: competency.osid,
      }
      this.selectedCompList.push(compobj)
      this.selectedCompetency.emit(this.selectedCompList)
    }
  }
}
