import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material'
import { AuthKeycloakService } from '../../services/auth-keycloak.service'
import { ConfigurationsService } from '../../services/configurations.service'
import { UtilityService } from '../../services/utility.service'

@Component({
  selector: 'ws-utils-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

  disabled = false
  isDownloadableIos = false
  isDownloadableAndroid = false
  constructor(
    public dialogRef: MatDialogRef<LogoutComponent>,
    private authSvc: AuthKeycloakService,
    private configSvc: ConfigurationsService,
    private utilitySvc: UtilityService
  ) { }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isDownloadableIos = !this.configSvc.restrictedFeatures.has('iosDownload')
      this.isDownloadableAndroid = !this.configSvc.restrictedFeatures.has('androidDownload')
    }
  }

  confirmed() {
    this.disabled = true
    this.dialogRef.close()
    if (localStorage.getItem('ratingformID')) {
      localStorage.removeItem('ratingformID')
    }
    if (localStorage.getItem('ratingfeedID')) {
      localStorage.removeItem('ratingfeedID')
    }
    if (localStorage.getItem('platformratingTime')) {
      localStorage.removeItem('platformratingTime')
    }
    // this.authSvc.logout()
    this.authSvc.force_logout()
    if (localStorage.getItem('faq')) {
      localStorage.removeItem('faq')
    }
    if (localStorage.getItem('faq-languages')) {
      localStorage.removeItem('faq-languages')
    }
    if (sessionStorage.getItem('hideUpdateProfilePopUp')) {
      sessionStorage.removeItem('hideUpdateProfilePopUp')
    }
  }

  get isDownloadable() {
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.isContentDownloadAvailable &&
      (this.utilitySvc.iOsAppRef || this.utilitySvc.isAndroidApp)) {
      return true
    }
    return false
  }

}
