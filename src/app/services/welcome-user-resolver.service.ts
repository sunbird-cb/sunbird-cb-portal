import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError, retry } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { IResolveResponse } from '@sunbird-cb/utils'

@Injectable()
export class WelcomeUserResolverService implements Resolve<Observable<IResolveResponse<any>>> {

    constructor(
        private http: HttpClient,
    ) { }

    resolve(): Observable<IResolveResponse<any>> {
        return this.getPublicDetails().pipe(
            map(data => ({ data, error: null })),
            catchError(error => of({ error, data: null })),
        )
    }
    getPublicDetails(): Observable<any> {
        let url = '/apis/proxies/v8/user/basicInfo'
        return this.http.get<any>(url).pipe(map(r => { return r.result.response })).pipe(retry(3))
    }
}
