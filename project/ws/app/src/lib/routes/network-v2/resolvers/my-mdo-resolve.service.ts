import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
import { IResolveResponse, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { NetworkV2Service } from '../services/network-v2.service'
import { NSNetworkDataV2 } from '../models/network-v2.model'

@Injectable({
  providedIn: 'root',
})
export class MyMdoResolveService  {
  constructor(private networkV2Service: NetworkV2Service, private configSvc: ConfigurationsService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NSNetworkDataV2.IRecommendedUserResponse>> {
    const usrDept = this.configSvc.userProfile && this.configSvc.userProfile.rootOrgName || ''
    // if (this.configSvc.userProfile) {
    //   usrDept = this.configSvc.userProfile.departmentName || 'iGOT'
    // }
    let req: NSNetworkDataV2.IRecommendedUserReq
    req = {
      size: 50,
      offset: 0,
      search: [
        {
          field: 'employmentDetails.departmentName',
          values: [usrDept],
        },
      ],
    }
    return this.networkV2Service.fetchAllRecommendedUsers(req).pipe(
      map((data: any) => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
