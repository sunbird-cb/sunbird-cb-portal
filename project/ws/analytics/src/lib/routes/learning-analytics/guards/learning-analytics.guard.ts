import { Injectable } from '@angular/core'
import { CanActivate, UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { ValueService } from '@sunbird-cb/utils-v2'

@Injectable({
  providedIn: 'root',
})
export class LearningAnalyticsGuard implements CanActivate {
  isLtMedium$ = this.valueSvc.isLtMedium$
  screenSizeIsLtMedium = false
  constructor(
    private valueSvc: ValueService,
    private router: Router,
  ) {
  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.isLtMedium$.subscribe((isLtMedium: boolean) => {
      this.screenSizeIsLtMedium = isLtMedium
    })
    if (!this.screenSizeIsLtMedium) {
      return true
    }
    return this.router.parseUrl('/analytics')
  }

}
