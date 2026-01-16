import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class ContentReadResolverService {
  constructor(private http: HttpClient) {}

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    return this.fetchContentPartners().pipe(
      map((rData: any) => ({ data: rData, error: null })),
      catchError((error: any) => of({ error, data: null })),
    )
  }

  /**
   * Fetch content partners with active courses
   * API: POST /apis/proxies/v8/contentpartner/v1/search
   */
  private fetchContentPartners(): Observable<any> {
    const url = '/apis/proxies/v8/contentpartner/v1/search'

    const requestBody = {
      filterCriteriaMap: {
        isActive: true,
        liveCoursesCount: {
          '>=': '1'
        },
        isTrainingInstitution: true,
      },
      pageNumber: 0,
      pageSize: 10,
      facets: ['contentPartnerName'],
      orderBy: 'createdOn',
      orderDirection: 'desc'
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Cache-Control': 'no-cache',
      'locale': localStorage.getItem('websiteLanguage') || 'en',
      'org': 'dopt',
      'rootOrg': 'igot',
      'hostPath': 'localhost_3000'
    }

    return this.http.post(url, requestBody, { headers })
  }
}

