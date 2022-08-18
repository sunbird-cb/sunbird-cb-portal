import {
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
import {
  // AuthKeycloakService,
  ConfigurationsService,
  LoggerService,
  TelemetryService,
  ValueService,
  UtilityService,
  EventService,
  WsEvents,
} from '@sunbird-cb/utils'
import { delay, first } from 'rxjs/operators'
import { MobileAppsService } from '../../services/mobile-apps.service'
import { RootService } from './root.service'
// import { DiscussionUiModule } from '@project-sunbird/discussions-ui-v8'

import { CsModule } from '@project-sunbird/client-services'
import { SwUpdate } from '@angular/service-worker'
import { environment } from '../../../environments/environment'
import { MatDialog } from '@angular/material'
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component'
import { concat, interval, timer } from 'rxjs'
// import { AppIntroComponent } from '../app-intro/app-intro.component'

@Component({
  selector: 'ws-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  providers: [SwUpdate],
})
export class RootComponent implements OnInit, AfterViewInit {

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
  showFooter = true
  currentUrl!: string
  customHeight = false
  isNavBarRequired = true
  isInIframe = false
  appStartRaised = false
  isSetupPage = false
  processed: any
  loginToken: any
  currentRouteData: any = []
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appRef: ApplicationRef,
    private logger: LoggerService,
    private swUpdate: SwUpdate,
    private dialog: MatDialog,
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
    // private dialogRef: MatDialogRef<any>,
  ) {
    if (window.location.pathname.includes('/public/home')
      || window.location.pathname.includes('/public/toc/')
      || window.location.pathname.includes('/viewer/')) {
      this.customHeight = true
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
  }
  ngOnInit() {
    if (window.location.pathname.includes('/public/home')) {
      this.customHeight = true
    }
    try {
      this.isInIframe = window.self !== window.top
    } catch (_ex) {
      this.isInIframe = false
    }

    this.btnBackSvc.initialize()

    // if (this.authSvc.isAuthenticated) {

    // }
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/setup/')) {
          this.isSetupPage = true
        }
      }
      if (event instanceof NavigationStart) {
        this.showNavbar = true
        if (event.url.includes('preview') || event.url.includes('embed')) {
          this.isNavBarRequired = false
        } else if (event.url.includes('author/') && this.isInIframe) {
          this.isNavBarRequired = false
        } else {
          this.isNavBarRequired = true
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
        ) {
          this.showFooter = false
          this.showNavbar = false
          this.isNavBarRequired = false
        } else {
          this.showFooter = true
          this.showNavbar = true
          this.isNavBarRequired = true
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
        this.raiseAppStartTelemetry()
        // console.log('data: ', data)
        if (data.pageContext.pageId && data.pageContext.module) {
          this.telemetrySvc.impression(data)
        } else {
          this.telemetrySvc.impression()
        }
        this.currentRouteData = []
        // if (this.appStartRaised) {
        //   this.telemetrySvc.audit(WsEvents.WsAuditTypes.Created, 'Login', {})
        //   this.appStartRaised = false
        // }
        this.openIntro()
      }
    })
    this.rootSvc.showNavbarDisplay$.pipe(delay(500)).subscribe(display => {
      this.showNavbar = display
    })
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
  get navBarRequired(): boolean {
    return this.isNavBarRequired
  }
  get isShowNavbar(): boolean {
    return this.showNavbar
  }
  get isCustomHeight(): boolean {
    if (window.location.pathname.includes('/public/home')) {
      this.customHeight = true
    }
    return this.customHeight
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
}
