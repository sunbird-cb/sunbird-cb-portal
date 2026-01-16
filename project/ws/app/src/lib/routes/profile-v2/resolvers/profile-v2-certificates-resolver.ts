import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { WidgetUserServiceLib } from '@sunbird-cb/consumption'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Injectable()
export class Profilev2CerficatesResolve
   {
  constructor(private configSvc: ConfigurationsService,
              private userSvc: WidgetUserServiceLib) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<any> {
    const userId = this.configSvc.userProfile && this.configSvc.userProfile.userId || ''

    return this.userSvc.fetchProfileUserBatchList(userId).pipe(
      map(data =>  ({ data, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
