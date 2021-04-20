import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { NetworkV2Service } from '../../services/network-v2.service'
import { MatSnackBar } from '@angular/material'
import { NsUser } from '@sunbird-cb/utils'
import { ConnectionHoverService } from '../connection-name/connection-hover.servive'

@Component({
  selector: 'ws-app-connection-request-card',
  templateUrl: './connection-request-card.component.html',
  styleUrls: ['./connection-request-card.component.scss'],
})
export class ConnectionRequestCardComponent implements OnInit {
  @Input() user!: NSNetworkDataV2.INetworkUser
  @Output() connection = new EventEmitter<string>()
  @ViewChild('toastAccept', { static: true }) toastAccept!: ElementRef<any>
  @ViewChild('toastReject', { static: true }) toastReject!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  me!: NsUser.IUserProfile
  howerUser!: any
  constructor(
    private router: Router,
    private networkV2Service: NetworkV2Service,
    // private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
    private activeRoute: ActivatedRoute,
    private connectionHoverService: ConnectionHoverService,
  ) {
    if (this.activeRoute.parent) {
      this.me = this.activeRoute.parent.snapshot.data.me
    }
  }

  ngOnInit() {
    const userId = this.user.id || this.user.identifier
    this.connectionHoverService.fetchProfile(userId).subscribe(res => {
      this.howerUser = res || {}
      this.user = this.howerUser
      return this.howerUser
    })
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
      connectionId: this.user.id,
      userIdFrom: this.me ? this.me.userId : '',
      userNameFrom: this.me ? this.me.userName : '',
      userDepartmentFrom: this.me ? this.me.departmentName : '',
      userIdTo: this.user.id,
      userNameTo: `${this.user.personalDetails.firstname}${this.user.personalDetails.surname}`,
      userDepartmentTo: this.user.employmentDetails.departmentName,
      status: action,
    }

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
    if (this.user && this.user.personalDetails) {
      // return `${this.user.name}`
      return `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
    }
    return ''
  }
  get usr() {
    return this.howerUser
  }
}
