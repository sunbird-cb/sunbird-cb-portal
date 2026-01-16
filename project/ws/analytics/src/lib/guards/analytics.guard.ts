import { Injectable } from '@angular/core'
import { UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Injectable({
  providedIn: 'root',
})
export class AnalyticsGuard  {
  constructor(
    private configSvc: ConfigurationsService,
    private router: Router,
  ) {
  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.configSvc.userRoles && (this.configSvc.userRoles.has('analytics') || this.configSvc.userRoles.has('admin'))) {
      return true
    }
    return this.router.parseUrl('/page/home')
  }

}
