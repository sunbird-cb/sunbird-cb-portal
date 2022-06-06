import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
// tslint:disable-next-line
import _ from 'lodash'
import { Observable } from 'rxjs'
import { NSProfileDataV3 } from '../models/profile-v3.models'

const API_END_POINTS = {
    getRoles: 'apis/protected/v8/roleactivity',
    UPDATE_PROFILE: '/apis/proxies/v8/user/v1/extPatch',
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
    createRoles(role: { request: { userId: string, profileDetails: { userRoles: NSProfileDataV3.IRolesAndActivities[] } } }) {
        return this.http.post<any>(API_END_POINTS.UPDATE_PROFILE, role)
    }
}
