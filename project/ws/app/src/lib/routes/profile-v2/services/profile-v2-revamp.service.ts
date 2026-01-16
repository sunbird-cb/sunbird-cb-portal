import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NSProfileDataV2 } from '../models/profile-v2.model';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash';


const API_END_POINTS = {
  GET_USER_BASIC_DETAILS: '/apis/proxies/v8/user/profile/v1/basic',
  GET_USER_ENTRIES: '/apis/proxies/v8/user/profile/v1/extended/',
  UPDATE_PROFILE_DETAILS: '/apis/proxies/v8/user/v1/extPatch',
  GET_RECOMMENDED_USERS: '/apis/proxies/v8/connections/v3/connections/recommended',
  ADD_CONNECTION: `apis/protected/v8/connections/v2/add/connection`,
  BLOCK_CONNECTION: `apis/proxies/v8/connections/block`,
  GET_COMMUNITIES: '/apis/proxies/v8/community/v1/popular',
  UPLOAD_PROFILE_PIC: '/apis/proxies/v8/storage/profilePhotoUpload/profileImage',
  UPLOAD_BANNER_PIC: '/apis/proxies/v8/storage/profilePhotoUpload/profileBanner',
  GET_CADRE_DETAILS: '/apis/proxies/v8/data/v2/system/settings/get/cadreConfig', // old
  APPROVAL_DETAILS: '/apis/proxies/v8/workflow/v2/userWFApplicationFieldsSearch', // old
  WITHDRAW_REQUEST: '/apis/protected/v8/workflowhandler/transition', // old
  COURSE_BATCH_LIST: `/apis/proxies/v8/learner/course/v1/batch/list`,
  GET_MASTER_LANGUAGES: '/apis/protected/v8/user/profileRegistry/getMasterLanguages',
  ORG_SEARCH: '/apis/proxies/v8/org/v1/search', // old
  GET_SEARCH_DESIGNATIONS: '/apis/proxies/v8/designation/search', //OLD
  GET_SUNBIRD_IGOT_SEARCH: '/apis/proxies/v8/sunbirdigot/v4/search', //OLD
  GET_GROUPS: '/api/user/v1/groups', //OLD
  GET_STATES_LIST: '/apis/proxies/v8/extendedprofile/list/states',
  GET_DISTRICTS_LIST: 'apis/proxies/v8/extendedprofile/list/districts',
  GET_DEGREES_LIST: 'apis/proxies/v8/masterdata/list/degrees',
  GET_INSTITUTIONS_LIST: 'apis/proxies/v8/masterdata/list/institutions',
  UPDATE_DEGREE: 'apis/proxies/v8/masterdata/update/degree',
  UPDATE_INSTITUTION: 'apis/proxies/v8/masterdata/update/institution',
  GET_MINISTRY: '/apis/public/v8/org/v1/list/ministry',

  UPLOAD_ACHIEVEMENT_PIC: '/apis/proxies/v8/storage/profilePhotoUpload/userAchievements',
  ADD_ENTRIES: '/apis/proxies/v8/user/profile/v1/extended',
  UPDATE_ENTRIES: '/apis/proxies/v8/user/profile/v1/extended/update',
  DELETE_ENTRIES: '/apis/proxies/v8/user/profile/v1/extended/delete',
  approvedDomains: 'apis/proxies/v8/user/v1/email/approvedDomains', //old

  INSIGHTS: `apis/proxies/v8/read/user/insights`, //old
  GET_CONNECTION_STATUS: (userId: string) => `apis/proxies/v8/connections/v1/profile/relationship/${userId}`,
  UPDAT_CONNECTION_REQUEST: '/apis/protected/v8/connections/v2/update/connection',
  SEARCH_USERS: '/apis/proxies/v8/user/v1/search',

  SEARCH_EDUCATIONAL_QUALIFICATIONS: '/apis/proxies/v8/masterdata/v1/search'

  // ASSESSMENT_DATA: `apis/proxies/v8/wheebox/read`, //old

}

@Injectable({
  providedIn: 'root'
})
export class ProfileV2RevampService {

  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
    private configSvc: ConfigurationsService
  ) { }

  fetchProfile(userId: string, isNotCurrentUser?: boolean): Observable<NSProfileDataV2.IProfile> {
    return this.http.get<NSProfileDataV2.IProfile>(`${API_END_POINTS.GET_USER_BASIC_DETAILS}/${userId}`)
      .pipe(map(res => {
        if(!isNotCurrentUser) {
          this.configulreProfileDetails(res)
        }
        return res
      }))
  }
// fetchNodalDetailsV2(rootOrgId: any, roles: string): Promise<any> {
//   const reqBody = {
//     request: {
//       filters: {
//         rootOrgId: rootOrgId,
//         'organisations.roles': roles,
//       },
//       fields: ['firstName', 'profileDetails.personalDetails.primaryEmail'],
//       limit: 1,
//     },
//   }
//   return this.http.post<any>(API_END_POINTS.SEARCH_USERS, reqBody).toPromise()
// }


  configulreProfileDetails(requestBody: any) {
    if( this.configSvc && this.configSvc.userProfileV2) {
      this.configSvc.userProfileV2['profileBannerUrl'] = _.get(requestBody, 'result.response.profileDetails.profileBannerUrl', '');
    }
  }

  updateProfileDetails(requestBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPDATE_PROFILE_DETAILS, requestBody)
      .pipe(map(res => {
        return res
      }))
  }

  updateProfilePic(formData: FormData): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPLOAD_PROFILE_PIC, formData)
      .pipe(map(res => {
        return res
      }))
  }

  updateBannerPic(formData: FormData): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPLOAD_BANNER_PIC, formData)
      .pipe(map(res => {
        return res
      }))
  }

  fetchProfileEntries(userId: string, entryType: string = 'all'): Observable<NSProfileDataV2.IProfile> {
    return this.http.get<NSProfileDataV2.IProfile>(`${API_END_POINTS.GET_USER_ENTRIES}${entryType}/${userId}`)
      .pipe(map(res => {
        return res
      }))
  }

  getRecommendedUsers(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_RECOMMENDED_USERS, formBody)
  }

  connectToNetwork(payload: any): Observable<any> {
    return this.http.post(API_END_POINTS.ADD_CONNECTION, payload)
  }

  blockConnection(payload: any): Observable<any> {
    return this.http.post(API_END_POINTS.BLOCK_CONNECTION, payload)
  }

  getCommunities(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_COMMUNITIES, formBody)
  }

  fetchCourseBatches(req: any): Observable<any> {
    return this.http
      .post<any>(API_END_POINTS.COURSE_BATCH_LIST, req)
      .pipe(
        retry(1),
        map(
          (data: any) => data.result.response
        )
      )
  }

  fetchCadre(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_CADRE_DETAILS}`)
  }

  getMasterLanguages(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_MASTER_LANGUAGES)
  }
  getOrgSearch(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.ORG_SEARCH, formBody)
  }

  getMinistriesList(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_MINISTRY)
  }

  searchDesignation(_req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_SEARCH_DESIGNATIONS, _req)
  }

  searchIgotDesignation(_req: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_SUNBIRD_IGOT_SEARCH, _req)
  }

  fetchNodalDetails(rootOrgId: any, roles: string) {
  const reqBody = {
    "request": {
        "filters": {
            "rootOrgId": rootOrgId,
             "organisations.roles": roles
        },
        "fields": ["firstName", "profileDetails.personalDetails.primaryEmail"],
        "limit": 1
    }
}
     return this.http.post<any>(API_END_POINTS.SEARCH_USERS, reqBody)
  }

  getGroups(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_GROUPS)
  }

  getStatesList(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_STATES_LIST)
  }

  getDistrictsList(state: string) {
    const formBody = {
      contextName: state
    }
    return this.http.post<any>(`${API_END_POINTS.GET_DISTRICTS_LIST}`, formBody)
  }

  getDegreesList(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_DEGREES_LIST}`)
  }

  getInstitutionsList() {
    return this.http.get<any>(API_END_POINTS.GET_INSTITUTIONS_LIST)
  }

  updateDegree(requestBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPDATE_DEGREE, requestBody)
  }

  updateInstitution(requestBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPDATE_INSTITUTION, requestBody)
  }

  updateAchievementPic(formData: FormData): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPLOAD_ACHIEVEMENT_PIC, formData)
  }

  addEntriesToProfile(requestBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.ADD_ENTRIES, requestBody)
  }

  updateEntriesOfProfile(requestBody: any): Observable<any> {
    return this.http.put<any>(API_END_POINTS.UPDATE_ENTRIES, requestBody)
  }

  deleteEntriesOfProfile(requestBody: any): Observable<any> {
    return this.http.delete<any>(API_END_POINTS.DELETE_ENTRIES, requestBody)
  }

  updateConnectionRequest(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPDAT_CONNECTION_REQUEST, formBody)
  }

  getWhiteListDomain(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.approvedDomains)
  }

  fetchApprovalDetails(requestBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.APPROVAL_DETAILS, requestBody)
  }

  withDrawRequest(payload: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.WITHDRAW_REQUEST, payload)
  }

  handleTranslateTo(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'NetworkV2Profile.' + menuName.replace(/\s/g, '')
    return this.translateService.instant(translationKey)
  }


  getInsightsData(payload: any) {
    const result = this.http.post(API_END_POINTS.INSIGHTS, payload)
    return result
  }

  getConnectionStatus(userId: string) {
    return this.http.get(`${API_END_POINTS.GET_CONNECTION_STATUS(userId)}`)
  }

  // getAssessmentinfo(): Observable<any> {
  //     return this.http.get(API_END_POINTS.ASSESSMENT_DATA)
  //   }

  deleteAchievement(payload: any): Observable<any> {
    return this.http.delete<any>(API_END_POINTS.DELETE_ENTRIES, { body: payload })
  }


  getEducationsQualificationsSearch(payload: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_EDUCATIONAL_QUALIFICATIONS, payload)
  }

}
