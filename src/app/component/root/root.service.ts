import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators'

const PROXY_CREATE_V8 = '/apis/proxies/v8'

const API_END_POINTS = {
  CREATE_USER_API: `${PROXY_CREATE_V8}/discussion/user/v1/create`,
  LANGUAGES: '/api/faq/v1/assistant/available/language',
  CONFIG: '/api/faq/v1/assistant/configs/language',
  AI_GLOBAL_SEARCH: `${PROXY_CREATE_V8}/chatbot/v3/search`,
  AI_CHAT_FEEDBACK:`${PROXY_CREATE_V8}/chatbot/v3/feedbacks/save`,
  AI_GLOBAL_INTERNET_SEARCH: `${PROXY_CREATE_V8}/chatbot/v3/global/search`,
  SUPPORT_AI_START_CHAT: `${PROXY_CREATE_V8}/support/ai/chat/start`,
  SUPPORT_AI_SEND_CHAT: `${PROXY_CREATE_V8}/support/ai/chat/send`
}

@Injectable({
  providedIn: 'root',
})

export class RootService {
  openSupportAIChatbot = new BehaviorSubject<boolean>(false)
  showNavbarDisplay$ = new BehaviorSubject<boolean>(true)
  discussionCnfig: any
  iGOTAIChatHistory:any
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
  getChatData(tabType: any): any {
    return this.http.post<any>(`${API_END_POINTS.CONFIG}`, tabType)
  }

  getLangugages(): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.LANGUAGES}`)
  }

  aiGlobalSearch(requestBody:any, chatId:any, userID:any): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.AI_GLOBAL_SEARCH}?chatID=${chatId}&userID=${userID}`, requestBody).pipe(
      catchError(error => {
        if (error.status === 502) {
          console.error('502 Bad Gateway from aiGlobalSearch');
        } else if (error.status === 500) {
          console.error('500 Internal Server Error from aiGlobalSearch');
        } else {
          console.error(`Unhandled error (${error.status}):`, error.message);
        }
        return throwError(() => error);
      })
    );
  }

  saveAIChatPositiveContentRating(requestBody:any, chatId:any, userID:any) {
    console.log('chatId=',chatId, 'userID=',userID)
    return this.http.post<any>(`${API_END_POINTS.AI_CHAT_FEEDBACK}?chatID=${chatId}&userID=${userID}`, requestBody)
  }

  shareAIFeedback(requestBody:any, chatId:any, userID:any) {
    return this.http.post<any>(`${API_END_POINTS.AI_CHAT_FEEDBACK}?chatID=${chatId}&userID=${userID}`, requestBody)
  }

  aiGlobalSearchFromInternet(requestBody:any, chatId:any, userID:any) {
    return this.http.post<any>(`${API_END_POINTS.AI_GLOBAL_INTERNET_SEARCH}?chatID=${chatId}&user_id=${userID}`, requestBody)
  }

  aiStartChathForSupport(requestBody:any, userID:any): Observable<any> {
    const headers = new HttpHeaders()
      .set('user-id', userID)
    return this.http.post<any>(`${API_END_POINTS.SUPPORT_AI_START_CHAT}`, requestBody, {
      headers
      
    })
  }

  aiSendChathForSupport(requestBody:any, userID:any): Observable<any> {
    const headers = new HttpHeaders()
      .set('user-id', userID)
    return this.http.post<any>(`${API_END_POINTS.SUPPORT_AI_SEND_CHAT}`, requestBody, {
      headers
      
    })
  }
}
