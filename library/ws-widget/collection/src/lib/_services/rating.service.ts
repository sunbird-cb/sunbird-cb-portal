import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { NsAppRating } from '../../../../../../project/ws/app/src/lib/routes/app-toc/models/rating.model'

const PROXY_SLAG_V8 = '/apis/proxies/v8'
const API_END_POINTS = {
  GET_RATING: (contentId: string, contentType: string, userId: string) =>
  `${PROXY_SLAG_V8}/ratings/v1/read/${contentId}/${contentType}/${userId}`,
  ADD_OR_UPDATE: `${PROXY_SLAG_V8}/ratings/v1/upsert`,
  GET_RATING_SUMMARY: (contentId: string, contentType: string) =>
  `${PROXY_SLAG_V8}/ratings/v1/summary/${contentId}/${contentType}`,
  GET_RATING_LOOKUP: `${PROXY_SLAG_V8}/ratings/v1/ratingLookUp`,
  GET_AUTHOR_REPLY: (contentId: string, userID: string) =>
  `${PROXY_SLAG_V8}/ratings/v1/read/${contentId}/Course/${userID}`,
  POST_AUTHOR_REPLY: `${PROXY_SLAG_V8}/ratings/v2/read`,
}

@Injectable({
  providedIn: 'root',
})

export class RatingService {

  constructor(private http: HttpClient) { }

  getRating(contentId: string, contentType: string, userId: string): Observable<any> {
    const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    if (!forPreview) {
      return this.http.get<any>(
        API_END_POINTS.GET_RATING(contentId, contentType, userId)
      )
    } else {
      return Observable.of({})
    }
  }

  addOrUpdateRating(req: NsAppRating.IRating): Observable<any> {
    return this.http.post<any>(
      API_END_POINTS.ADD_OR_UPDATE, req
    )
  }

  getRatingSummary(contentId: string, contentType: string): Observable<any> {
    const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    if (!forPreview) {
      return this.http.get<any>(
        API_END_POINTS.GET_RATING_SUMMARY(contentId, contentType)
      )
    } else {
      return Observable.of({})
    }
  }

  getRatingLookup(req: NsAppRating.ILookupRequest): Observable<any> {
    return this.http.post<any>(
      API_END_POINTS.GET_RATING_LOOKUP, req
    )
  }

  getRatingReply(req: any): Observable<any> {
    const forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')
    if (!forPreview) {
      return this.http.post<any>(
        API_END_POINTS.POST_AUTHOR_REPLY, req
      )
    } else {
      return Observable.of({})
    }
  }

  getRatingIcon(ratingIndex: number, avg: number): 'star' | 'star_border' | 'star_half' {
    if (avg) {
      const avgRating = avg
      const ratingFloor = Math.floor(avgRating)
      // const difference =  avgRating - ratingIndex
      if (ratingIndex <= ratingFloor) {
        return 'star'
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 >= 0.29 && avgRating % 1 < 0.71) {
        return 'star_half'
      }
    }
    return 'star'
  }

  getRatingIconClass(ratingIndex: number, avg: number): boolean {
    if (avg) {
      const avgRating = avg
      const ratingFloor = Math.floor(avgRating)
      if (ratingIndex <= ratingFloor) {
        return true
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 >= 0.29 && avgRating % 1 < 0.71) {
        return true
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 > 0.71) {
        return true
      }
      if (ratingFloor === ratingIndex - 1 && avgRating % 1 < 0.29) {
        return false
      }
    }
    return false
  }

  getAuthorReply(contentId: string, userID: string): Observable<any> {
    return this.http.get<any>(
      API_END_POINTS.GET_AUTHOR_REPLY(contentId, userID)
    )
  }
}
