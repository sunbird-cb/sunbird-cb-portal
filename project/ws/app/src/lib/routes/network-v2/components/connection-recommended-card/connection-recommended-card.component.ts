import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { NetworkV2Service } from '../../services/network-v2.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Router } from '@angular/router'
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-connection-recommended-card',
  templateUrl: './connection-recommended-card.component.html',
  styleUrls: ['./connection-recommended-card.component.scss'],
})
export class ConnectionRecommendedCardComponent implements OnInit {

  @Input() user!: NSNetworkDataV2.INetworkUser
  @Output() connection = new EventEmitter<string>()
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  verifiedBadge = false
  constructor(
    private networkV2Service: NetworkV2Service, private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
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
      } else if (this.user.personalDetails.firstname) {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstname} ${this.user.personalDetails.surname}`
        } else {
          name = `${this.user.personalDetails.firstname}`
        }
      } else {
        // tslint:disable-next-line:max-line-length
        if (this.user.personalDetails.surname && this.user.personalDetails.surname !== null && this.user.personalDetails.surname !== undefined) {
          // tslint:disable-next-line: max-line-length
          name = `${this.user.personalDetails.firstName} ${this.user.personalDetails.surname}`
        } else {
          name = `${this.user.personalDetails.firstName}`
        }
      }
    }
    return name
  }
  connetToUser() {
    const req = {
      connectionId: this.user.id || this.user.identifier || this.user.wid,
      userIdFrom: this.configSvc.userProfileV2 ? this.configSvc.userProfileV2.userId : '',
      userNameFrom: this.configSvc.userProfileV2 ? this.configSvc.userProfileV2.userName : '',
      userDepartmentFrom: this.configSvc.userProfileV2 ? this.configSvc.userProfileV2.departmentName : '',
      userIdTo: this.user.id || this.user.identifier || this.user.wid,
      userNameTo: '',
      userDepartmentTo: '',
    }
    if (this.user.personalDetails) {
      req.userNameTo = `${this.user.personalDetails.firstname}`
      req.userDepartmentTo =  this.user.employmentDetails.departmentName
    }
    if (!this.user.personalDetails && this.user.first_name) {
      req.userNameTo = `${this.user.first_name}${this.user.last_name}`
      req.userDepartmentTo =  this.user.department_name
    }
    if (!this.user.personalDetails && this.user.firstName) {
      req.userNameTo = `${this.user.firstName}`
      req.userDepartmentTo =  this.user.channel
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
    this.router.navigate(['/app/person-profile', (user.userId || user.id)])
    // this.router.navigate(['/app/person-profile'], { queryParams: { emailId: } })
  }

}
