import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { NetworkV2Service } from '../../services/network-v2.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Router, ActivatedRoute } from '@angular/router'
import { NsUser } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-connection-search-card',
  templateUrl: './connection-search-card.component.html',
  styleUrls: ['./connection-search-card.component.scss'],
})
export class ConnectionSearchCardComponent implements OnInit {
  @Input() user!: NSNetworkDataV2.IAutocompleteUser
  @Output() connection = new EventEmitter<string>()
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  me!: NsUser.IUserProfile

  constructor(
    private networkV2Service: NetworkV2Service,
    private snackBar: MatSnackBar,
    private router: Router,
    // private configSvc: ConfigurationsService
    private activeRoute: ActivatedRoute,
  ) {
    if (this.activeRoute.parent) {
      this.me = this.activeRoute.parent.snapshot.data.me
    }
  }

  ngOnInit() {
  }

  getUseravatarName() {
    let name = ''
    if (this.user && !this.user.personalDetails) {
      if (this.user.firstName) {
        if (this.user.lastName && this.user.lastName !== null && this.user.lastName !== undefined) {
          name = `${this.user.firstName} ${this.user.lastName}`
        } else  {
          name = `${this.user.firstName}`
        }
      }
    } else if (this.user && this.user.personalDetails) {
      if (this.user.personalDetails.middlename) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename} ${this.user.personalDetails.surname}`
        } else {
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename}`
        }
      } else {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
        } else {
          name = `${this.user.personalDetails.firstname}`
        }
      }
    }
    return name
  }

  connetToUser() {
    if (this.me && this.me.userId === this.user.wid) {
      this.openSnackbar('Cannot send request to yourself')
    } else {
      const req = {
        connectionId: this.user.id || this.user.identifier || this.user.wid,
        userIdFrom: this.me ? this.me.userId : '',
        userNameFrom: this.me ? this.me.userId : '',
        userDepartmentFrom: this.me && this.me.departmentName ? this.me.departmentName : 'IGOT',
        userIdTo: this.user.id || this.user.identifier || this.user.wid,
        userNameTo:  this.user.id || this.user.identifier || this.user.wid,
        userDepartmentTo: this.user.rootOrgName,
      }
      // if (this.user.personalDetails) {
      //   req.userNameTo = `${this.user.personalDetails.firstname}${this.user.personalDetails.surname}`
      //   req.userDepartmentTo =  this.user.employmentDetails.departmentName
      // }
      // if (!this.user.personalDetails && this.user.first_name) {
      //   req.userNameTo = `${this.user.first_name}${this.user.last_name}`
      //   req.userDepartmentTo =  this.user.department_name
      // }
      // if (!this.user.personalDetails && this.user.firstName) {
      //   req.userNameTo = `${this.user.firstName}${this.user.lastName}`
      //   req.userDepartmentTo =  this.user.channel
      // }

      this.networkV2Service.createConnection(req).subscribe(
        () => {
          this.openSnackbar(this.toastSuccess.nativeElement.value)
          this.connection.emit('connection-updated')
        },
        () => {
          this.openSnackbar(this.toastError.nativeElement.value)
        })
    }
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  goToUserProfile(user: any) {
    this.router.navigate(['/app/person-profile', (user.userId || user.id || user.wid)])
    // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: } })

  }

}
