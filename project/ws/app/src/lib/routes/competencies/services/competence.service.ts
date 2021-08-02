import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NsUser } from '@sunbird-cb/utils'
import { Observable } from 'rxjs'
import { ConfigurationsService } from 'library/ws-widget/utils/src/public-api'
import { map } from 'rxjs/operators'
import { IUserProfileDetailsFromRegistry } from '../../user-profile/models/user-profile.model'

const API_ENDPOINTS = {
  searchCompetency: 'apis/protected/v8/frac/searchNodes',
  // searchCompetency: '/apis/protected/v8/competency/searchCompetency',
  fetchProfileNyId: (id: string) => `/apis/proxies/v8/api/user/v2/read/${id}`,
  // fetchProfile: '/apis/protected/v8/user/profileDetails/getUserRegistry',
  fetchProfile: '/apis/proxies/v8/api/user/v2/read',
  updateProfile: '/apis/protected/v8/user/profileDetails/updateUser',


}
/* this page needs refactor*/
@Injectable({
  providedIn: 'root',
})
export class CompetenceService {
  usr: any
  constructor(
    private http: HttpClient, private configSvc: ConfigurationsService) {
    this.usr = this.configSvc.userProfile
  }

  get getUserProfile(): NsUser.IUserProfile {
    return this.usr
  }
  appendPage(page: any, url: string) {
    if (page) {
      return `${url}?page=${page}`
    }
    return url
  }

  fetchCompetency(searchData: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.searchCompetency, searchData)
  }

  fetchProfileById(id: any): Observable<any> {
    return this.http.get<[IUserProfileDetailsFromRegistry]>(API_ENDPOINTS.fetchProfileNyId(id))
      .pipe(map((res: any) => res.result.response))
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.patch<any>(API_ENDPOINTS.updateProfile, profileData)
  }
}
