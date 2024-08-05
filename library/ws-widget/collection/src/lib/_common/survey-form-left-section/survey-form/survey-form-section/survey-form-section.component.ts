import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-widget-survey-form-section',
  templateUrl: './survey-form-section.component.html',
  styleUrls: ['./survey-form-section.component.scss'],
})
export class SurveyFormSectionComponent implements OnInit {
  isVisible = true
  @Input() surveyFormData: any
  surveyData: any

  constructor() { }

  ngOnInit() {
  //  this.surveyData = this.surveyFormData
  }

  closeCard() {
    this.isVisible = false
  }
}
