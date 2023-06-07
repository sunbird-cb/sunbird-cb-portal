import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MatDialog, MatSnackBar } from '@angular/material'
import { environment } from 'src/environments/environment'
// tslint:disable-next-line: import-name
import _ from 'lodash'
import { Subscription, Observable, interval } from 'rxjs'
import { map } from 'rxjs/operators'
import { SignupService } from '../public-signup/signup.service'
import { RequestService } from './request.service'
import { RequestSuccessDialogComponent } from './request-success-dialog/request-success-dialog.component'
import { v4 as uuid } from 'uuid'

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
  // domainPattern = `([a-z0-9A-Z]\.)*[a-z0-9-]+\.([a-z0-9]{2,24})+(\.co\.([a-z0-9]{2,24})|\.([a-z0-9]{2,24}))*`
  domainPattern = `([a-z0-9\-]+\.){1,2}[a-z]{2,4}`
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
  // tslint:disable-next-line:max-line-length
  requestObj: { state: string; action: string; serviceName: string; userId: string;
    applicationId: string; actorUserId: string; deptName: string; updateFieldValues: any}  | undefined
  formobj: { toValue: {} ; fieldKey: any; description: any; firstName: any; email: any; mobile: any} | undefined

  constructor(private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private signupSvc: SignupService,
              private dialog: MatDialog,
              private requestSvc: RequestService) {
    this.requestType = this.activatedRoute.snapshot.queryParams.type
    this.requestForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      // tslint:disable-next-line:max-line-length
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9_-]+(?:\.[a-z0-9_-]+)*@((?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?){2,}\.){1,3}(?:\w){2,}$/)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
      // tslint:disable-next-line:max-line-length
      position: new FormControl('', this.requestType === 'Position' ? [Validators.pattern(this.customCharsPattern),
        Validators.required, forbiddenNamesValidatorPosition(this.masterPositions)] : []),
      // tslint:disable-next-line:max-line-length
      organisation: new FormControl('', this.requestType === 'Organisation' ? [Validators.required, Validators.pattern(this.customCharsPattern)] : []),
      domain: new FormControl('', this.requestType === 'Domain' ? [Validators.required, Validators.pattern(this.domainPattern)] : []),
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
          this.openDialog(this.requestType)
          this.disableBtn = false
          this.isMobileVerified = true
          this.requestForm.reset()
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
          this.openDialog(this.requestType)
          this.disableBtn = false
          this.isMobileVerified = true
          this.requestForm.reset()
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
          domain: this.requestForm.value.domain,
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
          this.openDialog(this.requestType)
          this.disableBtn = false
          this.isMobileVerified = true
          this.requestForm.reset()
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

  openDialog(type: any): void {
    const dialogRef = this.dialog.open(RequestSuccessDialogComponent, {
      // height: '400px',
      width: '500px',
      data:  { requestType: type },
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
}
