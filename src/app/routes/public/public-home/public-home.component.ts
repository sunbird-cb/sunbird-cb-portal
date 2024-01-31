import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
// tslint:disable-next-line
import _ from 'lodash'
import { WidgetResolverService } from '@sunbird-cb/resolver/src/public-api'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.scss'],
  // tslint:disable-next-line
  encapsulation: ViewEncapsulation.None,
})
export class PublicHomeComponent implements OnInit, OnDestroy {
  contactUsMail = ''
  contactPage: any
  platform = 'Learner'
  panelOpenState = false
  appIcon: SafeUrl | null = null
  appIconSecondary: SafeUrl | null = null
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  private subscriptionContact: Subscription | null = null
  learnNetworkSection: any = []
  data!: any
  loading = true

  constructor(
    private configSvc: ConfigurationsService,
    private activateRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private ws: WidgetResolverService,
    private translate: TranslateService,
  ) {
    // setTimeout(() => {
    this.loadData()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    // },         1000)
  }

  get isWsInit(): boolean {
    return this.ws.isInitialized
  }
  loadData() {
    this.data = _.get(this.activateRoute.snapshot, 'data.pageData.data.featuredCourses')
    this.learnNetworkSection = _.get(this.activateRoute.snapshot, 'data.pageData.data.learnNetwork')
    this.loading = false
  }
  ngOnInit() {
    if (this.configSvc.instanceConfig) {
      this.appIcon = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.app,
      )
      this.appIconSecondary = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.configSvc.instanceConfig.logos.appSecondary,
      )
    }
    this.subscriptionContact = this.activateRoute.data.subscribe(data => {
      this.contactPage = data.pageData && data.pageData.data
    })
    if (this.configSvc.instanceConfig) {
      this.contactUsMail = this.configSvc.instanceConfig.mailIds.contactUs
    }
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
  }

  ngOnDestroy() {
    if (this.subscriptionContact) {
      this.subscriptionContact.unsubscribe()
    }
  }
  login() {
    const host = window.location.origin
    window.location.href = `${host}/protected/v8/resource`
    // window.location.reload()
  }
}
