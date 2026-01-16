import { Component, HostListener } from '@angular/core'
import { ProgressIndicatorLocation, GuidedTour, Orientation, GuidedTourService } from 'igot-cb-tour-guide'
import { UtilityService, EventService, WsEvents, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { UserProfileService } from '@ws/app/src/lib/routes/user-profile/services/user-profile.service'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-tour',
  templateUrl: './app-tour.component.html',
  styleUrls: ['./app-tour.component.scss'],
  providers: [UserProfileService],
})

export class AppTourComponent {
  progressIndicatorLocation = ProgressIndicatorLocation.TopOfTourBlock
  currentWindow: any
  videoProgressTime = 114
  tourStatus: any = { visited: true, skipped: false }
  showpopup = true
  noScroll  = true
  closePopupIcon = true
  showCompletePopup  = false
  showVideoTour = false
  isMobile = false
  hideCloseBtn = false
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.skipTour('', '')
    }
  }
  // tslint:disable-next-line
  private readonly TOUR: GuidedTour = {
    tourId: 'purchases-tour',
    useOrb: false,
    completeCallback: () => this.completeTour(),
    nextCallback: (currentStep, stepObject) => this.nextCb(currentStep, stepObject),
    prevCallback: (currentStep, stepObject) => this.prevCb(currentStep, stepObject),
    // closeModalCallback: () => setTimeout(() => {
    //   this.closeModal()
    //   // tslint:disable-next-line
    // }, 500),
    steps: [
      {
        icon: 'school',
        connectorDirection: 'left',
        title: this.translateTo('stepLearn'),
        selector: '#Learn',
        class: 'tour_learn',
        containerClass: 'tour_learn_container',
        content: this.translateTo('learnContnet'),
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip',
      },
      {
        icon: 'forum',
        connectorDirection: 'left',
        title: this.translateTo('stepDiscuss'),
        selector: '#Discuss',
        class: 'tour_discuss',
        containerClass: 'tour_discuss_container',
        content: this.translateTo('discussContent'),
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip',
      },
      {
        icon: 'search',
        connectorDirection: 'left',
        title: this.translateTo('stepSearch'),
        selector: '#app-search-bar',
        class: 'tour_search',
        containerClass: 'tour_search_container',
        content: this.translateTo('searchContent'),
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip',
      },
      {
        icon: 'person',
        connectorDirection: 'right',
        title: this.translateTo('stepMyProfile'),
        selector: '#user_icon',
        class: 'tour_profile',
        containerClass: 'tour_profile_container',
        content: this.translateTo('myProfileContent'),
        orientation: Orientation.BottomRight,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip',
      },
    ],
    preventBackdropFromAdvancing: true,
  }
  // tslint:disable-next-line
  private readonly MOBILE_TOUR: GuidedTour = {
    tourId: 'purchases-tour',
    useOrb: false,
    completeCallback: () => this.completeTour(),
    steps: [
      {
        icon: 'school',
        isMobile: true,
        connectorDirection: 'top',
        title: this.translateTo('stepLearn'),
        selector: '#Learn',
        class: 'tour_learn_mobile',
        containerClass: 'tour_learn_mobile_container',
        content: this.translateTo('learnContnet'),
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip',
      },
      {
        icon: 'forum',
        isMobile: true,
        connectorDirection: 'top',
        title: this.translateTo('stepDiscuss'),
        selector: '#Discuss',
        class: 'tour_discuss_mobile',
        containerClass: 'tour_discuss_mobile_container',
        content: 'Discuss new ideas with colleagues and experts in the government.',
        orientation: Orientation.Bottom,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip',
      },
      {
        icon: 'search',
        isMobile: true,
        connectorDirection: 'bottom',
        title: 'Search',
        selector: '#feature_mobile_search',
        class: 'tour_search_mobile',
        containerClass: 'tour_search_mobile_container',
        content: 'Find the perfect course and program tailor-made for you.',
        orientation: Orientation.TopRight,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip',
      },
      {
        icon: 'person',
        isMobile: true,
        connectorDirection: 'top',
        title: 'My Profile',
        selector: '#user_icon',
        class: 'tour_profile_mobile',
        containerClass: 'tour_profile_mobile_container',
        content: 'Update your information to get the best-suited courses and programs.',
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip',
      },
    ],
  }

  constructor(
    private guidedTourService: GuidedTourService,
    private utilitySvc: UtilityService,
    private configSvc: ConfigurationsService,
    private events: EventService,
    private userProfileSvc: UserProfileService,
    private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    this.isMobile = this.utilitySvc.isMobile
    this.raiseGetStartedStartTelemetry()
  }

  updateTourstatus(status: any) {
    const reqUpdates = {
      request: {
        userId: this.configSvc.unMappedUser.id,
        profileDetails: { get_started_tour: status },
      },
    }
    this.userProfileSvc.editProfileDetails(reqUpdates).subscribe((_res: any) => {
      // console.log("re s ", res )
    })
  }

  emitFromVideo(event: any) {
    if (event === 'skip') {
      this.skipTour(`video-${event}`, 'video')
    } else {
      this.startTour(`welcome-${event}`, 'welcome')
    }
  }

  public startTour(screen: string, subType: string): void {
    this.showpopup = false
    this.showVideoTour = false
    this.raiseTemeletyInterat(screen, subType)
    if (this.isMobile) {
      // @ts-ignore
      setTimeout(() => {
        this.guidedTourService.startTour(this.MOBILE_TOUR)
        // tslint:disable-next-line: align
      }, 2000)
    } else {
     this.guidedTourService.startTour(this.TOUR)
      setTimeout(() => {
        // @ts-ignore
        const _left = parseFloat(document.getElementsByClassName('tour_learn')[0]['style']['left'].split('px')[0])
        // @ts-ignore
        // tslint:disable-next-line: prefer-template
        document.getElementsByClassName('tour_learn')[0]['style']['left'] = (_left - 10) + 'px'
        // tslint:disable-next-line: align
      }, 100)
    }

  }

  public skipTour(screen: string, subType: string): void {
    // localStorage.setItem('tourGuide',JSON.stringify({'disable': true}) )
    this.updateTourstatus({ visited: true, skipped: true })
    this.configSvc.updateTourGuideMethod(true)
    if (screen.length > 0 && subType.length > 0) {
      this.raiseTemeletyInterat(screen, subType)
    } else {
      if (this.currentWindow) {
        // tslint:disable-next-line: max-line-length
        this.raiseTemeletyInterat(`${this.currentWindow.title.toLowerCase().replace(' ', '-')}-skip`, this.currentWindow.title.toLowerCase())
      } else {
        this.raiseTemeletyInterat('welcome-skip', 'welcome')
      }
    }
    this.raiseGetStartedEndTelemetry()
    this.noScroll = false
    this.showpopup = false
    this.showVideoTour = false
    this.showCompletePopup = false
    this.closePopupIcon = false
    setTimeout(() => {
      // tslint:disable-next-line
      this.guidedTourService && this.guidedTourService.skipTour()
      // tslint:disable-next-line: align
    }, 2000)
    if (this.isMobile) {
      // tslint:disable-next-line: align
       // @ts-ignore
       setTimeout(() => {
         this.guidedTourService.startTour(this.MOBILE_TOUR)
         // tslint:disable-next-line: align
       }, 2000)
    }
  }

  completeTour(): void {
    this.hideCloseBtn = false
    this.showpopup = false
    this.showCompletePopup = true
    setTimeout(() => {
      this.onCongrats()
    // tslint: disable-next-line
    },         3000)
    this.raiseGetStartedEndTelemetry()
    this.updateTourstatus({ visited: true, skipped: false })
  }

  onCongrats(): void {
    this.showCompletePopup = false
    localStorage.setItem('tourGuide', JSON.stringify({ 'disable': true }))
    this.configSvc.updateTourGuideMethod(true)
  }

  startApp(): void {
    this.showpopup = true
  }

  starVideoPlayer() {
    this.showpopup = false
    this.showVideoTour = true
  }

  nextCb(currentStep: number, stepObject: any) {
    if (stepObject.title === 'My Profile') {
      this.hideCloseBtn = true
    }
    // tslint:disable-next-line
    console.log('currentStep', currentStep)
    this.currentWindow = stepObject
    const currentStepObj: any = this.TOUR.steps[currentStep - 1]
    // // tslint:disable-next-line: max-line-length
    this.raiseTemeletyInterat(`${currentStepObj.title.toLowerCase().replace(' ', '-')}-next`, currentStepObj.title.toLowerCase())
  }

  prevCb(currentStep: number, stepObject: any) {
    // tslint:disable-next-line
    console.log('currentStep', currentStep)
    this.hideCloseBtn = false
    this.currentWindow = stepObject
    const currentStepObj: any = this.TOUR.steps[currentStep +  1]
    // // tslint:disable-next-line: max-line-length
    this.raiseTemeletyInterat(`${currentStepObj.title.toLowerCase().replace(' ', '-')}-previous`, currentStepObj.title.toLowerCase())
  }

  raiseGetStartedStartTelemetry() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: '' },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Loaded,
        eventSubType: WsEvents.EnumTelemetrySubType.GetStarted,
        type: 'Get Started',
        mode: 'view',
      },
      pageContext: { pageId: '/home', module: WsEvents.EnumTelemetrySubType.GetStarted },
      from: '',
      to: 'Telemetry',
    }
    this.events.dispatchGetStartedEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raiseTemeletyInterat(idn: string, stype: string) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', id: idn, subType: stype },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.GetStarted,
        mode: 'view',
      },
      pageContext: { pageId: '/home', module: WsEvents.EnumTelemetrySubType.GetStarted },
      from: '',
      to: 'Telemetry',
    }
    this.events.dispatchGetStartedEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raiseGetStartedEndTelemetry() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: '' },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Unloaded,
        eventSubType: WsEvents.EnumTelemetrySubType.GetStarted,
        type: 'Get Started',
        mode: 'view',
      },
      pageContext: { pageId: '/home', module: WsEvents.EnumTelemetrySubType.GetStarted },
      from: '',
      to: 'Telemetry',
    }
    this.events.dispatchGetStartedEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  closeModal() {
    this.skipTour('', '')
  }

  translateTo(name: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey =  'tour.' + name
    return this.translate.instant(translationKey)
  }
}
