import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { IBtnAppsConfig, CustomTourService } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ConfigurationsService, NsInstanceConfig, NsPage } from '@sunbird-cb/utils'
import { Router, NavigationStart, NavigationEnd } from '@angular/router'
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from './../dialog-box/dialog-box.component';
import { BtnSettingsService } from '@sunbird-cb/collection'
@Component({
  selector: 'ws-app-nav-bar',
  templateUrl: './app-nav-bar.component.html',
  styleUrls: ['./app-nav-bar.component.scss'],
})
export class AppNavBarComponent implements OnInit, OnChanges {
  @Input() mode: 'top' | 'bottom' = 'top'
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
  fontContainerFlag = false;
  constructor(
    private domSanitizer: DomSanitizer,
    private configSvc: ConfigurationsService,
    private tourService: CustomTourService,
    private router: Router,
    public dialog: MatDialog,
    public btnSettingsSvc: BtnSettingsService
  ) {
    this.btnAppsConfig = { ...this.basicBtnAppsConfig }
    if (this.configSvc.restrictedFeatures) {
      this.isHelpMenuRestricted = this.configSvc.restrictedFeatures.has('helpNavBarMenu')
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.cancelTour()
      } else if (event instanceof NavigationEnd) {
        this.routeSubs(event)
        this.cancelTour()
        this.bindUrl(event.url.replace('/app/competencies/', ''))
      }
    })
  }

  ngOnInit() {
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
  get isThisSetUpPage(): boolean {
    if (window.location.pathname.includes('/app/setup')) {
      this.isSetUpPage = true
    } else {
      this.isSetUpPage = false
    }
    return this.isSetUpPage
  }

  openDialog(): void { 
    let dialogRef = this.dialog.open(DialogBoxComponent, { 
      width: '1000px', 
    }); 
  
    dialogRef.afterClosed().subscribe(() => { 
    }); 
  } 

  changeFont(fontSize:any) {
    console.log('fontSize',fontSize.value)
    let fontClass = 'small-typography';
    switch(fontSize.value) {
      case 10:
        fontClass = 'x-small-typography';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break;
      case 12:
        fontClass = 'small-typography';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break;
      case 14:
        fontClass = 'normal-typography';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break;
      case 16:
        fontClass = 'large-typographt';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break;
      case 18:
        fontClass = 'x-large-typography';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break
    }
    
  }
}
