import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const API_END_POINTS = {
  positionCreate: `/v1/position/workflow/create`,
  orgCreate: `/v1/org/workflow/create`,
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
    constructor(private http: HttpClient) { }

    createPosition(reqObj: any): Observable<any> {
        return this.http.post<any>(API_END_POINTS.positionCreate, reqObj)
    }

    createOrg(reqObj: any): Observable<any> {
        return this.http.post<any>(API_END_POINTS.orgCreate, reqObj)
    }
}
