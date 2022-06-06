import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-public-home',
  templateUrl: './public-home.component.html',
  styleUrls: ['./public-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PublicHomeComponent implements OnInit, OnDestroy {
  contactUsMail = ''
  contactPage: any
  platform = 'Learner'
  panelOpenState = false
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  private subscriptionContact: Subscription | null = null

  constructor(
    private configSvc: ConfigurationsService,
    private activateRoute: ActivatedRoute,
    // private authSvc: AuthKeycloakService,
  ) { }

  ngOnInit() {
    this.subscriptionContact = this.activateRoute.data.subscribe(data => {
      this.contactPage = data.pageData && data.pageData.data
    })
    if (this.configSvc.instanceConfig) {
      this.contactUsMail = this.configSvc.instanceConfig.mailIds.contactUs
    }
    // this.authSvc.force_logout().then(() => { })
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
