import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: { class: 'flex flex-1' },
})
export class InsightsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
