import { Injectable } from '@angular/core'
import { HttpBackend, HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_END_POINTS = {
  EVENT_READ: `/api/event/v4/read`,
  GET_EVENTS: '/api/composite/v1/search',
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
    private newHttp: HttpClient
    private newHttp1: HttpClient
    constructor(handler: HttpBackend, handler1: HttpBackend) {
        this.newHttp = new HttpClient(handler)
        this.newHttp1 = new HttpClient(handler1)
    }

    getEventData(eventId: any): Observable<any> {
        const options = {
        headers: {
            // tslint:disable-next-line:max-line-length
            Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJRekw4VVA1dUtqUFdaZVpMd1ZtTFJvNHdqWTg2a2FrcSJ9.TPjV0xLacSbp3FbJ7XeqHoKFN35Rl4YHx3DZNN9pm0o',
        },
        }
        return this.newHttp.get<any>(`${API_END_POINTS.EVENT_READ}/${eventId}`, options)
    }

    getEventsList(req: any) {
        const options = {
          headers: {
            // tslint:disable-next-line:max-line-length
            Authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJRekw4VVA1dUtqUFdaZVpMd1ZtTFJvNHdqWTg2a2FrcSJ9.TPjV0xLacSbp3FbJ7XeqHoKFN35Rl4YHx3DZNN9pm0o',
          },
        }
        return this.newHttp1.post<any>(`${API_END_POINTS.GET_EVENTS}`, req, options)
      }
}
