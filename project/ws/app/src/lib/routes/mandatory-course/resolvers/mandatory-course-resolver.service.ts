import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { WidgetUserServiceLib } from '@sunbird-cb/consumption'
import { IResolveResponse, ConfigurationsService } from '@sunbird-cb/utils-v2'
@Injectable({
  providedIn: 'root',
})

export class MandatoryCourseResolverService  {
    constructor(
      private configSvc: ConfigurationsService,
      private userSvc: WidgetUserServiceLib,
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
