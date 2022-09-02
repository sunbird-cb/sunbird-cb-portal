import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
// import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_ENDPOINTS = {
    SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
    searchAssessment: (id: string) => `apis/proxies/v8/assessment/read/${id}`,

}
/* this page needs refactor*/
@Injectable({
    providedIn: 'root',
})
export class CompetenceAssessmentService {
    constructor(private http: HttpClient) { }

    fetchSearchData(request: any): Observable<any> {
        return this.http.post<any>(API_ENDPOINTS.SEARCH_V6, request)
    }
    fetchAssessment(assessmentId: string) {
        return this.http.get(API_ENDPOINTS.searchAssessment(assessmentId))
    }
}
