import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { FormExtService } from 'src/app/services/form-ext.service'

@Injectable({
  providedIn: 'root',
})
export class KarmaProgramsFormV1Service  {
constructor(
private formSvc: FormExtService) {}

resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
): Observable<IResolveResponse<any>> {
    const orgId = _route.params && _route.params.orgId || ''
    const requestData: any = {
      'request': {
        'type': 'karma-program',
        'subType': 'microsite',
        'action': 'page-configuration',
        'component': 'portal',
        'rootOrgId': orgId,
      },
  }
        // 'request': {
      //     'type': 'ATI-CTI',
      //     'subType': 'microsite',
      //     'action': 'page-configuration',
      //     'component': 'portal',
      //     'rootOrgId': orgId,
      // },
    return this.formSvc.formReadData(requestData).pipe(
      map((rData: any) => ({ data: rData, error: null })),
      tap((resolveData: any) => {
        const finalData = resolveData && resolveData.data.result.form
        return of({ error: null, data: finalData })
      }),
      catchError((error: any) => of({ error, data: null })),
      )
  }
}
