import { AUTO_STYLE, animate, state, transition, trigger, style } from '@angular/animations'
import { Component, OnInit } from '@angular/core'
import { HomePageService } from 'src/app/services/home-page.service'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute, Router } from '@angular/router'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'
import { TranslateService } from '@ngx-translate/core'
import { MatSnackBar } from '@angular/material'
import moment from 'moment'

const DEFAULT_WEEKLY_DURATION = 300
const DEFAULT_DISCUSS_DURATION = 600
const DEFAULT_DURATION = 100

const noData = {
  desc: 'Do you have any questions, suggestions or, ideas in your mind? Post it.',
  linkUrl: 'https://portal.karmayogibm.nic.in/page/learn',
  linkText: 'Start discussion',
  iconImg: '/assets/icons/edit.svg',
}

@Component({
  selector: 'ws-in-sight-side-bar',
  templateUrl: './in-sight-side-bar.component.html',
  styleUrls: ['./in-sight-side-bar.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({  height: '0', visibility: 'hidden'  })),
      // tslint:disable-next-line
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      // tslint:disable-next-line
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out')),
    ]),
    trigger('collapseWeekly', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({  height: '0', visibility: 'hidden'  })),
      // state('true', style({  position: 'absolute', width: '90%',marginRight: '16px', marginLeft:'16px',top: '-118%', zIndex: '9' })),
      // tslint:disable-next-line: prefer-template
      transition('false => true', animate(DEFAULT_WEEKLY_DURATION + 'ms ease-in')),
      // tslint:disable-next-line: prefer-template
      transition('true => false', animate(DEFAULT_WEEKLY_DURATION + 'ms ease-out')),
    ]),

    trigger('collapsDiscuss', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({  height: '0', visibility: 'hidden'  })),
      // tslint:disable-next-line:max-line-length
      // state('true', style({  position: 'absolute', width: '80%', transform: 'scaleY(0.7)',marginRight: '32px', marginLeft:'32px',top: '-300%', zIndex: '6' })),
      // tslint:disable-next-line: prefer-template
      transition('false => true', animate(DEFAULT_DISCUSS_DURATION + 'ms ease-in')),
      // tslint:disable-next-line: prefer-template
      transition('true => false', animate(DEFAULT_DISCUSS_DURATION + 'ms ease-out')),
    ]),
  ],
})

export class InsightSideBarComponent implements OnInit {
  profileDataLoading = true
  homePageData: any
  noDataValue: {} | undefined
  clapsDataLoading = true
  collapsed = false
  userData: any
  insightsData: any
  discussion = {
    loadSkeleton: false,
    data: [],
    error: false,
  }
  pendingRequestData: any = []
  pendingRequestSkeleton = true
  showCreds = false
  credMessage = 'View my credentials'
  assessmentsData: any
  isLeaderboardExist = false
  assessmentStrip: any
  learnAdvisoryData: any
  randomlearnAdvisoryObj: any
  learnAdvisoryDataLength: any
  surveyForm: any
  isNotMyUser = false
  isIgotOrg = false
  nwlConfiguration: any
  canShowNlwCard = false
  totlaDays = 0
  daysCompleted = 0
  constructor(
    private homePageSvc: HomePageService,
    private configSvc: ConfigurationsService,
    private activatedRoute: ActivatedRoute,
    private discussUtilitySvc: DiscussUtilsService,
    private translate: TranslateService,
    private events: EventService,
    private snackBar: MatSnackBar,
    private router: Router) {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    }

  ngOnInit() {
    this.userData = this.configSvc && this.configSvc.userProfile
    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.homePageData = this.activatedRoute.snapshot.data.pageData.data
      this.learnAdvisoryData = this.activatedRoute.snapshot.data.pageData.data.learnerAdvisory
      this.surveyForm = this.activatedRoute.snapshot.data.pageData.data.surveyForm
      // Fetch National learning week configurations
      this.nwlConfiguration = this.activatedRoute.snapshot.data.pageData.data.nationalLearningWeek
      if (this.nwlConfiguration && this.nwlConfiguration.enabled) {
        this.getNlwConfig()
      }
    }
    // console.log(' this.userData--', this.configSvc.unMappedUser,  this.configSvc.unMappedUser.profileDetails.profileStatus)
    this.isNotMyUser = this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() === 'not-my-user' ? true : false
    this.isIgotOrg = this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName === 'igot' ? true : false

    // this.learnAdvisoryDataLength = this.learnAdvisoryData.length
    this.getInsights()
    this.getPendingRequestData()
    this.noDataValue = noData
    this.getDiscussionsData()
    // this.displayRandomlearnAdvisoryData()

    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data.assessmentData) {
      this.assessmentStrip = this.activatedRoute.snapshot.data.pageData.data.assessmentData

    }
    // this.getAssessmentData()
  }

  // displayRandomlearnAdvisoryData(): void {
  //   const randomIndex = Math.floor(Math.random() * this.learnAdvisoryData.length)
  //   this.randomlearnAdvisoryObj = this.learnAdvisoryData[randomIndex]
  // }

  getNlwConfig() {
    const startDate = moment(this.nwlConfiguration.startDate, 'DD-MMYYYY')
    const endDate = moment(this.nwlConfiguration.endDate, 'DD-MMYYYY')
    this.totlaDays = endDate.diff(startDate, 'days')
    const currentDate = moment()
    if (currentDate.isBetween(startDate, endDate, null, '[]')) {
      const daysPassed = currentDate.diff(startDate, 'days')
      this.canShowNlwCard = true
      this.daysCompleted = daysPassed

    } else if (currentDate.isBefore(startDate)) {
      this.canShowNlwCard = false
    } else if (currentDate.isAfter(endDate)) {
      const daysPassed = currentDate.diff(endDate, 'days')
      if (daysPassed === 0) {
        this.canShowNlwCard = true
        this.daysCompleted = 6
      }
    }
  }

  getInsights() {
    this.profileDataLoading = true
    const request = {
      request: {
          filters: {
            primaryCategory: 'programs',
            organisations: [
                'across',
                this.userData.rootOrgId,
            ],
          },
      },
    }

    this.homePageSvc.getInsightsData(request).subscribe((res: any) => {
      if (res && res.result && res.result.response) {
        this.insightsData = res.result.response
        this.constructNudgeData()
        this.constructWeeklyData()
        this.profileDataLoading = false
      }
      // tslint:disable-next-line: align
    }, (_error: any) => {
      // tslint:disable-next-line: align
      this.insightsData = ''
      this.profileDataLoading = false
      this.clapsDataLoading = false
    })
  }

  constructNudgeData() {
    const nudgeData: any = {
      type: 'data',
      iconsDisplay: false,
      cardClass: 'slider-container',
      height: 'auto',
      width: '',
      sliderData: [],
      negativeDisplay: false,
      'dot-default': 'dot-grey',
      'dot-active': 'dot-active',
    }
    const sliderData: { title: any; icon: string; data: string; colorData: string; }[] = []
    this.insightsData.nudges.forEach((ele: any) => {
      if (ele) {
        const data = {
          title: ele.label,
          icon: ele.growth === 'positive' ?  'arrow_upward' : 'arrow_downward',
          // tslint:disable-next-line: prefer-template
          data: `${ele.growth === 'positive' && ele.progress > 1 ?  '+' + Math.round(ele.progress) + '%' : ''}`,
          colorData: ele.growth === 'positive' ? 'color-green' : 'color-red',
        }
        sliderData.push(data)
      }
    })
    nudgeData.sliderData = sliderData
    this.insightsData['sliderData'] = nudgeData
    this.profileDataLoading = false
  }

  constructWeeklyData() {
    if (this.insightsData && this.insightsData['weekly-claps']) {
      this.insightsData['weeklyClaps'] = this.insightsData['weekly-claps']
    }
    this.clapsDataLoading = false
  }

  getAssessmentData() {
    this.homePageSvc.getAssessmentinfo().subscribe(
      (res: any) => {
        if (res && res.result && res.result.response) {
          this.assessmentsData = res.result.response
        }
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          // tslint:disable-next-line
          console.log(error)
        }
      }
    )
  }

  getDiscussionsData(): void {
    this.discussion.loadSkeleton = true
    this.homePageSvc.getDiscussionsData(this.userData.userName).subscribe(
      (res: any) => {
        this.discussion.loadSkeleton = false
        this.discussion.data = res && res.latestPosts
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.discussion.loadSkeleton = false
          this.discussion.error = true
        }
      }
    )
  }

  getPendingRequestData() {
    this.homePageSvc.getRecentRequests().subscribe(
      (res: any) => {
        this.pendingRequestSkeleton = false
        this.pendingRequestData = res.result.data && res.result.data.map((elem: any) => {
          elem.fullName = elem.fullName.charAt(0).toUpperCase() + elem.fullName.slice(1)
          return elem
        })
        // tslint:disable-next-line: align
      }, (error: HttpErrorResponse) => {
        // tslint:disable-next-line: align
        if (!error.ok) {
          // tslint:disable-next-line: align
          this.pendingRequestSkeleton = false
        }
      }
    )
  }

  navigateTo() {
    this.router.navigateByUrl('app/network-v2/connection-requests')
  }

  moveToUserProile(id: string) {
    // tslint:disable-next-line: prefer-template
    this.router.navigateByUrl('app/person-profile/' + id + '#profileInfo')
  }

  expandCollapse(event: any) {
    this.collapsed = event
  }

  goToActivity(_e: any) {
    this.router.navigateByUrl(`app/person-profile/me?tab=1`)
  }

  navigate() {
    const config = {
      menuOptions: [
        {
          route: 'all-discussions',
          label: 'All discussions',
          enable: true,
        },
        {
          route: 'categories',
          label: 'Categories',
          enable: true,
        },
        {
          route: 'tags',
          label: 'Tags',
          enable: true,
        },
        {
          route: 'my-discussion',
          label: 'Your discussion',
          enable: true,
        },
        // {
        //   route: 'leaderboard',
        //   label: 'Leader Board',
        //   enable: true,
        // },

      ],
      userName: (this.configSvc.nodebbUserProfile && this.configSvc.nodebbUserProfile.username) || '',
      context: {
        id: 1,
      },
      categories: { result: [] },
      routerSlug: '/app',
      headerOptions: false,
      bannerOption: true,
    }
    this.discussUtilitySvc.setDiscussionConfig(config)
    localStorage.setItem('home', JSON.stringify(config))
    this.router.navigate(['/app/discussion-forum'], { queryParams: { page: 'home' }, queryParamsHandling: 'merge' })
  }

  raiseTelemetry(id: string) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.MY_DISCUSSIONS,
        id: `${id}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
  }

  toggleCreds() {
    this.showCreds = !this.showCreds
    if (this.showCreds) {
      this.credMessage = 'Hide my credentials'
    } else {
      this.credMessage = 'View my credentials'
    }
  }

  copyToClipboard(text: string) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    // textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    this.openSnackbar('copied')
    this.raiseTelemetry('copyToClipboard')
  }

  checkLeaderboardData(event: boolean) {
    if (event) {
      this.isLeaderboardExist = event
    }
  }

  navigateToNationalLearning() {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'national-learning-week',
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )

    this.router.navigateByUrl('app/learn/karmayogi-saptah')
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

}
