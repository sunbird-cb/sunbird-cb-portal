import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of, Subject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { FormExtService } from '../../../../../../../../src/app/services/form-ext.service'
import { catchError, map } from 'rxjs/operators'
const API_END_POINTS = {
  EVENT_READ: `/apis/proxies/v8/event/v4/read`,
  GET_EVENTS: '/apis/proxies/v8/sunbirdigot/search',
  ENROLL_EVENT: '/apis/proxies/v8/event/batch/enroll',
  SAVE_EVENT_PROGRESS_UPDATE: 'apis/proxies/v8/eventprogress/v1/event/state/update',
  CONTENT_STATE_UPDATE_READ: 'apis/proxies/v8/user/event/state/read',
  ENROLL_SUMMARY: 'apis/proxies/v8/user/events/enroll/summary',
  CONTENT_STATE_UPDATE: (eventId: string) => `/apis/proxies/v8/event-progres/${eventId}`,
  ALL_EVENT_ENROLL_LIST: (userId: string) => `/apis/proxies/v8/v1/user/events/list/${userId}`,
  IS_ENROLLED: (userId: string, eventId: string, batchId?: string) =>
    `/apis/proxies/v8/user/event/read/${userId}?eventId=${eventId}&batchId=${batchId}`,
  USER_ALL_ENROLL_EVENT_LIST: (userId: string) => `/apis/proxies/v8/user/events/v2/list/${userId}`,
  TRENDING: `/apis/proxies/v8/user/mdo/trending/events`,
  FEATURED: `/apis/proxies/v8/user/featured/events`,
  MY_EVENTS: (userId: string) =>
    `/apis/proxies/v8/user/events/list/${userId}`,
  CONTENT_READ: (contentId: any) => `/apis/proxies/v8/action/content/v3/read/${contentId}`,
  ENROLL_CONTENT_DATA: (userId: string,) => `/apis/proxies/v8/learner/course/v4/user/enrollment/details/${userId}`,
  GET_USER_ENROLL_COUNT: `/apis/proxies/v8/course/v1/batch/getParticipants`
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventData: any
  eventEnrollEvent = new Subject()
  constructor(private http: HttpClient, private formSvc: FormExtService) { }
  getKeySpeakerConfig: any = null
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

  getUserEnrollEvents(userId: string, req: any) {
    return this.http.post<any>(`${API_END_POINTS.USER_ALL_ENROLL_EVENT_LIST(userId)}`, req)
  }

  myEvents(userId: string, req: any) {
    return this.http.post<any>(`${API_END_POINTS.MY_EVENTS(userId)}`, req)
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

  eventStateRead(req: any) {
    let batchId = req.batchId
    let eventId = req.eventId
    return this.http.post<any>(`${API_END_POINTS.CONTENT_STATE_UPDATE_READ}?batchId=${batchId}&eventId=${eventId}`, req)
  }

  getEventEngagements() {
    return this.http.get<any>(`${API_END_POINTS.ENROLL_SUMMARY}`)
  }

  getTrendingEvents() {
    return this.http.get<any>(`${API_END_POINTS.TRENDING}`)
  }

  getFeaturedEvents() {
    return this.http.get<any>(`${API_END_POINTS.FEATURED}`)
  }

  async getKeySpeakerJson(): Promise<any> {
    if (!this.getKeySpeakerConfig) {
      this.getKeySpeakerConfig = {}
      const requestData: any = {
        'request': {
          'type': 'page',
          'subType': 'events',
          'action': 'page-configuration',
          'component': 'portal',
          'rootOrgId': '*',
        },
      }
      this.getKeySpeakerConfig = await this.formSvc.homeFormReadData(requestData).toPromise()
    }
    return of(this.getKeySpeakerConfig).toPromise()
  }

  getContentData(contentId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.CONTENT_READ(contentId)}`)
  }

  getCourseEnrollData(userId: string, request: any): Observable<{ data: any; error: any }> {
    return this.http.post(API_END_POINTS.ENROLL_CONTENT_DATA(userId), request).pipe(
      map((rData: any) => {
        const result = rData?.result ?? null
        return { data: result, error: null }
      }),
      catchError((error: any) => {
        return of({ data: null, error })
      })
    )
  }

  getUserEnrollCount(requestBody: any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.GET_USER_ENROLL_COUNT}`, requestBody)
  }
}
