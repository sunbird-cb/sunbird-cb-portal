import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class CbpResolverService implements Resolve<Observable<any>> {

    constructor(private http: HttpClient) { }
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {
        return this.http.get(`/assets/configurations/page/cbp.json`).pipe(
            map(data => ({ data, error: null })),
            catchError(err => of({ data: null, error: err })),
          )
    }
}
