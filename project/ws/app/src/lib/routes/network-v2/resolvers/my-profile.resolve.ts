import { Injectable  } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of, EMPTY } from 'rxjs'
import { } from '@sunbird-cb/collection'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Injectable()
export class MyProfileResolve
    implements
    Resolve<any> {
    constructor(private configSvc: ConfigurationsService) { }
    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot,
    ): Observable<any> {
        if (!this.configSvc.userProfile && !this.configSvc.userProfileV2) {
            return EMPTY
        }
        const combinedProfile = {
            ...this.configSvc.userProfile,
        }
        return of(combinedProfile)
    }
}
