import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment'
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'ws-survey-shiksha',
  templateUrl: './survey-shiksha.component.html',
  styleUrls: ['./survey-shiksha.component.scss']
})
export class SurveyShikshaComponent implements OnInit {
  hostUrl = environment.azureHost
  solutionId:any
  iframeUrl:any
  constructor(public route: ActivatedRoute,private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.solutionId = this.route.snapshot.paramMap.get('id')
    const subUrl = '/mligot/mlsurvey/'
    const url = `${this.hostUrl}${subUrl}${this.solutionId}`
    this.iframeUrl =  this.sanitized.bypassSecurityTrustResourceUrl(url)
  }

}
