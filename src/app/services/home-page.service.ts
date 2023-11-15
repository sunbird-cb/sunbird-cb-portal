import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

const API_END_POINTS = {
  INSIGHTS: `apis/proxies/v8/read/user/insights`
}

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  
  constructor(private http: HttpClient) { }

  getInsightsData(payload:any){
    const result = this.http.post(API_END_POINTS.INSIGHTS,  payload)
    return result
  }
}
