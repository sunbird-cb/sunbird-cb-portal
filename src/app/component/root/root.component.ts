import {
  AfterViewChecked,
  AfterViewInit,
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  // TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router'
// import { interval, concat, timer } from 'rxjs'
import { BtnPageBackService } from '@sunbird-cb/collection'
import { HttpClient } from '@angular/common/http'
import {
  // AuthKeycloakService,
  ConfigurationsService,
  LoggerService,
  TelemetryService,
  ValueService,
  UtilityService,
  EventService,
  WsEvents,
} from '@sunbird-cb/utils-v2'
import { delay, first, catchError, map, filter } from 'rxjs/operators'
import { MobileAppsService } from '../../services/mobile-apps.service'
import { RootService } from './root.service'
import { UrlService } from 'src/app/shared/url.service'

import { CsModule } from '@project-sunbird/client-services'
import { SwUpdate } from '@angular/service-worker'
import { environment } from '../../../environments/environment'
import { MatDialog } from '@angular/material'
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component'
import { concat, interval, timer, of } from 'rxjs'

@Component({
  selector: 'ws-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  providers: [SwUpdate],
})
export class RootComponent implements OnInit, AfterViewInit, AfterViewChecked {

  hideHeaderAndFooter = false
  disableHeightOnTop = false
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appRef: ApplicationRef,
    private logger: LoggerService,
    private swUpdate: SwUpdate,
    private dialog: MatDialog,
    private http: HttpClient,
    // public authSvc: AuthKeycloakService,
    public configSvc: ConfigurationsService,
    private valueSvc: ValueService,
    private telemetrySvc: TelemetryService,
    private eventSvc: EventService,
    private mobileAppsSvc: MobileAppsService,
    private rootSvc: RootService,
    private btnBackSvc: BtnPageBackService,
    private changeDetector: ChangeDetectorRef,
    private utilitySvc: UtilityService,
    private urlService: UrlService
    // private dialogRef: MatDialogRef<any>,
  ) {

    if (window.location.pathname.includes('/public/privacy-policy')) {
      this.hideHeaderAndFooter = true
    }

    this.getHeaderFooterConfiguration().subscribe((sectionData: any) => {
      // console.log('headerFooterConfigData',sectionData)
      this.headerFooterConfigData = sectionData.data
      this.showFooter = true
    })
    if (window.location.pathname.includes('/public/home')
      || window.location.pathname.includes('/public/toc/')
      || window.location.pathname.includes('/viewer/')
      ) {
      this.customHeight = true
      // tslint: disable
    }
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.profileDetails &&
      this.configSvc.unMappedUser.profileDetails.get_started_tour) {
      this.showTour = this.configSvc.unMappedUser.profileDetails.get_started_tour.skipped ||
      this.configSvc.unMappedUser.profileDetails.get_started_tour.visited
    }
    this.mobileAppsSvc.init()
    this.openIntro()
    // if (this.authSvc.token) {
    //   // console.log("CALLED AFTER LOGIN")
    //   this.loginToken = this.authSvc.token
    // } else {
    //   // console.log("ALREADY LOGGED IN")
    //   const lastSaved = localStorage.getItem('kc')
    //   if (lastSaved) {
    //       this.loginToken = JSON.parse(lastSaved).token
    //   }
    // }
    const locationOrigin = location.origin

    CsModule.instance.init({
      core: {
        httpAdapter: 'HttpClientBrowserAdapter',
        global: {
          channelId: '', // required
          producerId: '', // required
          deviceId: '', // required
          sessionId: '',
        },
        api: {
          host: `${locationOrigin}/apis/proxies/v8`, // default host
          // host: 'http://localhost:3004/proxies/v8', // default host
          // host: 'http://localhost:3002', // default host
          authentication: {
            // bearerToken: "", // optional
            // userToken: "5574b3c5-16ca-49d8-8059-705304f2c7fb"
            // bearerToken: this.loginToken,
            // optional
          },
        },
      },
      services: {
        groupServiceConfig: {
          apiPath: '/learner/group/v1',
          dataApiPath: '/learner/data/v1/group',
          updateGroupGuidelinesApiPath: '/learner/group/membership/v1',
        },
        userServiceConfig: {
          apiPath: '/learner/user/v2',
        },
        formServiceConfig: {
          apiPath: '/learner/data/v1/form',
        },
        courseServiceConfig: {
          apiPath: '/learner/course/v1',
          certRegistrationApiPath: '/learner/certreg/v2/certs',
        },
        discussionServiceConfig: {
          apiPath: '/discussion',
        },
      },
    })
  }

  get navBarRequired(): boolean {
    return this.isNavBarRequired
  }

  get isShowNavbar(): boolean {
    return this.showNavbar
  }

  get isCustomHeight(): boolean {
    if (window.location.pathname.includes('/public/home')
    || window.location.pathname.includes('/public/faq')
    || window.location.pathname.includes('/public/contact')
    || window.location.pathname.includes('/public/signup')
    || window.location.pathname.includes('/public/request')

    ) {
      this.customHeight = true
    }
    return this.customHeight
  }

  @ViewChild('previewContainer', { read: ViewContainerRef, static: true })
  // @ViewChild('userIntro', { static: true }) userIntro!: TemplateRef<any>
  previewContainerViewRef: ViewContainerRef | null = null
  @ViewChild('appUpdateTitle', { static: true })
  appUpdateTitleRef: ElementRef | null = null
  @ViewChild('appUpdateBody', { static: true })
  appUpdateBodyRef: ElementRef | null = null

  @ViewChild('skipper', { static: false }) skipper!: ElementRef

  isXSmall$ = this.valueSvc.isXSmall$
  routeChangeInProgress = false
  showNavbar = true
  showFooter = false
  currentUrl!: string
  customHeight = false
  isNavBarRequired = true
  isInIframe = false
  appStartRaised = false
  isSetupPage = false
  processed: any
  loginToken: any
  showTour = false
  currentRouteData: any = []
  loggedinUser = !!(this.configSvc.userProfile && this.configSvc.userProfile.userId)
  headerFooterConfigData: any = {}
  mobileTopHeaderVisibilityStatus = true
  activeMenu: any = ''
  backGroundTheme: any
  showHubs = true
  showBottomNav = true
  viewerPage = false

  prevUrl = ''
  currUrl = ''
  @HostListener('window:unload', ['$event'])
  unloadHandler(event: any) {
    if (event && event.type === 'unload') {
      // this.authSvc.logout()
    }
  }
  openIntro() {
    // if (!(this.rootSvc.getCookie('intro') && !!(this.rootSvc.getCookie('intro')))) {
    //   if (this.router.url === '/page/home') {
    //     this.dialog.open(AppIntroComponent, { data: {} })
    //   }
    // }
    // this.snackBar.openFromTemplate(this.userIntro, { duration: 20000, verticalPosition: 'bottom', horizontalPosition: 'left' })
  }
  public skipToMainContent(): void {
    this.skipper.nativeElement.focus()
    // tslint: disable
  }
  ngOnInit() {
    // let showTour = localStorage.getItem('tourGuide')? JSON.parse(localStorage.getItem('tourGuide')||''): {}
    // this.showTour = showTour && showTour.disable ? showTour.disable : false
    this.mobileAppsSvc.mobileTopHeaderVisibilityStatus.subscribe((status: any) => {
      this.mobileTopHeaderVisibilityStatus = status
    })
    this.configSvc.updateTourGuideMethod(this.showTour)
    this.route.queryParams
      .subscribe(params => {
        // tslint:disable-next-line
        console.log(params) // { orderby: "price" }
      }
    )
    if (window.location.pathname.includes('/public/home')) {
      this.customHeight = true
    }
    try {
      this.isInIframe = window.self !== window.top
    } catch (_ex) {
      this.isInIframe = false
    }

    this.btnBackSvc.initialize()

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.prevUrl = this.currUrl
      this.currUrl = event.url
      this.urlService.setPreviousUrl(this.prevUrl)
    })

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {

        if (event.url.includes('/setup/')) {
          this.isSetupPage = true
        }
      }
      if (window.location.pathname.includes('/page/home')) {
        this.changeBg26Jan()
      } else {
        this.removeBg26Jan()
      }

      if (event instanceof NavigationStart) {
        let isMobile = false
        if (window.innerWidth <= 1200) {
          isMobile = true
        } else {
          isMobile = false
        }
        this.showNavbar = true
        if (event.url.includes('preview') || event.url.includes('embed')) {
          this.isNavBarRequired = false
        } else if (event.url.includes('author/') && this.isInIframe) {
          this.isNavBarRequired = false
        } else {
          this.isNavBarRequired = true
        }

        if (!(event.url.includes('/page/home')) && isMobile) {
          this.showHubs = false
        } else {
          if (event.url.includes('/public')) {
            this.showHubs = false
          } else {
            this.showHubs = true
          }
        }

        if (event.url.includes('/viewer')) {
          this.viewerPage = true
        } else {
          this.viewerPage = false
        }

        this.routeChangeInProgress = true
        this.changeDetector.detectChanges()
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.routeChangeInProgress = false
        this.currentUrl = event.url

        if (this.currentUrl.includes('/public/home')) {
          this.customHeight = true

        } else {
          this.customHeight = false
        }

        if (
          !!this.currentUrl.startsWith('/public/logout')
          || !!this.currentUrl.startsWith('/public/signup')
          || !!this.currentUrl.startsWith('/public/welcome')
          || !!this.currentUrl.startsWith('/viewer/')
          || !!this.currentUrl.startsWith('/public/request')
          || !!this.currentUrl.startsWith('/public/toc')
        ) {
          this.showFooter = false
          this.showNavbar = false
          this.isNavBarRequired = false
        } else {
          this.showFooter = true
          this.showNavbar = true
          this.isNavBarRequired = true
        }
        if (window.location.pathname.includes('/learner-advisory')) {
          this.showNavbar = true
          this.isNavBarRequired = true
          this.showBottomNav = true
          this.showHubs = true

        }

        if (!!this.currentUrl.startsWith('/app/toc/')) {
          this.showBottomNav = false
        }
      }

      if (event instanceof NavigationEnd) {
        // let snapshot = this.router.routerState.firstChild(this.activatedRoute).snapshot
        // console.log('this.route.snapshot :: ', this.route.snapshot)
        const snapshot = this.route.snapshot
        // console.log('root.snapshot.root.firstChild ', snapshot.root.firstChild)
        // console.log('firstChild ', snapshot.firstChild)
        const firstChild = snapshot.root.firstChild
        this.getChildRouteData(snapshot, firstChild)
        // tslint:disable-next-line: no-console
        // console.log('Final currentDataRoute', this.currentRouteData)
        this.utilitySvc.setRouteData(this.currentRouteData)
        const pageContext = this.utilitySvc.routeData
        const data = {
          pageContext,
        }
        const objectType = this.route.snapshot.queryParams.primaryCategory || ''
        this.raiseAppStartTelemetry()
        // console.log('data: ', data)
        if (data.pageContext.pageId && data.pageContext.module) {
          this.telemetrySvc.impression(data, objectType)
        } else {
          this.telemetrySvc.impression()
        }
        this.currentRouteData = []
        // if (this.appStartRaised) {
        //   this.telemetrySvc.audit(WsEvents.WsAuditTypes.Created, 'Login', {})
        //   this.appStartRaised = false
        // }
        this.activeMenu = localStorage.getItem('activeMenu')
        this.openIntro()

      }
    })
    this.rootSvc.showNavbarDisplay$.pipe(delay(500)).subscribe((display: any) => {
      this.showNavbar = display
    })

    let isNotMyUser = false
    let isIgotOrg = false
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.profileStatus) {
      isNotMyUser = this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() === 'not-my-user' ? true : false
    }
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName) {
        isIgotOrg = this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName.toLowerCase() === 'igot' ? true : false
    }
    // let isIgotOrg = true
    if (isNotMyUser && isIgotOrg) {
      this.disableHeightOnTop = true
      this.router.navigateByUrl('app/person-profile/me#profileInfo')
    } else {
      this.disableHeightOnTop = false
    }
  }

  changeBg26Jan() {
    this.backGroundTheme = this.configSvc.overrideThemeChanges
    const docData: any = document.getElementById('app-bg')
    if (this.backGroundTheme && this.backGroundTheme.isEnabled) {
      docData.classList.add('jan-bg-change')
    } else {
      docData.classList.remove('jan-bg-change')
    }
  }

  removeBg26Jan() {
    this.backGroundTheme = this.configSvc.overrideThemeChanges
    const docData: any = document.getElementById('app-bg')
    docData.classList.remove('jan-bg-change')
  }

  raiseAppStartTelemetry() {
    if (!this.appStartRaised) {
      // Application start telemetry
      const event = {
        eventType: WsEvents.WsEventType.Telemetry,
        eventLogLevel: WsEvents.WsEventLogLevel.Info,
        data: {
          edata: { type: '' },
          object: {},
          state: WsEvents.EnumTelemetrySubType.Loaded,
          eventSubType: WsEvents.EnumTelemetrySubType.Loaded,
          type: 'app',
          mode: 'view',
        },
        from: '',
        to: 'Telemetry',
      }
      this.eventSvc.dispatchEvent<WsEvents.IWsEventTelemetryInteract>(event)
      this.appStartRaised = true
    }
  }

  ngAfterViewInit() {
    this.initAppUpdateCheck()
  }

  getChildRouteData(snapshot: ActivatedRouteSnapshot, firstChild: ActivatedRouteSnapshot | null) {
    if (firstChild) {
      if (firstChild.data) {
        // console.log('firstChild.data', firstChild.data)
        this.currentRouteData.push(firstChild.data)
      }
      if (firstChild.firstChild) {
        this.getChildRouteData(snapshot, firstChild.firstChild)
      }
    }
  }

  initAppUpdateCheck() {
    this.logger.log('LOGGING IN ROOT FOR PWA INIT CHECK')
    if (environment.production) {
      const appIsStable$ = this.appRef.isStable.pipe(
        first(isStable => isStable),
      )
      const everySixHours$ = interval(6 * 60 * 60 * 1000)
      const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$)
      everySixHoursOnceAppIsStable$.subscribe(() => this.swUpdate.checkForUpdate())
      if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe(() => {
          const dialogRef = this.dialog.open(DialogConfirmComponent, {
            data: {
              title: (this.appUpdateTitleRef && this.appUpdateTitleRef.nativeElement.value) || '',
              body: (this.appUpdateBodyRef && this.appUpdateBodyRef.nativeElement.value) || '',
            },
          })
          dialogRef.afterClosed().subscribe(
            result => {
              if (result) {
                this.swUpdate.activateUpdate().then(() => {
                  if ('caches' in window) {
                    caches.keys()
                      .then(keyList => {
                        timer(2000).subscribe(
                          _ => window.location.reload(),
                        )
                        return Promise.all(keyList.map(key => {
                          return caches.delete(key)
                        }))
                      })
                  }
                })
              }
            },
          )
        })
      }
    }
  }

  getTourGuide() {
    let showTour = false
    this.configSvc.updateTourGuide.subscribe((res: any) => {
      showTour = res
    })
    this.showTour = showTour
    return showTour
  }

  getHeaderFooterConfiguration() {
    const baseUrl = this.configSvc.sitePath
    // tslint:disable-next-line: prefer-template
    return this.http.get(baseUrl + '/page/right-nav-config.json').pipe(
      map(data => ({ data, error: null })),
      catchError(err => of({ data: null, error: err })),
    )
  }

  ngAfterViewChecked() {
    const show = this.getTourGuide()
    if (show !== this.showTour) { // check if it change, tell CD update view
      // this.showTour = this.showTour
    }
    this.changeDetector.detectChanges()
  }
}
