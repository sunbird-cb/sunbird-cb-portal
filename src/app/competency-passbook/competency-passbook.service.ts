import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_POINTS = {
    COMPETENCY_LIST: `apis/proxies/v8/competency/v4/search`,
    CERTIFICATE_URL: `apis/protected/v8/cohorts/course/batch/cert/download/`,
}

@Injectable({ providedIn: 'root' })

export class CompetencyPassbookService {
    // tslint: disable-next-line: whitespace
    constructor(private http: HttpClient) { }
    getCompetencyList(payload: any): Observable<any> {
        return this.http.post(API_POINTS.COMPETENCY_LIST, payload)
    }

    fetchCertificate(certId: string): Observable<any> {
        return this.http.get(API_POINTS.CERTIFICATE_URL + certId)
    }
}
