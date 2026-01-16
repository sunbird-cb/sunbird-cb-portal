import { AUTO_STYLE, animate, state, transition, trigger, style } from '@angular/animations'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { HomePageService } from '../../services/home-page.service'
import { ConfigurationsService, EventService, WsEvents, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute, Router } from '@angular/router'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'
import { TranslateService } from '@ngx-translate/core'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import moment from 'moment'
import { SignupService } from '../../routes/public/public-signup/signup.service'
import _ from 'lodash';
import { ProfileV2Service } from '@ws/app/src/lib/routes/profile-v2/services/profile-v2.servive'
import { UserProfileService } from '@ws/app/src/lib/routes/user-profile/services/user-profile.service'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'

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
  surveyPopup: any
  isNotMyUser = false
  isIgotOrg = false
  nwlConfiguration: any
  canShowNlwCard = false
  slwConfiguration: any
  canShowSlwCard = false
  totalDays = 0
  daysCompleted = 0
  currentLang: any = ''
  updateDesignationCard: any
  selectDesignation: string = ''
  designationList: any = []
  showUpdateDesignations: boolean = false
  desigantionUnderApproval: any
  filterDesigantionList: any = []
  isMatcompleteOpened = false
  @Output() telemetryRaisedLibrary = new EventEmitter()
  
  constructor(
    private homePageSvc: HomePageService,
    private configSvc: ConfigurationsService,
    private activatedRoute: ActivatedRoute,
    private discussUtilitySvc: DiscussUtilsService,
    private translate: TranslateService,
    private events: EventService,
    private snackBar: MatSnackBar,
    private router: Router,
    private signupService: SignupService,
    private profileV2Svc: ProfileV2Service,
    private userProfileService: UserProfileService,
    private langtranslations: MultilingualTranslationsService) {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
      this.langtranslations.languageSelectedObservable.subscribe(() => {
        if (localStorage.getItem('websiteLanguage')) {
          this.translate.setDefaultLang('en')
          const lang = localStorage.getItem('websiteLanguage')!
          this.translate.use(lang)
          this.currentLang = lang
        }
      })
    }

  ngOnInit() {
    this.userData = this.configSvc && this.configSvc.userProfile
    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.homePageData = this.activatedRoute.snapshot.data.pageData.data
      this.learnAdvisoryData = this.activatedRoute.snapshot.data.pageData.data.learnerAdvisory
      this.surveyForm = this.activatedRoute.snapshot.data.pageData.data.surveyForm
      this.surveyPopup = this.activatedRoute.snapshot.data.pageData.data.surveyPopup
      // Fetch National learning week configurations
      this.nwlConfiguration = this.activatedRoute.snapshot.data.pageData.data.nationalLearningWeek
      this.updateDesignationCard = this.activatedRoute.snapshot.data.pageData.data.updateDesignation
      let slwConfigurationLocal:any = this.activatedRoute.snapshot.data.pageData.data &&
      this.activatedRoute.snapshot.data.pageData.data.stateLearningWeek || []

      if(slwConfigurationLocal && slwConfigurationLocal.length) {
        let userData = this.configSvc.unMappedUser
        if(userData && userData.profileDetails 
          && userData.profileDetails.refRootOrg 
          && userData.profileDetails.refRootOrg.orgId) {
          for(let item of slwConfigurationLocal) {
            if(item.orgId === userData.profileDetails.refRootOrg.orgId) {
              this.slwConfiguration = item
            }
          }
        }
      }

      if (this.nwlConfiguration && this.nwlConfiguration.enabled) {
        this.getNlwConfig()
      }
      if (this.updateDesignationCard && this.updateDesignationCard.enabled) {
        this.getMasterDesignation()
      }
      if (this.slwConfiguration && this.slwConfiguration.enabled) {
        this.getSlwConfig()
      }

    }
    // console.log(' this.userData--', this.configSvc.unMappedUser,  this.configSvc.unMappedUser.profileDetails.profileStatus)
    if (this.configSvc && this.configSvc.unMappedUser && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.profileStatus) {
      this.isNotMyUser = this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() === 'not-my-user' ? true : false
    }
    if (this.configSvc && this.configSvc.unMappedUser && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails &&
      this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName) {
      this.isIgotOrg = this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName === 'igot' ? true : false
    }

    // this.learnAdvisoryDataLength = this.learnAdvisoryData.length
    this.getInsights()
    this.getPendingRequestData()
    this.noDataValue = noData
    // this.getDiscussionsData()
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
    this.totalDays = endDate.diff(startDate, 'days')
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
        this.daysCompleted = this.totalDays
      }
    }
  }

  getSlwConfig() {
    const startDate = moment(this.slwConfiguration.startDate, 'DD-MMYYYY')
    const endDate = moment(this.slwConfiguration.endDate, 'DD-MMYYYY')
    this.totalDays = endDate.diff(startDate, 'days')
    const currentDate = moment()
    if (currentDate.isBetween(startDate, endDate, null, '[]')) {
      const daysPassed = currentDate.diff(startDate, 'days')
      this.canShowSlwCard = true
      this.daysCompleted = daysPassed

    } else if (currentDate.isBefore(startDate)) {
      this.canShowSlwCard = false
    } else if (currentDate.isAfter(endDate)) {
      const daysPassed = currentDate.diff(endDate, 'days')
      if (daysPassed === 0) {
        this.canShowSlwCard = true
        this.daysCompleted = this.totalDays
      }
    }
  }

  getMasterDesignation() {
    this.signupService.getOrgReadData(this.userData.rootOrgId).subscribe((result: any) => {
      if (result && result.frameworkid) {
        this.signupService.getFrameworkInfo(result.frameworkid).subscribe((res: any) => {
          const frameworkDetails = _.get(res, 'result.framework')
          const categoriesOfFramework = _.get(frameworkDetails, 'categories', [])
          const organisationsList = this.getTermsByCode(categoriesOfFramework, 'org')
          const disOrderedList = _.get(organisationsList, '[0].children', [])
          this.designationList = _.sortBy(disOrderedList, 'name')
          this.filterDesigantionList = this.designationList
          this.profileV2Svc.fetchApprovalDetails().subscribe((resp: any) => {
            if (resp && resp.result && resp.result.data) {
              if (resp.result.data.length > 0) {
                resp.result.data.forEach((user: any) => {
                  if (user['designation']) {
                    let designationsArray = this.designationList.map((des: any) => des.name.toLowerCase())
                    if (!designationsArray.includes(user['designation'].toLowerCase())) {
                      this.showUpdateDesignations = true
                      this.desigantionUnderApproval = user
                    }
                  }
                })
              } else {
                if (this.configSvc.userProfile && this.configSvc.userProfile.professionalDetails &&
                    this.configSvc.userProfile.professionalDetails[0] && this.configSvc.userProfile.professionalDetails[0].designation) {
                  let designation = this.configSvc.userProfile.professionalDetails[0].designation
                  if (designation) {
                    let designationsArray = this.designationList.map((des: any) => des.name.toLowerCase())
                    if (!designationsArray.includes(designation.toLowerCase())) {
                      this.showUpdateDesignations = true
                    }
                  }
                } else {
                  this.showUpdateDesignations = true
                }
              }
            }
          })
        },(_error: any) => {
          // tslint:disable-next-line
          console.error('Error occurred:', _error)
        })
      }
    },(error: any) => {
      // tslint:disable-next-line
      console.error('Error occurred:', error)
    })
  }

  private getTermsByCode(categories: any[], code: string) {
    const selectedCategory = categories.filter(
      (category: any) => category.code === code
    );
    return _.get(selectedCategory, '[0].terms', []);
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
    this.pendingRequestSkeleton = false
    // this.homePageSvc.getRecentRequests().subscribe(
    //   (res: any) => {
    //     this.pendingRequestSkeleton = false
    //     this.pendingRequestData = res.result.data && res.result.data.map((elem: any) => {
    //       elem.fullName = elem.fullName.charAt(0).toUpperCase() + elem.fullName.slice(1)
    //       return elem
    //     })
    //     // tslint:disable-next-line: align
    //   }, (error: HttpErrorResponse) => {
    //     // tslint:disable-next-line: align
    //     if (!error.ok) {
    //       // tslint:disable-next-line: align
    //       this.pendingRequestSkeleton = false
    //     }
    //   }
    // )
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

  navigateToStatelLearning() {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'state-learning-week',
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
      if(this.slwConfiguration && this.slwConfiguration.orgName && this.slwConfiguration.orgId) {
        this.router.navigateByUrl(`app/learn/mdo-channels/${this.slwConfiguration.orgName}/${this.slwConfiguration.orgId}/micro-sites`)
      }
    
  }

  updateDesignation() {
    if (this.selectDesignation) {
      this.raiseTelemetryForDesigantion()
      this.apiCallToUpdateDesignation()
    } else {
      this.openSnackbar('Please select a valid designation')
    }
  }

  raiseTelemetryForDesigantion() {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: this.selectDesignation,
        id: "designation-master-import",
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
  }

  submitProfile() {
    let payload: any = {
      request: {
        userId: this.configSvc.unMappedUser.id,
        profileDetails: {
          professionalDetails: [{designation: this.selectDesignation}]
        }
      }
    }

    this.userProfileService.editProfileDetails(payload).subscribe((res: any) => {
      if (res.responseCode === 'OK') {
        this.showUpdateDesignations = false
        this.openSnackbar('Designation updated successfully')
      }
    }, error => {
      /* tslint:disable */
      console.log(error)
      this.snackBar.open("something went wrong!")
    })

  }

  apiCallToUpdateDesignation() {
    if (this.desigantionUnderApproval) {
      this.profileV2Svc.withDrawApprovalRequest(this.configSvc.unMappedUser.id, this.desigantionUnderApproval.wfId).subscribe((resp: any) => {
        if (resp && resp.result) {
          /* tslint:disable */
          console.log(resp.result.message)
          this.submitProfile()
        }
      })
    } else {
      this.submitProfile()
    }
  }

  onInputChange(searchValue: string) {
    if (searchValue.length) {
      this.filterDesigantionList = this.designationList.filter((des: any) => des.name.toLowerCase().includes(searchValue.toLowerCase()))
      this.selectDesignation = searchValue
    } else {
      this.filterDesigantionList = this.designationList
    }
    this.selectDesignation = ''
  }

  onOptionSelected(designation: string) {
    this.selectDesignation = designation
  }

  onAutoCompleteOpened() {
    this.isMatcompleteOpened = true
  }

  onAutoCompleteClosed() {
    this.isMatcompleteOpened = false
    this.filterDesigantionList = this.designationList
  }

  openAutocomplete(trigger: MatAutocompleteTrigger, inputElement: HTMLInputElement): void {
    inputElement.focus(); // Ensure the input field is focused
    trigger.openPanel(); // Open the autocomplete panel
  }

  renderUpdateDesignationCardHeader(){
    switch (this.currentLang) {
      case "hi":
        return this.updateDesignationCard.headerHi
      case "gu":
        return this.updateDesignationCard.headerGu
      default:
        return this.updateDesignationCard.header
    }
  }

  renderUpdateDesignationCardButtonText() {
    switch (this.currentLang) {
      case "hi":
        return this.updateDesignationCard.buttonTextHi
      case "gu":
        return this.updateDesignationCard.buttonTextGu
      default:
        return this.updateDesignationCard.buttonText
    }
  }

  renderUpdateDesignationCardHint() {
    switch (this.currentLang) {
      case "hi":
        return this.updateDesignationCard.hintTextHi
      case "gu":
        return this.updateDesignationCard.hintTextGu
      default:
        return this.updateDesignationCard.hintText
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  raiseTelemetryInteratEvent(event: any) {
    this.telemetryRaisedLibrary.emit(event)
  }
}
