import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import {  WidgetUserService } from '@sunbird-cb/collection/src/public-api'

@Injectable()
export class AppEnrollmentResolverService
    implements
    Resolve<
    Observable<IResolveResponse<any>> | IResolveResponse<any>
    > {
    constructor(private configSvc: ConfigurationsService, private userSvc: WidgetUserService) {}

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<IResolveResponse<any>> {
        let userId
        if (this.configSvc.userProfile) {
          userId = this.configSvc.userProfile.userId || ''
        }
        return  this.userSvc.fetchUserBatchList(userId).pipe(
            map((rData: any) => ({ data: rData, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
                tap((resolveData: any) => {
                    return of({ error: null, data: resolveData })
                }),
                catchError((error: any) => of({ error, data: null })),
            )
    }
}
