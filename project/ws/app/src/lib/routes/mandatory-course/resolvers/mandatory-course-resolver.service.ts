import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { WidgetUserService } from '@sunbird-cb/collection'
import { IResolveResponse, ConfigurationsService } from '@sunbird-cb/utils'
@Injectable({
  providedIn: 'root',
})

export class MandatoryCourseResolverService implements
  Resolve<Observable<IResolveResponse<any>> |
  IResolveResponse<any>> {
    constructor(
      private configSvc: ConfigurationsService,
      private userSvc: WidgetUserService,
    ) {

    }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<any>> {
    let userId = ''
    if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId
    }
    return this.userSvc.fetchUserBatchList(userId).pipe(
      map((data: any) => ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
