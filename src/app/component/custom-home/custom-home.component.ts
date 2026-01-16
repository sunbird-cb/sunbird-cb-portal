import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
/* tslint:disable */
import _ from 'lodash'
import moment from 'moment'
import { HomePageService } from 'src/app/services/home-page.service'

// Add this helper function before your component class
function isStripActive(strip: any): boolean {
  return !!(strip &&
    strip.strips &&
    Array.isArray(strip.strips) &&
    strip.strips.length > 0 &&
    strip.strips[0] &&
    strip.strips[0].active === true);
}

// Add this constant at the top of your file (near other constants)
const INITIAL_VISIBLE_STRIPS = 5;

@Component({
  selector: 'ws-custom-home',
  templateUrl: './custom-home.component.html',
  styleUrls: ['./custom-home.component.scss']
})
export class CustomHomeComponent implements OnInit, AfterViewInit {
  widgetData = {}
  contentStripData: any = {}
  sectionList: any[] = []
  sliderData = []
  enableLazyLoadingFlag = true
  isTelemetryRaised = false
  departmentId: string = ''
  homeConfig: any = {}
  currentPosition: any
  mobileTopHeaderVisibilityStatus: any = true
  private readonly initialVisibleStrips = INITIAL_VISIBLE_STRIPS;
  showNoConfig: boolean = false
  showModal: boolean = false
  profileCardData: any
  profileDataLoading: boolean = false
  userData: any
  insightsData: any
  clapsDataLoading = true
  isNotMyUser = false
  isIgotOrg = false
  nwlConfiguration: any
  canShowNlwCard = false
  slwConfiguration: any
  canShowSlwCard = false
  totalDays = 0
  daysCompleted = 0
  announcementData: any
  eventsCalendarData: any
  orgId: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private events: EventService,
    private translate: TranslateService,
    private router: Router,
    private configSvc: ConfigurationsService,
    private homePageSvc: HomePageService,
  ) { }

  ngOnInit() {
    this.userData = this.configSvc && this.configSvc.userProfile
    this.orgId = this.configSvc && this.configSvc.unMappedUser.organisations[0].organisationId  
    // Get department ID from route parameters
    this.departmentId = this.activatedRoute.snapshot.params['id']
    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data

    ) {
      this.homeConfig = this.activatedRoute.snapshot.data.pageData.data.homeConfig
      this.profileCardData = this.activatedRoute.snapshot.data.pageData.data.profileCard
      this.announcementData = this.activatedRoute.snapshot.data.pageData.data.announcementSection
      this.eventsCalendarData = this.activatedRoute.snapshot.data.pageData.data.eventCalendar

        this.contentStripData = this.activatedRoute.snapshot.data.pageData.data || []
        // tslint:disable-next-line: prefer-template
        this.contentStripData = (this.contentStripData.newHomeStrip || []).sort((a: any, b: any) => a.order - b.order)

        // Clear sectionList before adding new entries
        this.sectionList = [];

        // Add all content strips to sectionList with correct indices
        this.contentStripData.forEach((strip: any, index: number) => {
          const obj: any = {};
          obj['section'] = 'section_' + index;
          obj['isVisible'] = false;
          obj['stripData'] = strip;
          obj['isActive'] = isStripActive(strip);
          this.sectionList.push(obj);
        });
      this.enableLazyLoadingFlag = this.activatedRoute.snapshot.data.pageData.data.enableLazyLoading
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
      this.sliderData = this.activatedRoute.snapshot.data.pageData.data.sliderData
      this.sectionList.push({ section: 'slider', isVisible: true })

      // Fetch National learning week configurations
      this.nwlConfiguration = this.activatedRoute.snapshot.data.pageData.data.nationalLearningWeek
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
      if (this.slwConfiguration && this.slwConfiguration.enabled) {
        this.getSlwConfig()
      }
      this.getInsights()
    } else {
      this.showNoConfig = true
    }
  }

  ngAfterViewInit() {
    // Make the first few content strips visible initially
    for (let i = 0; i < this.sectionList.length && i < this.initialVisibleStrips; i++) {
      if (this.sectionList[i]['section'].startsWith('section_')) {
        this.sectionList[i]['isVisible'] = true;
      }
    }
  }

  // handleDefaultFontSetting() {
  //   const fontClass = localStorage.getItem('setting')
  //   this.btnSettingsSvc.changeFont(fontClass)
  // }

  translateHub(hubName: string): string {
    const translationKey = hubName
    return this.translate.instant(translationKey)
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler() {
    // Check visibility for sections that aren't already visible
    for (let i = 0; i < this.sectionList.length; i++) {
      if (!this.sectionList[i]['isVisible'] &&
        !this.sectionList[i]['section'].match(new RegExp(`^section_[0-${this.initialVisibleStrips - 1}]$`))) {
        this.checkSectionVisibility(this.sectionList[i]['section']);
      }
    }
  }

  checkSectionVisibility(className: string) {
    // Skip already visible sections
    if (className.match(new RegExp(`^section_[0-${this.initialVisibleStrips - 1}]$`))) {
      return;
    }

    // Find the section in our list
    const sectionIndex = this.sectionList.findIndex((item: any) => item.section === className);
    if (sectionIndex === -1) return;

    // Check if the element is in viewport
    const elements = document.getElementsByClassName(className);
    if (elements && elements.length > 0) {
      const rect = elements[0].getBoundingClientRect();
      const eleTop = rect.top;
      const eleBottom = rect.bottom;
      const isVisible = (eleTop >= 0) && (eleBottom <= window.innerHeight);

      // Update visibility
      if (isVisible) {
        this.sectionList[sectionIndex]['isVisible'] = true;
      }
    }
  }
  
  raiseTelemetryInteratEvent(event: any) {
    if (event && event.viewMoreUrl) {
      this.raiseTelemetry(`${event.stripTitle} ${event.viewMoreUrl.viewMoreText}`, event.typeOfTelemetry)
    }
    if (!this.isTelemetryRaised && event && !event.viewMoreUrl) {
      if (event.contentId && event.contentId.includes("ext")) {
        this.events.raiseInteractTelemetry(
          {
            type: 'click',
            subType: event.typeOfTelemetry,
            id: 'card-content',
          },
          {
            id: event.contentId || event.identifier,
            type: 'External content'
          },
          {
            module: WsEvents.EnumTelemetrymodules.HOME
          }
        )
      } else {
        let id = event.typeOfTelemetry === 'mdoChannel' ? event.identifier : event.orgId
        let type = event.typeOfTelemetry === 'mdoChannel' ? 'org/ministry' : event.title
        let _subType = event.typeOfTelemetry === 'mdoChannel' ? 'mdo-channel' :
          event.typeOfTelemetry === 'karmaProgram' ? 'karma-programs' : event.typeOfTelemetry
        if ((event.typeOfTelemetry === 'cbpPlan' && !event?.sakshamAIGenerated
          || event.typeOfTelemetry === 'forYou'
          || event.typeOfTelemetry === 'continueLearning') && event.selectedTab && event.selectedPill
        ) {
          id = event.identifier
          type = event.primaryCategory
          _subType = `${event.selectedTab}-${event.selectedPill}`
        }
        else if (event.typeOfTelemetry === 'cbpPlan' && event?.sakshamAIGenerated) {
          id = event.identifier
          type = event.primaryCategory
          _subType = 'igot-ai'
        }
        else if (event.typeOfTelemetry === 'providers') {
          id = event.orgId
          type = 'org'
          _subType = `training-institutions`
        }

        this.events.raiseInteractTelemetry(
          {
            type: 'click',
            subType: _subType,
            id: 'card-content',
            pageid: "/page/home"
          },
          {
            id,
            type,
          },
          {
            module: WsEvents.EnumTelemetrymodules.HOME,
          }
        )
      }
    }
    this.isTelemetryRaised = true

  }

  raiseTelemetry(name: string, subtype: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: subtype,
        id: `${_.kebabCase(name).toLocaleLowerCase()}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
  }

  triggerOpenDialog(event: boolean) {
    if(event) {
      this.showModal = true
      document.body.style.overflow = 'hidden'
    }
    this.raiseTelemetry('key annoucements', 'key annoucements')
  }

  onClose() {
    this.showModal = false
    document.body.style.overflow = 'auto'
    this.raiseTelemetry('key annoucements', 'close key annoucements')
  }

  goToActivity(_e: any) {
    this.router.navigateByUrl(`app/person-profile/me?tab=1`)
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

  getOrgId(stripData: any) {
    if (stripData && stripData.orgIDNeeded) {
      return this.orgId
    } else {
      return ''
    }
  }
}