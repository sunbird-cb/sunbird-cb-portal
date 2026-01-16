import { Component, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { UserProfileService } from '../../../user-profile/services/user-profile.service'
import { HttpErrorResponse } from '@angular/common/http'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-withdraw-request',
  templateUrl: './withdraw-request.component.html',
  styleUrls: ['./withdraw-request.component.scss'],
})
export class WithdrawRequestComponent implements OnInit, OnDestroy {

  private destroySubject$ = new Subject()
  @Output() enableMakeTransfer = new EventEmitter<boolean>()
  constructor(
    public dialogRef: MatDialogRef<WithdrawRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matSnackBar: MatSnackBar,
    private userProfileService: UserProfileService,
    private configService: ConfigurationsService
  ) { }

  ngOnInit() {
  }

  handleCloseModal(): void {
    this.dialogRef.close()
  }

  handleWithdrawRequest(): void {
    if (this.data.withDrawType === 'department') {
      this.data.approvalPendingFields.forEach((_obj: any) => {
        this.userProfileService.withDrawRequest(this.configService.unMappedUser.id, _obj.wfId)
        .pipe(takeUntil(this.destroySubject$))
        .subscribe((_res: any) => {
          this.matSnackBar.open(this.handleTranslateTo('withdrawTransferSuccess'))
          this.handleCloseModal()
          this.enableMakeTransfer.emit(true)
        },         (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.matSnackBar.open(this.handleTranslateTo('withdrawTransferFailed'))
          }
        })
      })
    } else {
      const withdraw = true
      this.dialogRef.close(withdraw)
    }
  }

  handleTranslateTo(menuName: string): string {
    return this.userProfileService.handleTranslateTo(menuName)
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }

}
