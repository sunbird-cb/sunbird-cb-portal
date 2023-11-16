import { Component, Input, OnInit } from '@angular/core';
import { ConfigurationsService } from '@sunbird-cb/utils';
import _ from 'lodash'
@Component({
  selector: 'ws-footer-section',
  templateUrl: './footer-section.component.html',
  styleUrls: ['./footer-section.component.scss']
})
export class FooterSectionComponent implements OnInit {
  @Input() environment:any;
  @Input() hubsList:any;
  constructor(private configSvc: ConfigurationsService,) { }
  footerSectionConfig = [
    {
      "id":1,
      "order":1,
      "sectionHeading": "Hubs",
      "active": true,
      "slug": "hub"
    },
    {
      "id":2,
      "order":2,
      "sectionHeading": "Related Links",
      "active": true,
      "slug": "link"
    },
    {
      "id":3,
      "order":3,
      "sectionHeading": "Support",
      "active": true,
      "slug": "support"
    },
    {
      "id":4,
      "order":4,
      "sectionHeading": "About us",
      "active": true,
      "slug": "about"
    }
  ];

  ngOnInit() {
    this.footerSectionConfig = (this.footerSectionConfig).sort((a,b)=>a.order - b.order);
    this.environment.portals = this.environment.portals.filter(
      (obj: any) => ((obj.name !== 'Frac Dictionary') &&
       (obj.isPublic || this.isAllowed(obj.id))))
    if(!this.environment.portals.length) {
      this.footerSectionConfig = this.footerSectionConfig.filter((obj:any)=> obj.sectionHeading !== 'Related Links')
    }
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

  onClick(event:any) {
    console.log(event.target.parentElement);
    event.target.parentElement.classList.toggle('open');
  }

}
