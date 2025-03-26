import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ContentReadResolverService implements
  Resolve<
  Observable<IResolveResponse<any>> | IResolveResponse<any>
  > {
  constructor(private contentSvc: WidgetContentService) {}

  resolve(
      _route: ActivatedRouteSnapshot,
      _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    if (environment && environment.providerDataKey) {
      const collectionId: any = environment.providerDataKey || ''
      return this.contentSvc.fetchProgramContent(collectionId).pipe(
        map((rData: any) => ({ data: rData, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
        tap((resolveData: any) => of({ error: null, data: resolveData })),
        catchError((error: any) => of({ error, data: null })),
        )
    }
    return of({ data: '', error: 'No Provider Data Key' })
  }
}
