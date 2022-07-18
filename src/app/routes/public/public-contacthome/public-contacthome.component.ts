import { Component, OnInit } from '@angular/core'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-public-contacthome',
  templateUrl: './public-contacthome.component.html',
  styleUrls: ['./public-contacthome.component.scss'],
})
export class PublicContacthomeComponent implements OnInit {
  contactUsMail = ''
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  constructor(private configSvc: ConfigurationsService) {}

  ngOnInit() {
    if (this.configSvc.instanceConfig) {
      this.contactUsMail = this.configSvc.instanceConfig.mailIds.contactUs
    }
  }

}
