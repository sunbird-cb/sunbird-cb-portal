import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { ProfileV2RevampService } from '../../../services/profile-v2-revamp.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { WithdrawRequestComponent } from '../../withdraw-request/withdraw-request.component';
import { RejectionReasonPopupComponent } from '../../rejection-reason-popup/rejection-reason-popup.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ws-app-profile-primary-details',
  templateUrl: './profile-primary-details.component.html',
  styleUrls: ['./profile-primary-details.component.scss']
})
export class ProfilePrimaryDetailsComponent implements OnInit {
  @Input() primaryDetails: any;
  @Input() isCurrentUser = false;
  @Input() enableWTR = false;
  @Input() enableWR = false;
  @Input() unVerifiedObj = {
    designation: '',
    group: '',
    organization: '',
    groupRequestTime: 0,
    designationRequestTime: 0,
  }
  @Input() rejectedFields = {
    name: '',
    group: '',
    designation: '',
    groupRejectionComments: '',
    designationRejectionComments: '',
    groupRejectionTime: 0,
    designationRejectionTime: 0,
  }
  @Input() approvalPendingFields: any = []

  @Output() openProfileEditDialog = new EventEmitter();
  @Output() getApprovalStatus = new EventEmitter();
  @Output() updateWithdrawalStatus = new EventEmitter();


  groupApprovedTime = 0
  designationApprovedTime = 0
  panelOpenState = false
  isIgotOrg = false;
  isNotMyUser = false;

  constructor(
    private profileV2RevampSvc: ProfileV2RevampService,
    private matSnackBar: MatLegacySnackBar,
    private configService: ConfigurationsService,
    private dialog: MatLegacyDialog,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getApprovedFields();
    this.isNotMyUser = _.get(this.configService, 'unMappedUser.profileDetails.profileStatus', '').toLowerCase() === 'not-my-user' ? true : false;
    this.isIgotOrg = _.get(this.configService, 'unMappedUser.profileDetails.employmentDetails.departmentName', '').toLowerCase() === 'igot' ? true : false;
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'primaryDetails' && this.showPrimaryDetailsEdit) {
        setTimeout(() => {
          this.editPrimaryDetails('Primary Details')
        }, 500)
      }
    })
  }

  getApprovedFields(): void {
    const requesrtBody = {
      serviceName: 'profile',
      applicationStatus: 'APPROVED',
    }
    this.profileV2RevampSvc.fetchApprovalDetails(requesrtBody)
      .subscribe((_res: any) => {
        if (_res && _res.result && _res.result.data && Array.isArray(_res.result.data)) {
          _res.result.data.filter((obj: any) => {
            this.groupApprovedTime = (obj.hasOwnProperty('group') && obj.lastUpdatedOn > this.groupApprovedTime) ?
              obj.lastUpdatedOn : this.groupApprovedTime

            this.designationApprovedTime = (obj.hasOwnProperty('designation') && obj.lastUpdatedOn > this.designationApprovedTime) ?
              obj.lastUpdatedOn : this.designationApprovedTime
          })
        }
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.openSnackbar(this.handleTranslateTo('somethingWentWrongPleaseTryAgain'))
        }
      })
  }

  editPrimaryDetails(header: string) {
    this.openProfileEditDialog.emit(header)
    // Logic to edit primary details
  }

  get showPrimaryDetailsEdit(): boolean {
    const canEdit = false
    if (!this.enableWTR && !this.enableWR && this.isCurrentUser && !(this.isNotMyUser || this.isIgotOrg)) {
      return true
    }
    return canEdit
  }

  get disablePrimaryDetailsEdit(): boolean {
    const disable = false
    if (this.enableWTR && !(this.isNotMyUser && this.isIgotOrg)) {
      return true
    }
    return disable
  }

  get showWithdrawRequestBtn(): boolean {
    if (this.enableWR && this.isCurrentUser && !(this.isNotMyUser && this.isIgotOrg)) {
      return true
    }
    return false
  }

  get showApprovalStatus(): boolean {
    if (
      (this.groupApprovedTime < this.rejectedFields.groupRejectionTime ||
        this.groupApprovedTime < this.unVerifiedObj.groupRequestTime ||
        this.designationApprovedTime < this.rejectedFields.designationRejectionTime ||
        this.designationApprovedTime < this.unVerifiedObj.designationRequestTime) &&
      this.isCurrentUser
    ) {
      return true
    }
    return false
  }

  get showGroupPending(): boolean {
    if (
      this.groupApprovedTime < this.unVerifiedObj.groupRequestTime &&
      this.rejectedFields.groupRejectionTime < this.unVerifiedObj.groupRequestTime &&
      this.unVerifiedObj.group
    ) {
      if ((this.unVerifiedObj.groupRequestTime + 100) < this.rejectedFields.designationRejectionTime ||
        (this.unVerifiedObj.groupRequestTime + 100) < this.unVerifiedObj.designationRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showGroupRejection(): boolean {
    if (
      this.groupApprovedTime < this.rejectedFields.groupRejectionTime &&
      this.unVerifiedObj.groupRequestTime < this.rejectedFields.groupRejectionTime &&
      this.rejectedFields.group
    ) {
      if ((this.rejectedFields.groupRejectionTime + 100) < this.rejectedFields.designationRejectionTime ||
        (this.rejectedFields.groupRejectionTime + 100) < this.unVerifiedObj.designationRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showDesignationPending(): boolean {
    if (
      this.designationApprovedTime < this.unVerifiedObj.designationRequestTime &&
      this.rejectedFields.designationRejectionTime < this.unVerifiedObj.designationRequestTime &&
      this.unVerifiedObj.designation
    ) {
      if ((this.unVerifiedObj.designationRequestTime + 100) < this.rejectedFields.groupRejectionTime ||
        (this.unVerifiedObj.designationRequestTime + 100) < this.unVerifiedObj.groupRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showDesignationRejection(): boolean {
    if (
      this.designationApprovedTime < this.rejectedFields.designationRejectionTime &&
      this.unVerifiedObj.designationRequestTime < this.rejectedFields.designationRejectionTime &&
      this.rejectedFields.designation
    ) {
      if ((this.rejectedFields.designationRejectionTime + 100) < this.rejectedFields.groupRejectionTime ||
        (this.rejectedFields.designationRejectionTime + 100) < this.unVerifiedObj.groupRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  viewReason(comments: string) {
    this.dialog.open(RejectionReasonPopupComponent, {
      data: {
        comments,
        buttonText: 'OK',
      },
      disableClose: true,
      width: '500px',
      maxWidth: '90vw',
    })
  }

  showWithdrawRequestPopup() {
    const dialogRef = this.dialog.open(WithdrawRequestComponent, {
      data: {
        withDrawType: 'primaryDetails',
      },
      disableClose: true,
      panelClass: 'common-modal',
    })

    dialogRef.afterClosed().subscribe((value: boolean) => {
      if (value) {
        this.handleWithdrawRequest()
      }
    })
  }

  handleWithdrawRequest(): void {
    this.approvalPendingFields.forEach((_obj: any) => {
      const userId = _.get(this.configService.unMappedUser, 'id')
      const payload = {
        action: 'WITHDRAW',
        state: 'SEND_FOR_APPROVAL',
        userId: userId,
        applicationId: userId,
        actorUserId: userId,
        wfId: _obj.wfId,
        serviceName: 'profile',
        updateFieldValues: [],
        comment: '',
      }
      this.profileV2RevampSvc.withDrawRequest(payload)
        .subscribe((_res: any) => {
          this.getApprovalStatus.emit('withdraw')
          this.unVerifiedObj.group = ''
          this.unVerifiedObj.designation = ''
          this.openSnackbar(this.handleTranslateTo('withdrawRequestSuccess'))
          this.enableWR = false
          this.updateWithdrawalStatus.emit(false)
        }, (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.openSnackbar(this.handleTranslateTo('unableWithdrawRequest'))
          }
        })
    })
  }

  handleTranslateTo(menuName: string): string {
    return this.profileV2RevampSvc.handleTranslateTo(menuName)
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.matSnackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
