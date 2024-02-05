import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'

@Injectable()
export class AppHierarchyResolverService
    implements
    Resolve<
    Observable<IResolveResponse<any>> | IResolveResponse<any>
    > {
    constructor(private contentSvc:WidgetContentService) {}

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<IResolveResponse<any>> {
        const collectionId = _route.queryParams && _route.queryParams.collectionId || ''
        const collectionType= _route.queryParams && _route.queryParams._collectionType || ''
        // tslint:disable-next-line
        // console.log("========> Before api call <===========", collectionId, collectionType)
        return this.contentSvc.fetchContent(collectionId, 'detail', [], collectionType).pipe(
        map((rData: any) => ({ data: rData, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
            tap((resolveData: any) => {
                // tslint:disable-next-line
                // console.log("========> after api call bind data <===========", resolveData)
                return of({ error: null, data: resolveData })
            }),
            catchError((error: any) => {
                // tslint:disable-next-line
                // console.log("========> catch error Hierarchy api call <===========", error)
                return of({ error, data: null })
            }),
        )
    }
}
