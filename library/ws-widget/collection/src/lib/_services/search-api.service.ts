import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
// import { ISocialSearchRequest, ISocialSearchResult, ISearchAutoComplete } from '../models/search.model'
// import { KeycloakService } from 'keycloak-angular'
// import { NSSearch } from '@ws-widget/collection'
import { map } from 'rxjs/operators'
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  SOCIAL_VIEW_SEARCH_RESULT: `${PROTECTED_SLAG_V8}/social/post/search`,
  SEARCH_AUTO_COMPLETE: `/apis/proxies/v8/sunbirdigot/read`,
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
  SEARCH_V4: `/apis/proxies/v8/sunbirdigot/v4/search`,
}
@Injectable({
  providedIn: 'root',
})
export class SearchApiService {
  //private keycloakSvc: KeycloakService
  constructor(private http: HttpClient) { }
  getSearchResults(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SOCIAL_VIEW_SEARCH_RESULT, request)
  }

  getSearchAutoCompleteResults(params: { q: string, l: string }): Observable<any[]> {
    return this.http.get<any[]>(API_END_POINTS.SEARCH_AUTO_COMPLETE, { params })
  }

  // get userId(): string | undefined {
  //   const kc = this.keycloakSvc.getKeycloakInstance()
  //   if (!kc) {
  //     return
  //   }
  //   return (kc.tokenParsed && kc.tokenParsed.sub) || (kc.idTokenParsed && kc.idTokenParsed.sub)
  // }

  getSearchV6Results(body: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_V6, body).pipe(map((res: any) => {
      const tempArray = Array()
      if (res.result.facets.length > 0) {
        res.result.facets.forEach((ele: { name: any; values: { name: any; count: any }[] }) => {
          const temp: any = {
            displayName: '',
            type: '',
            content: [],
          }

          temp.displayName = ele.name
          temp.type = ele.name
          if (ele.values.length > 0) {
            ele.values.forEach((subEle: { name: any; count: any }) => {
              temp.content.push({
                displayName: subEle.name,
                type: subEle.name,
                count: subEle.count,
                id: '',
              })
            })
          }
          tempArray.push(temp)
        })
      }
      res.filters = tempArray
      for (const filter of res.filters) {
        if (filter.type === 'catalogPaths') {
          if (filter.content.length === 1) {
            filter.content = filter.content[0].children || []
          }
          break
        }
      }
      return res
    }))
  }

  getSearchV4Results(body: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SEARCH_V4, body).pipe(map((res: any) => {
      const tempArray = Array()
      if (res.result.facets.length > 0) {
        res.result.facets.forEach((ele: { name: any; values: { name: any; count: any }[] }) => {
          const temp: any = {
            displayName: '',
            type: '',
            content: [],
          }

          temp.displayName = ele.name
          temp.type = ele.name
          if (ele.values.length > 0) {
            ele.values.forEach((subEle: { name: any; count: any }) => {
              temp.content.push({
                displayName: subEle.name,
                type: subEle.name,
                count: subEle.count,
                id: '',
              })
            })
          }
          tempArray.push(temp)
        })
      }
      res.filters = tempArray
      for (const filter of res.filters) {
        if (filter.type === 'catalogPaths') {
          if (filter.content.length === 1) {
            filter.content = filter.content[0].children || []
          }
          break
        }
      }
      return res
    }))
  }

  getSearch(body: any): Observable<any> {
    const data = {
      locale: [
        'en',
      ],
      query: '',
      request: {
        query: '',
        filters: {
          primaryCategory: body.request.filters.contentType,
          status: [
            'Draft',
            'Live',
          ],
          visibility: 'default',
          contentType: body.request.filters.contentType,
        },
        sort_by: {
          lastUpdatedOn: 'desc',
        },
        facets: [
          'primaryCategory',
          'mimeType',
        ],
      },
    }
    data.request.query = body.request.query
    return this.http.post<any>(API_END_POINTS.SEARCH_AUTO_COMPLETE, data)
  }
}
