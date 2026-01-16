import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { SignupService } from './signup.service'

@Component({
  selector: 'ws-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: UntypedFormGroup
  unseenCtrl!: UntypedFormControl
  unseenCtrlSub!: Subscription
  uploadSaveData = false
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>

  constructor(
    private snackBar: MatSnackBar,
    private signupService: SignupService,
  ) {
    this.signupForm = new UntypedFormGroup({
      fname: new UntypedFormControl('', [Validators.required]),
      lname: new UntypedFormControl('', [Validators.required]),
      // mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      code: new UntypedFormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    // this.unseenCtrlSub = this.signupForm.valueChanges.subscribe(value => {
    //   console.log('ngOnInit - value', value);
    // })
  }

  ngOnDestroy() {
    if (this.unseenCtrlSub && !this.unseenCtrlSub.closed) {
      this.unseenCtrlSub.unsubscribe()
    }
  }

  onSubmit(form: any) {
    this.uploadSaveData = true
    this.signupService.signup(form.value).subscribe(
      () => {
        form.reset()
        this.uploadSaveData = false
        this.openSnackbar(this.toastSuccess.nativeElement.value)
      },
      err => {
        this.openSnackbar(err.error.split(':')[1])
        this.uploadSaveData = false
      })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

}
