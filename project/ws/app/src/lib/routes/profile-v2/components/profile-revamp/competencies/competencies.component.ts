import { Component, Input, OnInit } from '@angular/core';
import { Competency } from '../../../models/profile-revamp.model';

@Component({
  selector: 'ws-app-competencies',
  templateUrl: './competencies.component.html',
  styleUrls: ['./competencies.component.scss']
})
export class CompetenciesComponent implements OnInit {
  //#region (global variable)
  @Input() competencies: Competency[] = []

  viewAll = false
  selectedCompetencyIndex = 0
  //#endregion (global variable)

  constructor() { }

  ngOnInit() { 
    if(this.competencies &&this.competencies.length > 0) {
      this.selectCompetency(0)
    }
  }

  selectCompetency(index: number): void {
    this.selectedCompetencyIndex = index
    this.competencies.forEach((comp, i) => {
      comp.active = i === index;
    });
    this.viewAll = false;
  }
  
  toggleView(): void {
    this.viewAll = !this.viewAll;
  }

}
