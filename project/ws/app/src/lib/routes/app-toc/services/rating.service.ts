import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const PROXY_SLAG_V8 = '/apis/proxies/v8'
const API_END_POINTS = {
  GET_RATING: (contentId: string, contentType: string, userId: string) =>
  `${PROXY_SLAG_V8}/ratings/v1/read/${contentId}/${contentType}/${userId}`,
  ADD_OR_UPDATE: `${PROXY_SLAG_V8}/ratings/v1/upsert`,
  GET_RATING_SUMMARY: (contentId: string, contentType: string) =>
  `${PROXY_SLAG_V8}/ratings/v1/summary/${contentId}/${contentType}`,
}

@Injectable({
  providedIn: 'root',
})

export class RatingService {

  constructor(private http: HttpClient) { }

  getRating(contentId: string, contentType: string, userId: string): Observable<any> {
    return this.http.get<any>(
      API_END_POINTS.GET_RATING(contentId, contentType, userId)
    )
  }

  addOrUpdateRating(req: any): Observable<any> {
    return this.http.post<any>(
      API_END_POINTS.ADD_OR_UPDATE, req
    )
  }

  getRatingSummary(contentId: string, contentType: string): Observable<any> {
    return this.http.get<any>(
      API_END_POINTS.GET_RATING_SUMMARY(contentId, contentType)
    )
  }
}
