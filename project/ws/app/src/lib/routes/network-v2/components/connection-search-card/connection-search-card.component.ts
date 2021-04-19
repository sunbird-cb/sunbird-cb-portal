import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { NetworkV2Service } from '../../services/network-v2.service'
import { MatSnackBar } from '@angular/material'
import { Router, ActivatedRoute } from '@angular/router'
import { NsUser } from '@sunbird-cb/utils'

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
    if (this.user) {
      if (this.user.personalDetails) {
        return `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
      }
      if (!this.user.personalDetails && this.user.first_name) {
        return `${this.user.first_name} ${this.user.last_name}`
      }
    }
    return ''
  }

  connetToUser() {
    if (this.me && this.me.userId === this.user.wid) {
      this.openSnackbar('Cannot send request to yourself')
    } else {
      // const req = { connectionId: this.user.wid }

      const req = {
        connectionId: this.user.id,
        userNameFrom: this.me ? this.me.userName : '',
        userDepartmentFrom: this.me ? this.me.departmentName : 'iGOT',
        userIdTo: this.user.id,
        userNameTo: `${this.user.personalDetails.firstname}${this.user.personalDetails.surname}`,
        userDepartmentTo: this.user.employmentDetails.departmentName,
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
