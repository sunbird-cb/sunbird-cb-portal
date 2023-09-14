import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

const PROXY_CREATE_V8 = '/apis/proxies/v8'

const API_END_POINTS = {
  CREATE_USER_API: `${PROXY_CREATE_V8}/discussion/user/v1/create`,
  LANGUAGES: '/api/faq/v1/assistant/available/language',
  CONFIG: '/api/faq/v1/assistant/configs/language',
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
  getCookie(name: string) {
    const ca: string[] = document.cookie.split(';')
    const caLen: number = ca.length
    const cookieName = `${name}=`
    let c: string

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '')
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length)
      }
    }
    return ''
  }
  deleteCookie(name: string) {
    this.setCookie(name, '', -1)
  }

  setCookie(name: string, value: string, expireDays: number, path: string = '') {
    const d = new Date()
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000)
    const expires = `expires=${d.toUTCString()}`
    const cpath = path ? `; path=${path}` : ''
    document.cookie = `${name}=${value}; ${expires}${cpath}`
  }
  getChatData(tabType:any): any {
    return this.http.post<any>(`${API_END_POINTS.CONFIG}`,tabType)
  }

  getLangugages(): Observable<any>{
    return this.http.get<any>(`${API_END_POINTS.LANGUAGES}`)
  }
}
