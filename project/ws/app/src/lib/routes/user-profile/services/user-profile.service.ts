import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import {
  IUserProfileDetails,
  ILanguagesApiData,
  INationalityApiData,
  ICountryApiData,
  IUserProfileDetailsFromRegistry,
  IProfileMetaApiData,
} from '../models/user-profile.model'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_ENDPOINTS = {
  updateProfileDetails: '/apis/protected/v8/user/profileDetails/updateUser',
  getUserdetailsFromRegistry: '/apis/proxies/v8/api/user/v2/read',
  getUserdetails: '/apis/protected/v8/user/details/detailV1',
  getMasterNationality: '/apis/protected/v8/user/profileRegistry/getMasterNationalities',
  getMasterCountries: '/apis/protected/v8/user/profileRegistry/getMasterCountries',
  getMasterLanguages: '/apis/protected/v8/user/profileRegistry/getMasterLanguages',
  getProfilePageMeta: '/apis/protected/v8/user/profileRegistry/getProfilePageMeta',
  getAllDepartments: '/apis/protected/v8/portal/listDeptNames',
  approveRequest: '/apis/protected/v8/workflowhandler/transition',
  getPendingFields: '/apis/proxies/v8/workflow/v2/userWFApplicationFieldsSearch',
  getApprovalPendingFields: '/apis/proxies/v8/workflow/v2/userWFApplicationFieldsSearch',
  getDesignation: '/apis/proxies/v8/user/v1/positions',
  editProfileDetails: '/apis/proxies/v8/user/v1/extPatch',
  updatePrimaryEmail: '/apis/proxies/v8/user/otp/v2/extPatch',
  updateProfilePic: '/apis/proxies/v8/storage/profilePhotoUpload/profileImage',
  GET_GROUPS: '/api/user/v1/groups',
  getApprovalReqs: '/apis/protected/v8/workflowhandler/applicationsSearch',
  ehrmsDataRequest: '/apis/proxies/v8/ehrms/details',
  withDrawRequest: '/apis/protected/v8/workflowhandler/transition',
  approvedDomains: 'apis/proxies/v8/user/v1/email/approvedDomains',
}

@Injectable()
export class UserProfileService {
  constructor(
    private http: HttpClient,
    private translateService: TranslateService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translateService.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translateService.use(lang)
    }
  }

  handleTranslateTo(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'profileInfo.' + menuName.replace(/\s/g, '')
    return this.translateService.instant(translationKey)
  }

  editProfileDetails(data: any) {
    return this.http.post<any>(API_ENDPOINTS.editProfileDetails, data)
  }

  updatePrimaryEmailDetails(data: any) {
    return this.http.post<any>(API_ENDPOINTS.updatePrimaryEmail, data)
  }

  updateProfileDetails(data: any) {
    return this.http.patch<any>(API_ENDPOINTS.updateProfileDetails, data)
  }

  getUserdetails(email: string | undefined): Observable<[IUserProfileDetails]> {
    return this.http.post<[IUserProfileDetails]>(API_ENDPOINTS.getUserdetails, { email })
  }

  getMasterLanguages(): Observable<ILanguagesApiData> {
    return this.http.get<ILanguagesApiData>(API_ENDPOINTS.getMasterLanguages)
  }

  getMasterNationality(): Observable<INationalityApiData> {
    return this.http.get<INationalityApiData>(API_ENDPOINTS.getMasterNationality)
  }

  getMasterCountries(): Observable<ICountryApiData> {
    return this.http.get<ICountryApiData>(API_ENDPOINTS.getMasterCountries)
  }

  getProfilePageMeta(): Observable<IProfileMetaApiData> {
    return this.http.get<IProfileMetaApiData>(API_ENDPOINTS.getProfilePageMeta)
  }

  getUserdetailsFromRegistry(wid: string): Observable<[IUserProfileDetailsFromRegistry]> {
    return this.http.get<[IUserProfileDetailsFromRegistry]>(`${API_ENDPOINTS.getUserdetailsFromRegistry}/${wid}`)
      .pipe(map((res: any) => {
        return res.result.response
      }))
  }

  getAllDepartments() {
    return this.http.get<INationalityApiData>(API_ENDPOINTS.getAllDepartments)
  }

  approveRequest(data: any) {
    return this.http.post(API_ENDPOINTS.approveRequest, data)
  }

  listApprovalPendingFields() {
    return this.http.post<any>(API_ENDPOINTS.getPendingFields, {
      serviceName: 'profile',
      applicationStatus: 'SEND_FOR_APPROVAL',
    })
  }

  fetchApprovalPendingFields() {
    return this.http.post<any>(API_ENDPOINTS.getApprovalPendingFields, {
      serviceName: 'profile',
      applicationStatus: 'SEND_FOR_APPROVAL',
    })
  }

  fetchApprovedFields() {
    return this.http.post<any>(API_ENDPOINTS.getApprovalPendingFields, {
      serviceName: 'profile',
      applicationStatus: 'APPROVED',
    })
  }

  listRejectedFields() {
    return this.http.post<any>(API_ENDPOINTS.getPendingFields, {
      serviceName: 'profile',
      applicationStatus: 'REJECTED',
    })
  }

  getDesignations(_req: any): Observable<IProfileMetaApiData> {
    return this.http.get<IProfileMetaApiData>(API_ENDPOINTS.getDesignation)
  }

  uploadProfilePhoto(req: any): Observable<any> {
    return this.http.post<any>(`${API_ENDPOINTS.updateProfilePic}`, req)
  }

  getGroups(): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.GET_GROUPS)
  }

  getApprovalReqs(data: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.getApprovalReqs, data)
  }

  withDrawRequest(userId: string, wfId: string): Observable<any> {
    const payload = {
      'action': 'WITHDRAW',
      'state': 'SEND_FOR_APPROVAL',
      'userId': userId,
      'applicationId': userId,
      'actorUserId': userId,
      'wfId': wfId,
      'serviceName': 'profile',
      'updateFieldValues': [],
      'comment': '',
    }
    return this.http.post<any>(API_ENDPOINTS.withDrawRequest, payload)
  }

  fetchEhrmsDetails() {
    return this.http
      .get(API_ENDPOINTS.ehrmsDataRequest)
      .pipe(
        map(
          (result: any) => result
        )
      )
  }
  getWhiteListDomain(): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.approvedDomains)
  }
}
