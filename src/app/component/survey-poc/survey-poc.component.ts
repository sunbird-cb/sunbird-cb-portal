import { Component, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'
import  {  ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'ws-survey-poc',
  templateUrl: './survey-poc.component.html',
  styleUrls: ['./survey-poc.component.scss'],
})
export class SurveyPocComponent implements OnInit {
  hostUrl = environment.azureHost
  solutionId:any
  iframeUrl:any;
  constructor(public route: ActivatedRoute,private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.solutionId = this.route.snapshot.paramMap.get('id');
    // console.log('test',65eeb928fa030d0007864e96)
    this.iframeUrl =  this.sanitized.bypassSecurityTrustResourceUrl(this.hostUrl+'/mligot/mlsurvey/'+this.solutionId);
  }

}
