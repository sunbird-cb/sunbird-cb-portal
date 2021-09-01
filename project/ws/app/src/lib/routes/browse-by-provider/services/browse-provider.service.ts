import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'

const API_ENDPOINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
  ALL_PROVIDERS: `/apis/proxies/v8/org/v1/search`,
}

@Injectable({
  providedIn: 'root',
})
export class BrowseProviderService {
  private removeFilter = new Subject<any>()
  /**
   * Observable string streams
   */
  notifyObservable$ = this.removeFilter.asObservable()
  constructor(private http: HttpClient) { }

  fetchSearchData(request: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.SEARCH_V6, request)
  }

  fetchAllProviders(request: any): Observable<any> {
    return this.http.post<any>(API_ENDPOINTS.ALL_PROVIDERS, request)
  }

  public notifyOther(data: any) {
    if (data) {
      this.removeFilter.next(data)
    }
  }

}
