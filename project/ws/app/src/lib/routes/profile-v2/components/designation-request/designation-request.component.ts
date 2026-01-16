import { Component, Inject, OnDestroy } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { HttpErrorResponse } from '@angular/common/http'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { RequestService } from 'src/app/routes/public/public-request/request.service'
import { UserProfileService } from '../../../user-profile/services/user-profile.service'

@Component({
  selector: 'ws-designation-request',
  templateUrl: './designation-request.component.html',
  styleUrls: ['./designation-request.component.scss'],
})

export class DesignationRequestComponent implements OnDestroy {

  private destroySubject$ = new Subject()
  designation = ''
  constructor(
    public dialogRef: MatDialogRef<DesignationRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private configService: ConfigurationsService,
    private requestService: RequestService,
    private matSnackBar: MatSnackBar,
    private userProfileService: UserProfileService
  ) { }

  handleCloseModal(): void {
    this.dialogRef.close()
  }

  handleSaveDesignation(): void {
    const postData: any = {
      state: 'INITIATE',
      action: 'INITIATE',
      serviceName: 'position',
      userId: this.configService.unMappedUser.id,
      applicationId: this.configService.unMappedUser.id,
      actorUserId: this.configService.unMappedUser.id,
      deptName: 'iGOT',
      updateFieldValues: [],
    }

    const data: any = {
      toValue: {
        position: this.designation,
      },
      fieldKey: 'position',
      description: this.designation,
      firstName: (this.data.portalProfile.personalDetails) ? (this.data.portalProfile.personalDetails.firstname || '') : '',
      email: (this.data.portalProfile.personalDetails) ? (this.data.portalProfile.personalDetails.primaryEmail || '') : '',
      mobile: (this.data.portalProfile.personalDetails) ? (this.data.portalProfile.personalDetails.mobile || '') : '',
    }

    postData.updateFieldValues.push(data)
    this.requestService.createPosition(postData)
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_res: any) => {
      this.matSnackBar.open(this.handleTranslateTo('designationRequestSent'))
      this.handleCloseModal()
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('designationRequestFailed'))
        this.handleCloseModal()
      }
    })
  }

  handleTranslateTo(menuName: string): string {
    return this.userProfileService.handleTranslateTo(menuName)
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }

}
