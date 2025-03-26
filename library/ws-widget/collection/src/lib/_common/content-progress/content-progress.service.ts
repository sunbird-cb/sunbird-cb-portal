import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, ReplaySubject } from 'rxjs'
import { map } from 'rxjs/operators'

// TODO: move this in some common place
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  PROGRESS_HASH: `${PROTECTED_SLAG_V8}/user/progress`,
}

@Injectable({
  providedIn: 'root',
})
export class ContentProgressService {

  private progressHashSubject: ReplaySubject<{ [id: string]: number, [batch: number]: number }> = new ReplaySubject(1)
  private progressHash: { [id: string]: number, [batch: number]: number } | null = null
  private isFetchingProgress = false

  constructor(
    private http: HttpClient,
  ) { }

  getProgressFor(id: string, batch: number, userId: string): Observable<number> {
    if (this.shouldFetchProgress) {
      this.fetchProgressHash(id, batch, userId)
    }
    return this.progressHashSubject.pipe(map(hash => hash[id]))
  }

  getProgressHash(contentId: string, batch: string | number, userId: string): Observable<{ [id: string]: number }> {
    if (this.shouldFetchProgress) {
      this.fetchProgressHash(contentId, batch, userId)
    }
    return this.progressHashSubject
  }
  private fetchProgressHash(contentId: string, batch: string | number, userId: string) {
    this.isFetchingProgress = true

    this.http.post<{ [id: string]: number, [batch: number]: number }>(`apis/proxies/v8/read/content-progres/${contentId}`, {
      request:
      {
        userId,
        batchId: batch,
        courseId: contentId,
        contentIds: [],
        fields: ['progressdetails'],
      },
    }).subscribe(data => {
      // this.http.get<{ [id: string]: number }>(API_END_POINTS.PROGRESS_HASH).subscribe(data => {
      this.progressHash = data
      this.isFetchingProgress = false
      this.progressHashSubject.next(data)
    })
  }
  private get shouldFetchProgress(): boolean {
    // return Boolean(this.progressHash === null && !this.isFetchingProgress)
    return Boolean(!this.isFetchingProgress)
  }

  fetchProgressHashContentsId(
    contentIds: any,
  ): Observable<any> {
    const url = API_END_POINTS.PROGRESS_HASH
    return this.http.post<any>(url, contentIds)
  }

  updateProgressHash(progressdata: any) {
    if (this.progressHash) {
      Object.keys(progressdata).forEach((id: string) => {
        if (this.progressHash && progressdata[id].new_progress) {
          this.progressHash[id] = progressdata[id].new_progress
        }
      })
      this.progressHashSubject.next(this.progressHash)
    }
  }
}
