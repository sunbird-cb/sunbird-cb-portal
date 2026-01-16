import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

export interface ProfileVerificationData {
  organization?: string
  designation?: string
  email?: string
  mobile?: string
  userProfile?: any
}

@Component({
  selector: 'ws-profile-verification-dialog',
  templateUrl: './profile-verification-dialog.component.html',
  styleUrls: ['./profile-verification-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileVerificationDialogComponent implements OnInit {
  userOrganization: any | undefined 
  ministryOrStateType: string = 'spv'
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ProfileVerificationData,
    private dialogRef: MatDialogRef<ProfileVerificationDialogComponent>,
    private router: Router,
    private configSvc: ConfigurationsService
  ) {
    
    if (this.configSvc.userProfile) {
      this.userOrganization = this.configSvc.userProfile.userRootOrg
      this.ministryOrStateType = this.userOrganization?.ministryOrStateType ? this.userOrganization?.ministryOrStateType?.toLowerCase() : 'spv'
    }
  }

  ngOnInit(): void {
    // Initialize component
  }

  onVerify() {
    this.dialogRef.close({ action: 'verify' })
  }

  onUpdateProfile() {
    this.dialogRef.close({ action: 'update' })
    // Navigate to profile update page
    this.router.navigate(['/app/person-profile'])
  }

  onClose() {
    this.dialogRef.close({ action: 'close' })
  }
}
