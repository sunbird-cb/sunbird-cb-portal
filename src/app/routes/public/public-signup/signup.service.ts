import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const API_END_POINTS = {
  // GET_DEPARTMENTS: `/api/user/registration/v1/getDeptDetails`,
  REGISTER: `/api/user/registration/v1/register`,
  GET_ALL_STATES: '/apis/public/v8/org/v1/list',
  GET_DEPARTMENTS_OF_STATE: '/apis/public/v8/org/v1/list',
  GET_ORGS_OF_DEPT: '/apis/public/v8/org/v1/list',
  GET_POSITIONS: '/apis/proxies/v8/user/v1/positions',
}

@Injectable({
  providedIn: 'root',
})
export class SignupService {

  constructor(private http: HttpClient) { }

  // getDepartments(): Observable<any> {
  //   return this.http.get<any>(API_END_POINTS.GET_DEPARTMENTS)
  // }

  register(req: any) {
    return this.http.post<any>(
      API_END_POINTS.REGISTER, req
    )
  }

  getStatesOrMinisteries(type: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ALL_STATES}/${type}`)
  }
  getDeparmentsOfState(stateId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_DEPARTMENTS_OF_STATE}/${stateId}`)
  }
  getOrgsOfDepartment(deptId: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.GET_ORGS_OF_DEPT}/${deptId}`)
  }
  getPositions(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_POSITIONS)
  }
}
