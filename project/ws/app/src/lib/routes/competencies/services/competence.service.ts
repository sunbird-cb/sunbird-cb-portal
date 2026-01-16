import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NsUser, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { IUserProfileDetailsFromRegistry } from '../../user-profile/models/user-profile.model'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_ENDPOINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
  searchCompetency: 'apis/protected/v8/frac/searchNodes',
  filterByMappings: 'apis/protected/v8/frac/filterByMappings',
  // searchCompetency: '/apis/protected/v8/competency/searchCompetency',
  fetchProfileNyId: (id: string) => `/apis/proxies/v8/api/user/v2/read/${id}`,
  // fetchProfile: '/apis/protected/v8/user/profileDetails/getUserRegistry',
  fetchCompetencyDetails: (id: string, type: string) => `/apis/protected/v8/frac/getNodeById/${id}/${type}`,
  fetchProfile: '/apis/proxies/v8/api/user/v2/read',
  // updateProfile: '/apis/protected/v8/user/profileDetails/updateUser',
  updateProfile: '/apis/proxies/v8/user/v1/extPatch',
  fetchWatCompetency: (id: string) => `/apis/protected/v8/workallocation/getUserCompetencies/${id}`,
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
      .pipe(map((res: any) => {
        // const roles = _.map(_.get(res, 'result.response.roles'), 'role')
        // _.set(res, 'result.response.roles', roles)
        return _.get(res, 'result.response')
      }))
  }

  fetchCompetencyDetails(id: any, type: string): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.fetchCompetencyDetails(id, type))
  }

  fetchWatCompetency(id: any): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.fetchWatCompetency(id))
  }

  fetchMappings(positionData: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.filterByMappings, positionData)
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.updateProfile, profileData)
  }

  fetchSearchData(request: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.SEARCH_V6, request)
  }
}
