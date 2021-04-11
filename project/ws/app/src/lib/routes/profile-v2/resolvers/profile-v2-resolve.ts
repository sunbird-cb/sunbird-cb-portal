import { Injectable, SkipSelf } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { } from '@sunbird-cb/collection'
import { IResolveResponse, ConfigurationsService } from '@sunbird-cb/utils'
import { ProfileV2Service } from '../services/profile-v2.servive'
import { NSProfileDataV2 } from '../models/profile-v2.model'

@Injectable()
export class Profilev2Resolve
  implements
  Resolve<Observable<IResolveResponse<NSProfileDataV2.IProfile>> | IResolveResponse<NSProfileDataV2.IProfile>> {
  constructor(private profileV2Svc: ProfileV2Service, @SkipSelf() private configSvc: ConfigurationsService) { }

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
        
         _route.data.subscribe((data: any) => {
          userId = data.profileData.data.userId || ''
        })
      }
    } else {
      
      _route.data.subscribe((data: any) => {
        userId = data.profileData.data.userId || ''
      })
    }
    return this.profileV2Svc.fetchProfile(userId).pipe(
      map(data =>  ({ data: data.result.UserProfile, error: null })),
      catchError(error => of({ error, data: null })),
    )
  }
}
