import { Injectable  } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils-v2'

@Injectable()
export class RestrictedFeaturesResolverService implements Resolve<Observable<any>> {

  constructor(private configSvc: ConfigurationsService) { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {

    const result: IResolveResponse<any> = {
      data: this.configSvc.restrictedFeatures,
      error: null,
    }
    return of(result)
  }
}
