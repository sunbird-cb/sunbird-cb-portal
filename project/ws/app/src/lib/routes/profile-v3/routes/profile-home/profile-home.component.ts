import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core'
import { map } from 'rxjs/operators'
import { ConfigurationsService, ValueService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
// tslint:disable-next-line
import _ from 'lodash'
import { Subscription } from 'rxjs'
import { StepService } from '../../services/step.service'
import { CompLocalService } from '../../services/comp.service'
import { ProfileV3Service } from '../../services/profile_v3.service'
import { InitService } from 'src/app/services/init.service'
import { TranslateService } from '@ngx-translate/core'
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

  tabs: NSProfileDataV3.IProfileTab[] = []
  tabsData = this.route.parent && this.route.parent.snapshot.data.pageData.data.tabs || []
  message = `Welcome to the Portal`
  currentStep = 1
  mode$ = this.isLtMedium$.pipe(map((isMedium: any) => (isMedium ? 'over' : 'side')))
  constructor(
    private valueSvc: ValueService,
    private route: ActivatedRoute,
    private router: Router,
    private stepService: StepService,
    private configSvc: ConfigurationsService,
    private compLocalService: CompLocalService,
    private profileSvc: ProfileV3Service,
    private initSvc: InitService,
    private translate: TranslateService,
  ) {
    if (!this.configSvc || !this.configSvc.userProfileV2) {
      this.initSvc.init().then(() => {
        this.defineTabs()
        this.init()
      })
    } else {
      this.defineTabs()
      this.init()
    }
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }

  }
  defineTabs() {
    this.tabs = _.orderBy(_.filter(this.tabsData, { enabled: true }), 'step')
    _.each(this.tabs, (t, idx) => {
      t.step = idx + 1
    })
    this.stepService.allSteps.next(this.tabs.length)
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
  updateCompentency() {
    this.tabs.forEach(s => {
      if (s.step === this.currentStep) {
        if (s.key.indexOf('competencies') !== -1 && this.configSvc.userProfileV2) {
          if (this.compLocalService.autoSaveCurrent.value) {
            // console.log("currentcompetencies========>", this.compLocalService.currentComps.value)
            this.profileSvc.updateCCProfileDetails({
              request: {
                profileDetails: {
                  competencies: this.compLocalService.currentComps.value,
                },
                userId: this.configSvc.userProfileV2.userId,
              },
            }).subscribe(sres => {
              if (sres && sres.responseCode === 'OK') {
                this.compLocalService.autoSaveCurrent.next(false)
                this.configSvc.updateGlobalProfile(true)
              }
            })

          }
        } else if (s.key.indexOf('desiredCompetencies') !== -1 && this.configSvc.userProfileV2) {
          if (this.compLocalService.autoSaveDesired.value) {
            // console.log("desiredcompetencies========>", this.compLocalService.desiredComps.value)
            this.profileSvc.updateDCProfileDetails({
              request: {
                profileDetails: {
                  desiredCompetencies: this.compLocalService.desiredComps.value,
                },
                userId: this.configSvc.userProfileV2.userId,
              },
            }).subscribe(res => {
              if (res && res.responseCode === 'OK') {
                this.compLocalService.autoSaveDesired.next(false)
                this.configSvc.updateGlobalProfile(true)
              }
            })
          }
        }
      }
    })
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
    if (!this.isNextStepAllowed) { return }
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
    if (!this.isNextStepAllowed) { return }
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
      // console.log(JSON.stringify(currentStep)+ '-- value of currentStep======-')
      return currentStep

    }
    return null
  }
  get isNextStepAllowed(): boolean {
    let isAllowed = false
    this.tabs.forEach(s => {
      if (s.step === this.currentStep) {
        if (s.key.indexOf('welcome') !== -1) {
          isAllowed = true
        } else if (s.key.indexOf('userRoles') !== -1) {
          if (
            (this.stepService.currentStep.value.allowSkip
              || this.configSvc.unMappedUser
              && this.configSvc.unMappedUser.profileDetails
              && this.configSvc.unMappedUser.profileDetails.userRoles
              && this.configSvc.unMappedUser.profileDetails.userRoles.length > 0)
          ) {
            isAllowed = true
          }
        } else if (s.key.indexOf('systemTopics') !== -1) {
          if (this.stepService.currentStep.value.allowSkip
            || (this.configSvc.unMappedUser
              && this.configSvc.unMappedUser.profileDetails
              && (
                (this.configSvc.unMappedUser.profileDetails.systemTopics
                  && this.configSvc.unMappedUser.profileDetails.systemTopics.length > 0
                )
                ||
                (this.configSvc.unMappedUser.profileDetails.desiredTopics
                  && this.configSvc.unMappedUser.profileDetails.desiredTopics.length > 0
                )
              ))
          ) {
            isAllowed = true
          }
        } else if (s.key.indexOf('competencies') !== -1) {
          if (this.stepService.currentStep.value.allowSkip
            || (this.configSvc.unMappedUser
              && this.configSvc.unMappedUser.profileDetails
              && this.configSvc.unMappedUser.profileDetails.competencies
              && this.configSvc.unMappedUser.profileDetails.competencies.length > 0)
          ) {
            isAllowed = true
          }
        } else if (s.key.indexOf('desiredCompetencies') !== -1) {
          if (this.stepService.currentStep.value.allowSkip
            || (this.configSvc.unMappedUser
              && this.configSvc.unMappedUser.profileDetails
              && this.configSvc.unMappedUser.profileDetails.desiredCompetencies
              && this.configSvc.unMappedUser.profileDetails.desiredCompetencies.length > 0)
          ) {
            isAllowed = true
          }
        } else if (s.key.indexOf('platformWalkthrough') !== -1) {
          isAllowed = true
        }
      }
    })
    return isAllowed
  }

  translateTo(menuName: string): string {
    const translationKey = 'profilehome.' + menuName.replace(/\s/g, '')
    return this.translate.instant(translationKey)
  }
}
