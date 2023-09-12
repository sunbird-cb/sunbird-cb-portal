import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// import { map } from 'rxjs/operators'
// tslint:disable
import _ from 'lodash'
import { BehaviorSubject } from 'rxjs'
// tslint:enable

const API_END_POINTS = {
    readFeed: (id: string) => `/api/user/v1/feed/${id}`,
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
}
