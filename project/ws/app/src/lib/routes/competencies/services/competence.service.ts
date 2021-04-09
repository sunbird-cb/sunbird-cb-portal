import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NsUser } from '@sunbird-cb/utils'
import { Observable } from 'rxjs'
import { ActivatedRoute } from '@angular/router'

const API_ENDPOINTS = {
  searchCompetency: '/apis/protected/v8/competency/searchCompetency',
  fetchProfileNyId: (id: string) => `/apis/protected/v8/user/profileDetails/getUserRegistryById${id}`,
  // fetchProfile: '/apis/protected/v8/user/profileDetails/getUserRegistry',
  fetchProfile: '/apis/protected/v8/user/profileRegistry/getUserRegistryById',
  updateProfile: '/apis/protected/v8/user/profileRegistry/createUserRegistry',

}
/* this page needs refactor*/
@Injectable({
  providedIn: 'root',
})
export class CompetenceService {
  usr: any
  constructor(
    private http: HttpClient, private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      this.usr = data.profileData.data
    })
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
    return this.http.get<any>(API_ENDPOINTS.fetchProfileNyId(id))
  }

  fetchProfile(): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.fetchProfile)
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.updateProfile, profileData)
  }
}
