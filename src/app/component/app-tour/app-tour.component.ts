import { Component } from '@angular/core'
import { ProgressIndicatorLocation, GuidedTour, Orientation, GuidedTourService } from 'cb-tour-guide';
import { UtilityService } from '@sunbird-cb/utils';

@Component({
  selector: 'app-tour',
  templateUrl: './app-tour.component.html',
  styleUrls: ['./app-tour.component.scss'],
})
export class AppTourComponent {
  progressIndicatorLocation = ProgressIndicatorLocation.TopOfTourBlock;

  private readonly TOUR: GuidedTour = {
    tourId: 'purchases-tour',
    useOrb: false,
    completeCallback: () => this.completeTour(),
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
  showCompletePopup: boolean = false;
  showVideoTour: boolean = false;
  isMobile: boolean = false;

  constructor(private guidedTourService: GuidedTourService, private utilitySvc: UtilityService) {
    console.log('is mobile ', this.utilitySvc.isMobile); // TODO: log!
    this.isMobile = this.utilitySvc.isMobile;
  }

  public startTour(): void {
    console.log('called tour'); // TODO: log!
    this.showpopup = false;
    this.showVideoTour = false;
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

  public skipTour(): void {
    console.log('skipped tour'); // TODO: log!
    this.noScroll = false;
    this.showpopup = false;
    this.showVideoTour = false;
    this.showCompletePopup = false;
    this.guidedTourService.skipTour();
  }

  completeTour(): void {
    this.showpopup = false;
    this.showCompletePopup = true;
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
}
