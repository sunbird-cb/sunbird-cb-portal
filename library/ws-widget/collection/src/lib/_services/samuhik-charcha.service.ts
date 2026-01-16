import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
const API_END_POINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
}
@Injectable({
  providedIn: 'root'
})
export class SamuhikCharchaService {

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService
  ) { }

  fetchConfigFile(): Observable<any> {
    return this.http.get<any>(`${this.configSvc.sitePath}/feature/samuhik-charcha.json`).pipe()
  }


  getSearchV6Results(body: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_V6, body)
      .pipe()
  }
}
