import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { NsSettings } from './settings.model'

const API_END_POINTS = {
  NOTIFICATIONS: `/apis/protected/v8/user/notifications/settings`,
  NOTIFICATION_PREFERENCE: '/apis/proxies/v8/data/v1/system/settings/get/notificationPreference',
  USER_NOTIFICATION_PREF: '/apis/proxies/v8/user/v1/notificationPreference',
}

@Injectable()
export class SettingsService {

  constructor(
    private http: HttpClient,
  ) { }

  fetchNotificationSettings(): Observable<NsSettings.INotificationGroup[]> {
    return this.http.get<NsSettings.INotificationGroup[]>(API_END_POINTS.NOTIFICATIONS)
  }
  updateNotificationSettings(body: NsSettings.INotificationGroup[]): Observable<any> {
    return this.http.patch(API_END_POINTS.NOTIFICATIONS, body)
  }

  fetchNotificationPreference(): Observable<NsSettings.INotificationPreferenceResponse> {
    return this.http.get<NsSettings.INotificationPreferenceResponse>(API_END_POINTS.NOTIFICATION_PREFERENCE)
  }
  fetchUserNotificationPreference() {
    return this.http.get<NsSettings.INotificationGroup[]>(API_END_POINTS.USER_NOTIFICATION_PREF)
  }
  updateUserNotificationPreference(req: any) {
    return this.http.post<NsSettings.INotificationGroup[]>(API_END_POINTS.USER_NOTIFICATION_PREF, req)
  }
}
