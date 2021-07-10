import { Injectable, LOCALE_ID, Inject } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AppInterceptorService implements HttpInterceptor {
  constructor(
    private configSvc: ConfigurationsService,
    @Inject(LOCALE_ID) private locale: string,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lang = [this.locale.replace('en-US', 'en')]
    if (this.configSvc.userPreference) {
      (this.configSvc.userPreference.selectedLangGroup || '')
        .split(',')
        .map(u => u.trim())
        .filter(u => u.length)
        .forEach(locale => {
          if (!lang.includes(locale)) {
            lang.push(locale)
          }
        })
    }

    if (this.configSvc.activeOrg && this.configSvc.rootOrg) {
      const modifiedReq = req.clone({
        setHeaders: {
          Authorization: '',
          org: this.configSvc.activeOrg,
          rootOrg: this.configSvc.rootOrg,
          locale: lang.join(','),
          wid: (this.configSvc.userProfile && this.configSvc.userProfile.userId) ||  '',
          hostPath: this.configSvc.hostPath,
        },
      })
      return next.handle(modifiedReq).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 419:      // login
                  window.location.href = error.error.redirectUrl // 'http://localhost:3003/protected/v8/user/resource/'
                  break
            }
          }
          return throwError('error')
        })
      )
    }
    return next.handle(req)
  }
}
