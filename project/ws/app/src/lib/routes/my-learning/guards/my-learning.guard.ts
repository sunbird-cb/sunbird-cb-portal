import { Injectable } from '@angular/core'
import { Router, UrlTree } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class LearningGuard  {
  constructor(private configSvc: ConfigurationsService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.configSvc && this.configSvc.restrictedFeatures && !this.configSvc.restrictedFeatures.has('my-learning')) {
      return true
    }
    return this.router.parseUrl('/page/home')
  }
}
