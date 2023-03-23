import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { SignupService } from './signup.service'

@Injectable()
export class AppPublicPositionResolverService
    implements
    Resolve<
    Observable<IResolveResponse<any>> | IResolveResponse<any>
    > {
    constructor(
        private signupService: SignupService,
    ) { }

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<IResolveResponse<any>> {
        return this.signupService.getPositions().pipe(
            map(rData => ({ data: rData.responseData, error: null })), //  (rData.responseData || []).map((p: any) => p.name)
            tap((resolveData: any) => {
                return of({ error: null, data: resolveData })
            }),
            catchError((error: any) => of({ error, data: null })),
        )
    }
}
