import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_END_POINTS = {
  GET_PROVIDERS: 'apis/proxies/v8/searchBy/provider',
  GET_FILTER_ENTITY: 'apis/proxies/v8/competency/v4/search',
}
@Injectable({
  providedIn: 'root',
})
export class AppCbpPlansService {

  constructor(private http: HttpClient) { }

  getFilterEntity(filter: object): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_FILTER_ENTITY}`, filter).pipe(map(res => _.get(res, 'result.competency')))
  }

  getProviders() {
    return this.http.get<any>(API_END_POINTS.GET_PROVIDERS)
  }
}
