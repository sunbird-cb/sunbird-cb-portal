// import { environment } from './../../../environments/environment'
import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { ConfigurationsService, NsInstanceConfig, ValueService } from '@sunbird-cb/utils'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'
// tslint:disable-next-line
import _ from 'lodash'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ws-app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent implements OnInit {

  isXSmall = false
  termsOfUser = true
  environment!: any
  currentRoute = 'page/home'
  hubsList!: NsInstanceConfig.IHubs[]
  portalUrls!: NsInstanceConfig.IPortalUrls

  constructor(
    private configSvc: ConfigurationsService,
    private valueSvc: ValueService,
    private discussUtilitySvc: DiscussUtilsService,
    private router: Router,
  ) {
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

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (this.configSvc.portalUrls) {
      this.portalUrls = this.configSvc.portalUrls
    }
    if (instanceConfig) {
      this.hubsList = (instanceConfig.hubs || []).filter(i => i.active)
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
  hasRole(role: string[]): boolean {
    let returnValue = false
    role.forEach(v => {
      if ((this.configSvc.userRoles || new Set()).has(v)) {
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
