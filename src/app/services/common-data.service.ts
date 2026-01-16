import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { ProfileVerificationDialogComponent } from '../profile-verification-dialog/profile-verification-dialog.component';
import { UserProfileService } from '@ws/app/src/lib/routes/user-profile/services/user-profile.service';
import { MatLegacyDialog as MatDialog  } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarConfig as MatSnackBarConfig } from '@angular/material/legacy-snack-bar'
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class CommonDataService {

  configSuccess: MatSnackBarConfig = {
    panelClass: 'style-success',
    duration: 20000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  }
  rootOrgId = ''
  constructor(
    private router:Router,
    private configSvc: ConfigurationsService,
    private userProfileService: UserProfileService,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {

    if (this.configSvc && this.configSvc.unMappedUser) {
      this.rootOrgId = this.configSvc.unMappedUser.rootOrgId || ''
    }
   }
   redirectToCustomProfile() {
      this.router.navigate(['/app/person-profile/me'], { fragment: 'orgDetails' })
    }
    mandatoryDetails() {
      let unMappedUser = this.configSvc.unMappedUser
      let userProfileUpdateDate= unMappedUser && unMappedUser.profileDetails && unMappedUser.profileDetails.personalDetails &&  unMappedUser.profileDetails.personalDetails?.lastProfileVerificationPromptDate ? Number(unMappedUser.profileDetails.personalDetails.lastProfileVerificationPromptDate) : null
      // Difference in milliseconds
      const currentEpochTime = new Date().getTime();
      let diffMs = 0
      if(userProfileUpdateDate !== null) {
       diffMs = Math.abs(currentEpochTime - userProfileUpdateDate);
      }
      // Convert ms → days
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
      if((diffDays && diffDays> 90 ) || userProfileUpdateDate === null) {
        let userData = {
          ...this.configSvc.userProfile,
          mobile: this.configSvc.unMappedUser.profileDetails?.personalDetails?.mobile || '',
          primaryEmail: this.configSvc.unMappedUser.profileDetails?.personalDetails?.primaryEmail || '',
        }
          let dialogRef = this.dialog.open(ProfileVerificationDialogComponent, {
            data: {
              userProfile: userData
            },
            panelClass: 'profile-verification-dialog-container',
            disableClose: true,
            maxWidth: '95vw',
            width: '500px'
          })
          dialogRef.afterClosed().subscribe(async (res: any) => {
            if (res && res?.action === 'update') {
              this.router.navigate(['/app/person-profile/me'], { fragment: 'mandatorySection' })
              dialogRef.close()
            } else if (res && res?.action === 'verify'){
              this.callExtPatchProfile()
            }
          })
      }
    }
    callExtPatchProfile() {
      const currentEpoch = new Date().getTime().toString()
      let request = {
        "request": {
            "userId":this.configSvc.unMappedUser.id,
            "profileDetails": {
                "personalDetails": {
                  "lastProfileVerificationPromptDate": currentEpoch
                }
            }
        }
      }
      this.userProfileService.editProfileDetails(request).subscribe((res: any) => {
        if(res && res.result && res.result.response?.toUpperCase() === 'SUCCESS') { 
          this.matSnackBar.open('Profile verification  updated successfully', 'X', this.configSuccess)
          if (this.configSvc?.unMappedUser?.profileDetails?.personalDetails) {
            this.configSvc.unMappedUser.profileDetails.personalDetails.lastProfileVerificationPromptDate = currentEpoch
          }
        }
        this.getOrgDetails()
      })
    }

    getOrgDetails() {
        const request = {
          request: { organisationId: this.rootOrgId },
        }
        this.userProfileService.readOrgData(request).subscribe((res: any) => {
          const isPopupEnabled = _.get(res, 'result?.response?.customfieldsdata?.isPopupEnabled') ? true : false
          const customFieldsCount = _.get(res, 'result?.response?.customfieldsdata?.customFieldsCount', 0) as number > 0 ? true : false
          const customFieldsLength = _.get(res, 'result?.response?.customfieldsdata?.customFieldIds', [])
          if (isPopupEnabled && customFieldsCount && customFieldsLength?.length > 0) {
            return this.readCustomattributeDetails()
          } else {
            return false
          }
        }, error => {
          return false
          console.error('Error fetching organization details', error)
        })
      }
   readCustomattributeDetails() {
      this.userProfileService.readCustomattributeDetails(this.configSvc.unMappedUser.id, this.rootOrgId).subscribe((res: any) => {
        let customFieldValues = _.get(res, 'result?.response?.customFieldValues', [])
        if ( customFieldValues && customFieldValues.length === 0) {
          return this.redirectToCustomProfile()
        } else {
          //this.redirectToCustomProfile()
          return false
        }
      }, error => {
        return false
        console.log('Error', error)
      })
    }
}
