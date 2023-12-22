import { Component, OnInit, Input, AfterViewInit } from '@angular/core'
// import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { ActivatedRoute, Router } from '@angular/router'
import { NsUser } from '@sunbird-cb/utils'
// import { ConnectionHoverService } from './connection-hover.servive'
// import { NSProfileDataV2 } from '../../../profile-v2/models/profile-v2.model'
// import { ConnectionHoverService } from '../connection-name/connection-hover.servive'

@Component({
  selector: 'ws-app-connection-hover-card',
  templateUrl: './connection-hover-card.component.html',
  styleUrls: ['./connection-hover-card.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})
export class ConnectionHoverCardComponent implements OnInit, AfterViewInit {
  @Input() hoverUser!: any
  // @Input() userId!: string
  me!: NsUser.IUserProfile
  // hoverUser!: NSProfileDataV2.IProfile
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    // private connectionHoverService: ConnectionHoverService,
  ) {
    if (this.activeRoute.parent) {
      this.me = this.activeRoute.parent.snapshot.data.me
    }
    // this.connectionHoverService.fetchProfile(this.userId).subscribe((fp: NSProfileDataV2.IProfile) => {
    //   this.hoverUser = fp
    // })
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    // const userId = this.user.id || this.user.identifier
  }
  get getUserName() {
    let name = 'Guest'
    if (this.hoverUser && !this.hoverUser.personalDetails) {
      // tslint:disable-next-line:max-line-length
      if (this.hoverUser.firstName && this.hoverUser.lastName && this.hoverUser.lastName !== null && this.hoverUser.lastName !== undefined) {
      // if (this.hoverUser.firstName) {
        name = `${this.hoverUser.firstName} ${this.hoverUser.lastName}`
      } else if (this.hoverUser.firstName && !this.hoverUser.lastName) {
        name = `${this.hoverUser.firstName}`
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
    return name
  }
  getUseravatarName() {
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
      }  else if (this.hoverUser.personalDetails.firstName) {
        // tslint:disable-next-line:max-line-length
        if (this.hoverUser.personalDetails.surname && this.hoverUser.personalDetails.surname !== null && this.hoverUser.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.hoverUser.personalDetails.firstName} ${this.hoverUser.personalDetails.surname}`
        } else {
          name = `${this.hoverUser.personalDetails.firstName}`
        }
      }
    }
    return name
  }
  goToUserProfile() {
    this.router.navigate(['/app/person-profile', (this.hoverUser.id)], { fragment: 'profileInfo' })
    // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: } })
  }

}
