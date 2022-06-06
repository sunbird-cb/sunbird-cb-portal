import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
// tslint:disable-next-line
import _ from 'lodash'
import { Observable } from 'rxjs'

const API_END_POINTS = {
    getRoles: 'apis/protected/v8/roleactivity',
}
@Injectable({
    providedIn: 'root',
})
export class RolesAndActivityService {
    constructor(
        private http: HttpClient) {
    }
    loadRoles(keyword: string): Observable<any> {
        return this.http.get<any>(`${API_END_POINTS.getRoles}/${keyword}`)
    }
}
