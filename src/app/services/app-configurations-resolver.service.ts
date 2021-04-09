import { Injectable, SkipSelf } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils'

@Injectable()
export class AppConfigurationsResolverService implements Resolve<Observable<any>> {

  constructor(@SkipSelf() private configSvc: ConfigurationsService) { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {

    const result: IResolveResponse<any> = {
      data: this.configSvc,
      error: null,
    }
    return of(result)
  }
}

