import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
// import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { NetworkV2Service } from '../../services/network-v2.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { NsUser } from '@sunbird-cb/utils-v2'
// import { ConnectionHoverService } from '../connection-name/connection-hover.servive'

@Component({
  selector: 'ws-app-connection-request-card',
  templateUrl: './connection-request-card.component.html',
  styleUrls: ['./connection-request-card.component.scss'],
})
export class ConnectionRequestCardComponent implements OnInit {
  @Input() user!: any // NSNetworkDataV2.INetworkUser
  @Output() connection = new EventEmitter<string>()
  @ViewChild('toastAccept', { static: true }) toastAccept!: ElementRef<any>
  @ViewChild('toastReject', { static: true }) toastReject!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  me!: NsUser.IUserProfile
  howerUser!: any
  unmappedHowerUser!: any
  constructor(
    private router: Router,
    private networkV2Service: NetworkV2Service,
    // private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
    private activeRoute: ActivatedRoute,
    // private connectionHoverService: ConnectionHoverService,
  ) {
    if (this.activeRoute.parent) {
      this.me = this.activeRoute.parent.snapshot.data.me
    }
  }

  ngOnInit() {
    this.unmappedHowerUser = this.user
    this.howerUser = this.user
    // const userId = this.user.id || this.user.identifier
    // this.connectionHoverService.fetchProfile(userId).subscribe((res: any) => {
    //   if (res.profileDetails !== null) {
    //     this.unmappedHowerUser = res
    //     this.howerUser = res.profileDetails
    //   } else {
    //     this.unmappedHowerUser = res
    //     this.howerUser = res || {}
    //   }
    //   this.user = this.howerUser
    //   return this.howerUser
    // })
  }

  acceptConnection() {
    this.connetToUser('Approved')
  }

  rejectConnection() {
    this.connetToUser('Rejected')
  }

  goToUserProfile(user: any) {
    this.router.navigate(['/app/person-profile', (user.userId || user.id || user.identifier)])
    // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: } })
  }

  connetToUser(action: string | 'Approved' | 'Rejected') {
    const req = {
      connectionId: this.user.id || this.user.identifier || this.user.wid,
      userIdFrom: this.me ? this.me.userId : '',
      userNameFrom: this.me ? this.me.userId : '',
      userDepartmentFrom: this.me && this.me.departmentName ? this.me.departmentName : '',
      userIdTo: this.unmappedHowerUser.id,
      userNameTo: this.unmappedHowerUser.fullName,
      userDepartmentTo: this.unmappedHowerUser.departmentName,
      status: action,
    }

    // if (this.user.personalDetails && this.user.employmentDetails && this.user.employmentDetails.departmentName) {
    //   req.userNameTo = `${this.user.personalDetails.firstname}${this.user.personalDetails.surname}`
    //   req.userDepartmentTo = this.user.employmentDetails.departmentName
    // } else {
    //   req.userNameTo = `${this.unmappedHowerUser.firstName}${this.unmappedHowerUser.lastName}`
    //   req.userDepartmentTo = this.unmappedHowerUser.rootOrg.channel
    // }

    // if (!this.user.personalDetails && this.user.first_name) {
    //   req.userNameTo = `${this.user.first_name}${this.user.last_name}`
    //   req.userDepartmentTo = this.user.department_name
    // }
    // if (!this.user.personalDetails && this.user.firstName) {
    //   req.userNameTo = `${this.user.firstName}${this.user.lastName}`
    //   req.userDepartmentTo = this.user.channel
    // }

    this.networkV2Service.updateConnection(req).subscribe(
      () => {
        if (action === 'Approved') {
          this.openSnackbar(this.toastAccept.nativeElement.value)
        } else {
          this.openSnackbar(this.toastReject.nativeElement.value)
        }
        this.connection.emit('connection-updated')
      },
      () => {
        this.openSnackbar(this.toastError.nativeElement.value)
      })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
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
  get usr() {
    return this.howerUser
  }
}
