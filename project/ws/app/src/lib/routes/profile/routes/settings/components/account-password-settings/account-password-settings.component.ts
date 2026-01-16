import { Component, OnInit } from '@angular/core'
import { NsSettings } from '../../settings.model'
import { TFetchStatus, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { SettingsService } from '../../settings.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-account-password-settings',
  templateUrl: './account-password-settings.component.html',
  styleUrls: ['./account-password-settings.component.scss'],
})
export class AccountPasswordSettingsComponent implements OnInit {

  notificationSettings: NsSettings.INotificationGroup[] = []
  notificationsFetchStatus: TFetchStatus = 'none'
  notificationsUpdateStatus: TFetchStatus = 'none'
  userRoles: Set<string> = new Set()
  constructor(
    private snackBar: MatSnackBar,
    private settingsSvc: SettingsService,
    private configSvc: ConfigurationsService,
    private translate: TranslateService,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.userRoles = this.configSvc.userRoles || new Set()
    // this.fetchNotificationSettings()
  }

  // private fetchNotificationSettings() {
  //   this.notificationsFetchStatus = 'fetching'
  //   this.settingsSvc.fetchNotificationSettings().subscribe(
  //     data => {
  //       this.notificationSettings = data
  //       this.notificationsFetchStatus = 'done'
  //     },
  //     _ => {
  //       this.notificationsFetchStatus = 'error'
  //     },
  //   )
  // }

  updateMode(groupIndex: number, eventIndex: number, successMsg: string, errorMsg: string) {
    this.notificationSettings[groupIndex].events[eventIndex].recipients.forEach(recipient => {
      recipient.modes.forEach(mode => {
        mode.status = !mode.status
      })
    })
    this.updateNotificationSettings(successMsg, errorMsg)
  }

  private updateNotificationSettings(successMsg: string, errorMsg: string) {
    if (this.notificationSettings && this.notificationSettings.length) {
      this.notificationsUpdateStatus = 'fetching'
      this.settingsSvc.updateNotificationSettings(this.notificationSettings).subscribe(
        _ => {
          this.notificationsUpdateStatus = 'done'
          this.snackBar.open(successMsg, 'X')
        },
        _ => {
          this.notificationsUpdateStatus = 'error'
          this.snackBar.open(errorMsg, 'X')
        },
      )
    }
  }

  getSupportedModes(notificationEvent: NsSettings.INotificationEvent): NsSettings.INotificationMode[] {
    return notificationEvent.recipients[0].modes
  }
}
