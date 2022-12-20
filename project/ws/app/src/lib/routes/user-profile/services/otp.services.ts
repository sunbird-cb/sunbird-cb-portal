import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
const API_ENDPOINTS = {
    sendOtp: '/apis/proxies/v8/otp/v1/generate',
    ReSendOtp: '/apis/proxies/v8/otp/v1/generate',
    VerifyOtp: '/apis/proxies/v8/otp/v1/verify',
}

@Injectable()
export class OtpService {
    constructor(
        private http: HttpClient,
    ) {
    }
    sendOtp(mob: number): Observable<any> {
        const reqObj = {
            request: {
                type: 'phone',
                key: `${mob}`,
            },
        }
        return this.http.post(API_ENDPOINTS.sendOtp, reqObj)
    }
    resendOtp(mob: number) {
        const reqObj = {
            request: {
                type: 'phone',
                key: `${mob}`,
            },
        }
        return this.http.post(API_ENDPOINTS.ReSendOtp, reqObj)

    }
    verifyOTP(otp: number, mob: number) {
        const reqObj = {
            request: {
                otp,
                type: 'phone',
                key: `${mob}`,
            },
        }
        return this.http.post(API_ENDPOINTS.VerifyOtp, reqObj)

    }
}
