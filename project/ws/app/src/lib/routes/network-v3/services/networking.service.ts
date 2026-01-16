import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { connectionUpdates } from '../models/network-v3.model';

const API_END_POINTS = {
  GET_USER_BASIC_DETAILS: '/apis/proxies/v8/user/profile/v1/basic',
  GET_COMMUNITIES: '/apis/proxies/v8/community/v1/popular',
  GET_CONNECTION_REQUESTS: '/apis/protected/v8/connections/v2/connections/requests/received',
  GET_RECOMMENDED_USERS: '/apis/proxies/v8/connections/v3/connections/recommended',
  GET_RECOMMENDED_MENTORS: '/apis/proxies/v8/connections/v3/connections/recommended/mentors',
  GET_CONNECTIONS: '/apis/protected/v8/connections/v2/connections/established',
  GET_REQUESTS_SENT: '/apis/protected/v8/connections/v2/connections/requested',
  GET_BLOCKED_USERS: '/apis/proxies/v8/connections/v2/connections/requests/blocked',
  SENT_CONNECTION_REQUEST: '/apis/protected/v8/connections/v2/add/connection',
  UPDAT_CONNECTION_REQUEST: '/apis/protected/v8/connections/v2/update/connection',
  CONNECTIONS_COUNT: '/apis/proxies/v8/connections/user/v1/network/connections/list',
}

@Injectable({
  providedIn: 'root'
})
export class NetworkingService {

  connectionsUpdates = new BehaviorSubject<connectionUpdates | null>(null)
  connectionsUpdates$ = this.connectionsUpdates.asObservable()

  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
    private configSvc: ConfigurationsService
  ) { }

  fetchProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_USER_BASIC_DETAILS}/${userId}`)
      .pipe(map(res => {
        this.configulreProfileDetails(res)
        return res
      }))
  }

  configulreProfileDetails(requestBody: any) {
    if (this.configSvc && this.configSvc.userProfileV2) {
      this.configSvc.userProfileV2['profileBannerUrl'] = _.get(requestBody, 'result.response.profileDetails.profileBannerUrl', '');
    }
  }

  getCommunities(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_COMMUNITIES, formBody)
  }

  getQueryString(pageNo?: number, pageSize?: number): string {
    let params: string[] = [];
    if (pageNo !== undefined && pageNo !== null) {
      params.push(`pageNo=${pageNo}`);
    }
    if (pageSize !== undefined && pageSize !== null) {
      params.push(`pageSize=${pageSize}`);
    }
    return params.length ? `?${params.join('&')}` : '';
  }

  getConnectionRequests(pageNo?: number, pageSize?: number): Observable<any> {
    const queryString = this.getQueryString(pageNo, pageSize);
    return this.http.get<any>(`${API_END_POINTS.GET_CONNECTION_REQUESTS}${queryString}`).pipe(
      map(response => {

        const modifiedResponse =  {
          data: this.formatedConnectionRequests(_.get(response, 'result.data')),
          count: _.get(response, 'result.count', 0)
        };
        return modifiedResponse;
      })
    )
  }

  formatedConnectionRequests(requests: any[]): any[] {
    if(requests) {
      requests.forEach((request: any) => {
        if(request.createdAt) {
          request['timeAgo'] = this.getTimeAgo(request.createdAt);
        }
      })
    }
    return requests
  }

  getTimeAgo(recievedAt: string): string {
    const recievedDate = new Date(recievedAt);
    if (isNaN(recievedDate.getTime())) return '';

    const now = Date.now();
    const diff = Math.max(0, now - recievedDate.getTime());

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months}m`;

    const years = Math.floor(months / 12);
    return `${years}y`;
  }

  getRecommendedUsers(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_RECOMMENDED_USERS, formBody)
  }

  getRecommendedMentors(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_RECOMMENDED_MENTORS, formBody)
  }

  getConnections(pageNo?: number, pageSize?: number): Observable<any> {
    const queryString = this.getQueryString(pageNo, pageSize);
    return this.http.get<any>(`${API_END_POINTS.GET_CONNECTIONS}${queryString}`)
  }

  getRequestSent(pageNo?: number, pageSize?: number): Observable<any> {
    const queryString = this.getQueryString(pageNo, pageSize);
    return this.http.get<any>(`${API_END_POINTS.GET_REQUESTS_SENT}${queryString}`)
  }

  getBlockedUsers(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.GET_BLOCKED_USERS, formBody)
  }

  sendConnectionRequest(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.SENT_CONNECTION_REQUEST, formBody)
  }

  updateConnectionRequest(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.UPDAT_CONNECTION_REQUEST, formBody)
  }

  getConnectionsCount(formBody: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.CONNECTIONS_COUNT, formBody)
  }

  //#region (connections updates)
  sendConnectionUpdates(connectionUpdates: connectionUpdates) {
    this.connectionsUpdates.next(connectionUpdates)
  }
  //#endregion (connections updates

  //#region (translation related methods)
  handleTranslateTo(menuName: string): string {
    const translationKey = 'NetworkLandingPage.' + menuName.replace(/\s/g, '')
    return this.translateService.instant(translationKey)
  }

  //#endregion (translation related methods)
}
