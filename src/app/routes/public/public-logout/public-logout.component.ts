import { Component, OnInit, OnDestroy } from '@angular/core'
import { AuthKeycloakService, ConfigurationsService, NsPage } from '@sunbird-cb/utils-v2'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
// tslint:disable-next-line
import _ from 'lodash'
@Component({
  selector: 'ws-public-logout',
  templateUrl: './public-logout.component.html',
  styleUrls: ['./public-logout.component.scss'],
})
export class PublicLogoutComponent implements OnInit, OnDestroy {
  contactUsMail = ''
  contactPage: any
  platform = 'Learner'
  panelOpenState = false
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  message: null | string | undefined
  private subscriptionContact: Subscription | null = null
  private routerSubsc: Subscription | null = null
  environment!: any

  constructor(
    private configSvc: ConfigurationsService,
    private activateRoute: ActivatedRoute,
    private authSvc: AuthKeycloakService,
    // private authSvc: AuthKeycloakService,
  ) { }

  ngOnInit() {
    if (this.subscriptionContact) {
      this.subscriptionContact.unsubscribe()
    }
    this.subscriptionContact = this.activateRoute.data.subscribe(data => {
      this.contactPage = data.pageData && data.pageData.data
    })

    if (this.routerSubsc) {
      this.routerSubsc.unsubscribe()
    }
    this.routerSubsc = this.activateRoute.queryParamMap.subscribe(params => {
      this.message = _.get(params, 'params.error')

      if (this.message || this.message !== 'undefined' || this.message !== null || this.message !== '') {
        this.authSvc.force_logout()
      }
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
    if (this.routerSubsc) {
      this.routerSubsc.unsubscribe()
    }
  }
  login() {
    const host = window.location.origin
    window.location.href = `${host}/protected/v8/resource`
    // window.location.reload()
  }
}
