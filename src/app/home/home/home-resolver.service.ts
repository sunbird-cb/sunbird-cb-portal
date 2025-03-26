import { Injectable } from '@angular/core'
import { Resolve, Router } from '@angular/router'
// import { Observable, of } from 'rxjs';
// import { catchError } from 'rxjs/operators';
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Injectable({
  providedIn: 'root',
})
export class HomeResolverService implements Resolve<any> {
  constructor(private configSvc: ConfigurationsService,  private router: Router) {}
  resolve(): any {
    let isNotMyUser = false
    let isIgotOrg = false
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.profileStatus) {
      isNotMyUser = this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() === 'not-my-user' ? true : false
    }
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName) {
        isIgotOrg = this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName.toLowerCase() === 'igot' ? true : false
    }
    if (isNotMyUser && isIgotOrg) {
        this.router.navigateByUrl('app/person-profile/me#profileInfo')
    }
    return true
  }
}
