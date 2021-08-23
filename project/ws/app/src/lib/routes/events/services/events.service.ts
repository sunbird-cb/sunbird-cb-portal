import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  EVENT_READ: `/apis/proxies/v8/event/v4/read`,
  GET_EVENTS: '/apis/proxies/v8/sunbirdigot/search',
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEventData(eventId: any): Observable<any> {
      return this.http.get<any>(`${API_END_POINTS.EVENT_READ}/${eventId}`)
  }

  getEventsList(req: any) {
      return this.http.post<any>(`${API_END_POINTS.GET_EVENTS}`, req)
    }
}
