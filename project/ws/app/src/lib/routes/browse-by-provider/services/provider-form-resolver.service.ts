import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { FormExtService } from 'src/app/services/form-ext.service'

@Injectable({
  providedIn: 'root',
})
export class ProviderFormResolverService
 {
constructor(
private router: Router,
private formSvc: FormExtService) {}

resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
): Observable<IResolveResponse<any>> {
    const orgId = _route.params && _route.params.orgId || ''
    const provider = _route.params && _route.params.provider || ''
    let subTypeValue: any = 'microsite'
    if (_route && _route.data && _route.data.pageId && _route.data.pageId.includes('v2')) {
      subTypeValue = 'microsite-v2'
    }
    const requestData: any = {
      'request': {
          'type': 'ATI-CTI',
          'subType': subTypeValue,
          'action': 'page-configuration',
          'component': 'portal',
          'rootOrgId': orgId,
      },
  }
    return this.formSvc.formReadData(requestData).pipe(
      map((rData: any) => ({ data: rData, error: null })),
      tap((resolveData: any) => {
        const finalData = resolveData && resolveData.data.result.form
        if (finalData.rootOrgId !== orgId) {
          this.router.navigate([`/app/learn/browse-by/provider/${provider}/${orgId}/all-CBP`])
          return  of({ })
        }
        return of({ error: null, data: finalData })
      }),
      catchError((error: any) => of({ error, data: null })),
      )
  }
}
