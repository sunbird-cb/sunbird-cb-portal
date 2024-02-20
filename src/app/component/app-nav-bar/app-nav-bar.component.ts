import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { IBtnAppsConfig, CustomTourService } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ConfigurationsService, EventService, MultilingualTranslationsService, NsInstanceConfig, NsPage, WsEvents } from '@sunbird-cb/utils'
import { Router, NavigationStart, NavigationEnd } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'ws-app-nav-bar',
  templateUrl: './app-nav-bar.component.html',
  styleUrls: ['./app-nav-bar.component.scss'],
})
export class AppNavBarComponent implements OnInit, OnChanges {
  @Input() mode: 'top' | 'bottom' = 'top'
  @Input() headerFooterConfigData: any
  // @Input()
  // @HostBinding('id')
  // public id!: string
  basicBtnAppsConfig: NsWidgetResolver.IRenderConfigWithTypedData<IBtnAppsConfig> = {
    widgetType: 'actionButton',
    widgetSubType: 'actionButtonApps',
    widgetData: { allListingUrl: '' }, // /app/features
  }
  forPreview = window.location.href.includes('/public/')
    || window.location.href.includes('&preview=true')
  enableLang: any
  isPlayerPage = window.location.href.includes('/viewer/')
  instanceVal = ''
  btnAppsConfig!: NsWidgetResolver.IRenderConfigWithTypedData<IBtnAppsConfig>
  appIcon: SafeUrl | null = null
  appIconSecondary: SafeUrl | null = null
  appBottomIcon?: SafeUrl
  primaryNavbarBackground: Partial<NsPage.INavBackground> | null = null
  primaryNavbarConfig: NsInstanceConfig.IPrimaryNavbarConfig | null = null
  pageNavbar: Partial<NsPage.INavBackground> | null = null
  featureApps: string[] = []
  isHelpMenuRestricted = false
  isTourGuideAvailable = false
  isTourGuideClosed = false
  showAppNavBar = false
  popupTour: any
  currentRoute = 'page/home'
  isPublicHomePage = window.location.href.includes('/public/home')
  isSetUpPage = false
  isLoggedIn = false
  fontContainerFlag = false
  activeRoute = ''
  countdata: any
  enrollInterval: any
  karmaPointLoading = true
  tooltipDelay: any = 1000
  jan26Data: any
  logoDisplayTime: any
  janDataEnable = true
  // defaultLogo: false
  animationDuration: number | undefined

  constructor(
    private domSanitizer: DomSanitizer,
    private configSvc: ConfigurationsService,
    private tourService: CustomTourService,
    private router: Router,
    private translate: TranslateService,
    private events: EventService,
    private langtranslations: MultilingualTranslationsService
  ) {
    this.btnAppsConfig = { ...this.basicBtnAppsConfig }
    if (this.configSvc.restrictedFeatures) {
      this.isHelpMenuRestricted = this.configSvc.restrictedFeatures.has('helpNavBarMenu')
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.cancelTour()
      } else if (event instanceof NavigationEnd) {
        localStorage.setItem('previousUrl', event.url)
        this.routeSubs(event)
        this.cancelTour()
        this.bindUrl(event.url.replace('/app/competencies/', ''))
      }
    })

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }

  }

  ngOnInit() {
    if (this.configSvc) {
      this.jan26Data = this.configSvc.overrideThemeChanges
      this.logoDisplayTime = this.jan26Data.desktop.logoDisplayTime
      this.displayLogo()
      setInterval(() => {
        this.janDataEnable = true
        this.displayLogo()
        // tslint:disable-next-line
       }, this.logoDisplayTime)
    }

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
          if (localStorage.getItem('activeRoute')) {
            const route = localStorage.getItem('activeRoute')
            this.activeRoute = route ? route.toLowerCase().toString() : ''
          }

          if (event.url.includes('/page/home')) {
            this.activeRoute = 'home'
          } else if (event.url.includes('/page/explore')) {
            this.activeRoute = 'explorer'
          } else if (event.url.includes('app/globalsearch')  || event.url.includes('/app/search/home')) {
            this.activeRoute = 'search'
          } else if (event.url.includes('app/careers')) {
            this.activeRoute = 'Career'
          } else if (event.url.includes('app/seeAll?key=continueLearning')) {
            this.activeRoute = 'my learnings'
          }
      }
    })

    if (this.configSvc.userProfile && this.configSvc.userProfile.userId) {
        this.isLoggedIn = true
    }
    if (this.configSvc.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.app,
      )

      this.appIconSecondary = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.appSecondary,
      )
      this.instanceVal = this.configSvc.rootOrg || ''
      if (this.configSvc.instanceConfig.logos.appBottomNav) {
        this.appBottomIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
          this.configSvc.instanceConfig.logos.appBottomNav,
        )
      }
      this.primaryNavbarBackground = this.configSvc.primaryNavBar
      this.pageNavbar = this.configSvc.pageNavBar
      this.primaryNavbarConfig = this.configSvc.primaryNavBarConfig
    }
    if (this.configSvc.appsConfig) {
      this.featureApps = Object.keys(this.configSvc.appsConfig.features)
    }
    this.configSvc.tourGuideNotifier.subscribe(canShow => {
      if (
        this.configSvc.restrictedFeatures &&
        !this.configSvc.restrictedFeatures.has('tourGuide')
      ) {
        this.isTourGuideAvailable = canShow
        this.popupTour = this.tourService.createPopupTour()
      }
    })
    this.startTour()
    this.enrollInterval = setInterval(() => {
      this.getKarmaCount()
    // tslint:disable-next-line
    }, 1000)
  }

  displayLogo() {
    const animationDur = this.jan26Data.desktop.animationDuration
    setTimeout(() => {
      this.janDataEnable = false
      // tslint:disable-next-line
    }, animationDur)
  }
  routeSubs(e: NavigationEnd) {
    // this.router.events.subscribe((e: Event) => {
    //   if (e instanceof NavigationEnd) {
    if (e.url.includes('/app/setup')) {
      this.isSetUpPage = true
    } else {
      this.isSetUpPage = false
    }
    if (
      e.url.includes('/public/logout')
      || e.url.includes('/public/home')
      || e.url.includes('/public/sso')
      || e.url.includes('/public/google/sso')
      || e.url.startsWith('/viewer')
    ) {
      this.showAppNavBar = false
      if (e.url.includes('/public/home')) {
        this.isPublicHomePage = true
      } else {
        this.isPublicHomePage = false
      }
    // tslint:disable-next-line: max-line-length
    } else if ((e.url.includes('/app/setup') && this.configSvc.instanceConfig && !this.configSvc.instanceConfig.showNavBarInSetup)) {
      this.showAppNavBar = false
    } else {
      this.showAppNavBar = true
    }
    //   }
    // })
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'mode') {
        if (this.mode === 'bottom') {
          this.btnAppsConfig = {
            ...this.basicBtnAppsConfig,
            widgetData: {
              ...this.basicBtnAppsConfig.widgetData,
              showTitle: true,
            },
          }
        } else {
          this.btnAppsConfig = {
            ...this.basicBtnAppsConfig,
          }
        }
      }
    }
  }

  startTour() {
    // this.tourService.createPopupTour()
    // this.tourService.isTourComplete.subscribe((result: boolean) => {
    //   if ((result)) {
    //     this.tourService.createPopupTour()
    //     this.configSvc.completedTour = true
    //     this.configSvc.prefChangeNotifier.next({ completedTour: this.configSvc.completedTour })
    //     // this.tour = tour
    //     setTimeout(
    //       () => {
    //         this.tourService.startPopupTour()
    //       },
    //       3000,
    //     )
    //   }
    // })
  }
  cancelTour() {
    if (this.popupTour) {
      this.tourService.cancelPopupTour()
      this.isTourGuideClosed = false
    }

  }
  bindUrl(path: string) {
    if (path) {
      // console.log(path)
      if (path !== '/app/competencies') {
        this.currentRoute = path
      }
    }
  }
  get stillOnHomePage(): boolean {
    this.isPublicHomePage = window.location.href.includes('/public/home')
    return this.isPublicHomePage
  }
  get fullMenuDispaly(): boolean {
    this.isPlayerPage = window.location.href.includes('/viewer/')
    return !(this.isPlayerPage || this.stillOnHomePage)
  }
  get sShowAppNavBar(): boolean {
    return this.showAppNavBar
  }
  get needToHide(): boolean {
    return this.currentRoute.includes('all/assessment/')
  }
  // parichay changes
  get isforPreview(): boolean {
    this.forPreview = window.location.href.includes('/public/')
    || window.location.href.includes('&preview=true')
    || window.location.href.includes('/certs')
    return this.forPreview
  }
  get isenableLang(): boolean {
    if (window.location.href.includes('/public/faq') || window.location.href.includes('/public/contact')) {
      return true
    }
    return false
  }
  get isThisSetUpPage(): boolean {
    if (window.location.pathname.includes('/app/setup')) {
      this.isSetUpPage = true
    } else {
      this.isSetUpPage = false
    }
    return this.isSetUpPage
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, '')
  }
  redirectToPath(pathConfig: any) {
    if (pathConfig && pathConfig.key) {
      this.router.navigate([pathConfig.path], { queryParams: { key: pathConfig.key } })
    } else {
      this.router.navigate([pathConfig.path])
    }
    this.configSvc.openExploreMenuForMWeb.next(false)
  }

  openExploreMenu() {
    this.activeRoute = 'explore'
    this.configSvc.openExploreMenuForMWeb.next(true)
  }

  getKarmaCount() {
    let enrollList: any
    if (localStorage.getItem('enrollmentData')) {
      enrollList = JSON.parse(localStorage.getItem('enrollmentData') || '')
      this.countdata = enrollList && enrollList.userCourseEnrolmentInfo &&
       enrollList.userCourseEnrolmentInfo.karmaPoints || 0
      this.karmaPointLoading = false
      clearInterval(this.enrollInterval)
    }
  }

  viewKarmapoints() {
    this.raiseTelemetry()
    this.router.navigate(['/app/person-profile/me'], { fragment: 'karmapoints' })
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'nav-karmapoints',
        id: 'nav-karmapoints',
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.KARMAPOINTS,
        // tslint: disable-next-line: whitespace
      }
      // tslint: disable-next-line: whitespace
      )
  }

  public getItem(item: any) {
    return { ...item, forPreview: !this.isforPreview, enableLang: this.enableLang }
  }

}
