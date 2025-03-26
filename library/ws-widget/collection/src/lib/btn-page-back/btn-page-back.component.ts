import { animate, style, transition, trigger } from '@angular/animations'
import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
// import { environment } from './../../../environments/environment'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, MultilingualTranslationsService, NsInstanceConfig } from '@sunbird-cb/utils-v2'

import { BtnPageBackService } from './btn-page-back.service'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'
import { environment } from 'src/environments/environment'
// tslint:disable
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
// tslint:enable

type TUrl = undefined | 'none' | 'back' | string
@Component({
  selector: 'ws-widget-btn-page-back',
  templateUrl: './btn-page-back.component.html',
  styleUrls: ['./btn-page-back.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 0 }),
        animate('300ms', style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 1 }),
        animate('300ms', style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 0 })),
      ]),
    ]
    ),
  ],
})
export class BtnPageBackComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<{ url: TUrl }> {
  @Input() widgetData: { url: TUrl, titles?: NsWidgetResolver.ITitle[], textClass?: string } = { url: 'none', titles: [] }
  presentUrl = ''
  @HostBinding('id')
  public id = 'nav-back'
  visible = false
  enablePeopleSearch = true
  environment!: any
  loggedinUser = !!(this.configSvc.userProfile && this.configSvc.userProfile.userId)
  hubsList!: NsInstanceConfig.IHubs[]
  constructor(
    private btnBackSvc: BtnPageBackService,
    public router: Router,
    private configSvc: ConfigurationsService,
    private discussUtilitySvc: DiscussUtilsService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    super()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.environment = environment
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.hubsList = (instanceConfig.hubs || []).filter(i => i.active)
    }
    this.presentUrl = this.router.url
    if (this.configSvc.userProfile) {
      this.loggedinUser = true
    } else {
      this.loggedinUser = false
    }
  }
  get isUserLoggegIn(): boolean {
    return this.loggedinUser
  }
  get backUrl(): { fragment?: string; routeUrl: string; queryParams: any } {

    if (this.presentUrl === '/page/explore') {
      return {
        queryParams: undefined,
        routeUrl: '/page/home',
      }
    }
    if (this.widgetData.url === 'home') {
      return {
        queryParams: undefined,
        routeUrl: '/page/home',
      }
    }

    if (this.widgetData.url === 'doubleBack') {
      return {
        fragment: this.btnBackSvc.getLastUrl(2).fragment,
        queryParams: this.btnBackSvc.getLastUrl(2).queryParams,
        routeUrl: this.btnBackSvc.getLastUrl(2).route,
      }
    } if (this.widgetData.url === 'back') {
      return {
        fragment: this.btnBackSvc.getLastUrl().fragment,
        queryParams: this.btnBackSvc.getLastUrl().queryParams,
        routeUrl: this.btnBackSvc.getLastUrl().route,
      }
    }
    if (this.widgetData.url !== 'back' && this.widgetData.url !== 'doubleBack') {

      this.btnBackSvc.checkUrl(this.widgetData.url)

    }

    return {
      queryParams: undefined,
      routeUrl: this.widgetData.url ? this.widgetData.url : '/app/home',
    }
  }

  navigate() {
    const config = {
      menuOptions: [
        {
          route: 'all-discussions',
          label: 'All discussions',
          enable: true,
        },
        {
          route: 'categories',
          label: 'Categories',
          enable: true,
        },
        {
          route: 'tags',
          label: 'Tags',
          enable: true,
        },
        {
          route: 'my-discussion',
          label: 'Your discussion',
          enable: true,
        },
      ],
      userName: (this.configSvc.nodebbUserProfile && this.configSvc.nodebbUserProfile.username) || '',
      context: {
        id: 1,
      },
      categories: { result: [] },
      routerSlug: '/app',
      headerOptions: false,
      bannerOption: true,
    }
    this.discussUtilitySvc.setDiscussionConfig(config)
    localStorage.setItem('home', JSON.stringify(config))
    this.router.navigate(['/app/discussion-forum'], { queryParams: { page: 'home' }, queryParamsHandling: 'merge' })
  }

  // get titleUrl(): { fragment?: string; routeUrl: string; queryParams: any } {
  //   return {
  //     queryParams: undefined,
  //     routeUrl: this.widgetData.url ? this.widgetData.url : '/app/home',
  //   }
  // }
  toggleVisibility() {
    this.visible = !this.visible
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

  translateLabels(label: string, type: any, subtype: any) {
    return this.langtranslations.translateLabel(label, type, subtype)
  }

}
