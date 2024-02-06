import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core'
import { Subscription, Observable, interval } from 'rxjs'
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms'
import { SignupService } from './signup.service'
import { LoggerService, ConfigurationsService, NsInstanceConfig } from '@sunbird-cb/utils/src/public-api'
import { startWith, map, pairwise } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { MatSnackBar, MatDialog } from '@angular/material'
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { SignupSuccessDialogueComponent } from './signup-success-dialogue/signup-success-dialogue/signup-success-dialogue.component'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'
// tslint:disable-next-line: import-name
import _ from 'lodash'
import { ActivatedRoute, Router } from '@angular/router'
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component'

// export function forbiddenNamesValidator(optionsArray: any): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     if (!optionsArray) {
//       return null
//       // tslint:disable-next-line: no-else-after-return
//     } else {
//       const index = optionsArray.findIndex((op: any) => {
//         // tslint:disable-next-line: prefer-template
//         // return new RegExp('^' + op.channel + '$').test(control.channel)
//         // return op.channel === control.value.channel
//         return op.channel === control.value.channel
//       })
//       return index < 0 ? { forbiddenNames: { value: control.value.channel } } : null
//     }
//   }
// }

export function forbiddenNamesValidator(optionsArray: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!optionsArray) {
      return null
      // tslint:disable-next-line: no-else-after-return
    } else {
      if (control.value) {
        const index = optionsArray.findIndex((op: any) => {
          // tslint:disable-next-line: prefer-template
          // return new RegExp('^' + op.orgname + '$').test(control.orgname)
          return op.orgname === control.value.orgname
        })
        return index < 0 ? { forbiddenNames: { value: control.value.orgname } } : null
      }
      return null
    }
  }
}

export function forbiddenNamesValidatorNonEmpty(optionsArray: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!optionsArray) {
      return null
      // tslint:disable-next-line: no-else-after-return
    } else {
      const index = optionsArray.findIndex((op: any) => {
        // tslint:disable-next-line: prefer-template
        // return new RegExp('^' + op.orgname + '$').test(control.orgname)
        return op.orgname === control.value.orgname
      })
      return index < 0 ? { forbiddenNames: { value: control.value.orgname } } : null
    }
  }
}

// export function forbiddenNamesValidatorPosition(optionsArray: any): ValidatorFn {
//   return (control: AbstractControl): { [key: string]: any } | null => {
//     if (!optionsArray) {
//       return null
//       // tslint:disable-next-line: no-else-after-return
//     } else {
//       const index = optionsArray.findIndex((op: any) => {
//         // tslint:disable-next-line: prefer-template
//         // return new RegExp('^' + op.channel + '$').test(control.channel)
//         return op.name === control.value.name
//       })
//       return index < 0 ? { forbiddenNames: { value: control.value && control.value.name ? control.value.name : null} } : null
//     }
//   }
// }

@Component({
  selector: 'ws-public-signup',
  templateUrl: './public-signup.component.html',
  styleUrls: ['./public-signup.component.scss'],
})

export class PublicSignupComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup
  // namePatern = `^[a-zA-Z']{1,32}$`
  namePatern = `[a-zA-Z\\s\\']{1,32}$`
  // emailWhitelistPattern = `^[a-zA-Z0-9._-]{3,}\\b@\\b[a-zA-Z0-9]*|\\b(.gov|.nic)\b\\.\\b(in)\\b$`
  customCharsPattern = `^[a-zA-Z0-9 \\w\-\&\(\)]*$`
  positionsOriginal!: []
  postions!: any
  // masterPositions!: Observable<any> | undefined
  masterGroup: any
  telemetryConfig: NsInstanceConfig.ITelemetryConfig | null = null
  portalID = ''
  confirm = false
  confirmTerms = false
  disableBtn = false
  disableVerifyBtn = false
  orgRequired = false
  ministeries: any[] = []
  masterMinisteries!: Observable<any> | undefined
  orgs: any[] = []
  masterOrgs!: Observable<any> | undefined
  emailLengthVal = false
  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  isMobileVerified = false
  isEmailVerified = false
  otpSend = false
  otpEmailSend = false
  otpVerified = false
  OTP_TIMER = environment.resendOTPTIme
  timerSubscription: Subscription | null = null
  timeLeftforOTP = 0
  timeLeftforOTPEmail = 0
  timerSubscriptionEmail: Subscription | null = null
  OTP_TIMER_EMAIL = environment.resendOTPTIme
  filteredOrgList!: any
  orgList: any
  resultFetched = false
  heirarchyObject: any
  hideOrg = false
  emailPattern = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`

  private subscriptionContact: Subscription | null = null
  private recaptchaSubscription!: Subscription
  private userdataSubscription!: Subscription
  searching = false
  groupsOriginal: any = []

  constructor(
    private signupSvc: SignupService,
    private loggerSvc: LoggerService,
    private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service,
    private router: Router,
    @Inject(DOCUMENT) private _document: any,
    @Inject(PLATFORM_ID) private _platformId: any,
  ) {
    let userData: any = {}
    this.userdataSubscription = this.signupSvc.updateSignupDataObservable.subscribe((res: any) => {
      userData = res
    })
    this.isMobileVerified = userData && userData.isMobileVerified || false
    this.isEmailVerified = userData && userData.isEmailVerified || false
    this.registrationForm = new FormGroup({
      firstname: new FormControl(userData && userData.firstname || '', [Validators.required, Validators.pattern(this.namePatern)]),
      // lastname: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      // tslint:disable-next-line:max-line-length
      // position: new FormControl('', [Validators.required,  Validators.pattern(this.customCharsPattern), forbiddenNamesValidatorPosition(this.masterPositions)]),
      // tslint:disable-next-line:max-line-length
      group: new FormControl('', [Validators.required]),
      // tslint:disable-next-line:max-line-length
      email: new FormControl(userData && userData.email || '', [Validators.required, Validators.pattern(this.emailPattern)]),
      // department: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterDepartments)]),
      mobile: new FormControl(userData && userData.mobile || '', [Validators.required,
        Validators.pattern(this.phoneNumberPattern), Validators.maxLength(12)]),
      confirmBox: new FormControl(false, [Validators.required]),
      confirmTermsBox: new FormControl(false, [Validators.required]),
      type: new FormControl('ministry', [Validators.required]),
      // ministry: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterMinisteries)]),
      // department: new FormControl('', [forbiddenNamesValidator(this.masterDepartments)]),
      // organisation: new FormControl('', [Validators.required, Validators.pattern(this.customCharsPattern)]),
      organisation: new FormControl('', [Validators.required]),
      // recaptchaReactive: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit() {
    // this.fetchDropDownValues('ministry')
    const instanceConfig = this.configSvc.instanceConfig
    this.positionsOriginal = this.activatedRoute.snapshot.data.positions.data || []
    if (this.activatedRoute.snapshot.data.group.data) {
      this.groupsOriginal = this.activatedRoute.snapshot.data.group.data.filter((ele: any) => ele !== 'Others')
      this.masterGroup = this.groupsOriginal
    } else {
      this.groupsOriginal = []
    }

    this.OrgsSearchChange()
    // this.onPositionsChange()
    // this.onGroupChange()
    this.onPhoneChange()
    this.onEmailChange()
    if (instanceConfig) {
      this.telemetryConfig = instanceConfig.telemetryConfig
      this.portalID = `${this.telemetryConfig.pdata.id}`
    }

    if (isPlatformBrowser(this._platformId)) {
      this._document.body.classList.add('cs-recaptcha')
    }
  }

  get typeValueStartCase() {
    // tslint:disable-next-line: no-non-null-assertion
    return _.startCase(this.registrationForm.get('type')!.value)
  }

  get typeValue() {
    // tslint:disable-next-line: no-non-null-assertion
    return this.registrationForm.get('type')!.value
  }

  emailVerification(emailId: string) {
    this.emailLengthVal = false
    if (emailId && emailId.length > 0) {
      const email = emailId.split('@')
      if (email && email.length === 2) {
        if ((email[0] && email[0].length > 64) || (email[1] && email[1].length > 255)) {
          this.emailLengthVal = true
        }
      } else {
        this.emailLengthVal = false
      }
    }
  }

  clearValues() {
    // tslint:disable-next-line: no-non-null-assertion
    this.registrationForm.get('organisation')!.setValue('')
    this.heirarchyObject = null
  }

  // onPositionsChange() {
  //   // tslint:disable-next-line: no-non-null-assertion
  //   this.masterPositions = this.registrationForm.get('position')!.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       startWith(''),
  //       map(value => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
  //       map(name => name ? this.filterPositions(name) : this.positionsOriginal.slice())
  //     )

  //   this.masterPositions.subscribe((event: any) => {
  //     // tslint:disable-next-line: no-non-null-assertion
  //     this.registrationForm.get('position')!.setValidators([Validators.required, forbiddenNamesValidatorPosition(event)])
  //     this.registrationForm.updateValueAndValidity()
  //   })
  // }

  // onGroupChange() {
  //   // tslint:disable-next-line: no-non-null-assertion
  //   this.masterGroup = this.registrationForm.get('group')!.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       startWith(''),
  //       map((value: any) => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
  //       map((name: any) => name ? this.filterGroups(name) : this.groupsOriginal.slice())
  //     )

  //   this.masterGroup.subscribe((event: any) => {
  //     // tslint:disable-next-line: no-non-null-assertion
  //     this.registrationForm.get('group')!.setValidators([Validators.required])
  //     this.registrationForm.updateValueAndValidity()
  //   })
  // }

  filterOrgsSearch(orgname: string = '') {
      const filterValue = orgname.toLowerCase()
      return this.signupSvc.searchOrgs(filterValue, this.typeValue).subscribe((res: any) => {
        this.resultFetched = true
        this.searching = false
        this.filteredOrgList =  res.result.response.filter((org: any) => {
          return org.orgName.toLowerCase().indexOf(filterValue) >= 0
        })
      },                                                                      (err: any) => {
        this.searching = false
        this.loggerSvc.error('Error in fetching organisations >', err)
        if (err.error && err.error.params && err.error.params.errmsg) {
          this.openSnackbar(err.error.params.errmsg)
        } else {
          this.openSnackbar('Something went wrong, please try again later!')
        }
      })
  }

  async searchOrgs(searchValue: string) {
    this.searching = true
    if (!searchValue) {
      this.openSnackbar('Please enter your organisation name')
      this.searching = false
      return
    }
    await this.filterOrgsSearch(searchValue)
    // console.log('this.filteredOrgList :: ', this.filteredOrgList)
  }

  editOrg() {
    this.hideOrg = false
    this.resultFetched = false
    this.searching = false
    this.clearValues()
    this.heirarchyObject = null
  }

  // tslint:disable-next-line:function-name
  OrgsSearchChange() {
    // tslint:disable-next-line:no-non-null-assertion
    this.registrationForm.get('organisation')!.valueChanges.subscribe(() => {
      this.resultFetched = false
      this.registrationForm.updateValueAndValidity()
    })
  }

  orgClicked(event: any) {
    if (event) {
      if (event.option && event.option.value && event.option.value.orgName) {
        const frmctr = this.registrationForm.get('organisation') as FormControl
        frmctr.setValue(_.get(event, 'option.value.orgName') || '')
        // frmctr.patchValue(_.get(event, 'option.value') || '')
        this.heirarchyObject = _.get(event, 'option.value')
        this.hideOrg = true
      } else {
        this.hideOrg = false
      }
    }
  }

  // private filterPositions(name: string): any {
  //   if (name) {
  //     const filterValue = name.toLowerCase()
  //     return this.positionsOriginal.filter((option: any) => option.name.toLowerCase().includes(filterValue))
  //   }
  //   return this.positionsOriginal
  // }

  // private filterGroups(name: string): any {
  //   if (name) {
  //     const filterValue = name.toLowerCase()
  //     return this.groupsOriginal.filter((option: any) => option.toLowerCase().includes(filterValue))
  //   }
  //   return this.groupsOriginal
  // }

  onPhoneChange() {
    const ctrl = this.registrationForm.get('mobile')
    if (ctrl) {
      ctrl
        .valueChanges
        .pipe(startWith(null), pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          if (!(prev == null && next)) {
            this.isMobileVerified = false
            this.otpSend = false
            this.disableVerifyBtn = false
          }
        })
    }
  }

  onEmailChange() {
    const ctrl = this.registrationForm.get('email')
    if (ctrl) {
      ctrl
        .valueChanges
        .pipe(startWith(null), pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          if (!(prev == null && next)) {
            this.isEmailVerified = false
            this.otpEmailSend = false
          }
        })
    }
  }

  sendOtp() {
    const mob = this.registrationForm.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.signupSvc.sendOtp(mob.value, 'phone').subscribe(() => {
        this.otpSend = true
        alert('An OTP has been sent to your mobile number (valid for 15 minutes)')
        this.startCountDown()
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid mobile number')
    }
  }

  resendOTP() {
    const mob = this.registrationForm.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.signupSvc.resendOtp(mob.value, 'phone').subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpSend = true
          this.disableVerifyBtn = false
          alert('An OTP has been sent to your mobile number (valid for 15 minutes)')
          this.startCountDown()
        }
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid mobile number')
    }
  }

  verifyOtp(otp: any) {
    // console.log(otp)
    const mob = this.registrationForm.get('mobile')

    if (otp && otp.value) {
      if (otp && otp.value.length < 4) {
        this.snackBar.open('Please enter a valid OTP.')
      } else if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
        this.signupSvc.verifyOTP(otp.value, mob.value, 'phone').subscribe((res: any) => {
          if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
            this.otpVerified = true
            this.isMobileVerified = true
            this.disableBtn = false
            // const reqUpdates = {
            //   request: {
            //     userId: this.configSvc.unMappedUser.id,
            //     profileDetails: {
            //       personalDetails: {
            //         mobile: mob.value,
            //         phoneVerified: true,
            //       },
            //     },
            //   },
            // }
            // this.userProfileSvc.editProfileDetails(reqUpdates).subscribe((updateRes: any) => {
            //   if (updateRes) {
            //     this.isMobileVerified = true
            //   }
            // })
          }
          // tslint:disable-next-line: align
        }, (error: any) => {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
          if (error.error && error.error.result) {
            this.disableVerifyBtn = error.error.result.remainingAttempt === 0 ? true : false
          }
        })
      }
    } else {
      this.snackBar.open('Please enter a valid OTP.')
    }
  }
  startCountDown() {
    const startTime = Date.now()
    this.timeLeftforOTP = this.OTP_TIMER
    // && this.primaryCategory !== this.ePrimaryCategory.PRACTICE_RESOURCE
    if (this.OTP_TIMER > 0
    ) {
      this.timerSubscription = interval(1000)
        .pipe(
          map(
            () =>
              startTime + this.OTP_TIMER - Date.now(),
          ),
        )
        .subscribe((_timeRemaining: any) => {
          this.timeLeftforOTP -= 1
          if (this.timeLeftforOTP < 0) {
            this.timeLeftforOTP = 0
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe()
            }
            // this.submitQuiz()
          }
        })
    }
  }

  sendOtpEmail() {
    const email = this.registrationForm.get('email')
    if (email && email.value && email.valid) {
      this.signupSvc.sendOtp(email.value, 'email').subscribe(() => {
        this.otpEmailSend = true
        alert('An OTP has been sent to your email address (valid for 15 minutes)')
        this.startCountDownEmail()
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid email address.')
    }
  }

  resendOTPEmail() {
    const email = this.registrationForm.get('email')
    if (email && email.value && email.valid) {
      this.signupSvc.resendOtp(email.value, 'email').subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpEmailSend = true
          alert('An OTP has been sent to your email address (valid for 15 minutes)')
          this.startCountDownEmail()
        }
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid email address.')
    }
  }

  verifyOtpEmail(otp: any) {
    // console.log(otp)
    const email = this.registrationForm.get('email')
    if (otp && otp.value) {
      if (otp && otp.value.length < 4) {
        this.snackBar.open('Please enter a valid OTP.')
      } else if (email && email.value && email.valid) {
        this.signupSvc.verifyOTP(otp.value, email.value, 'email').subscribe((res: any) => {
          if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
            this.otpEmailSend = true
            this.isEmailVerified = true
            this.disableBtn = false
            // const reqUpdates = {
            //   request: {
            //     userId: this.configSvc.unMappedUser.id,
            //     profileDetails: {
            //       personalDetails: {
            //         mobile: mob.value,
            //         phoneVerified: true,
            //       },
            //     },
            //   },
            // }
            // this.userProfileSvc.editProfileDetails(reqUpdates).subscribe((updateRes: any) => {
            //   if (updateRes) {
            //     this.isMobileVerified = true
            //   }
            // })
          }
          // tslint:disable-next-line: align
        }, (error: any) => {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
        })
      }
    } else {
      this.snackBar.open('Please enter a valid OTP.')
    }
  }
  startCountDownEmail() {
    const startTime = Date.now()
    this.timeLeftforOTPEmail = this.OTP_TIMER_EMAIL
    // && this.primaryCategory !== this.ePrimaryCategory.PRACTICE_RESOURCE
    if (this.OTP_TIMER_EMAIL > 0
    ) {
      this.timerSubscriptionEmail = interval(1000)
        .pipe(
          map(
            () =>
              startTime + this.OTP_TIMER_EMAIL - Date.now(),
          ),
        )
        .subscribe(_timeRemaining => {
          this.timeLeftforOTPEmail -= 1
          if (this.timeLeftforOTPEmail < 0) {
            this.timeLeftforOTPEmail = 0
            if (this.timerSubscriptionEmail) {
              this.timerSubscriptionEmail.unsubscribe()
            }
            // this.submitQuiz()
          }
        })
    }
  }

  public confirmChange() {
    this.confirm = !this.confirm
    this.registrationForm.patchValue({
      confirmBox: this.confirm,
    })
  }

  public confirmTermsChange() {
    this.confirmTerms = !this.confirmTerms
    this.registrationForm.patchValue({
      confirmTermsBox: this.confirmTerms,
    })
  }

  displayFn = (value: any) => {
    return value ? value.channel : undefined
  }

  displayFnPosition = (value: any) => {
    return value ? value.name : undefined
  }

  displayFnGroup = (value: any) => {
    return value ? value : undefined
  }

  displayFnOrg = (value: any) => {
    return value ? value.orgName : ''
  }

  signup() {
    this.disableBtn = true
    this.recaptchaSubscription = this.recaptchaV3Service.execute('importantAction')
      .subscribe(
        _token => {
          // tslint:disable-next-line: no-console
          console.log('captcha validation success')
          let req: any
          if (this.heirarchyObject) {
            req = {
              firstName: this.registrationForm.value.firstname || '',
              // lastName: this.registrationForm.value.lastname || '',
              email: this.registrationForm.value.email || '',
              phone: `${this.registrationForm.value.mobile}` || '',
              // position: this.registrationForm.value.position.name || '',
              group: this.registrationForm.value.group || '',
              source: `${environment.name}.${this.portalID}` || '',
              orgName: this.heirarchyObject.orgName || '',
              channel: this.heirarchyObject.channel || '',
              organisationType: this.heirarchyObject.sbOrgType || '',
              organisationSubType: this.heirarchyObject.sbOrgSubType || '',
              mapId: this.heirarchyObject.mapId || '',
              sbRootOrgId: this.heirarchyObject.sbRootOrgId,
              sbOrgId: this.heirarchyObject.sbOrgId,
            }
          }

          // console.log('req ===: ', req)

          this.signupSvc.register(req).subscribe(
            (_res: any) => {
              this.openDialog()
              this.disableBtn = false
              this.isMobileVerified = true
            },
            (err: any) => {
              this.disableBtn = false
              this.loggerSvc.error('Error in registering new user >', err)
              if (err.error && err.error.params && err.error.params.errmsg) {
                this.openSnackbar(err.error.params.errmsg)
              } else {
                this.openSnackbar('Something went wrong, please try again later!')
              }
            }
          )
        },
        error => {
          this.disableBtn = false
          // tslint:disable-next-line: no-console
          console.error('captcha validation error', error)
          this.openSnackbar(`reCAPTCHA validation failed: ${error}`)
        }
      )
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SignupSuccessDialogueComponent, {
      // height: '400px',
      width: '500px',
      // data: { content, userId: this.userId, userRating: this.userRating },
    })
    dialogRef.afterClosed().subscribe((_result: any) => {
    })
  }

  termsAndConditionClick() {
    const dialogRef = this.dialog.open(TermsAndConditionComponent, {
      maxHeight: 'auto',
      height: '90%',
      width: '90%',
      minHeight: 'auto',
    })
    dialogRef.afterClosed().subscribe((_result: any) => {
      if (_result) {
        this.confirmTerms = _result
      }
     })
  }

  ngOnDestroy() {
    if (this.subscriptionContact) {
      this.subscriptionContact.unsubscribe()
    }
    if (this.recaptchaSubscription) {
      this.recaptchaSubscription.unsubscribe()
    }

    if (isPlatformBrowser(this._platformId)) {
      this._document.body.classList.remove('cs-recaptcha')
    }
    if (this.userdataSubscription) {
      this.userdataSubscription.unsubscribe()
    }
  }

  // Getters
  // get ministry(): FormControl {
  //   return this.registrationForm.get('ministry') as FormControl
  // }
  // get department(): FormControl {
  //   return this.registrationForm.get('department') as FormControl
  // }
  // get organisation(): FormControl {
  //   return this.registrationForm.get('organisation') as FormControl
  // }

  navigateTo(param?: any) {
    const formData = this.registrationForm.value
    const url = '/public/request'
    // tslint:disable-next-line: max-line-length
    this.router.navigate([url], {  queryParams: { type: param }, state: { userform: formData, isMobileVerified: this.isMobileVerified , isEmailVerified: this.isEmailVerified } })
  }

  numericOnly(event: any): boolean {
    const pattren = /^([0-9])$/
    const result = pattren.test(event.key)
    return result
  }
}
