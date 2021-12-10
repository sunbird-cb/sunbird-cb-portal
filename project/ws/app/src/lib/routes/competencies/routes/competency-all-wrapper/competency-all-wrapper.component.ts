import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-competency-all-wrapper',
  templateUrl: './competency-all-wrapper.component.html',
  styleUrls: ['./competency-all-wrapper.component.scss'],

  host: { class: 'competency_main_wrapper' },
})
export class CompetencyAllWrapperComponent implements OnInit {
  currentRoute = 'all'
  constructor() { }

  ngOnInit() {
  }

}
