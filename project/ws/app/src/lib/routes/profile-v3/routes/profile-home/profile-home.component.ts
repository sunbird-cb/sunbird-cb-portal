import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core'
import { map } from 'rxjs/operators'
import { ValueService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
// tslint:disable-next-line
import _ from 'lodash'
import { Subscription } from 'rxjs'
import { StepService } from '../../services/step.service'
@Component({
  selector: 'ws-app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss'],
})
export class ProfileHomeComponent implements OnInit, OnDestroy {
  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef
  isLtMedium$ = this.valueSvc.isLtMedium$
  private defaultSideNavBarOpenedSubscription: any
  sideNavBarOpened = true
  public screenSizeIsLtMedium = false
  sticky = false
  currentRoute = 'all'
  banner!: NsWidgetResolver.IWidgetData<any>
  userRouteName = ''
  private routerSubscription: Subscription | null = null

  tabs!: NSProfileDataV3.IProfileTab[]
  tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
  message = `Welcome to the Portal`
  currentStep = 1
  mode$ = this.isLtMedium$.pipe(map((isMedium: any) => (isMedium ? 'over' : 'side')))
  constructor(
    private valueSvc: ValueService,
    private route: ActivatedRoute,
    private router: Router,
    private stepService: StepService,
  ) {
    this.tabs = _.orderBy(this.tabsData, 'step')
    this.stepService.allSteps.next(this.tabs.length)
    this.init()
  }
  init() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
    this.routerSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) { // do not delete this
        // console.log(event)
      }
      if (event instanceof NavigationEnd) {
        _.each(this.tabs, t => {
          if (event.url.indexOf(t.routerLink) !== -1) {
            this.message = t.description
            this.currentStep = t.step
            this.stepService.currentStep.next(t)
          }
        })
      }
    })
  }
  updateProfile() {
    // need to update profile
    this.router.navigate(['/page/home'])
  }
  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isLtMedium => {
      this.sideNavBarOpened = !isLtMedium
      this.screenSizeIsLtMedium = isLtMedium
    })

  }

  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
  }
  get next() {
    const nextStep = _.first(_.filter(this.tabs, { step: this.currentStep + 1 }))
    if (nextStep) {
      return nextStep
    }
    return 'done'
  }

  get previous() {
    const previousStep = _.first(_.filter(this.tabs, { step: this.currentStep - 1 }))
    if (previousStep !== undefined) {
      return previousStep
    }
    return 'first'
  }
  get skip() {
    this.stepService.skiped.next(true)
    const nextStep = _.first(_.filter(this.tabs, { step: this.currentStep + 1 }))
    if (nextStep && nextStep.step !== this.tabs.length + 1) {
      return nextStep
    }
    return null
  }
  get current() {
    const currentStep = _.first(_.filter(this.tabs, { step: this.currentStep }))
    if (currentStep !== undefined) {
      return currentStep
    }
    return null
  }
}
