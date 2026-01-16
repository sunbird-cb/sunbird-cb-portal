import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { NsSettings } from './settings.model'
import { NSProfileDataV2 } from '../../../profile-v2/models/profile-v2.model'

const API_END_POINTS = {
  NOTIFICATIONS: `/apis/protected/v8/user/notifications/settings`,
  NOTIFICATION_PREFERENCE: '/apis/proxies/v8/data/v1/system/settings/get/notificationPreference',
  USER_NOTIFICATION_PREF: '/apis/proxies/v8/user/v1/notificationPreference',
  GET_NOTIFICATIONS: `apis/proxies/v8/notificationSetting/read`,
  UPDATE_NOTIFICATIONS: `apis/proxies/v8/notificationSetting/upsert`,
  GET_USER_BASIC_DETAILS: '/apis/proxies/v8/user/profile/v1/basic',
  UPDATE_PROFILE_DETAILS: '/apis/proxies/v8/user/v1/extPatch',
  RESET_PASSWORD: '/apis/proxies/v8/user/v2/password/reset'
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

  getSettings() {
    return this.http.get<any>(API_END_POINTS.GET_NOTIFICATIONS)
  }

  enableNotification(request: any) {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_NOTIFICATIONS}`, request)
  }

  fetchProfile(userId: string): Observable<NSProfileDataV2.IProfile> {
    return this.http.get<NSProfileDataV2.IProfile>(`${API_END_POINTS.GET_USER_BASIC_DETAILS}/${userId}`)
  }

  updateProfileVisibility(form: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.UPDATE_PROFILE_DETAILS}`, form)
  }

  resetPassword(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.RESET_PASSWORD)
  }
}
