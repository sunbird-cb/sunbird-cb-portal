import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// import { Observable } from 'rxjs'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  GET_ALL_COMPETENCY: '/apis/protected/v8/frac/searchNodes',
}

@Injectable({
  providedIn: 'root',
})
export class ProfileV3Service {
  constructor(private http: HttpClient) { }

  getAllCompetencies(req: any) {
    return this.http.post<any>(API_END_POINTS.GET_ALL_COMPETENCY, req)
  }

}
