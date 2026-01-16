import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'

@Injectable({
  providedIn: 'root',
})
export class AppTocExtPublicResolverService implements
Resolve<
Observable<IResolveResponse<any>> | IResolveResponse<any>
> {
constructor(private contentSvc: WidgetContentService) {}

resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
): Observable<IResolveResponse<any>> {
    const collectionId = _route.params && _route.params.id || ''
    const partnerName = _route.params && _route.params.partner || ''
    return this.contentSvc.fetchExternalPublicContent(partnerName , collectionId).pipe(
    map((rData: any) => ({ data: rData, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
    tap((resolveData: any) => of({ error: null, data: resolveData })),
    catchError((error: any) => of({ error, data: null })),
    )
  }
}
