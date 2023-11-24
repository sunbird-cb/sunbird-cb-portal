// import { environment } from './../../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewEncapsulation } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { ConfigurationsService, NsInstanceConfig, ValueService } from '@sunbird-cb/utils'

// tslint:disable-next-line
import _ from 'lodash'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'ws-app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppFooterComponent implements OnInit {
  @Input() headerFooterConfigData:any;
  isXSmall = false
  termsOfUser = true
  environment!: any
  currentRoute = 'page/home'
  hubsList!: NsInstanceConfig.IHubs[]
  portalUrls!: NsInstanceConfig.IPortalUrls
  private baseUrl = this.configSvc.baseUrl
  constructor(
    private configSvc: ConfigurationsService,
    private valueSvc: ValueService,    
    private router: Router,
    private http: HttpClient,
    private translate: TranslateService,
    private cdRef: ChangeDetectorRef, 
    private ngZone: NgZone,
  ) {
    console.log("---------------------------------------------------------------")
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++--")
    const lang = localStorage.getItem('websiteLanguage')
    // window.addEventListener('storage', (event) => {
    //   console.log("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")
    //   if (event.key === 'websiteLanguage') {
    //     alert("Entered event")
    //     this.ngZone.run(() => {
    //       alert("Entered event")
    //       const lang = localStorage.getItem('websiteLanguage') || 'en';
    //       this.translate.use(lang);
    //       this.cdRef.detectChanges();
    //     });
    //   }
    // });
    console.log("---------------------------------------------------------------", lang)
    
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!
     
      this.translate.use(lang)
      console.log('current lang ------', this.translate.getBrowserLang())
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        console.log('onLangChange', event);
      });
    }


    // if (localStorage.getItem('websiteLanguage')) {
    //   this.translate.setDefaultLang('en')
    //   const lang = localStorage.getItem('websiteLanguage')!
    //   this.translate.use(lang)
    // }
    this.environment = environment
    if (this.configSvc.restrictedFeatures) {
      if (this.configSvc.restrictedFeatures.has('termsOfUser')) {
        this.termsOfUser = false
      }
    }
    this.valueSvc.isXSmall$.subscribe(isXSmall => {
      this.isXSmall = isXSmall
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.bindUrl(event.url.replace('/app/competencies/', ''))
      }
    })
  }

  ngAfterViewInit() {
    // Listen for changes in localStorage after the view has been initialized
    console.log("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")
    window.addEventListener('storage', (event) => {
      console.log("222222222222222222222222222222222222222222222222222222222222222222222222222")
      if (event.key === 'websiteLanguage') {
        this.ngZone.run(() => {
          const lang = localStorage.getItem('websiteLanguage') || 'en';
          this.translate.use(lang);
          this.cdRef.detectChanges();
        });
      }
    });
  }
  
  async ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (this.configSvc.portalUrls) {
      this.portalUrls = this.configSvc.portalUrls
    }
    if (instanceConfig && instanceConfig.hubs) {
      this.hubsList = (instanceConfig.hubs || []).filter(i => i.active)
    } else {
      const newInstance = await this.readAgain()
      this.hubsList = (newInstance.hubs || []).filter(i => i.active)
    }   

  }
  
  async readAgain() {
    const publicConfig: NsInstanceConfig.IConfig = await this.http
      .get<NsInstanceConfig.IConfig>(`${this.baseUrl}/site.config.json`)
      .toPromise()
    return publicConfig
  }
  bindUrl(path: string) {
    if (path) {
      // console.log(path)
      if (path !== '/app/competencies') {
        this.currentRoute = path
      }
    }
  }
  
  hasRole(role: string[]): boolean {
    let returnValue = false
    role.forEach(v => {
      const rolesList = (this.configSvc.userRoles || new Set())
      if (rolesList.has(v.toLowerCase()) || rolesList.has(v.toUpperCase())) {
        returnValue = true
      }
    })
    return returnValue
  }

  isAllowed(portalName: string) {
    const roles = _.get(_.first(_.filter(environment.portals, { id: portalName })), 'roles') || []
    if (!(roles && roles.length)) {
      return true
    }
    const value = this.hasRole(roles)
    return value
  }

  // translateHub(hubName: string): string {
  //   const translationKey = 'common.' + hubName;
  //   return this.translate.instant(translationKey);
  // }


  
  get needToHide(): boolean {
    return this.currentRoute.includes('all/assessment/')
  }

  onClick(event:any) {
    console.log(event.target.parentElement);
    event.target.parentElement.classList.toggle('open');
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName;
    return this.translate.instant(translationKey);
  }
  
}
