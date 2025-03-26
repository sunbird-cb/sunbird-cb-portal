import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { FormExtService } from 'src/app/services/form-ext.service'

@Injectable({
  providedIn: 'root',
})
export class MdoChannelFormService implements
Resolve<Observable<IResolveResponse<any>> | IResolveResponse<any>> {
constructor(
private formSvc: FormExtService) {}

resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
): Observable<IResolveResponse<any>> {
    const orgId = _route.params && _route.params.orgId || ''
    let subTypeValue: any = 'microsite'
    if (_route && _route.data && _route.data.pageId && _route.data.pageId.includes('v2')) {
      subTypeValue = 'microsite-v2'
    }
    const requestData: any = {
      'request': {
      'type': 'MDO-channel',
        'subType': subTypeValue,
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
