import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
const API_ENDPOINTS = {
    sendOtp: '/apis/proxies/v8/otp/v1/generate',
    ReSendOtp: '/apis/proxies/v8/otp/v1/generate',
    VerifyOtp: '/apis/proxies/v8/otp/v1/verify',
    sendEmailOtp: '/apis/proxies/v8/otp/v3/generate',
    reSendEmailOtp: '/apis/proxies/v8/otp/v3/generate',
    VerifyEmailOtp: '/apis/proxies/v8/otp/v3/validate',
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

    sendEmailOtp(email: string): Observable<any> {
        const reqObj = {
            request: {
                type: 'email',
                key: `${email}`,
                contextType: "extPatch",
                context: ["profileDetails.personalDetails.primaryEmail"]
            },
        }
        return this.http.post(API_ENDPOINTS.sendEmailOtp, reqObj)
    }

    reSendEmailOtp(email: string): Observable<any> {
        const reqObj = {
            request: {
                type: 'email',
                key: `${email}`,
                contextType: "extPatch",
                context: ["profileDetails.personalDetails.primaryEmail"]
            },
        }
        return this.http.post(API_ENDPOINTS.reSendEmailOtp, reqObj)
    }

    verifyEmailOTP(otp: number, email: number) {
        const reqObj = {
            request: {
                otp,
                type: 'email',
                key: `${email}`,
            },
        }
        return this.http.post(API_ENDPOINTS.VerifyEmailOtp, reqObj)

    }
}
