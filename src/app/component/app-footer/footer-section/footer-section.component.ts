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

  ngOnInit() {
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
