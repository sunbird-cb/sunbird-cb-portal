import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const API_END_POINTS = {
  // GET_DEPARTMENTS: `/api/user/registration/v1/getDeptDetails`,
  REGISTER: `/api/user/registration/v1/register`,
  GET_ALL_STATES: '/apis/public/v8/org/v1/list',
  GET_DEPARTMENTS_OF_STATE: '/apis/public/v8/org/v1/list',
  GET_ORGS_OF_DEPT: '/apis/public/v8/org/v1/list',
  sendOtp: '/api/otp/v1/generate',
  ReSendOtp: '/api/otp/v1/generate',
  sendOtpExt: '/api/otp/ext/v1/generate',
  ReSendOtpExt: '/api/otp/ext/v1/generate',
  VerifyOtp: '/api/otp/v1/verify',
  GET_POSITIONS: '/api/user/v1/positions',
  GET_GROUPS: '/api/user/v1/groups',
  SEARCH_ORG: '/api/org/ext/v2/signup/search',
}

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private signupData = new BehaviorSubject({})
  updateSignupDataObservable = this.signupData.asObservable()

  constructor(private http: HttpClient) { }

  // getDepartments(): Observable<any> {
  //   return this.http.get<any>(API_END_POINTS.GET_DEPARTMENTS)
  // }

  register(req: any) {
    return this.http.post<any>(
      API_END_POINTS.REGISTER, req
    )
  }

  getStatesOrMinisteries(type: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_STATES}/${type}`)
  }
  getDeparmentsOfState(stateId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_DEPARTMENTS_OF_STATE}/${stateId}`)
  }
  getOrgsOfDepartment(deptId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ORGS_OF_DEPT}/${deptId}`)
  }
  getPositions(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_POSITIONS)
  }

  getGroups(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_GROUPS)
  }

  sendOtp(value: any, type: string): Observable<any> {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.sendOtpExt, reqObj)
  }
  resendOtp(value: any, type: string) {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.ReSendOtpExt, reqObj)

  }
  verifyOTP(otp: number, value: any, type: string) {
    const reqObj = {
      request: {
        otp,
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.VerifyOtp, reqObj)

  }

  searchOrgs(orgName: any, type: any) {
    const req = {
      request: {
        filters: {
          orgName,
          parentType: type,
        },
        limit: 500,
      },
    }
    return this.http.post(API_END_POINTS.SEARCH_ORG, req)
  }

  updateSignUpData(state: any) {
    this.signupData.next(state)
  }
}
