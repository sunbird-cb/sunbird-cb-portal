import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { BtnGoalsService, NsGoal } from '@sunbird-cb/collection'
import { IResolveResponse } from '@sunbird-cb/utils-v2'

@Injectable()
export class GoalsOthersResolve
  implements
    Resolve<Observable<IResolveResponse<NsGoal.IGoal[]>> | IResolveResponse<NsGoal.IGoal[]>> {
  constructor(private goalSvc: BtnGoalsService) {}

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NsGoal.IGoal[]>> {
    return this.goalSvc.getOthersGoals('isInIntranet').pipe(
      map(data => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
