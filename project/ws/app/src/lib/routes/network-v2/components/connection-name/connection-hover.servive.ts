import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { NSProfileDataV2 } from '../../../profile-v2/models/profile-v2.model'
import { catchError, map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable
// const PROTECTED_SLAG_V8 = '/apis/protected/v8'

const API_END_POINTS = {
  // getUserdetailsV2FromRegistry: '/apis/protected/v8/user/profileRegistry/getUserRegistryByUser',
  getUserdetailsV2FromRegistry: '/apis/proxies/v8/api/user/v2/read',
}

@Injectable({
  providedIn: 'root',
})
export class ConnectionHoverService {
  constructor(private http: HttpClient) { }
  fetchProfile(userId: string): Observable<NSProfileDataV2.IProfile | null> {
    return this.http.get<NSProfileDataV2.IProfile | null>(`${API_END_POINTS.getUserdetailsV2FromRegistry}/${userId}`)
      .pipe(map((data: any) => {
        // tslint:disable-next-line: prefer-const
        let profile!: NSProfileDataV2.IProfile | null
        // _.set(profile, '.', _.first(_.get(data, 'result.UserProfile')))
        // profile = _.first(_.get(data, 'result.UserProfile')) || null
        // profile = _.first(_.get(data.result.response, 'result.UserProfile')) || null
        profile = data.result.response
        return profile
      },
        // tslint:disable-next-line: align
        catchError((err: any) => {
          return of({ data: null, error: err })
        })
      ))
  }
}
