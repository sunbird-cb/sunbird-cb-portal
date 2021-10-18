import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-reportproblem',
  templateUrl: './reportproblem.component.html',
  styleUrls: ['./reportproblem.component.scss'],
})
export class ReportproblemComponent implements OnInit {
  domain = 'https://rain.tarento.com/'
  surveyTitle = 'Report a problem'
  surveyId = 1632458489991
  // surveyTitle = 'Report a problem'
  // surveyId = 1625726181379
  thankYouMessage = "Thank you for reporting your concern.";
  thankYouDescription = "We are always looking forward to improvement.";
  tyPrimaryBtnLink = "/page/home";
  tySecondaryBtnLink = "/app/info/report-problem";
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
