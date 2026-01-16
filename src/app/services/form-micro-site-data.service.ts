import { Injectable } from '@angular/core'
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { FormExtService } from './form-ext.service'

@Injectable({
  providedIn: 'root'
})
export class FormMicroSiteDataService implements Resolve<any> {

  constructor(
    public configSvc: ConfigurationsService,
    private formSvc: FormExtService,
    private router: Router
  ) { }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<any> | Promise<any> | UrlTree | any {
    const userRootOrg = this.configSvc?.userProfile?.userRootOrg || {}
    const reqBody = {
      request: {
        action: 'page-configuration',
        component: 'portal',
        rootOrgId: '',
        subType: 'microsite-v3',
        type: 'MDO-channel',
      },
    }
    if (userRootOrg && Object.keys(userRootOrg).length > 0) {
      if (userRootOrg?.ministryOrStateType?.toLowerCase() === 'ministry' ||
        userRootOrg?.ministryOrStateType?.toLowerCase() === 'state') {
        reqBody.request.rootOrgId = userRootOrg.ministryOrStateId
      } else if (userRootOrg?.ministryOrStateType?.toLowerCase() === 'spv') {
        reqBody.request.rootOrgId = userRootOrg.rootOrgId
      }
    }

    // Check localStorage first for existing redirection data
    const localData: any = JSON.parse(localStorage.getItem('microSiteRedirectionData') || '{}')

    if (localData && Object.keys(localData).length > 0 && localData?.enabled === true) {
      const redirectUrl = `/app/learn/mdo-channels/${localData.channelName}/${localData.orgId}/v3/micro-sites`
      // Set enabled to false to prevent redirect on next visit
      localData.enabled = false
      localStorage.setItem('microSiteRedirectionData', JSON.stringify(localData))

      // Use setTimeout to ensure localStorage is updated before navigation
      setTimeout(() => {
        this.router.navigateByUrl(redirectUrl)
      }, 0)
      return false
    }

    // If we have cached data (even with enabled: false), don't call API again
    if (localData && Object.keys(localData).length > 0) {
      return { data: localData, error: null }
    }

    // If rootOrgId is empty, don't call API
    if (!reqBody.request.rootOrgId || reqBody.request.rootOrgId.trim() === '') {
      localStorage.removeItem('microSiteRedirectionData')
      return { data: null, error: 'Root Organization ID is required' }
    }

    // Otherwise, fetch from API
    return this.formSvc.formReadData(reqBody).pipe(
      map((rData: any) => {
        const finalData = rData && rData.result.form.data
        if (finalData?.userRedirectionData?.enabled === true) {
          // Store the data with enabled set to false before navigating
          const redirectionData = { ...finalData.userRedirectionData, enabled: false }
          localStorage.setItem('microSiteRedirectionData', JSON.stringify(redirectionData))
          const redirectUrl = `/app/learn/mdo-channels/${finalData.userRedirectionData.channelName}/${finalData.userRedirectionData.orgId}/v3/micro-sites`

          // Use setTimeout to ensure localStorage is updated before navigation
          setTimeout(() => {
            this.router.navigateByUrl(redirectUrl)
          }, 0)
          return false
        } else {
          localStorage.removeItem('microSiteRedirectionData')
          return { data: finalData?.userRedirectionData, error: null }
        }
      }),
      catchError((_error: any) => {
        localStorage.setItem('microSiteRedirectionData', JSON.stringify({ enabled: false }))
        return of({ data: null, error: _error })
      })
    )
  }
}
