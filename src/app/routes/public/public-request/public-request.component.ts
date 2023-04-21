import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import { environment } from 'src/environments/environment'
// tslint:disable-next-line: import-name
import _ from 'lodash'
import { Subscription, Observable, interval } from 'rxjs'
import { map } from 'rxjs/operators'
import { SignupService } from '../public-signup/signup.service'

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
  emailWhitelistPattern = `^[a-zA-Z0-9._-]{3,}\\b@\\b[a-zA-Z0-9]*|\\b(.gov|.nic)\b\\.\\b(in)\\b$`
  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  confirm = false
  disableBtn = false
  isMobileVerified = false
  otpSend = false
  otpVerified = false
  requestType: any
  masterPositions!: Observable<any> | undefined
  emailLengthVal = false
  OTP_TIMER = environment.resendOTPTIme
  timerSubscription: Subscription | null = null
  timeLeftforOTP = 0

  constructor(private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar, private signupSvc: SignupService) {
    this.requestType = this.activatedRoute.snapshot.queryParams.type
    this.requestForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailWhitelistPattern)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
      position: new FormControl('', this.requestType === 'Position'? [Validators.required, forbiddenNamesValidatorPosition(this.masterPositions)]:[]),
      organisation: new FormControl('', this.requestType === 'Organisation' ? Validators.required : []),
      addDetails: new FormControl('', []),
      confirmBox: new FormControl(false, [Validators.required]),
    })
   }

  ngOnInit() {

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

  sendOtp() {
    const mob = this.requestForm.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.signupSvc.sendOtp(mob.value).subscribe(() => {
        this.otpSend = true
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
  resendOTP() {
    const mob = this.requestForm.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.signupSvc.resendOtp(mob.value).subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpSend = true
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

  verifyOtp(otp: any) {
    // console.log(otp)
    const mob = this.requestForm.get('mobile')
    if (otp && otp.value) {
      if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
        this.signupSvc.verifyOTP(otp.value, mob.value).subscribe((res: any) => {
          if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
            this.otpVerified = true
            this.isMobileVerified = true
            this.disableBtn = false
          }
          // tslint:disable-next-line: align
        }, (error: any) => {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
        })
      }
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
        .subscribe(_timeRemaining => {
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

}
