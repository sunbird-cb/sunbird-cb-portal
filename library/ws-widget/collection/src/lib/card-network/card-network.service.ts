import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
// import { NSNetworkDataV2 } from '@ws/app/src/lib/routes/network-v2/models/network-v2.model'
// import { NetworkV2Service } from '@ws/app/src/lib/routes/network-v2/services/network-v2.service'
// import { of } from 'rxjs'

const API_END_POINTS = {
  GET_ALL_ACTIVE_USER: `/apis/protected/v8/networkHub/users`,
  GET_ALL_SEARCH_USER: `/apis/proxies/v8/user/v1/autocomplete/`,
}

@Injectable({
  providedIn: 'root',
})
export class CardNetWorkService {
  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService,
    // private networkV2Service: NetworkV2Service,
  ) { }

  fetchLatestUserInfo(data: any) {
    return this.http.post<any>(API_END_POINTS.GET_ALL_ACTIVE_USER, data).pipe(
      map((response: any) => {
        return response
      }),
    )
  }
  fetchSearchUserInfo(searchKey: string) {
    return this.http.get<any>(API_END_POINTS.GET_ALL_SEARCH_USER + searchKey).pipe(
      map((response: any) => {
        return response
      }),
    )
  }
  fetchMyMdoUsers() {
    let usrDept = 'igot'
    if (this.configSvc.userProfile) {
      usrDept = this.configSvc.userProfile.departmentName || 'igot'
    }
    let req: any // NSNetworkDataV2.IRecommendedUserReq
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
    if (req) {

    }
    // return this.networkV2Service.fetchAllRecommendedUsers(req).pipe(
    //   map((data: any) => ({ data, error: null })),
    //   catchError(error => of({ error, data: null })),
    // )
  }

}
