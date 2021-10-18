import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  domain = 'https://rain.tarento.com/'
  // surveyTitle = 'Report a problem'
  // surveyId= 1632458489991
  surveyTitle = 'Feedback and suggestions'
  surveyId = 1625726181379
  thankYouMessage = "Thank you for your feedback!!!";
  thankYouDescription = "We are always looking forward to improvement.";
  tyPrimaryBtnLink = "/page/home";
  tySecondaryBtnLink = "/app/info/feedback";
  tyPrimaryBtnText = "Go to";
  tySecondaryBtnText = "More feedback";
  apiData: object = {
    getAPI: `${this.domain}api/forms/getFormById?id=${this.surveyId}`,
    postAPI: `${this.domain}api/forms/saveFormSubmit`,
    customizedHeader: {
    },
  }
  constructor() { }

  ngOnInit() {
  }

}
