import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog, MatSnackBar } from '@angular/material'
import { environment } from 'src/environments/environment'
// tslint:disable-next-line: import-name
import _ from 'lodash'
import { Subscription, Observable } from 'rxjs'

import { v4 as uuid } from 'uuid'
import { RequestService } from 'src/app/routes/public/public-request/request.service'
import { RequestSuccessDialogComponent } from 'src/app/routes/public/public-request/request-success-dialog/request-success-dialog.component'

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
  selector: 'ws-app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.scss'],
})
export class RequestDialogComponent implements OnInit {
  requestForm!: FormGroup
  namePatern = `[a-zA-Z\\s\\']{1,32}$`
  // emailWhitelistPattern = `^[a-zA-Z0-9._-]{3,}\\b@\\b[a-zA-Z0-9]*|\\b(.gov|.nic)\b\\.\\b(in)\\b$`
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

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              // private signupSvc: SignupService,
              private dialog: MatDialog,
              private requestSvc: RequestService,
              // private _location: Location
              ) {
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
      // tslint:disable-next-line:max-line-length
      designation: new FormControl('', this.requestType === 'Position' ? [Validators.pattern(this.customCharsPattern),
        Validators.required, forbiddenNamesValidatorPosition(this.masterPositions)] : []),

    })
    if (this.userform) {
      this.requestForm.patchValue({
        // organisation: this.userform.organisation ? this.userform.organisation : '',
        // domain: this.userform.domain ? this.modifyDomain(this.userform.domain) : '',
      })
      // this.requestForm.controls['firstname'].markAsTouched()
      // this.requestForm.controls['email'].markAsTouched()
      // this.requestForm.controls['mobile'].markAsTouched()
      // this.requestForm.controls['confirmBox'].markAsTouched()
    }
   }

  ngOnInit() {
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
          position: this.requestForm.value.designation,
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

  // public goBackUrl() {
  //   const formData = this.requestForm.value
  //   tslint:disable-next-line: max-line-length
  //   this.signupSvc.updateSignUpData({firstname: formData.firstname, mobile: formData.mobile, email: formData.email, isMobileVerified: this.isMobileVerified , isEmailVerified: this.isEmailVerified })
  //   this._location.back()
  // }
}
