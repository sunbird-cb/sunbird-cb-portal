import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-app-popular-competency-card',
  templateUrl: './popular-competency-card.component.html',
  styleUrls: ['./popular-competency-card.component.scss'],
})
export class PopularCompetencyCardComponent implements OnInit {
  @Input() competency!: any
  constructor() { }

  ngOnInit() {
  }

}
