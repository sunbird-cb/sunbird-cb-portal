import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'ws-app-competency-card',
  templateUrl: './competency-card.component.html',
  styleUrls: ['./competency-card.component.scss'],
})
export class CompetencyCardComponent implements OnInit {
  selectedId: BigInteger | undefined
  @Input() competenciesData!: any
  @Output() selectedLevel = new EventEmitter<string>()
  @Output() selectedCompetency = new EventEmitter<string>()

  constructor() { }

  ngOnInit() {
  }

  selectLevel(complevel: any, competency: any) {
    this.selectedId = complevel.id

    this.selectedLevel.emit(complevel)
    this.selectedCompetency.emit(competency)
  }
}
