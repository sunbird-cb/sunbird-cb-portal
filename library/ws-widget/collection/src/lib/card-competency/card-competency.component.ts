import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-widget-card-competency',
  templateUrl: './card-competency.component.html',
  styleUrls: ['./card-competency.component.scss'],
})
export class CardCompetencyComponent implements OnInit {

  @Input() bindingData: any
  @Input() competencyArea = ''
  constructor() { }

  ngOnInit() {
  }
}
