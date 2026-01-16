import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
const API_END_POINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
}
@Injectable({
  providedIn: 'root',
})
export class JanKarmayogiService {

  constructor(private http: HttpClient) { }
  getSearchResults(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_V6, request)
  }
}
