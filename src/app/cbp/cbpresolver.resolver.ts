import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class CbpResolverService  {

    constructor(private http: HttpClient) { }
    resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {
        return this.http.get(`/assets/configurations/page/cbp.json`).pipe(
            map(data => ({ data, error: null })),
            catchError(err => of({ data: null, error: err })),
          )
    }
}
