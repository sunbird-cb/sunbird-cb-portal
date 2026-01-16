import { Component, OnInit } from '@angular/core'
import { SettingsService } from '../../settings.service'
//import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { TranslateService } from '@ngx-translate/core'
/* tslint:disable*/
import _ from 'lodash'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'ws-app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent implements OnInit {
  selectedLanguage = 'en'
  notificationSettings: any[] = []
  constructor(
    //private snackBar: MatSnackBar,
    private settingsSvc: SettingsService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private snackbar: MatSnackBar

  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
      lang = lang.replace(/\"/g, '')
      this.selectedLanguage = lang
      this.translate.use(lang)
    }

    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
        this.selectedLanguage = lang
      }
    })
  }

  getTitle(label: string) {
    let _lable = ''
    if (label === 'EMAIL') {
      _lable = 'email'
    } else if (label === 'SMS') {
      _lable = 'sms'
    } else if (label === 'PUSH') {
      _lable = 'push'
    } else if (label === 'IN_APP') {
      _lable = 'inApp'
    }
    return this.translateLabels(_lable, 'notificationV2Settings')
  }

  getDescription(label: string) {
    let _lable = ''
    if (label === 'EMAIL') {
      _lable = 'emailDesc'
    } else if (label === 'SMS') {
      _lable = 'smsDesc'
    } else if (label === 'PUSH') {
      _lable = 'pushDesc'
    } else if (label === 'IN_APP') {
      _lable = 'inAppDesc'
    }
    return this.translateLabels(_lable, 'notificationV2Settings')
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }

  ngOnInit() {

    this.settingsSvc.getSettings().subscribe((settings: any) => {
      this.notificationSettings = _.get(settings, 'result.settings', [])
      console.log(this.notificationSettings)
    }, error => {
      this.notificationSettings = []
      console.log(error)
    })
  }

  onToggleChange(item: any, event: any) {
    let request = {
      request: {
        notificationType: item.notificationType,
        enabled: event.checked
      }
    }
    this.settingsSvc.enableNotification(request).subscribe((settings: any) => {
      const result = _.get(settings, 'result', '')
      if (result && result.enabled) {
        this.snackbar.open('Notification enabled!')
      } else {
        this.snackbar.open('Notification disabled!')
      }
    }, error => {
      console.log(error)
      this.snackbar.open('Something went wrong!')
      item.enabled = !event.enabled
    })
  }
}
