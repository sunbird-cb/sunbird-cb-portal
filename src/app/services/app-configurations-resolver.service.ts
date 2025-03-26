import { Injectable  } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'

@Injectable()
export class AppConfigurationsResolverService implements Resolve<Observable<any>> {

  constructor(private configSvc: ConfigurationsService) { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {

    const result: IResolveResponse<any> = {
      data: this.configSvc,
      error: null,
    }
    return of(result)
  }
}
