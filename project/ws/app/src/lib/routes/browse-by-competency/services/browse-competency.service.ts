import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'

const API_ENDPOINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
  GET_COMPETENCY_AREA: `/apis/protected/v8/frac/getAllNodes/competencyarea`,
  SEARCH_COMPETENCY: `apis/protected/v8/frac/searchNodes`
}

@Injectable({
  providedIn: 'root',
})
export class BrowseCompetencyService {
  private removeFilter = new Subject<any>()
  /**
   * Observable string streams
   */
  notifyObservable$ = this.removeFilter.asObservable()
  constructor(private http: HttpClient) { }

  fetchSearchData(request: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.SEARCH_V6, request)
  }

  searchCompetency(searchData: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.SEARCH_COMPETENCY, searchData)
  }

  fetchCompetencyAreas(): Observable<any> {
    return this.http.get<any>(API_ENDPOINTS.GET_COMPETENCY_AREA)
  }

  public notifyOther(data: any) {
    if (data) {
      this.removeFilter.next(data)
    }
  }

}
