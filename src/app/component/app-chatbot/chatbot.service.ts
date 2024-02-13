import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {

  LANGUAGES = '/api/faq/v1/assistant/available/language'
  CONFIG = '/api/faq/v1/assistant/configs/language'

  constructor(private http: HttpClient) {}

  getLangugages(): Observable<any> {
    return this.http.get<any>(`${this.LANGUAGES}`)
  }

  getChatData(tabType: any): any {
    return this.http.post<any>(`${this.CONFIG}`, tabType)
  }
}
