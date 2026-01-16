import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { ConfigurationsService, EventService, NsUser, WsEvents } from '@sunbird-cb/utils-v2';
import { Router } from '@angular/router';
import { NetworkingService } from '../../services/networking.service';
import { MatLegacyDialog } from '@angular/material/legacy-dialog';
import { ConfirmationDialogComponent } from '@sunbird-cb/consumption'

@Component({
  selector: 'ws-app-connections-card',
  templateUrl: './connections-card.component.html',
  styleUrls: ['./connections-card.component.scss']
})
export class ConnectionsCardComponent implements OnInit {
  
  @Input() otherUserProfile: any;
  @Input() currentTab = 'Requested'
  @Input() showBorder = true;
  @Output() getCountOf: EventEmitter<string[]> = new EventEmitter<string[]>(); 
  nameInitials = '';
  fullName = '';
  currentUserDetails: NsUser.IUserProfile | null = null;

  constructor(
    private snackBar: MatLegacySnackBar,
    private router: Router,
    private configSvc: ConfigurationsService,
    private networkingSvc: NetworkingService,
    private dialog: MatLegacyDialog,
     private events: EventService,
  ) { }

  ngOnInit(): void {
    this.getInitials();
    this.getCurrentUserDetails();
  }

  getInitials(): void {
    this.fullName = _.get(this.otherUserProfile, 'fullName', _.get(this.otherUserProfile, 'personalDetails.firstname', ''));
    if (this.fullName) {
      if (this.fullName.split(' ').length > 1) {
        const nameArr = this.fullName.split(' ')
        this.nameInitials = nameArr[0].charAt(0) + nameArr[1].charAt(0)
      } else {
        this.nameInitials = this.fullName.charAt(0)
      }
    }
  }

  getCurrentUserDetails() {
    this.currentUserDetails = this.configSvc.userProfileV2;
  }

  goToUserProfile() {
    if(this.otherUserProfile && this.otherUserProfile.userId) {
      this.router.navigate(['/app/person-profile', (this.otherUserProfile.userId)], { fragment: 'profileInfo' })
    }
  }

  copyProfile() {
    if (this.otherUserProfile && this.otherUserProfile.userId) {
      const userId = this.otherUserProfile.userId
      const url = `${window.location.origin}/app/person-profile/${userId}#profileInfo`
      navigator.clipboard.writeText(url).then(() => {
        this.openSnackbar('Profile link copied to clipboard')
      }).catch(() => {
        this.openSnackbar('Failed to copy link')
      })
    }
  }

  viewProfile() {
    if(this.otherUserProfile && this.otherUserProfile.userId) {
      const userId = this.otherUserProfile.userId
      this.router.navigate(['/app/person-profile', (userId)], { fragment: 'profileInfo' })
    }
  }

  openConformationPopup(action: string | 'Approved' | 'Rejected' | 'Withdrawn' | 'Unblocked' | 'Removed') {
    let message = ''
    switch(action) {
      case 'Rejected':
        message = this.handleTranslateTo('areYouSureYouWantToIgnoreThisRequest')
        break;
      case 'Withdrawn':
        message = this.handleTranslateTo('areYouSureYouWantToWithdrawThisRequest')
        break;
      case 'Removed':
        message = this.handleTranslateTo('areYouSureYouWantToRemoveThisConnection')
        break;
      case 'Unblocked':
        message = this.handleTranslateTo('areYouSureYouWantToUnblockThisUser')
        break;
    }
    if(message) {
      const dialgoData = {
        description: message,
        iconName: 'info',
        type: 'warning',
        buttonsPositionClass: 'justify-center items-center',
        buttons: [
          {
            classes: 'btn-out-line',
            text: this.handleTranslateTo('no'),
            response: false
          },
          {
            classes: 'succes-button',
            text: this.handleTranslateTo('yes'),
            response: true
          }
        ]
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: dialgoData,
        disableClose: true,
        width: '400px',
        maxWidth: '90vw'
      })
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.updateConnection(action)
        }
      })
    } else {
      this.updateConnection(action)
    }
  }

  updateConnection(action: string | 'Approved' | 'Rejected' | 'Withdrawn' | 'Unblocked' | 'Removed') {
    if(this.otherUserProfile && this.currentUserDetails) {
      if(['Approved', 'Rejected', 'Withdrawn', 'Unblocked'].includes(action)) {
        let subType = ''
        let eDataId = ''
        switch (action) {
          case 'Accepted':
            eDataId = 'accept-request'
            subType = 'network-hub-connection-requests'
            break;
          case 'Rejected':
            eDataId = 'ignore-request'
            subType = 'network-hub-connection-requests'
            break;
          case 'Withdrawn':
            eDataId = 'connect-withdraw'
            subType = 'network-hub-connections-sent'
            break;
          case 'Unblocked':
            eDataId = 'profile-unblock'
            subType = 'network-hub-connections-blocked'
            break;
        }
        this.raiseTelemetry(_.get(this.currentUserDetails, 'userId', ''), eDataId, subType)
      }

      const formBody = {
        connectionId: this.otherUserProfile.id || this.otherUserProfile.identifier || this.otherUserProfile.wid || this.otherUserProfile.userId,
        userIdFrom: this.currentUserDetails.userId,
        userNameFrom: this.currentUserDetails.firstName,
        userDepartmentFrom: this.currentUserDetails.departmentName,
        userIdTo: this.otherUserProfile.userId,
        userNameTo: this.fullName,
        userDepartmentTo: this.otherUserProfile.departmentName ? this.otherUserProfile.departmentName : _.get(this.otherUserProfile, 'employmentDetails.departmentName', ''),
        status: action
      }
      this.otherUserProfile['connectionStatus'] = 'progress'
      this.networkingSvc.updateConnectionRequest(formBody).subscribe({
        next: (response) => {
          if (response) {
            this.otherUserProfile['connectionStatus'] = action
            let listToGetCount: string[] = []
            switch(action) {
              case 'Approved':
                listToGetCount = ['Approved', 'Pending']
                this.openSnackbar('Connection accepted successfully')
                break;
              case 'Rejected':
                listToGetCount = ['Pending']
                this.openSnackbar('Connection rejected successfully')
                break;
              case 'Withdrawn':
                listToGetCount = ['Pending']
                this.openSnackbar('Connection withdrawn successfully')
                break;
              case 'Unblocked':
                listToGetCount = ['Blocked']
                this.openSnackbar('User unblocked successfully')
                break;
              case 'Removed':
                listToGetCount = ['Approved']
                this.openSnackbar('Connection removed successfully')
                break;
            }
            if(listToGetCount && listToGetCount.length) {
              this.getCountOf.emit(listToGetCount)
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          if(error) {
            this.otherUserProfile['connectionStatus'] = ''
            this.openSnackbar('Something went wrong please try again')
          }
        }
      })
    }
  }

  raiseTelemetry(userId: string, eDataId: string, subType?: string) {
    const edata: any = {
      type: WsEvents.EnumInteractTypes.CLICK,
      id: eDataId
    }
    const objDetails = {
      id: userId,
      type: 'User'
    }
    const env = {
      module: WsEvents.EnumTelemetrymodules.NETWORK,
    }
    if(subType) {
      edata['subType'] = subType
    }
    this.events.raiseInteractTelemetry(edata, objDetails, env)
  }

  handleTranslateTo(menuName: string): string {
    return this.networkingSvc.handleTranslateTo(menuName)
  }
  
  openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

}
