import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const PROXY_CREATE_V8 = '/apis/proxies/v8'

const API_END_POINTS = {
  CREATE_USER_API: `${PROXY_CREATE_V8}/discussion/user/v1/create`,
}

@Injectable({
  providedIn: 'root',
})

export class RootService {

  showNavbarDisplay$ = new BehaviorSubject<boolean>(true)
  discussionCnfig: any

  constructor(
    private http: HttpClient,
  ) { }

  createUser(request: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.CREATE_USER_API, request)
  }

  setDiscussionConfig(config: any) {
    this.discussionCnfig = config
  }
}
