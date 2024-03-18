import { Component, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ws-survey-poc',
  templateUrl: './survey-poc.component.html',
  styleUrls: ['./survey-poc.component.scss'],
})
export class SurveyPocComponent implements OnInit {
  hostUrl = environment.azureHost
  constructor() { }

  ngOnInit() {
    // console.log('test')
  }

}
