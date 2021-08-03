import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  apiData: object = {
    id: '1625726181379',
    getAPI: 'https://rain.tarento.com/api/forms/getFormById?id=1625726181379',
    postAPI: 'https://rain.tarento.com/api/forms/saveFormSubmit',
  }
  constructor() { }

  ngOnInit() {
  }

}
