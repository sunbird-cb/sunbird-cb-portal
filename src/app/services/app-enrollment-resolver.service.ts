import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

import { WidgetUserServiceLib } from '@sunbird-cb/consumption'

@Injectable()
export class AppEnrollmentResolverService
    implements
    Resolve<
    Observable<IResolveResponse<any>> | IResolveResponse<any>
    > {
    constructor(private configSvc: ConfigurationsService, private userSvc: WidgetUserServiceLib) {}

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<IResolveResponse<any>> {
        let userId
        if (this.configSvc.userProfile) {
          userId = this.configSvc.userProfile.userId || ''
        }
        if (window.location.href.includes('/public/') || window.location.href.includes('&preview=true')) {
            return of({ error: null, data: null })
        }
        return  this.userSvc.fetchUserBatchList(userId).pipe(
            map((rData: any) => ({ data: rData, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
                // tslint: disable-next-line: align
                // @ts-ignore
            tap((resolveData: any) => {
                    // @ts-ignore
                    return of({ error: null, data: resolveData })
                    // @ts-ignore
                }),
                // tslint: disable-next-line: align
                // @ts-ignore
            catchError((error: any) => of({ error, data: null })),
            )
    }
}
