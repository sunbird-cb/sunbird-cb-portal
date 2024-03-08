import { Component, OnInit } from '@angular/core'
//import { Router } from '@angular/router'
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils'
import { PipeDurationTransformPipe } from '@sunbird-cb/utils/src/public-api'
import { HomePageService } from 'src/app/services/home-page.service'
import moment from 'moment'
import { UserProfileService } from '@ws/app/src/lib/routes/user-profile/services/user-profile.service'

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
  ApiResponse: any
  loading = false
  rank1: any
  rank2: any
  rank3: any
  otherUsers: any = []
  currentUserId: string = ''
  currentUserRank: any
  overLayText: string = ''
  monthName: string = ''
  currentUserProfile: any
  constructor(private configSvc: ConfigurationsService,
              private homePageSvc: HomePageService,
              private userProfileSvc: UserProfileService,
              //private router: Router,
              //private pipDuration: PipeDurationTransformPipe,
              private langtranslations: MultilingualTranslationsService) { }

  ngOnInit() {

    this.currentUserId = this.configSvc.unMappedUser.id
    this.currentUserProfile = this.configSvc.unMappedUser.profileDetails
    this.loader = true
    this.userInfo =  this.configSvc && this.configSvc.userProfile
    this.loading = true
    this.homePageSvc.getLearnerLeaderboard().subscribe((res: any) => {
      if (res && res.result && res.result.result) {
        this.currentUserRank = res.result.result.find((rankDetails: any) => rankDetails.userId === this.currentUserId)
        this.ApiResponse = res.result.result
        this.rank1 = this.ApiResponse[0]
        this.rank2 = this.ApiResponse[1]
        this.rank3 = this.ApiResponse[2]
        this.otherUsers = this.ApiResponse.slice(3, 6)
        if (this.currentUserRank) {
          this.monthName = moment().month(Number(this.currentUserRank.month) - 1).format('MMMM')
        }
        if (this.currentUserRank && this.currentUserRank.rank > this.currentUserRank.previous_rank) {
          // tslint:disable-next-line: max-line-length
          this.overLayText = `${this.translateLabels('overlayText1','learnerLeaderboard')} ${this.getRankOrdinal(this.currentUserRank.rank - this.currentUserRank.previous_rank)} ${this.translateLabels('overlayText2','learnerLeaderboard')} ${this.getRankOrdinal(this.currentUserRank.rank)} ${this.translateLabels('overlayText3','learnerLeaderboard')}`
          const isMessageShown = localStorage.getItem('motivationalMessage')
          if (!isMessageShown) {
            this.showOverlayMessage()
          }
          // tslint:disable-next-line: max-line-length
          if (isMessageShown && this.currentUserProfile && this.currentUserProfile.lastMotivationalMessageTime) {
            const date = moment(this.currentUserProfile.lastMotivationalMessageTime)
            // tslint:disable-next-line: max-line-length
            if ((date.month() === 0 && this.rank1.month !== 12) || (date.month() !== 0 && date.month() !== (this.rank1.month))) {
              this.showOverlayMessage()
            }
          }
        }
      }
      this.loading = false
      // tslint:disable-next-line: align
    }, (_error: any) => {
      // tslint:disable-next-line: align
      this.loading = false
    })
  }

  showOverlayMessage() {
    this.showOverlay = true
    this.updateMotivationalMessagestatus()
    setTimeout(() => {
      this.showOverlay = false
    }, 15000)
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  getRankOrdinal(rank: number) {
    if (rank === 0) return '0th'
    const suffixes = ['th', 'st', 'nd', 'rd']
    const v = rank % 100
    return rank + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
  }

  updateMotivationalMessagestatus() {
    const reqUpdates = {
      request: {
        userId: this.configSvc.unMappedUser.id,
        profileDetails: { lastMotivationalMessageTime: new Date() },
      },
    }
    this.userProfileSvc.editProfileDetails(reqUpdates).subscribe((_res: any) => {
      localStorage.setItem('motivationalMessage', 'yes')
    })
  }

}
