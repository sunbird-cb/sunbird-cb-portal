import { Injectable  } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable, of } from 'rxjs'
import { ConfigurationsService, IResolveResponse } from '@sunbird-cb/utils-v2'

@Injectable()
export class AppConfigurationsService  {

  constructor(private configSvc: ConfigurationsService) { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {

    const result: IResolveResponse<any> = {
      data: this.configSvc,
      error: null,
    }
    return of(result)
  }
}
