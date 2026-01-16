import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  constructor(private http: HttpClient) { }

  getBanners(): Observable<any> {
    return this.http.get<any>('api/course/v2/explore')
  }

  getContentDetails(identifier: string): Observable<any> {
    return this.http.get<any>(`api/content/v1/read/${identifier}`)
  }
}
