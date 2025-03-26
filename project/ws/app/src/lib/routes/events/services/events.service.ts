import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { environment } from 'src/environments/environment'

const API_END_POINTS = {
  EVENT_READ: `/apis/proxies/v8/event/v4/read`,
  GET_EVENTS: '/apis/proxies/v8/sunbirdigot/search',
  ENROLL_EVENT: '/apis/proxies/v8/event/batch/enroll',
  SAVE_EVENT_PROGRESS_UPDATE: 'apis/proxies/v8/eventprogress/v1/event/state/update',
  CONTENT_STATE_UPDATE_READ: 'apis/proxies/v8/user/event/state/read',
  CONTENT_STATE_UPDATE: (eventId: string) => `/apis/proxies/v8/event-progres/${eventId}`,
  ALL_EVENT_ENROLL_LIST: (userId: string) => `/apis/proxies/v8/v1/user/events/list/${userId}`,
  IS_ENROLLED: (userId: string, eventId: string, batchId?: string) =>
    `/apis/proxies/v8/user/event/read/${userId}?eventId=${eventId}&batchId=${batchId}`,

}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventData: any
  eventEnrollEvent = new Subject()
  constructor(private http: HttpClient) { }
  /* tslint:disable */
  getEventData(eventId: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.EVENT_READ}/${eventId}`)
  }

  getEventsList(req: any) {
    return this.http.post<any>(`${API_END_POINTS.GET_EVENTS}`, req)
  }

  getPublicUrl(url: string): string {
    const mainUrl = url.split('/content').pop() || ''
    return `${environment.contentHost}/${environment.contentBucket}/content${mainUrl}`
  }
  
  AllEventEnrollList(userId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.ALL_EVENT_ENROLL_LIST(userId)}`)
  }

  getIsEnrolled(userId: string, eventId: string, batchId?: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.IS_ENROLLED(userId, eventId, batchId)}`)
  }

  enrollEvent(req: any) {
    return this.http.post<any>(`${API_END_POINTS.ENROLL_EVENT}`, req)
  }

  contentStateUpdate(req: any) {
    return this.http.patch<any>(`${API_END_POINTS.CONTENT_STATE_UPDATE}`, req)
  }

  saveEventProgressUpdate(req: any) {
    return this.http.patch<any>(`${API_END_POINTS.SAVE_EVENT_PROGRESS_UPDATE}`, req)
  }

  eventStateRead(req:any) {
    let batchId = req.batchId
    let eventId = req.eventId
    return this.http.post<any>(`${API_END_POINTS.CONTENT_STATE_UPDATE_READ}?batchId=${batchId}&eventId=${eventId}`,req)
  }
}
