import { Component, OnInit } from '@angular/core'
import { NsSettings } from '../../settings.model'
import { TFetchStatus } from '@sunbird-cb/utils'
import { SettingsService } from '../../settings.service'
import { MatSnackBar } from '@angular/material'
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
  notificationsUpdateStatus: TFetchStatus = 'none'
  userPreference: any
  constructor(
    private snackBar: MatSnackBar,
    private settingsSvc: SettingsService,
  ) { }

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
          console.log('this.notificationPref', this.notificationPref)
        }
        // this.notificationSettings = data
        
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
        console.log('user pref data::', data)
        this.userPreference = _.get(data, 'result.notificationPreference')
        // if (value) {
        //   this.notificationPref = JSON.parse(value)
        //   this.notificationPrefList = this.notificationPref.notificationPreferenceList || []
        //   this.notificationPrefList = this.notificationPrefList.map(n => {
        //     n.status = true
        //     return n
        //   })
        //   console.log('this.notificationPref', this.notificationPref)
        // }
        // // this.notificationSettings = data
        this.updateNotificationPref()
      },
      _ => {
        this.mockData()
        // this.notificationsFetchStatus = 'error'
      },
    )
  }

  mockData() {
    this.notificationsFetchStatus = 'done'
        const data = {
          "id": "user.v1.notification.preference",
          "ver": "1.0",
          "ts": "2022-09-13 00:21:28:536+0000",
          "params": {
              "resmsgid": "00f176f1b7670185d56b3e624a579614",
              "msgid": "00f176f1b7670185d56b3e624a579614",
              "err": null,
              "status": "SUCCESS",
              "errmsg": null
          },
          "responseCode": "OK",
          "result": {
              "notificationPreference": {
                "incompleteCourseReminder" : false,
                // "networkRecommendation": false,
                // "networkInvitation": true,
                // "networkAccepted" : true,
                // "ownTopicReplied" : true,
                // "commentAddedOnMonitoringTopic": false,
                // "replyAddedOnMonitoringTopic": false,
                // "newJobPost": false,
                // "competencyRecommendation": false,
                // "newCoursePublishedOnInterestedTopic": false
              }
            }
        }
      
        this.userPreference = _.get(data, 'result.notificationPreference')
        this.updateNotificationPref()
  }

  updateStatus(notificationPref: NsSettings.INotificationPreference) {
    this.notificationPrefList.find((x, i) => {
      if (x.id === notificationPref.id) {
        this.notificationPrefList[i].status = !this.notificationPrefList[i].status

        // Update userPreference with status
          this.userPreference[notificationPref.id] = this.notificationPrefList[i].status
      }
    })
    console.log('this.notificationPrefList : ', this.notificationPrefList)
    console.log('this.userPreference : ', this.userPreference)
  }

  submitUserPref() {
    const req = {
      'request': this.userPreference
    }
    console.log('req:', req)
    this.settingsSvc.updateUserNotificationPreference(req).subscribe(
      data => {
        console.log('data : ', data)
        
      },
      _ => {
        // this.notificationsFetchStatus = 'error'
      },
    )
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
