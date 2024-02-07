import { Component, Input, OnInit } from '@angular/core'
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils'
import { Router } from '@angular/router'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'
// tslint: disable-next-line
// @ts-ignore
import _ from 'lodash'
// tslint: enable
@Component({
  selector: 'ws-footer-section',
  templateUrl: './footer-section.component.html',
  styleUrls: ['./footer-section.component.scss'],
})
export class FooterSectionComponent implements OnInit {
  @Input() environment: any
  @Input() hubsList: any
  @Input() headerFooterConfigData: any
  constructor(
    private configSvc: ConfigurationsService,
    private discussUtilitySvc: DiscussUtilsService,
    private router: Router,
    private langtranslations: MultilingualTranslationsService) { }
  footerSectionConfig = [
    {
      id: 1 ,
      order: 1,
      sectionHeading: 'Hubs',
      active: true,
      slug: 'hub',
    },
    {
      id: 2,
      order: 2,
      sectionHeading: 'Related Links',
      active: true,
      slug: 'link',
    },
    {
      id: 3,
      order: 3,
      sectionHeading: 'Support',
      active: true,
      slug: 'support',
    },
    {
      id: 4,
      order: 4,
      sectionHeading: 'About us',
      active: true,
      slug: 'about',
    },
  ]

  ngOnInit() {
    // console.log('this.headerFooterConfigData',this.headerFooterConfigData)
    this.footerSectionConfig = this.headerFooterConfigData.footerSectionConfig
    if (this.footerSectionConfig) {
      this.footerSectionConfig = (this.footerSectionConfig).sort((a, b) => a.order - b.order)
    }
    this.environment.portals = this.environment.portals.filter(
      (obj: any) => ((obj.name !== 'Frac Dictionary') &&
       (obj.isPublic || this.isAllowed(obj.id))))
        if (!this.environment.portals.length) {
          if (this.footerSectionConfig) {
            this.footerSectionConfig = this.footerSectionConfig.filter((obj: any) => obj.sectionHeading !== 'Related Links')
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

  isAllowed(portalName: string) {
    const roles = _.get(_.first(_.filter(this.environment.portals, { id: portalName })), 'roles') || []
    if (!(roles && roles.length)) {
      return true
    }
    const value = this.hasRole(roles)
    return value
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

  onClick(event: any) {
    // console.log(event.target.parentElement);
    event.target.parentElement.classList.toggle('open')
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, '')
  }
}
