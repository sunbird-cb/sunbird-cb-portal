import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, forkJoin, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AppGyaanKarmayogiService  implements
Resolve<
Observable<IResolveResponse<any>> | IResolveResponse<any>
> {
constructor(private http: HttpClient) {}

resolve(
): Observable<any> {
    const facets = {
      'request': {
          'filters': {
              'status': ['Live'],
          },
          'fields': ['identifier', 'courseCategory', 'status'],
          'offset': 0,
          'limit': 0,
          'sort_by': {
              'lastUpdatedOn': 'desc',
          },
          'facets': [
            'resourceCategory',
            'sectorName',
            'subSectorName',
          ],
      },
  }
  const a  = this.http.post('apis/proxies/v8/sunbirdigot/v4/search', facets).pipe(
    map((rData: any) => ({ data: rData.result.facets, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
    tap((resolveData: any) => of({ error: null, data: resolveData })),
    catchError((error: any) => of({ error, data: null })),
    )
    const b  = this.http.get('apis/proxies/v8/catalog/v1/sector').pipe(
    map((rData: any) => ({

      data: rData.result.sectors, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
    tap((resolveData: any) => of({ error: null, data: resolveData })),
    catchError((error: any) => of({ error, data: null })),
  )

 const join = forkJoin(a, b).pipe(map(allResponses => {
   return {
     facets: allResponses[0],
     sector: allResponses[1],
   }
 }))
 return join

}
}
