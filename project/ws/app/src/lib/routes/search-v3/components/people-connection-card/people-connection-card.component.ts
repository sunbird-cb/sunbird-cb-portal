import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigurationsService, NsUser } from '@sunbird-cb/utils-v2';
import { NetworkV2Service } from '../../../network-v2/services/network-v2.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar as MatSnackbarNew } from '@angular/material/snack-bar';

const SNACKBAR_DURATION = 3000;
@Component({
  selector: 'ws-app-people-connection-card',
  templateUrl: './people-connection-card.component.html',
  styleUrls: ['./people-connection-card.component.scss'],
})
export class PeopleConnectionCardComponent {
  @Input() user!: any;
  @Input() category!: any;
  @Output() connection = new EventEmitter<string>();
  @Output() telemetry = new EventEmitter<any>();
  currentUser!: NsUser.IUserProfile;
  howerUser!: any;
  unmappedUser!: any;

  constructor(
    private networkV2Service: NetworkV2Service,
    private configSvc: ConfigurationsService,
    private router: Router,
    private translate: TranslateService,
    private matSnackbarNew: MatSnackbarNew
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en');
      const lang = localStorage.getItem('websiteLanguage')!;
      this.translate.use(lang);
    }
  }

  ngOnInit() {
    if (this.configSvc.userProfile) {
      this.currentUser = this.configSvc.userProfile;
    }

    this.howerUser = this.user;
    this.unmappedUser = this.user;
  }

  getUseravatarName() {
    let name = '';
    if (this.user && !this.user.personalDetails) {
      if (this.user.firstName) {
        if (
          this.user.lastName &&
          this.user.lastName !== null &&
          this.user.lastName !== undefined
        ) {
          name = `${this.user.firstName} ${this.user.lastName}`;
        } else {
          name = `${this.user.firstName}`;
        }
      } else if (this.user.fullName) {
        name = `${this.user.fullName}`;
      } else {
        name = `${this.user.name}`;
      }
    } else if (this.user && this.user.personalDetails) {
      if (this.user.personalDetails.middlename) {
        // tslint:disable-next-line:max-line-length
        if (
          this.user.personalDetails.surname &&
          this.user.personalDetails.surname !== null &&
          this.user.personalDetails.surname !== undefined
        ) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename} ${this.user.personalDetails.surname}`;
        } else {
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.middlename}`;
        }
      } else if (this.user.personalDetails.firstname) {
        // tslint:disable-next-line:max-line-length
        if (
          this.user.personalDetails.surname &&
          this.user.personalDetails.surname !== null &&
          this.user.personalDetails.surname !== undefined
        ) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`;
        } else {
          name = `${this.user.personalDetails.firstname}`;
        }
      } else if (this.user.personalDetails.firstName) {
        // tslint:disable-next-line:max-line-length
        if (
          this.user.personalDetails.surname &&
          this.user.personalDetails.surname !== null &&
          this.user.personalDetails.surname !== undefined
        ) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstName} ${this.user.personalDetails.surname}`;
        } else {
          name = `${this.user.personalDetails.firstName}`;
        }
      }
    }
    return name;
  }

  connetToUser() {
    const req = {
      connectionId: this.user.userId || this.user.identifier || this.user.wid,
      userIdFrom: this.currentUser ? this.currentUser.userId : '',
      userNameFrom: this.currentUser ? this.currentUser.userId : '',
      userDepartmentFrom:
        this.currentUser && this.currentUser.departmentName
          ? this.currentUser.departmentName
          : '',
      userIdTo: this.unmappedUser.userId,
      userNameTo: this.user.userId || this.user.identifier || this.user.wid,
      userDepartmentTo: this.unmappedUser.profileDetails?.professionalDetails
        .length
        ? this.unmappedUser.profileDetails?.professionalDetails[0]
            ?.designation
        : this.unmappedUser.rootOrgName,
    };
    this.networkV2Service.createConnection(req).subscribe(
      () => {
        this.connection.emit('connection-updated');
        this.matSnackbarNew.open('Connection request sent.', 'X', {
          duration: SNACKBAR_DURATION,
          panelClass: ['success'],
        });
      },
      () => {
        this.matSnackbarNew.open('Could not send connection request', 'X', {
          duration: SNACKBAR_DURATION,
          panelClass: ['error'],
        });
      }
    );
  }

  goToUserProfile(user: any) {
    user.contentType = 'People'
    user.identifier = user.userId
    this.telemetry.emit(user)
    this.router.navigate(
      ['/app/person-profile', user.userId || user.id || user.wid],
      { fragment: 'profileInfo' }
    );

  }

  get usr() {
    return this.howerUser;
  }

  get userDesignation(): string {
    const professionalDetails = this.user?.profileDetails?.professionalDetails;
  
    if (professionalDetails?.length) {
      const designationItem = professionalDetails.find((item: any) => 'designation' in item);
      const designation = designationItem?.designation ?? '';
      const rootOrgName = this.user?.rootOrgName ?? '';
      return designation ? `${designation} at ${rootOrgName}` : rootOrgName;
    }
  
    return this.user?.rootOrgName ?? '';
  }
}
