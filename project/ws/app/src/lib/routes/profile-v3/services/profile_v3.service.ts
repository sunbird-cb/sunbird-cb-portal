import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  GET_ALL_COMPETENCY: '/apis/protected/v8/frac/searchNodes',
  UPDATE_PROFILE: '/apis/proxies/v8/user/v1/extPatch',
  getUserdetailsFromRegistry: '/apis/proxies/v8/api/user/v2/read',
}

@Injectable({
  providedIn: 'root',
})
export class ProfileV3Service {
  constructor(private http: HttpClient) { }

  getAllCompetencies(req: any) {
    return this.http.post<any>(API_END_POINTS.GET_ALL_COMPETENCY, req)
  }

  updateCCProfileDetails(data: { request: { userId: string, profileDetails: { competencies: any[] } } }) {
    return this.http.post<any>(API_END_POINTS.UPDATE_PROFILE, data)
  }
  updateDCProfileDetails(data: { request: { userId: string, profileDetails: { desiredCompetencies: any[] } } }) {
    return this.http.post<any>(API_END_POINTS.UPDATE_PROFILE, data)
  }

  getUserdetailsFromRegistry(wid: string): Observable<[any]> {
    return this.http.get<[any]>(`${API_END_POINTS.getUserdetailsFromRegistry}/${wid}`)
      .pipe(map((res: any) => {
        return res.result.response
      }))
  }

}
