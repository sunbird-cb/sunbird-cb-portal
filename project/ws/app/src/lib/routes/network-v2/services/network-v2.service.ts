import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NSNetworkDataV2 } from '../models/network-v2.model'
import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
// tslint:enable

const API_ENDPOINTS = {
  getRecommendedUsers: '/apis/protected/v8/connections/v2/connections/recommended',
  createConnection: `/apis/protected/v8/connections/v2/add/connection`,
  updateConnection: `/apis/protected/v8/connections/v2/update/connection`,
  connectionRequests: `/apis/protected/v8/connections/v2/connections/requested`,
  connectionRequestsReceived: `/apis/protected/v8/connections/v2/connections/requests/received`,
  connectionEstablished: `/apis/protected/v8/connections/v2/connections/established`,
  getSuggestedUsers: `/apis/protected/v8/connections/v2/connections/suggests`,
  // getUserdetailsV2FromRegistry: '/apis/protected/v8/user/profileRegistry/getUserRegistryByUser',
  getUserdetailsV2FromRegistry: '/apis/proxies/v8/api/user/v2/read',
}

@Injectable({
  providedIn: 'root',
})
export class NetworkV2Service {

  constructor(
    private http: HttpClient) {
  }

  fetchProfile(userId: string) {
    return this.http.get<NSNetworkDataV2.IProfile>(`${API_ENDPOINTS.getUserdetailsV2FromRegistry}/${userId}`)
      .pipe(map(res => {
        // const roles = _.map(_.get(res, 'result.response.roles'), 'role')
        // _.set(res, 'result.response.roles', roles)
        return res
      }))

  }

  fetchAllConnectionRequests() {
    return this.http.get<NSNetworkDataV2.IConnectionRequestResponse>(API_ENDPOINTS.connectionRequests)
  }

  fetchAllReceivedConnectionRequests() {
    return this.http.get<NSNetworkDataV2.IConnectionRequest>(API_ENDPOINTS.connectionRequestsReceived)
  }

  fetchAllRecommendedUsers(data: NSNetworkDataV2.IRecommendedUserReq) {
    return this.http.post(API_ENDPOINTS.getRecommendedUsers, data)
  }

  fetchAllSuggestedUsers() {
    return this.http.get(API_ENDPOINTS.getSuggestedUsers)
  }

  createConnection(data: any) {
    return this.http.post(API_ENDPOINTS.createConnection, data)
  }

  updateConnection(data: any) {
    return this.http.post(API_ENDPOINTS.updateConnection, data)
  }

  fetchAllConnectionEstablished() {
    return this.http.get<NSNetworkDataV2.IEstablishedConnectResopnse>(API_ENDPOINTS.connectionEstablished)
  }

  fetchAllConnectionEstablishedById(wid: any) {
    const url = `${API_ENDPOINTS.connectionEstablished}/${wid}`
    return this.http.get<NSNetworkDataV2.IEstablishedConnectResopnse>(url)
  }
}
