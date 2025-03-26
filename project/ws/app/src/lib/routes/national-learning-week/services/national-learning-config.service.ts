import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { FormExtService } from 'src/app/services/form-ext.service'

@Injectable({
  providedIn: 'root',
})
export class NationalLearningConfigService implements
Resolve<Observable<any>> {
constructor(
private formSvc: FormExtService) {}

resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
): Observable<any> {
    const requestData: any = {
      'request': {
      'type': 'page',
        'subType': 'home',
        'action': 'page-configuration',
        'component': 'portal',
        'rootOrgId': '*',
      },
  }
    return this.formSvc.homeFormReadData(requestData).pipe(
      map((rData: any) => ({ data: rData, error: null })),
      tap((resolveData: any) => {
        const finalData = resolveData && resolveData.data
        return of({ error: null, configData: finalData })
      }),
      catchError((error: any) => of({ error, data: null })),
      )
  }
}
