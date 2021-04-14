import { Injectable  } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { IResolveResponse } from '@sunbird-cb/utils'
// import { NsInstanceConfig, ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils'

@Injectable()
export class ConfigResolverService implements Resolve<Observable<any>> {

  constructor(private configSvc: any) { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {

    const result: IResolveResponse<any> = {
      data: this.configSvc.instanceConfig,
      error: null,
    }
    return of(result)
  }
}
