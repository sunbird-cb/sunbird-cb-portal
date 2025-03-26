import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription, Observable, interval } from 'rxjs'
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms'
import { WelcomeUsersService } from './public-welcome.service'
import { SignupService } from '../public-signup/signup.service'
import { LoggerService, ConfigurationsService, NsInstanceConfig } from '@sunbird-cb/utils-v2'
import { debounceTime, distinctUntilChanged, startWith, map, pairwise } from 'rxjs/operators'
import { MatSnackBar } from '@angular/material'
// import { ReCaptchaV3Service } from 'ng-recaptcha'
// import { DOCUMENT, isPlatformBrowser } from '@angular/common'
// tslint:disable-next-line: import-name
import _ from 'lodash'
import { ActivatedRoute, Router } from '@angular/router'
import { InitService } from 'src/app/services/init.service'
import { environment } from 'src/environments/environment'

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
                    return op.orgName === control.value.orgName
                })
                return index < 0 ? { forbiddenNames: { value: control.value.orgName } } : null
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
                return op.orgName === control.value.orgName
            })
            return index < 0 ? { forbiddenNames: { value: control.value.orgName } } : null
        }
    }
}

export function forbiddenNamesValidatorPosition(optionsArray: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!optionsArray) {
            return null
            // tslint:disable-next-line: no-else-after-return
        } else {
            const index = optionsArray.findIndex((op: any) => {
                // tslint:disable-next-line: prefer-template
                // return new RegExp('^' + op.channel + '$').test(control.channel)
                return op.name === control.value.name
            })
            return index < 0 ? { forbiddenNames: { value: control.value.name } } : null
        }
    }
}

@Component({
    selector: 'ws-public-welcome',
    templateUrl: './public-welcome.component.html',
    styleUrls: ['./public-welcome.component.scss'],
})

export class PublicWelcomeComponent implements OnInit, OnDestroy {
    registrationForm!: FormGroup
    namePatern = `^[a-zA-Z\\s\\']{1,32}$`
    emailWhitelistPattern = `^[a-zA-Z0-9._-]{3,}\\b@\\b[a-zA-Z0-9]*|\\b(.gov|.nic)\b\\.\\b(in)\\b$`
    telemetryConfig: NsInstanceConfig.ITelemetryConfig | null = null
    portalID = ''
    confirm = false
    disableBtn = false
    orgRequired = false
    ministeries: any[] = []
    masterMinisteries!: Observable<any> | undefined
    orgs: any[] = []
    masterOrgs!: Observable<any> | undefined
    usr: any
    private subscriptionContact: Subscription | null = null
    groupsOriginal: any = []
    masterGroup!: Observable<any> | undefined
    customCharsPattern = `^[a-zA-Z0-9 \\w\-\&\(\)]*$`
    phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
    timeLeftforOTP = 0
    OTP_TIMER = environment.resendOTPTIme
    timerSubscription: Subscription | null = null
    isMobileVerified = false
    otpSend = false
    otpVerified = false
    disableVerifyBtn = false
    filteredOrgList!: any
    orgList: any
    resultFetched = false
    heirarchyObject: any
    hideOrg = false
    searching = false
    isEmailVerified = false

    constructor(
        private welcomeSignupSvc: WelcomeUsersService,
        private signupSvc: SignupService,
        private loggerSvc: LoggerService,
        private configSvc: ConfigurationsService,
        private snackBar: MatSnackBar,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private initSvc: InitService,
        // private recaptchaV3Service: ReCaptchaV3Service,
        // @Inject(DOCUMENT) private _document: any,
        // @Inject(PLATFORM_ID) private _platformId: any,
    ) {
        this.usr = _.get(this.activatedRoute, 'snapshot.data.userData.data')
        if (!this.usr.isUpdateRequired) {
            if (!this.configSvc || !this.configSvc.userProfileV2) {
                this.fetch().then(() => {
                    this.router.navigate(['/page/home'])
                })
            } else {
                this.router.navigate(['/page/home'])
            }
        } else {
            if (!this.configSvc || !this.configSvc.userProfileV2) {
                this.fetch().then(() => {
                    this.init()
                })
            } else {
                this.init()
            }
        }
        // this.init()
    }
    async fetch() {
        await this.initSvc.init()
    }
    init() {
        // tslint:disable
        const fullname = this.usr && this.usr.firstName ? this.usr.firstName + (this.usr.lastName ? ` ${this.usr.lastName}`: '') : ''
        this.isEmailVerified = this.usr && this.usr.email ? true : false
        let mobileDisabled = false
        if (this.usr.phone) {
          this.isMobileVerified = true
          mobileDisabled = true
        }
        this.registrationForm = new FormGroup({
            firstname: new FormControl(fullname || '', [Validators.required, Validators.pattern(this.namePatern)]),
            // lastname: new FormControl(_.get(this.usr, 'lastName') || '', [Validators.required, Validators.pattern(this.namePatern)]),
            // tslint:disable-next-line:max-line-length
            group: new FormControl('', [Validators.required,  Validators.pattern(this.customCharsPattern), forbiddenNamesValidatorPosition(this.masterGroup)]),
            email: new FormControl({ value: _.get(this.usr, 'email') || '', disabled: true }, [Validators.required, Validators.pattern(this.emailWhitelistPattern)]),
            // department: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterDepartments)]),
            mobile: new FormControl({ value: _.get(this.usr, 'phone') || '', disabled: mobileDisabled }, [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
            confirmBox: new FormControl(false, [Validators.required]),
            type: new FormControl('ministry', [Validators.required]),
            // ministry: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterMinisteries)]),
            // department: new FormControl('', [forbiddenNamesValidator(this.masterDepartments)]),
            organisation: new FormControl('', [Validators.required, Validators.pattern(this.customCharsPattern)]),
            // recaptchaReactive: new FormControl(null, [Validators.required]),
        })
        // tslint:enable
    }
    ngOnInit() {
        if (this.registrationForm) {
            const instanceConfig = this.configSvc.instanceConfig
            if (this.activatedRoute.snapshot.data.group.data) {
              this.groupsOriginal = this.activatedRoute.snapshot.data.group.data.filter((ele: any) => ele !== 'Others')
            } else {
              this.groupsOriginal = []
            }
            this.OrgsSearchChange()
            this.onGroupChange()
            if (instanceConfig) {
                this.telemetryConfig = instanceConfig.telemetryConfig
                this.portalID = `${this.telemetryConfig.pdata.id}`
            }
        }
        this.onPhoneChange()
    }

    get typeValueStartCase() {
        // tslint:disable-next-line: no-non-null-assertion
        return _.startCase(this.registrationForm.get('type')!.value)
    }

    get typeValue() {
        // tslint:disable-next-line: no-non-null-assertion
        return this.registrationForm.get('type')!.value
    }

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
        this.openSnackbar('Please enter organisation to search')
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

    clearValues() {
        // tslint:disable-next-line: no-non-null-assertion
        this.registrationForm.get('organisation')!.setValue('')
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

    onGroupChange() {
        // tslint:disable-next-line: no-non-null-assertion
        this.masterGroup = this.registrationForm.get('group')!.valueChanges
          .pipe(
            debounceTime(500),
            distinctUntilChanged(),
            startWith(''),
            map((value: any) => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
            map((name: any) => name ? this.filterGroups(name) : this.groupsOriginal.slice())
          )
        this.masterGroup.subscribe((event: any) => {
          // tslint:disable-next-line: no-non-null-assertion
          this.registrationForm.get('group')!.setValidators([Validators.required, forbiddenNamesValidatorPosition(event)])
          this.registrationForm.updateValueAndValidity()
        })
    }
    private filterGroups(name: string): any {
    if (name) {
        const filterValue = name.toLowerCase()
        return this.groupsOriginal.filter((option: any) => option.toLowerCase().includes(filterValue))
    }
    return this.groupsOriginal
    }

    public confirmChange() {
        this.confirm = !this.confirm
        this.registrationForm.patchValue({
            confirmBox: this.confirm,
        })
    }

    displayFn = (value: any) => {
        return value ? value.channel : undefined
    }

    displayFnGroup = (value: any) => {
        return value ? value : undefined
      }

    signup() {
        this.disableBtn = true
        let req: any
        if (this.heirarchyObject) {
            req = {
                request: {
                    userId: this.usr.userId,
                    firstName: this.registrationForm.value.firstname || '',
                    // lastName: this.registrationForm.value.lastname || '',
                    group: this.registrationForm.value.group || '',
                    phone: `${this.registrationForm.value.mobile}` || '',
                    orgName: this.heirarchyObject.orgName,
                    channel: this.heirarchyObject.channel || '',
                    sbOrgId: this.heirarchyObject.sbOrgId,
                    mapId: this.heirarchyObject.mapId || '',
                    sbRootOrgId: this.heirarchyObject.sbRootOrgId,
                    organisationType: this.heirarchyObject.sbOrgType || '',
                    organisationSubType: this.heirarchyObject.sbOrgSubType || '',
                },
            }
        }

        this.welcomeSignupSvc.register(req).subscribe(
            (_res: any) => {
                this.disableBtn = false
                this.configSvc.updateGlobalProfile(true)
                // this.router.navigate(['/app/setup'])
                this.router.navigate(['/page/home'])
            },
            (err: any) => {
                this.disableBtn = false
                this.loggerSvc.error('Error in registering new user >', err)
                if (err.error && err.error.params && err.error.params.errmsg) {
                    this.openSnackbar(err.error.params.errmsg)
                } else {
                    this.openSnackbar('Something went wrong, please try again later!')
                }
                // this.dialogRef.close(false)
            }
        )
        //   }
        // ,
        //   error => {
        //     this.disableBtn = false
        //     // tslint:disable-next-line: no-console
        //     console.error('captcha validation error', error)
        //     this.openSnackbar(`reCAPTCHA validation failed: ${error}`)
        //   }
        // )
    }

    private openSnackbar(primaryMsg: string, duration: number = 5000) {
        this.snackBar.open(primaryMsg, 'X', {
            duration,
        })
    }

    openDialog(): void {
        // const dialogRef = this.dialog.open(SignupSuccessDialogueComponent, {
        //   // height: '400px',
        //   width: '500px',
        //   // data: { content, userId: this.userId, userRating: this.userRating },
        // })
        // dialogRef.afterClosed().subscribe((_result: any) => {
        // })
    }

    displayFnState = (value: any) => {
        return value ? value.orgName : undefined
    }

    ngOnDestroy() {
        if (this.subscriptionContact) {
            this.subscriptionContact.unsubscribe()
        }
        // if (this.recaptchaSubscription) {
        //     this.recaptchaSubscription.unsubscribe()
        // }

        // if (isPlatformBrowser(this._platformId)) {
        //     this._document.body.classList.remove('cs-recaptcha')
        // }
    }
    // resend otp countdown start
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
            .subscribe(_timeRemaining => {
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
    //   resend otp countdown end
    //   onPhoneChange method start
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
              }
            })
        }
      }
    //   onPhoneChange method end
    //   sendOtp method start
      sendOtp() {
        const mob = this.registrationForm.get('mobile')
        if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
          this.signupSvc.sendOtp(mob.value, 'phone').subscribe(() => {
            this.otpSend = true
            this.disableVerifyBtn = false
            alert('OTP send to your Mobile Number')
            this.startCountDown()
            // tslint:disable-next-line: align
          }, (error: any) => {
            this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
          })
        } else {
          this.snackBar.open('Please enter a valid Mobile No')
        }
      }
    //   sendOtp method end
    //   resendOTP method start
      resendOTP() {
        const mob = this.registrationForm.get('mobile')
        if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
          this.signupSvc.resendOtp(mob.value, 'phone').subscribe((res: any) => {
            if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
              this.otpSend = true
              this.disableVerifyBtn = false
              alert('OTP send to your Mobile Number')
              this.startCountDown()
            }
            // tslint:disable-next-line: align
          }, (error: any) => {
            this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
          })
        } else {
          this.snackBar.open('Please enter a valid Mobile No')
        }
      }
    // resendOTP method end
    // verifyOtp method start
      verifyOtp(otp: any) {
        // console.log(otp)
        const mob = this.registrationForm.get('mobile')
        if (otp && otp.value) {
          if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
            this.signupSvc.verifyOTP(otp.value, mob.value, 'phone').subscribe((res: any) => {
              if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
                this.otpVerified = true
                this.isMobileVerified = true
                this.disableBtn = false
              }
              // tslint:disable-next-line: align
            }, (error: any) => {
              this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
              if (error.error && error.error.result) {
                this.disableVerifyBtn = error.error.result.remainingAttempt === 0 ? true : false
              }
            })
          }
        }
      }
    //   verifyOtp method end

    navigateTo(param?: any) {
        const formData = this.registrationForm.getRawValue()
        const url = '/public/request'
        // tslint:disable-next-line:max-line-length
        this.router.navigate([url], {  queryParams: { type: param }, state: { userform: formData, isMobileVerified: this.isMobileVerified, isEmailVerified: this.isEmailVerified } })
    }
}
