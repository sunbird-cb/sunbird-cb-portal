import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class KarmaProgramDataService  {
constructor(
private http: HttpClient) {}

resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
): Observable<IResolveResponse<any>> {
    const requestUrl: any = `/apis/proxies/v8/playList/v2/search`
    const requestData: any = {
      'filterCriteriaMap': {
        'type': 'program',
      },
      'pageNumber': 0,
      'pageSize': 100,
      'orderBy': 'createdOn',
      'orderDirection': 'ASC',
      'facets': ['category', 'orgId'],
    }
    return this.http.post(requestUrl, requestData).pipe(
      map((rData: any) => ({ data: rData, error: null })),
      tap((resolveData: any) => {
        const finalData = resolveData && resolveData.data.result
        return of({ error: null, data: finalData })
      }),
      catchError((error: any) => of({ error, data: null })),
      )
  }
}
