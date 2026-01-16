import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils-v2';
import { Observable, of } from 'rxjs';
import { NSProfileDataV2 } from '../../models/profile-v2.model';
import { ProfileV2RevampService } from '../../services/profile-v2-revamp.service';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class profileResolver
   {
  constructor(private profileSvc: ProfileV2RevampService, private configSvc: ConfigurationsService) { }

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<IResolveResponse<NSProfileDataV2.IProfile>> {
    const path = _route.routeConfig && _route.routeConfig.path
    let userId = ''
    if (path !== 'me') {
      userId = _route.params.userId
      if (!userId) {
        userId = _route.queryParams.userId
      }
      if (!userId) {
        userId = this.configSvc.userProfile && this.configSvc.userProfile.userId || ''
      }
    } else {
      userId = this.configSvc.userProfile && this.configSvc.userProfile.userId || ''
    }
    const isNotCurrentUser = userId !== _.get(this.configSvc, 'userProfile.userId')
    return this.profileSvc.fetchProfile(userId, isNotCurrentUser).pipe(
      map(data =>  ({
         data: _.get(data, 'result.response'), 
         error: null,
         userId
        })),
      catchError(error => of({ error, data: null })),
    )
  }
}
