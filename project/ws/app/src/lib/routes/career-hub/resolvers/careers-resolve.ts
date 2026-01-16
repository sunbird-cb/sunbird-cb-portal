import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
import { IResolveResponse } from '@sunbird-cb/utils-v2'
import { DiscussService } from '../../discuss/services/discuss.service'
import { NSDiscussData } from '../../discuss/models/discuss.model'

@Injectable()
export class CareerRecentResolve
   {
  constructor(private discussionSvc: DiscussService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NSDiscussData.ICategoryData>> {
    const categoryId = _route.data['careersCategoryId'] || 1
    return this.discussionSvc.fetchSingleCategoryDetails(categoryId).pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
