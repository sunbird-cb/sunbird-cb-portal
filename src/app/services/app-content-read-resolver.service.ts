import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'

@Injectable()
export class AppContentResolverService
    implements
    Resolve<
    Observable<IResolveResponse<any>> | IResolveResponse<any>
    > {
    constructor(private contentSvc: WidgetContentService) {}

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<IResolveResponse<any>> {
        const collectionId = _route.queryParams && _route.queryParams.collectionId || ''
        if (collectionId) {
            return this.contentSvc.fetchProgramContent(collectionId).pipe(
                map((rData: any) => ({ data: rData, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
                tap((resolveData: any) => of({ error: null, data: resolveData })),
                catchError((error: any) => of({ error, data: null })),
                )
        }
        return  of({ error: 'Collection Id not found', data: null })
    }
}
