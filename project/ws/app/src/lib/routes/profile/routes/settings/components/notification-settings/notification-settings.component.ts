import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { NsSettings } from '../../settings.model'
import { TFetchStatus } from '@sunbird-cb/utils'
import { SettingsService } from '../../settings.service'
import { MatSnackBar } from '@angular/material'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
/* tslint:disable*/
import _ from 'lodash'

@Component({
  selector: 'ws-app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent implements OnInit {

  notificationSettings: NsSettings.INotificationGroup[] = []
  notificationPref!: NsSettings.INotificationPreferenceResponse
  notificationPrefList: NsSettings.INotificationPreference[] = []
  notificationsFetchStatus: TFetchStatus = 'none'
  savePrefInprogress = false
  notificationsUpdateStatus: TFetchStatus = 'none'
  userPreference: any = {}
  disableBtn = false
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  constructor(
    private snackBar: MatSnackBar,
    private settingsSvc: SettingsService,
    private translate: TranslateService,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!

      this.translate.use(lang)
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        console.log('onLangChange', event);
      });
    }
  }

  ngOnInit() {
    this.fetchNotificationPreference()
  }

  private fetchNotificationPreference() {
    this.notificationsFetchStatus = 'fetching'
    this.settingsSvc.fetchNotificationPreference().subscribe(
      data => {
        this.notificationsFetchStatus = 'done'
        const value = _.get(data, 'result.response.value')
        if (value) {
          this.notificationPref = JSON.parse(value)
          this.notificationPrefList = this.notificationPref.notificationPreferenceList || []
          this.notificationPrefList = this.notificationPrefList.map(n => {
            n.status = true
            return n
          })
          this.fetchUserNotificationPref()
        }
      },
      _ => {
        this.notificationsFetchStatus = 'error'
      },
    )
  }

  private fetchUserNotificationPref() {
    this.notificationsFetchStatus = 'fetching'
    this.settingsSvc.fetchUserNotificationPreference().subscribe(
      data => {
        this.notificationsFetchStatus = 'done'
        this.userPreference = _.get(data, 'result.notification_preference') || {}
        this.updateNotificationPref()
      },
      _ => {
        this.notificationsFetchStatus = 'error'
      },
    )
  }

  updateStatus(notificationPref: NsSettings.INotificationPreference) {
    this.notificationPrefList.find((x, i) => {
      if (x.id === notificationPref.id) {
        this.notificationPrefList[i].status = !this.notificationPrefList[i].status

        // Update userPreference with status
          this.userPreference[notificationPref.id] = this.notificationPrefList[i].status
      }
    })
  }

  submitUserPref() {
    this.savePrefInprogress = true
    this.disableBtn = true
    const req = {
      'request': this.userPreference
    }
    this.settingsSvc.updateUserNotificationPreference(req).subscribe(
      _data => {
        this.savePrefInprogress = false
        this.disableBtn = false
        this.openSnackbar(this.toastSuccess.nativeElement.value)
      },
      _ => {
        this.savePrefInprogress = false
        this.disableBtn = false
        this.openSnackbar(this.toastError.nativeElement.value)
      },
    )
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  updateNotificationPref() {
    if(this.notificationPrefList && this.notificationPrefList.length) {
      if(this.userPreference) {
        for(let key in this.userPreference){
          if(_.findIndex(this.notificationPrefList,  { id: key } ) >=0){

            this.notificationPrefList[_.findIndex(this.notificationPrefList,  { id: key } )].status = this.userPreference[key]
          }
        }
      }
    }
  }

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
