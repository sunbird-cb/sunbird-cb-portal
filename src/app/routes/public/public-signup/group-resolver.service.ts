import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
// import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { SignupService } from './signup.service'

@Injectable()
export class AppPublicGroupResolverService
     {
    constructor(
        private signupService: SignupService,
    ) { }

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<any> {
        return this.signupService.getGroups().pipe(
            // map((rData: any) => ({ data: rData.result.response, error: null })),
            // tap((resolveData: any) => {
            //     return of({ error: null, data: resolveData.result.response })
            // }),
            // catchError((error: any) => of({ error, data: null })),

            map((rData: any) => ({ data: rData.result.response, error: null })),
            tap((resolveData: any) => {
                return of({ error: null, data: resolveData })
            }),
            catchError((error: any) => of({ error, data: null })),
        )
    }
}
