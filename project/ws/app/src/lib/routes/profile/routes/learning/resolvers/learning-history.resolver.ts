import { Injectable } from '@angular/core'

import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { NSLearningHistory } from '../models/learning.models'
import { LearningHistoryService } from '../services/learning-history.service'

@Injectable()
export class LearningHistoryResolver
   {
  constructor(private learnHistorySvc: LearningHistoryService) {}
  pageState = ''
  pageSize = 10
  status = 'inprogress'
  contentType = 'Learning path'

  resolve():
    | Observable<IResolveResponse<NSLearningHistory.ILearningHistory>>
    | IResolveResponse<NSLearningHistory.ILearningHistory> {
    return this.learnHistorySvc
      .fetchContentProgress(this.pageState, this.pageSize, this.status, this.contentType)
      .pipe(
        map(data => ({ data, error: null })),
        catchError(() => of({ data: null, error: null })),
      )
  }
}
