import { Component } from '@angular/core'
import { ProgressIndicatorLocation, GuidedTour, Orientation, GuidedTourService } from 'cb-tour-guide';
import { UtilityService, EventService, WsEvents } from '@sunbird-cb/utils';

@Component({
  selector: 'app-tour',
  templateUrl: './app-tour.component.html',
  styleUrls: ['./app-tour.component.scss'],
})
export class AppTourComponent {
  progressIndicatorLocation = ProgressIndicatorLocation.TopOfTourBlock;
  currentWindow: any

  private readonly TOUR: GuidedTour = {
    tourId: 'purchases-tour',
    useOrb: false,
    completeCallback: () => this.completeTour(),
    nextCallback: (currentStep, stepObject) => this.nextCb(currentStep, stepObject),
    prevCallback: (currentStep, stepObject) => this.prevCb(currentStep, stepObject),
    steps: [
      {
        icon: 'school',
        connectorDirection: 'left',
        title: 'Learn',
        selector: '#Learn',
        class: 'tour_learn',
        containerClass: 'tour_learn_container',
        content: 'Drive your career forward through appropriate courses, programs and assessments.',
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip'
      },
      {
        icon: 'forum',
        connectorDirection: 'left',
        title: 'Discuss',
        selector: '#Discuss',
        class: 'tour_discuss',
        containerClass: 'tour_discuss_container',
        content: 'Discuss new ideas with colleagues and experts in the government.',
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip'
      },
      {
        icon: 'search',
        connectorDirection: 'left',
        title: 'Search',
        selector: '#app-search-bar',
        class: 'tour_search',
        containerClass: 'tour_search_container',
        content: 'Find the perfect course and program tailor-made for you.',
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip'
      },
      {
        icon: 'group',
        connectorDirection: 'left',
        title: 'My Profile',
        selector: '#user_icon',
        class: 'tour_profile',
        containerClass: 'tour_profile_container',
        content: 'Update your information to get the best-suited courses and programs.',
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip'
      },
    ],
  };
  private readonly MOBILE_TOUR: GuidedTour = {
    tourId: 'purchases-tour',
    useOrb: false,
    completeCallback: () => this.completeTour(),
    steps: [
      {
        icon: 'school',
        isMobile: true,
        connectorDirection: 'top',
        title: 'Learn',
        selector: '#Learn',
        class: 'tour_learn_mobile',
        containerClass: 'tour_learn_mobile_container',
        content: 'Drive your career forward through appropriate courses, programs and assessments.',
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip'
      },
      {
        icon: 'forum',
        isMobile: true,
        connectorDirection: 'top',
        title: 'Discuss',
        selector: '#Discuss',
        class: 'tour_discuss_mobile',
        containerClass: 'tour_discuss_mobile_container',
        content: 'Discuss new ideas with colleagues and experts in the government.',
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip'
      },
      {
        icon: 'search',
        isMobile: true,
        connectorDirection: 'right',
        title: 'Search',
        selector: '#feature_search',
        class: 'tour_search_mobile',
        containerClass: 'tour_search_mobile_container',
        content: 'Find the perfect course and program tailor-made for you.',
        orientation: Orientation.BottomLeft,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip'
      },
      {
        icon: 'group',
        isMobile: true,
        connectorDirection: 'bottom',
        title: 'My Profile',
        selector: '#feature_profile',
        class: 'tour_profile_mobile',
        containerClass: 'tour_profile_mobile_container',
        content: 'Update your information to get the best-suited courses and programs.',
        orientation: Orientation.Top,
        nextBtnClass: 'action-orange mat-button',
        backBtnClass: 'back',
        skipBtnClass: 'skip'
      },
    ],
  };
  showpopup: boolean = true;
  noScroll: boolean = true;
  closePopupIcon: boolean = true;
  showCompletePopup: boolean = false;
  showVideoTour: boolean = false;
  isMobile: boolean = false;

  constructor(private guidedTourService: GuidedTourService, private utilitySvc: UtilityService, private events: EventService) {
    this.isMobile = this.utilitySvc.isMobile;
    this.raiseGetStartedStartTelemetry()
  }

  public startTour(screen: string, subType: string): void {
    this.showpopup = false;
    this.showVideoTour = false;
    this.raiseTemeletyInterat(screen, subType)
    if (this.isMobile) {
      // @ts-ignore
      document.getElementById('menuToggleMobile').click();
      setTimeout(() => {
        this.guidedTourService.startTour(this.MOBILE_TOUR);
      }, 1000);
    } else {
      this.guidedTourService.startTour(this.TOUR);
    }

  }

  public skipTour(screen: string, subType: string): void {
    if (screen.length > 0 && subType.length > 0) {
      this.raiseTemeletyInterat(screen, subType)
    } else {
      if(this.currentWindow) {
        this.raiseTemeletyInterat(`${this.currentWindow.title.toLowerCase().relace(' ','-')}-skip`, this.currentWindow.title.toLowerCase())
      } else {
        this.raiseTemeletyInterat('welcome-skip', 'welcome')
      }
    }

    this.raiseGetStartedEndTelemetry()
    this.noScroll = false;
    this.showpopup = false;
    this.showVideoTour = false;
    this.showCompletePopup = false;
    this.closePopupIcon = false
    this.guidedTourService.skipTour();
    if (this.isMobile) {
       // @ts-ignore
       document.getElementById('menuToggleMobile').click();
       setTimeout(() => {
         this.guidedTourService.startTour(this.MOBILE_TOUR);
       }, 1000);
    }
  }

  completeTour(): void {
    this.showpopup = false;
    this.showCompletePopup = true;
    this.raiseGetStartedEndTelemetry()
    if (this.isMobile) {
      // @ts-ignore
      document.getElementById('menuToggleMobile').click()
    }
  }

  startApp(): void {
    this.showpopup = true;
  }

  starVideoPlayer() {
    this.showpopup = false;
    this.showVideoTour = true;
  }

  nextCb(currentStep: number, stepObject:any) {
    this.currentWindow = stepObject
    console.log("this.currentWindow ", this.currentWindow)
    let currentStepObj: any = this.TOUR.steps[currentStep - 1]
    this.raiseTemeletyInterat(`${currentStepObj.title.toLowerCase().relace(' ','-')}-next`, currentStepObj.title.toLowerCase())
  }

  prevCb(currentStep: number, stepObject:any) {
    this.currentWindow = stepObject
    console.log("this.currentWindow ", this.currentWindow)
    let currentStepObj: any = this.TOUR.steps[currentStep +  1]
    this.raiseTemeletyInterat(`${currentStepObj.title.toLowerCase().relace(' ','-')}-previous`, currentStepObj.title.toLowerCase())
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
      pageContext: {pageId: "/home", module: WsEvents.EnumTelemetrySubType.GetStarted},
      from: '',
      to: 'Telemetry',
    }
    this.events.dispatchGetStartedEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raiseTemeletyInterat(id: string, stype: string) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: 'click', id: id, subType: stype},
        object: {},
        state: WsEvents.EnumTelemetrySubType.Interact,
        eventSubType: WsEvents.EnumTelemetrySubType.GetStarted,
        mode: 'view'
      },
      pageContext: {pageId: '/home', module: WsEvents.EnumTelemetrySubType.GetStarted},
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
      pageContext: {pageId: "/home", module: WsEvents.EnumTelemetrySubType.GetStarted},
      from: '',
      to: 'Telemetry',
    }
    this.events.dispatchGetStartedEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }
}
