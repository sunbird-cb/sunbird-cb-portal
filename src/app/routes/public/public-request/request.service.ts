import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const API_END_POINTS = {
  positionCreate: `/api/workflow/position/create`,
  orgCreate: `/api/workflow/org/create`,
  domainCreate: `/api/workflow/domain/create`,
  sendOtp: '/api/otp/v1/generate',
  ReSendOtp: '/api/otp/v1/generate',
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
    constructor(private http: HttpClient) { }

    createPosition(reqObj: any): Observable<any> {
        return this.http.post<any>(API_END_POINTS.positionCreate, reqObj)
    }

    createOrg(reqObj: any): Observable<any> {
        return this.http.post<any>(API_END_POINTS.orgCreate, reqObj)
    }

    createDomain(reqObj: any): Observable<any> {
      return this.http.post<any>(API_END_POINTS.domainCreate, reqObj)
  }

  sendOtp(value: any, type: string): Observable<any> {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.sendOtp, reqObj)
  }
  resendOtp(value: any, type: string) {
    const reqObj = {
      request: {
        type: `${type}`,
        key: `${value}`,
      },
    }
    return this.http.post(API_END_POINTS.ReSendOtp, reqObj)

  }

}
