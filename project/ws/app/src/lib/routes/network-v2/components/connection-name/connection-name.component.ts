import { Component, OnInit, Input, AfterViewInit } from '@angular/core'
// import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { ActivatedRoute } from '@angular/router'
import { NsUser } from '@sunbird-cb/utils'
// import { ConnectionHoverService } from './connection-hover.servive'
// import { NSProfileDataV2 } from '../../../profile-v2/models/profile-v2.model'

@Component({
  selector: 'ws-app-connection-name',
  templateUrl: './connection-name.component.html',
  styleUrls: ['./connection-name.component.scss'],
})
export class ConnectionNameComponent implements OnInit, AfterViewInit {
  @Input() hoverUser!: any
  me!: NsUser.IUserProfile
  // hoverUser!: NSProfileDataV2.IProfile
  constructor(
    // private router: Router,
    private activeRoute: ActivatedRoute,
    // private connectionHoverService: ConnectionHoverService,
  ) {
    if (this.activeRoute.parent) {
      this.me = this.activeRoute.parent.snapshot.data.me
    }

  }

  ngOnInit() {
    // const userId = this.user.id || this.user.identifier
    // this.connectionHoverService.fetchProfile(userId).subscribe((fp: NSProfileDataV2.IProfile) => {
    //   this.hoverUser = fp
    // })
  }
  ngAfterViewInit() {

  }
  get getUseravatarName() {
    let name = 'Guest'
    if (this.hoverUser && !this.hoverUser.personalDetails) {
      if (this.hoverUser.firstName) {
        if (this.hoverUser.lastName && this.hoverUser.lastName !== null && this.hoverUser.lastName !== undefined) {
          name = `${this.hoverUser.firstName} ${this.hoverUser.lastName}`
        } else  {
          name = `${this.hoverUser.firstName}`
        }
      } else if (this.hoverUser.fullName) {
        name = `${this.hoverUser.fullName}`
      } else {
        name = `${this.hoverUser.name}`
      }
    } else if (this.hoverUser && this.hoverUser.personalDetails) {
      if (this.hoverUser.personalDetails.middlename) {
        // tslint:disable-next-line:max-line-length
        if (this.hoverUser.personalDetails.surname && this.hoverUser.personalDetails.surname !== null && this.hoverUser.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.hoverUser.personalDetails.firstname} ${this.hoverUser.personalDetails.middlename} ${this.hoverUser.personalDetails.surname}`
        } else {
          name = `${this.hoverUser.personalDetails.firstname} ${this.hoverUser.personalDetails.middlename}`
        }
      } else if (this.hoverUser.personalDetails.firstname) {
        // tslint:disable-next-line:max-line-length
        if (this.hoverUser.personalDetails.surname && this.hoverUser.personalDetails.surname !== null && this.hoverUser.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.hoverUser.personalDetails.firstname} ${this.hoverUser.personalDetails.surname}`
        } else {
          name = `${this.hoverUser.personalDetails.firstname}`
        }
      } else if (this.hoverUser.personalDetails.firstName) {
        // tslint:disable-next-line:max-line-length
        if (this.hoverUser.personalDetails.surname && this.hoverUser.personalDetails.surname !== null && this.hoverUser.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.hoverUser.personalDetails.firstName} ${this.hoverUser.personalDetails.surname}`
        } else {
          name = `${this.hoverUser.personalDetails.firstName}`
        }
      }
    }
    // if (this.hoverUser) {
    //   // tslint:disable-next-line: max-line-length
    //   name = `${this.hoverUser.personalDetails.firstname}
    // ${this.hoverUser.personalDetails.middlename} ${this.hoverUser.personalDetails.surname}`
    // }
    return name
  }
  goToUserProfile() {
    // this.router.navigate(['/app/person-profile', (this.user.id || this.user.identifier)])
    // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: } })
  }
  // get usr() {
  //   // const userId = this.user.id || this.user.identifier
  //   // return this.connectionHoverService.fetchProfile(userId).subscribe()
  //   // return userId
  // }
}
