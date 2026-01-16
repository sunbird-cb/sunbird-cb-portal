import { Injectable } from '@angular/core'

import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { IBadgeResponse } from './badges.model'
import { BadgesService } from './badges.service'

@Injectable()
export class BadgesResolver2
   {
  constructor(private badgesSvc: BadgesService) { }

  resolve(): Observable<IResolveResponse<IBadgeResponse>> | IResolveResponse<IBadgeResponse> {
    return this.badgesSvc.fetchBadges().pipe(
      map(data => ({ data, error: null })),
      catchError(() => of({ data: null, error: null })),
    )
  }
}
