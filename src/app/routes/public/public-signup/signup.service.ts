import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const API_END_POINTS = {
  GET_DEPARTMENTS: `/api/user/registration/v1/getDeptDetails`,
  REGISTER: `/api/user/registration/v1/register`,
}

@Injectable({
  providedIn: 'root',
})
export class SignupService {

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.GET_DEPARTMENTS)
  }

  register(req: any) {
    return this.http.post<any>(
      API_END_POINTS.REGISTER, req
    )
  }
}