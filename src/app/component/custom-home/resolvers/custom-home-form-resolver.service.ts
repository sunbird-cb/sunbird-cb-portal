import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IResolveResponse } from '@sunbird-cb/utils-v2';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormExtService } from 'src/app/services/form-ext.service';

@Injectable({
  providedIn: 'root'
})
export class CustomHomeFormResolverService {

  constructor(
    private formSvc: FormExtService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
): Observable<IResolveResponse<any>> {
    let deptId = route.paramMap.get('id')
    if(deptId === 'ec') {
      deptId = 'iiidem'
    }
    const requestData: any = {
      'request': {
        "type": "custom-home",
        "subType": deptId,
        'action': 'page-configuration',
        'component': 'portal',
        'rootOrgId': '*',
      },
  }
    return this.formSvc.formReadData(requestData).pipe(
      map((rData: any) => {
        console.log('Raw API response in resolver:', rData)
        const finalData = rData && rData.result && rData.result.form && rData.result.form.data
        console.log('Extracted finalData in resolver:', finalData)
        const result = { data: finalData, error: null }
        console.log('Final resolver result:', result)
        return result
      }),
      catchError((error: any) => of({ error, data: null })),
      )
  }
}

