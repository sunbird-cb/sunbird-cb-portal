import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router'
import { AuthKeycloakService, ConfigurationsService } from '@sunbird-cb/utils-v2' // AuthKeycloakService
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class EmptyRouteGuard  {
  constructor(
    private router: Router,
    private configSvc: ConfigurationsService,
    private authSvc: AuthKeycloakService,
    private activateRoute: ActivatedRoute
  ) { }
  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.configSvc.userProfile && this.configSvc.userProfile.userId) {
      return this.router.parseUrl('/page/home')
    }
    // this.router.parseUrl('/page/home')
    if (this.configSvc.isAuthenticated) {
      // logger.log('Redirecting to application home page');
      return this.router.parseUrl('/page/home')
    }
    // logger.log('redirecting to login page as the user is not loggedIn');
    // return this.router.parseUrl('/login')
    const paramsMap = this.activateRoute.snapshot.queryParamMap
    let redirectUrl
    if (paramsMap.has('redirect_uri')) {
      redirectUrl =
        //  document.baseURI +
        `${paramsMap.get('redirect_uri')}`
    }
    // else {
    //   redirectUrl = document.baseURI
    // }
    Promise.resolve(this.authSvc.loginV2('S', redirectUrl))
    // return false
    // return this.router.parseUrl('/page/home')
    // Promise.resolve()
    return false
  }
}
