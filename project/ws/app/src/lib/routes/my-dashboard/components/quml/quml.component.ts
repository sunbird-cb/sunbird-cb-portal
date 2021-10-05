import { Component, OnInit } from '@angular/core'
import { data1  } from '../../data/quml-library-data'

@Component({
  selector: 'ws-app-quml',
  templateUrl: './quml.component.html',
  styleUrls: ['./quml.component.scss'],
})
export class QumlComponent implements OnInit {
  pageConfig = data1
  getPlayerEvents(event: any) {
    console.log('get player events', JSON.stringify(event))
  }

  getTelemetryEvents(event: any) {
    console.log('event is for telemetry', JSON.stringify(event))
  }
  constructor() { }

  ngOnInit() {
  }

}
