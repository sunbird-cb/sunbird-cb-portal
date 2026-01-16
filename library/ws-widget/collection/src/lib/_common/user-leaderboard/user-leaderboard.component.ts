import { Component, EventEmitter, OnInit, Output } from '@angular/core'
// import { Router } from '@angular/router'
import { ConfigurationsService, MultilingualTranslationsService, PipeDurationTransformPipe
  , PipeOrdinalPipe,
 } from '@sunbird-cb/utils-v2'
import { HomePageService } from 'src/app/services/home-page.service'
import moment from 'moment'
import { UserProfileService } from '@ws/app/src/lib/routes/user-profile/services/user-profile.service'

@Component({
  selector: 'ws-widget-user-leaderboard',
  templateUrl: './user-leaderboard.component.html',
  styleUrls: ['./user-leaderboard.component.scss'],
  providers: [PipeDurationTransformPipe, PipeOrdinalPipe],
})
export class UserLeaderboardComponent implements OnInit {

  @Output() isLeaderboardAvailable = new EventEmitter<Boolean>()

  userInfo: any
  loader = true
  showOverlay = false
  apiResponse: any
  loading = false
  rank1: any
  rank2: any
  rank3: any
  otherUsers: any = []
  currentUserId = ''
  currentUserRank: any
  overLayText = ''
  monthName = ''
  currentUserProfile: any
  rankLengthsArray = []
  maxLength = 2
  tooltipDelay: any = 1000
  constructor(private configSvc: ConfigurationsService,
              private homePageSvc: HomePageService,
              private userProfileSvc: UserProfileService,
              private langtranslations: MultilingualTranslationsService,
              private ordinalPipe: PipeOrdinalPipe) { }

  ngOnInit() {

    this.currentUserId = this.configSvc.unMappedUser.id
    this.currentUserProfile = this.configSvc.unMappedUser.profileDetails
    this.loader = true
    this.userInfo =  this.configSvc && this.configSvc.userProfile
    this.loading = true
    this.homePageSvc.getLearnerLeaderboard().subscribe((res: any) => {
      if (res && res.result && res.result.result && res.result.result.length) {
        this.currentUserRank = res.result.result.find((rankDetails: any) => rankDetails.userId === this.currentUserId)
        this.isLeaderboardAvailable.emit(true)
        this.apiResponse = res.result.result
        this.rank1 = this.apiResponse[0]
        this.rank2 = this.apiResponse[1]
        this.rank3 = this.apiResponse[2]
        this.otherUsers = this.apiResponse.slice(3, 6)
        this.rankLengthsArray = this.otherUsers.map((obj: any) => obj.rank.toString().length)
        this.maxLength = Math.max(...this.rankLengthsArray)
        if (this.currentUserRank) {
          this.monthName = moment().month(Number(this.currentUserRank.month) - 1).format('MMMM')
        } else if (!this.currentUserRank) {
          this.monthName = moment().month(Number(this.rank1.month) - 1).format('MMMM')
        }
        if (this.currentUserRank && this.currentUserRank.rank < this.currentUserRank.previous_rank) {
          const rankDiff = this.currentUserRank.previous_rank - this.currentUserRank.rank
          // tslint:disable-next-line: max-line-length
          this.overLayText = `${this.translateLabels('overlayText1', 'learnerLeaderboard')} ${this.ordinalPipe.transform(this.currentUserRank.rank)} ${this.translateLabels('overlayText2', 'learnerLeaderboard')} ${(this.currentUserRank.previous_rank - this.currentUserRank.rank)} ${this.translateLabels((rankDiff === 1 ?  'overlayText3WithSingular' : 'overlayText3'), 'learnerLeaderboard')}`
          const isMessageShown = localStorage.getItem('motivationalMessage')
          if (!isMessageShown) {
            this.showOverlayMessage()
          }
          // tslint:disable-next-line: max-line-length
          if (isMessageShown && this.currentUserProfile && this.currentUserProfile.lastMotivationalMessageTime) {
            const date = moment(this.currentUserProfile.lastMotivationalMessageTime)
            // tslint:disable-next-line: max-line-length
            if ((date.month() === 0 && (+this.rank1.month !== 12)) || (date.month() !== 0 && date.month() !== (+this.rank1.month))) {
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
    },         5000)
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
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
