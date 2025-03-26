import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'

@Injectable()
export class AppHierarchyResolverService
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
        const collectionType = _route.queryParams && _route.queryParams._collectionType || ''
        // tslint:disable-next-line
        // console.log("========> Before api call <===========", collectionId, collectionType)
        if (collectionId) {
            return this.contentSvc.fetchContent(collectionId, 'detail', [], collectionType).pipe(
                map((rData: any) => ({ data: rData, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
                    tap((resolveData: any) => {
                        // tslint:disable-next-line
                        // console.log("========> after api call bind data <===========", resolveData)
                        // this.router.queryParams
                        // if (_route.queryParams && _route.queryParams.checkFirstChild) {
                        //     const content = resolveData.data.result.content
                        //     const firstChildData = this.contentSvc.getFirstChildInHierarchy(content)
                        //     const url = this.contentSvc.getResourseLink(firstChildData, content, _route.queryParams.batchId)
                        //     this.router.navigate(
                        //         [url.url],
                        //         {
                        //           queryParams: url.queryParams,
                        //         })
                        // }

                        return of({ error: null, data: resolveData })
                    }),
                    catchError((error: any) => {
                        // tslint:disable-next-line
                        // console.log("========> catch error Hierarchy api call <===========", error)
                        return of({ error, data: null })
                    }),
                )
        }
        return of({ error: 'No Collectionid', data: null })
    }
}
