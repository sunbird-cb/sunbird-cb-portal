import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ws-survey-poc',
  templateUrl: './survey-poc.component.html',
  styleUrls: ['./survey-poc.component.scss']
})
export class SurveyPocComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('test')
  }

}
