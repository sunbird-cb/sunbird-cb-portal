import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const API_END_POINTS = {
  FORM_READ: `/apis/v1/form/read`,
}
@Injectable({
  providedIn: 'root'
})
export class FormExtService {

  constructor(
    private http: HttpClient
  ) {

  }

  formReadData(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.FORM_READ, request)
  }
}
