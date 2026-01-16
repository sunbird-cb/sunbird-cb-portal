import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'

@Injectable({
  providedIn: 'root',
})
export class AppTocCiosResolverService  {
constructor(private contentSvc: WidgetContentService) {}

resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
): Observable<IResolveResponse<any>> {
    const collectionId = _route.params && _route.params.id || ''
    return this.contentSvc.fetchExternalContent(collectionId).pipe(
    map((rData: any) => ({ data: rData, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
    tap((resolveData: any) => of({ error: null, data: resolveData })),
    catchError((error: any) => of({ error, data: null })),
    )
  }
}
