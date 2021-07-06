import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'

const API_END_POINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
}

@Injectable({
  providedIn: 'root',
})
export class GbSearchService {
  private removeFilter = new Subject<any>()
  /**
   * Observable string streams
   */
  notifyObservable$ = this.removeFilter.asObservable()
  constructor(private http: HttpClient) { }

  fetchSearchData(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_V6, request)
  }

  public notifyOther(data: any) {
    if (data) {
      this.removeFilter.next(data)
    }
  }

}
