import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { FormExtService } from './form-ext.service'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class AppHomePageResolverService  {
constructor(
private http: HttpClient,
public configSvc: ConfigurationsService,
private formSvc: FormExtService) {}

resolve(
      _route: ActivatedRouteSnapshot,
      _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    const requestData: any = {
      'request': {
          'type': 'page',
          'subType': 'home',
          'action': 'page-configuration',
          'component': 'portal',
          'rootOrgId': '*',
      },
    }
    return this.formSvc.formReadData(requestData).pipe(
        map((rData: any) => {
          const finalData = rData && rData.result.form.data
          return ({ data: finalData, error: null })
        }),
        catchError((_error: any) => {
          const baseUrl = this.configSvc.sitePath
          return this.http.get(`${baseUrl}/page/home.json`).pipe(
            map(data => ({ data, error: null })),
            catchError(err => of({ data: null, error: err })),
          )
        }
      ),
    )
  }
}
