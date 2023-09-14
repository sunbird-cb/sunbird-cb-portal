import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
import { BehaviorSubject } from 'rxjs'
// tslint:enable

const API_END_POINTS = {
    readFeed: (id: string) => `/apis/proxies/v8/user/v1/feed/${id}`,
    getFormID: (id: string) => `/apis/proxies/v8/forms/getFormById?id=${id}`,
    submitForm: `/apis/proxies/v8/forms/v1/saveFormSubmit`,
}

@Injectable()
export class NPSGridService {
  private telemetryEvents = new BehaviorSubject(false)
  updateTelemetryDataObservable = this.telemetryEvents.asObservable()

  constructor(private http: HttpClient) { }

  updateTelemetryData(state: boolean) {
    console.log('state', state)
    this.telemetryEvents.next(state)
  }

  getFeedStatus(id: any) {
    return this.http.get<any>(API_END_POINTS.readFeed(id))
  }

  getFormData(formid: any) {
    return this.http.get<any>(API_END_POINTS.getFormID(formid))
  }
  submitNPS(req: any) {
    return this.http.post<any>(API_END_POINTS.submitForm, req)
  }
}
