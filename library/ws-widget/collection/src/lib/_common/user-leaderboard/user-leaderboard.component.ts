import { Component, OnInit } from '@angular/core'
//import { Router } from '@angular/router'
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils'
import { PipeDurationTransformPipe } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-widget-user-leaderboardComponent',
  templateUrl: './user-leaderboard.component.html',
  styleUrls: ['./user-leaderboard.component.scss'],
  providers: [PipeDurationTransformPipe],
})
export class UserLeaderboardComponent implements OnInit {

  userInfo: any
  constructor(private configSvc: ConfigurationsService,
              //private router: Router,
              //private pipDuration: PipeDurationTransformPipe,
              private langtranslations: MultilingualTranslationsService) { }

  ngOnInit() {
    this.userInfo =  this.configSvc && this.configSvc.userProfile
  }
  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }
}
