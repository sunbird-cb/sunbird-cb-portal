import { Component, OnInit } from '@angular/core'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ws-public-contacthome',
  templateUrl: './public-contacthome.component.html',
  styleUrls: ['./public-contacthome.component.scss'],
})
export class PublicContacthomeComponent implements OnInit {
  contactUsMail = ''
  environment!: any
  meetLink = ''

  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  constructor(private configSvc: ConfigurationsService) {}

  ngOnInit() {
    this.environment = environment
    this.meetLink = environment.contactMeetLink
    if (this.configSvc.instanceConfig) {
      this.contactUsMail = this.configSvc.instanceConfig.mailIds.contactUs
    }
  }

  preventData(event: any) {
    event.preventDefault()
  }

}
