import { Component, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'
import { ActivatedRoute } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'ws-survey-poc',
  templateUrl: './survey-poc.component.html',
  styleUrls: ['./survey-poc.component.scss'],
})
export class SurveyPocComponent implements OnInit {
  hostUrl = environment.azureHost
  solutionId: any
  iframeUrl: any
  constructor(public route: ActivatedRoute, private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.solutionId = this.route.snapshot.paramMap.get('id')
    const subUrl = '/mligot/mlsurvey/'
    const url = `${this.hostUrl}${subUrl}${this.solutionId}`
    this.iframeUrl =  this.sanitized.bypassSecurityTrustResourceUrl(url)
  }

}
