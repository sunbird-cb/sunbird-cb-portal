  import { Injectable } from '@angular/core'
  import { Observable } from 'rxjs'
  import { HttpClient } from '@angular/common/http'
  
  const API_END_POINTS = {
    REGISTER: `/apis/proxies/v8/user/basicProfileUpdate`,
    GET_ALL_STATES: '/apis/public/v8/org/v1/list',
    GET_DEPARTMENTS_OF_STATE: '/apis/public/v8/org/v1/list',
    GET_ORGS_OF_DEPT: '/apis/public/v8/org/v1/list',
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class WelcomeUsersService {
  
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
  
  }
  