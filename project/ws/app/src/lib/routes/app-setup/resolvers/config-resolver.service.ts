import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { EMPTY, Observable } from 'rxjs'
import { NsInstanceConfig } from '@sunbird-cb/utils-v2'

@Injectable()
export class ConfigurationsService111  {

  constructor() { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> {

    // const result: IResolveResponse<NsInstanceConfig.IConfig> = {
    //   data: this.configSvc.instanceConfig,
    //   error: null,
    // }
    // return of(result)
    return EMPTY
  }
}
