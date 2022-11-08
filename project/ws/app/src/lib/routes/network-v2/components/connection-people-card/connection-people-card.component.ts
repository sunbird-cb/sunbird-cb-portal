import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { NetworkV2Service } from '../../services/network-v2.service'
import { MatSnackBar } from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router'
import { NsUser } from '@sunbird-cb/utils'
import { ConnectionHoverService } from '../connection-name/connection-hover.servive'

@Component({
  selector: 'ws-app-connection-people-card',
  templateUrl: './connection-people-card.component.html',
  styleUrls: ['./connection-people-card.component.scss'],
})
export class ConnectionPeopleCardComponent implements OnInit {
  @Input() user!: NSNetworkDataV2.INetworkUser
  @Output() connection = new EventEmitter<string>()
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  me!: NsUser.IUserProfile
  howerUser!: any
  unmappedUser!: any

  constructor(
    private networkV2Service: NetworkV2Service,
    private snackBar: MatSnackBar,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private connectionHoverService: ConnectionHoverService,
    //  private configSvc: ConfigurationsService,
  ) {
    if (this.activeRoute.parent) {
      this.me = this.activeRoute.parent.snapshot.data.me
    }
  }

  ngOnInit() {
    const userId = this.user.id || this.user.identifier
    this.connectionHoverService.fetchProfile(userId).subscribe((res: any) => {
      if (res.profileDetails !== null) {
        this.howerUser = res.profileDetails
        if (this.howerUser.phoneVerified) {
          this.howerUser.phoneVerified = res.phoneVerified
        } else {
          this.howerUser.phoneVerified = false
        }
        this.unmappedUser = res
      } else {
        this.howerUser = res || {}
        this.unmappedUser = res
      }
      return this.howerUser
    })
  }

  getUseravatarName() {
    // if (this.user) {
    //   return `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
    // }
    // return ''
    let name = ''
    if (this.user && !this.user.personalDetails) {
      if (this.user.firstName) {
        name = `${this.user.firstName} ${this.user.lastName}`
      }
    } else if (this.user && this.user.personalDetails) {
      if (this.user.personalDetails.middlename) {
        // tslint:disable-next-line: max-line-length
        name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename} ${this.user.personalDetails.surname}`
      } else {
        name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
      }
    }
    return name
  }
  connetToUser() {
    const req = {
      connectionId: this.user.id || this.user.identifier || this.user.wid,
      userIdFrom: this.me ? this.me.userId : '',
      userNameFrom: this.me ? this.me.userId : '',
      userDepartmentFrom: this.me && this.me.departmentName ? this.me.departmentName : '',
      userIdTo: this.unmappedUser.userId,
      userNameTo: this.user.id || this.user.identifier || this.user.wid,
      userDepartmentTo: this.unmappedUser.rootOrg.channel,
    }

    this.networkV2Service.createConnection(req).subscribe(
      () => {
        this.openSnackbar(this.toastSuccess.nativeElement.value)
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

  goToUserProfile(user: any) {
    this.router.navigate(['/app/person-profile', (user.userId || user.id || user.wid)], { fragment: 'profileInfo' })
    // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: } })
  }

  get usr() {
    return this.howerUser
  }
}
