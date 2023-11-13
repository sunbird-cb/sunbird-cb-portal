import { trigger, transition, style, animate } from '@angular/animations'
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, NsInstanceConfig, ValueService } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'
import { environment } from 'src/environments/environment'
// tslint:disable
import _ from 'lodash'
// tslint:enable
// import { AccessControlService } from '@ws/author/src/public-api'

// interface IGroupWithFeatureWidgets extends NsAppsConfig.IGroup {
//   featureWidgets: NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink>[]
// }

@Component({
  selector: 'ws-widget-card-hubs-list',
  templateUrl: './card-hubs-list.component.html',
  styleUrls: ['./card-hubs-list.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 0 }),
        animate('500ms', style({ transition: 'visibility 0s linear 0.23s, opacity 0.33s linear', opacity: 1, 'transition-delay': '0s' })),
      ]),
      transition(':leave', [
        style({ transition: 'visibility 1s linear 0.33s, opacity 0.33s linear', opacity: 1 }),
        animate('300ms', style({ transition: 'visibility 1s linear 0.33s, opacity 0.33s linear', opacity: 0, 'transition-delay': '0s' })),
      ]),
    ]
    ),
  ],
})
export class CardHubsListComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<any> {
  private defaultMenuSubscribe: Subscription | null = null
  isLtMedium$ = this.valueSvc.isLtMedium$
  enableFeature = true
  enablePeopleSearch = true
  @Input() widgetData: any
  givenName: string | undefined
  userEmail: string | undefined
  keyTag: string[] = []
  newUserReq: any
  deptUserReq: any
  nameFilter = ''
  visible = false
  searchSpinner = false
  isMobile = false
  environment!: any
  @HostBinding('id')
  public id = `hub_${Math.random()}`
  public activeRoute = ''

  // private readonly featuresConfig: IGroupWithFeatureWidgets[] = []

  constructor(
    private configSvc: ConfigurationsService,
    private discussUtilitySvc: DiscussUtilsService,
    private router: Router,
    private valueSvc: ValueService,
    // private accessService: AccessControlService
  ) {
    super()
  }

  hubsList!: NsInstanceConfig.IHubs[]

  ngOnInit() {
    this.router.events.subscribe((event: any) => {

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
          console.log('event', event)
          if (event.url.includes('/page/learn')) {
            this.activeRoute = 'Learn'
          } else if (event.url.includes('/app/discussion-forum')) {
            this.activeRoute = 'Discuss'
          } else if (event.url.includes('app/network-v2')) {
            this.activeRoute = 'Network'
          } else if (event.url.includes('app/careers')) {
            this.activeRoute = 'Career'
          } else if (event.url.includes('app/competencies')) {
            this.activeRoute = 'Competencies'
          } else if (event.url.includes('app/event-hub')) {
            this.activeRoute = 'Events'
          }

      }
  })
    this.environment = environment
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.hubsList = (instanceConfig.hubs || []).filter(i => i.active)
    }
    this.defaultMenuSubscribe = this.isLtMedium$.subscribe((isLtMedium: boolean) => {
      this.isMobile = isLtMedium
    })
  }
  ngOnDestroy() {
    if (this.defaultMenuSubscribe) {
      this.defaultMenuSubscribe.unsubscribe()
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
        // {
        //   route: 'leaderboard',
        //   label: 'Leader Board',
        //   enable: true,
        // },

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

  getUserFullName(user: any) {
    if (user && user.personalDetails.firstname && user.personalDetails.surname) {
      return `${user.personalDetails.firstname.trim()} ${user.personalDetails.surname.trim()}`
    }
    return ''
  }
  getSearchProfileUserFullName(user: any) {
    if (user && user.first_name && user.last_name) {
      return `${user.first_name.trim()} ${user.last_name.trim()}`
    }
    return ''
  }
  goToUserProfile(user: any) {
    this.router.navigate(['/app/person-profile', user.userId])
    // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: user.personalDetails.primaryEmail } })
  }
  searchUser() {

    if (this.nameFilter.length === 0) {
      this.enableFeature = true
    } else {
      this.searchSpinner = true
      this.enableFeature = false

    }

  }
  toggleVisibility() {
    if (!this.visible) {
      this.visible = !this.visible
      this.configSvc.changeNavBarFullView.next(this.visible)
    } else {
      this.visible = !this.visible
      setTimeout(() => {
        this.configSvc.changeNavBarFullView.next(this.visible)
      },         200)
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

}
