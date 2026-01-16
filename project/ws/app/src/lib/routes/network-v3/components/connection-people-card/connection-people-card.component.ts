import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationsService} from '@sunbird-cb/utils-v2';
import { NSNetworkDataV2 } from '../../../network-v2/models/network-v2.model';
import { NetworkV2Service } from '../../../network-v2/services/network-v2.service';
import * as _ from 'lodash';

@Component({
  selector: 'ws-app-connection-people-card',
  templateUrl: './connection-people-card.component.html',
  styleUrls: ['./connection-people-card.component.scss']
})
export class ConnectionPeopleCardComponent implements OnInit {
  @Input() user!: NSNetworkDataV2.INetworkUser
  @Input() addMargin = false
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  cirrentUser: any
  howerUser!: any
  unmappedUser!: any
  userAvatarName = ''
  showBadge = false
  showMentor = false

  constructor(
    private networkV2Service: NetworkV2Service,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService,
    private configurationsService: ConfigurationsService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.initialization();
  }

  initialization() { 
    this.getCurrentUser()
    this.howerUser = this.user
    this.unmappedUser = this.user
    this.userAvatarName = this.getUseravatarName
    if(this.user ) {
      if(this.user.verifiedKarmayogi) {
        this.showBadge = true
      }
      if (this.user.role && this.user.role.some(role => role.toLowerCase() === 'mentor')) {
        this.showMentor = true
      }
    }
  }
  

  getCurrentUser() {
    this.cirrentUser = this.configurationsService.userProfileV2
  }
  get getUseravatarName(): string {
    let name = ''
    if (this.user && !this.user.personalDetails) {
      if (this.user.firstName) {
        if (this.user.lastName && this.user.lastName !== null && this.user.lastName !== undefined) {
          name = `${this.user.firstName} ${this.user.lastName}`
        } else  {
          name = `${this.user.firstName}`
        }
      } else if (this.user.fullName) {
        name = `${this.user.fullName}`
      } else {
        name = `${this.user.name}`
      }
    } else if (this.user && this.user.personalDetails) {
      if (this.user.personalDetails.middlename) {
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename} ${this.user.personalDetails.surname}`
        } else {
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename}`
        }
      } else if (this.user.personalDetails.firstname) {
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
        } else {
          name = `${this.user.personalDetails.firstname}`
        }
      } else if (this.user.personalDetails.firstName) {
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          name = `${this.user.personalDetails.firstName} ${this.user.personalDetails.surname}`
        } else {
          name = `${this.user.personalDetails.firstName}`
        }
      }
    }
    return name
  }
  connetToUser() {
    this.user['requestSent'] = false
    const req = {
      connectionId: this.user.id || this.user.identifier || this.user.wid,
      userIdFrom: _.get(this.cirrentUser, 'userId', ''),
      userNameFrom: _.get(this.cirrentUser, 'firstName', ''),
      userDepartmentFrom: _.get(this.cirrentUser, 'departmentName', ''),
      userIdTo: this.unmappedUser.userId,
      userNameTo: _.get(this.unmappedUser, 'personalDetails.firstname', ''),
      userDepartmentTo: _.get(this.unmappedUser, 'employmentDetails.departmentName', ''),
    }
    this.networkV2Service.createConnection(req).subscribe(
      () => {
        this.openSnackbar(this.toastSuccess.nativeElement.value)
        this.user['requestSent'] = true
      },
      () => {
        this.user['requestSent'] = undefined
        this.openSnackbar('Failed to send request. Please try again.')
      })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  goToUserProfile(user: any) {
    this.router.navigate(['/app/person-profile', (user.userId || user.id || user.wid)], { fragment: 'profileInfo' })
  }
}
