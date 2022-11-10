import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Subject, Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'

const API_ENDPOINTS = {
  SEARCH_V6: `/apis/proxies/v8/sunbirdigot/search`,
  CONTENT_HIRARCHY: `/apis/proxies/v8/action/content/v3/hierarchy`,
}

@Injectable({
  providedIn: 'root',
})
export class CuratedCollectionService {
  private removeFilter = new Subject<any>()
  private displayLoader$: Subject<boolean> = new BehaviorSubject<boolean>(false)
  /**
   * Observable string streams
   */
  notifyObservable$ = this.removeFilter.asObservable()
  constructor(private http: HttpClient) { }

  public isLoading(): Observable<boolean> {
    return this.displayLoader$
  }

  fetchSearchData(request: any): Observable<any> {
    this.displayLoader$.next(true)
    return this.http.post<any>(API_ENDPOINTS.SEARCH_V6, request)
      .pipe(finalize(() => this.displayLoader$.next(false)))
  }

  // fetchAllCuratedCollection(_request: any): Observable<any> {
  //   this.displayLoader$.next(true)
  //   return this.http.get<any>(API_ENDPOINTS.ALL_CURATED_COLLECTION)
  //     .pipe(finalize(() => this.displayLoader$.next(false)))
  // }

  fetchContent(id: string, type: string) {
    this.displayLoader$.next(true)
    return this.http.get<any>(`${API_ENDPOINTS.CONTENT_HIRARCHY}/${id}?mode=${type}`)
      .pipe(finalize(() => this.displayLoader$.next(false)))
  }

  public notifyOther(data: any) {
    if (data) {
      this.removeFilter.next(data)
    }
  }
}
