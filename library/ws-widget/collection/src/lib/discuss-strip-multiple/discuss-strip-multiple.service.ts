import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
// import { getStringifiedQueryParams } from '@ws-widget/utils'
// import { NsNetworkStripNewMultiple } from './network-strip-multiple.model'

// const PROXY_CREATE_V8 = `/apis/proxies/v8/discussion/user/v1/create`;
const PROXY_CREATE_V8 = '/apis/proxies/v8'
// const PROXY_CREATE_V8 = 'http://localhost:3004/proxies/v8'
const API_END_POINTS = {
  CREATE_USER_API: `${PROXY_CREATE_V8}/discussion/user/v1/create`,
}

@Injectable({
  providedIn: 'root',
})
export class ContentStripNewMultipleService {

  constructor(
    private http: HttpClient,
  ) { }

  // getContentStripResponseApi(request: NsNetworkStripNewMultiple.IStripRequestApi, filters?: { [key: string]: string | undefined }):
  //   Observable<NsNetworkStripNewMultiple.INetworkStripResponseApi> {
  //   let stringifiedQueryParams = ''
  //   stringifiedQueryParams = getStringifiedQueryParams({
  //     pageNo: request.queryParams ? request.queryParams.pageNo : undefined,
  //     pageSize: request.queryParams ? request.queryParams.pageSize : undefined,
  //     pageState: request.queryParams ? request.queryParams.pageState : undefined,
  //     sourceFields: request.queryParams ? request.queryParams.sourceFields : undefined,
  //     filters: filters ? encodeURIComponent(JSON.stringify(filters)) : undefined,
  //   })
  //   let url = request.path
  //   url += stringifiedQueryParams ? `?${stringifiedQueryParams}` : ''
  //   return this.http.get<NsNetworkStripNewMultiple.INetworkStripResponseApi>(url)
  // }
  fetchNetworkUsers(req: any, url: string): Observable<any> {
    return this.http.get<any>(url, req)
  }

  createUser(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.CREATE_USER_API, request)
  }
}
