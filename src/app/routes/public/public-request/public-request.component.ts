import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog, MatSnackBar } from '@angular/material'
import { environment } from 'src/environments/environment'
// tslint:disable-next-line: import-name
import _ from 'lodash'
import { Subscription, Observable, interval, of } from 'rxjs'
import { catchError, map, pairwise, startWith } from 'rxjs/operators'
import { SignupService } from '../public-signup/signup.service'
import { RequestService } from './request.service'
import { RequestSuccessDialogComponent } from './request-success-dialog/request-success-dialog.component'
import { v4 as uuid } from 'uuid'
import { Location } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'
import { HttpClient } from '@angular/common/http'

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
  selector: 'ws-public-request',
  templateUrl: './public-request.component.html',
  styleUrls: ['./public-request.component.scss'],
})
export class PublicRequestComponent implements OnInit {
  requestForm!: FormGroup
  namePatern = `[a-zA-Z\\s\\']{1,32}$`
  // emailWhitelistPattern = `^[a-zA-Z0-9._-]{3,}\\b@\\b[a-zA-Z0-9]*|\\b(.gov|.nic)\b\\.\\b(in)\\b$`
  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  customCharsPattern = `^[a-zA-Z0-9 \\w\-\&\(\)]*$`
  customCharsPatternOrg = `^[a-zA-Z0-9 \\w\-\&,\(\)]*$`
  // domainPattern = `([a-z0-9A-Z]\.)*[a-z0-9-]+\.([a-z0-9]{2,24})+(\.co\.([a-z0-9]{2,24})|\.([a-z0-9]{2,24}))*`
  domainPattern = `^@([a-z0-9\-]+\.){1,2}[a-z]{2,4}`
  confirm = false
  disableBtn = false
  disableVerifyBtn = false
  disableEmailVerifyBtn = false
  isMobileVerified = false
  isEmailVerified = false
  otpEmailSend = false
  timeLeftforOTPEmail = 0
  otpSend = false
  otpVerified = false
  requestType: any
  masterPositions!: Observable<any> | undefined
  emailLengthVal = false
  OTP_TIMER = environment.resendOTPTIme
  OTP_TIMER_EMAIL = environment.resendOTPTIme
  timerSubscriptionEmail: Subscription | null = null
  timerSubscription: Subscription | null = null
  timeLeftforOTP = 0
  emailPattern = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
  // tslint:disable-next-line:max-line-length
  requestObj: { state: string; action: string; serviceName: string; userId: string;
    applicationId: string; actorUserId: string; deptName: string; updateFieldValues: any}  | undefined
  formobj: { toValue: {} ; fieldKey: any; description: any; firstName: any; email: any; mobile: any} | undefined
  userform: any
  selectedLanguage = 'en'
  multiLang: any = []
  isMultiLangEnabled: any

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private signupSvc: SignupService,
              private dialog: MatDialog,
              private requestSvc: RequestService,
              private _location: Location,
              private configSvc: ConfigurationsService,
              private http: HttpClient,
              private langtranslations: MultilingualTranslationsService,
              private translate: TranslateService) {
    const navigation = this.router.getCurrentNavigation()
    if (navigation) {
      const extraData = navigation.extras.state as {
        userform: any
        isMobileVerified: boolean
        isEmailVerified: boolean
      }
      this.userform = extraData.userform
      this.isMobileVerified = extraData.isMobileVerified
      this.isEmailVerified = extraData.isEmailVerified
    }
    this.requestType = this.activatedRoute.snapshot.queryParams.type
    this.requestForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      // tslint:disable-next-line:max-line-length
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
      // tslint:disable-next-line:max-line-length
      position: new FormControl('', this.requestType === 'Position' ? [Validators.pattern(this.customCharsPattern),
        Validators.required, forbiddenNamesValidatorPosition(this.masterPositions)] : []),
      // tslint:disable-next-line:max-line-length
      organisation: new FormControl('', this.requestType === 'Organisation' ? [Validators.required, Validators.pattern(this.customCharsPatternOrg)] : []),
      domain: new FormControl('', this.requestType === 'Domain' ? [Validators.required, Validators.pattern(this.domainPattern)] : []),
      addDetails: new FormControl('', []),
      confirmBox: new FormControl(false, [Validators.required]),
    })
    if (this.userform) {
      this.requestForm.patchValue({
        firstname: this.userform.firstname ? this.userform.firstname : '',
        email: this.userform.email ? this.userform.email : '',
        mobile: this.userform.mobile ? this.userform.mobile : '',
        organisation: this.userform.organisation ? this.userform.organisation : '',
        domain: this.userform.domain ? this.modifyDomain(this.userform.domain) : '',
        addDetails: this.userform.addDetails ? this.userform.addDetails : '',
        confirmBox: this.userform.confirmBox ? this.userform.confirmBox : '',
      })
      this.confirm = this.userform.confirmBox
      // this.requestForm.controls['firstname'].markAsTouched()
      // this.requestForm.controls['email'].markAsTouched()
      // this.requestForm.controls['mobile'].markAsTouched()
      // this.requestForm.controls['confirmBox'].markAsTouched()
    }

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
      lang = lang.replace(/\"/g, '')
      this.selectedLanguage = lang
      this.translate.use(lang)
    } else {
      this.translate.setDefaultLang('en')
      localStorage.setItem('websiteLanguage', 'en')
    }
    this.getHeaderFooterConfiguration().subscribe((sectionData: any) => {
      const topnavconfig = sectionData.data.topRightNavConfig
      topnavconfig.forEach((item: any) => {
        if (item.section === 'language') {
          this.isMultiLangEnabled = item.active
        }
      })
    })
   }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.multiLang = instanceConfig.webistelanguages
    }

    this.onPhoneChange()
    this.onEmailChange()
  }

  modifyDomain(domainName: string) {
    if (domainName.includes('@')) {
      return domainName.replace('@', '')
    }
    return domainName
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

  onPhoneChange() {
    const ctrl = this.requestForm.get('mobile')
    if (ctrl) {
      ctrl
        .valueChanges
        .pipe(startWith(null), pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          if (!(prev == null && next)) {
            this.isMobileVerified = false
            this.disableVerifyBtn = false
            this.otpSend = false
          }
        })
    }
  }

  onEmailChange() {
    const ctrl = this.requestForm.get('email')
    if (ctrl) {
      ctrl
        .valueChanges
        .pipe(startWith(null), pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          if (!(prev == null && next)) {
            this.isEmailVerified = false
            this.disableEmailVerifyBtn = false
            this.otpEmailSend = false
          }
        })
    }
  }

  sendOtp() {
    const mob = this.requestForm.get('mobile')
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
    const mob = this.requestForm.get('mobile')
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
    const mob = this.requestForm.get('mobile')
    if (otp && otp.value) {
      if (otp && otp.value.length < 4) {
        this.snackBar.open('Please enter a valid OTP.')
      } else if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
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
    } else {
      this.snackBar.open('Please enter a valid OTP.')
    }
  }

  verifyOtpEmail(otp: any) {
    // console.log(otp)
    const email = this.requestForm.get('email')
    if (email && email.value && otp) {
      if (email && email.value && email.valid) {
        this.signupSvc.verifyOTP(otp.value, email.value, 'email').subscribe((res: any) => {
          if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
            this.otpEmailSend = true
            this.isEmailVerified = true
            this.disableBtn = false
          }
          // tslint:disable-next-line: align
        }, (error: any) => {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
          if (error.error && error.error.result) {
            this.disableEmailVerifyBtn = error.error.result.remainingAttempt === 0 ? true : false
          }
        })
      }
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
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe()
            }
            // this.submitQuiz()
          }
        })
    }
  }

  sendOtpEmail() {
    const email = this.requestForm.get('email')
    if (email && email.value && email.valid) {
      this.requestSvc.sendOtp(email.value, 'email').subscribe(() => {
        this.otpEmailSend = true
        alert('An OTP has been sent to your email address (valid for 15 minutes)')
        this.startCountDownEmail()
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid email')
    }
  }

  resendOTPEmail() {
    const email = this.requestForm.get('email')
    if (email && email.value && email.valid) {
      this.requestSvc.resendOtp(email.value, 'email').subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpEmailSend = true
          this.disableEmailVerifyBtn = false
          alert('An OTP has been sent to your email address (valid for 15 minutes)')
          this.startCountDownEmail()
        }
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid email')
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
          }
        })
    }
  }

  public confirmChange() {
    this.confirm = !this.confirm
    this.requestForm.patchValue({
      confirmBox: this.confirm,
    })
  }

  submitRequest() {
    const reqType = this.requestType.toLowerCase()
    // tslint:disable-next-line:no-console
    console.log('this.requestForm', this.requestForm.value)
    const uniqueID = uuid()
    this.requestObj = {
      state: 'INITIATE',
      action: 'INITIATE',
      serviceName: reqType,
      userId: uniqueID,
      applicationId: uniqueID,
      actorUserId: uniqueID,
      deptName : 'iGOT',
      updateFieldValues: [],
    }

    if (this.requestType === 'Position') {
      this.formobj = {
        toValue: {
          position: this.requestForm.value.position,
        },
        fieldKey: reqType,
        description: this.requestForm.value.addDetails || '',
        firstName: this.requestForm.value.firstname || '',
        email: this.requestForm.value.email || '',
        mobile: this.requestForm.value.mobile || '',
      }
      this.requestObj.updateFieldValues.push(this.formobj)

      // this.openDialog(this.requestType)

      this.requestSvc.createPosition(this.requestObj).subscribe(
        (_res: any) => {
          this.openDialog(this.requestType, _res)
          this.disableBtn = false
          this.isMobileVerified = true
          this.clearForm()
        },
        (err: any) => {
          this.disableBtn = false
          if (err.error && err.error.params && err.error.params.errmsg) {
            this.openSnackbar(err.error.params.errmsg)
          } else {
            this.openSnackbar('Something went wrong, please try again later!')
          }
        }
      )
    } else if (this.requestType === 'Organisation') {
      this.formobj = {
        toValue: {
          organisation: this.requestForm.value.organisation,
        },
        fieldKey: reqType,
        description: this.requestForm.value.addDetails || '',
        firstName: this.requestForm.value.firstname || '',
        email: this.requestForm.value.email || '',
        mobile: this.requestForm.value.mobile || '',
      }
      this.requestObj.updateFieldValues.push(this.formobj)

      // this.openDialog(this.requestType)

      this.requestSvc.createOrg(this.requestObj).subscribe(
        (_res: any) => {
          this.openDialog(this.requestType, _res)
          this.disableBtn = false
          this.isMobileVerified = true
          this.clearForm()
        },
        (err: any) => {
          this.disableBtn = false
          if (err.error && err.error.params && err.error.params.errmsg) {
            this.openSnackbar(err.error.params.errmsg)
          } else {
            this.openSnackbar('Something went wrong, please try again later!')
          }
        }
      )
    } else if (this.requestType === 'Domain') {
      this.formobj = {
        toValue: {
          domain: this.modifyDomain(this.requestForm.value.domain),
        },
        fieldKey: reqType,
        description: this.requestForm.value.addDetails || '',
        firstName: this.requestForm.value.firstname || '',
        email: this.requestForm.value.email || '',
        mobile: this.requestForm.value.mobile || '',
      }
      this.requestObj.updateFieldValues.push(this.formobj)
      // this.openDialog(this.requestType)

      this.requestSvc.createDomain(this.requestObj).subscribe(
        (_res: any) => {
          this.openDialog(this.requestType, _res)
          this.disableBtn = false
          this.isMobileVerified = true
          this.clearForm()
        },
        (err: any) => {
          this.disableBtn = false
          if (err.error && err.error.params && err.error.params.errmsg) {
            this.openSnackbar(err.error.params.errmsg)
          } else {
            this.openSnackbar('Something went wrong, please try again later!')
          }
        }
      )
    }
  }

  clearForm() {
    this.requestForm.reset()
    Object.keys(this.requestForm.controls).forEach(control => {
      this.requestForm.controls[control].setErrors(null)
    })
  }

  openDialog(type: any, res: any): void {
    const dialogRef = this.dialog.open(RequestSuccessDialogComponent, {
      // height: '400px',
      width: '500px',
      data:  { requestType: type, apiResponse: res },
      // data: { content, userId: this.userId, userRating: this.userRating },
    })
    dialogRef.afterClosed().subscribe((_result: any) => {
    })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  public goBackUrl() {
    const formData = this.requestForm.value
    this.signupSvc.updateSignUpData({
      firstname: formData.firstname,
      mobile: formData.mobile, email: formData.email,
      isMobileVerified: this.isMobileVerified,
      isEmailVerified: this.isEmailVerified })
    this._location.back()
  }
  numericOnly(event: any): boolean {
    const pattren = /^([0-9])$/
    const result = pattren.test(event.key)
    return result
  }

  selectLanguage(event: any) {
    this.selectedLanguage = event
    localStorage.setItem('websiteLanguage', this.selectedLanguage)
    this.langtranslations.updatelanguageSelected(true, this.selectedLanguage, '')
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

  getHeaderFooterConfiguration() {
    const baseUrl = this.configSvc.sitePath
    // tslint:disable-next-line: prefer-template
    return this.http.get(baseUrl + '/page/home.json').pipe(
      map(data => ({ data, error: null })),
      catchError(err => of({ data: null, error: err })),
    )
  }
}
