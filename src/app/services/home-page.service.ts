import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

const API_END_POINTS = {
  INSIGHTS: `apis/proxies/v8/read/user/insights`,
  DISCUSSIONS: `apis/proxies/v8/discussion/recent`,
  NETWORK: `apis/protected/v8/connections/v2/connections/recommended`,
  CONNECT: `apis/protected/v8/connections/v2/add/connection`,
  CONN_REQUESTED: `apis/protected/v8/connections/v2/connections/requests/received`
}

@Injectable({
  providedIn: 'root'
})

export class HomePageService {
  
  constructor(private http: HttpClient) { }

  getInsightsData(payload:any){
    const result = this.http.post(API_END_POINTS.INSIGHTS, payload)
    return result
  }

  getDiscussionsData() {
    return this.http.get(API_END_POINTS.DISCUSSIONS);
  }

  getNetworkRecommendations(payload: any): any {
    return this.http.post(API_END_POINTS.NETWORK, payload);
  }

  connectToNetwork(payload: any): any {
    return this.http.post(API_END_POINTS.CONNECT, payload);
  }

  getRecentRequests(): any {
    return this.http.get(API_END_POINTS.CONN_REQUESTED);
  }
}
