import { animate, style, transition, trigger } from '@angular/animations'
import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, NsInstanceConfig } from '@sunbird-cb/utils-v2'
import { BreadcrumbsOrgService } from './breadcrumbs-org.service'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'

type TUrl = undefined | 'none' | 'back' | string

@Component({
  selector: 'ws-widget-breadcrumbs-org',
  templateUrl: './breadcrumbs-org.component.html',
  styleUrls: ['./breadcrumbs-org.component.scss'],
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
export class BreadcrumbsOrgComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<{ url: TUrl }> {
  @Input() widgetData: { url: TUrl, titles?: NsWidgetResolver.ITitle[] } = { url: 'none', titles: [] }
  presentUrl = ''
  @HostBinding('id')
  public id = 'nav-back'
  visible = false
  enablePeopleSearch = true
  hubsList!: NsInstanceConfig.IHubs[]
  constructor(
    private btnBackSvc: BreadcrumbsOrgService,
    private router: Router,
    private configSvc: ConfigurationsService,
    private discussUtilitySvc: DiscussUtilsService,
  ) {
    super()
  }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.hubsList = (instanceConfig.hubs || []).filter(i => i.active)
    }
    this.presentUrl = this.router.url

  }

  get backUrl(): { fragment?: string; routeUrl: string; queryParams: any } {
    if (this.presentUrl === '/page/explore') {
      return {
        queryParams: undefined,
        routeUrl: '/app/home',
      }
    }
    if (this.widgetData.url === 'home') {
      return {
        queryParams: undefined,
        routeUrl: '/app/home',
      }
    }
    if (this.widgetData.url === 'doubleBack') {
      return {
        fragment: this.btnBackSvc.getLastUrl(2).fragment,
        queryParams: this.btnBackSvc.getLastUrl(2).queryParams,
        routeUrl: this.btnBackSvc.getLastUrl(2).route,
      }
    }
    if (this.widgetData.url === 'back') {
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
}
