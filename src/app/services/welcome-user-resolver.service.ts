import { Injectable } from '@angular/core'

import { Observable, of } from 'rxjs'
import { map, catchError, retry } from 'rxjs/operators'
import { HttpBackend, HttpClient } from '@angular/common/http'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
// tslint:disable-next-line
import _ from 'lodash'

@Injectable()
export class WelcomeUserResolverService  {
    private httpClient: HttpClient
    constructor(handler: HttpBackend) {
        this.httpClient = new HttpClient(handler)
    }

    resolve(): Observable<IResolveResponse<any>> {
        return this.getPublicDetails().pipe(
            map(data => ({ data, error: null })),
            catchError(error => of({ error, data: null })),
        )
    }
    getPublicDetails(): Observable<any> {
        const url = '/apis/proxies/v8/user/basicInfo'
        return this.httpClient.get<any>(url)
            .pipe(retry(3), map(r => _.get(r, 'result.response')))
    }

}
