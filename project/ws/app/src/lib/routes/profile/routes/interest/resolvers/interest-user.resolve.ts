import { Injectable } from '@angular/core'


import { Observable, of } from 'rxjs'
import { InterestService } from '../services/interest.service'
import { map, catchError } from 'rxjs/operators'
import { IResolveResponse } from '@sunbird-cb/utils-v2'

@Injectable()
export class InterestUserResolve
   {
  constructor(private interestSvc: InterestService) {}

  resolve(): Observable<IResolveResponse<string[]>> | IResolveResponse<string[]> {
    return this.interestSvc.fetchUserInterestsV2().pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
