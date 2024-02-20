import { Component, OnInit } from '@angular/core'
//import { Router } from '@angular/router'
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils'
import { PipeDurationTransformPipe } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-widget-user-leaderboard',
  templateUrl: './user-leaderboard.component.html',
  styleUrls: ['./user-leaderboard.component.scss'],
  providers: [PipeDurationTransformPipe],
})
export class UserLeaderboardComponent implements OnInit {

  userInfo: any
  loader: boolean = true
  showOverlay: boolean = false
  constructor(private configSvc: ConfigurationsService,
              //private router: Router,
              //private pipDuration: PipeDurationTransformPipe,
              private langtranslations: MultilingualTranslationsService) { }

  ngOnInit() {
    this.loader = true
    this.userInfo =  this.configSvc && this.configSvc.userProfile
    setTimeout(() => {
      this.showOverlay = true
    }, 5000)

    setTimeout(() => {
      //this.showOverlay = false
    }, 15000)
  }
  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }
}
