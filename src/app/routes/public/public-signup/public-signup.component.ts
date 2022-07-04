import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core'
import { Subscription, Observable } from 'rxjs'
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms'
import { SignupService } from './signup.service'
import { LoggerService, ConfigurationsService, NsInstanceConfig } from '@sunbird-cb/utils/src/public-api'
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { MatSnackBar, MatDialog } from '@angular/material'
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { SignupSuccessDialogueComponent } from './signup-success-dialogue/signup-success-dialogue/signup-success-dialogue.component'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'

export function forbiddenNamesValidator(optionsArray: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!optionsArray) {
      return null
      // tslint:disable-next-line: no-else-after-return
    } else {
      const index = optionsArray.findIndex((op: any) => {
        // tslint:disable-next-line: prefer-template
        // return new RegExp('^' + op.channel + '$').test(control.channel)
        return op.channel === control.value.channel
      })
      return index < 0 ? { forbiddenNames: { value: control.value.channel } } : null
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
  selector: 'ws-public-signup',
  templateUrl: './public-signup.component.html',
  styleUrls: ['./public-signup.component.scss'],
})

export class PublicSignupComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup
  namePatern = `^[a-zA-Z\\s\\']{1,32}$`
  emailWhitelistPattern = `^[a-zA-Z0-9._-]{3,}\\b@\\b[a-zA-Z0-9]*|\\b(.gov|.nic)\b\\.\\b(in)\\b$`
  departments!: any
  masterDepartments!: Observable<any> | undefined
  masterDepartmentsOriginal!: []
  positionsOriginal!: []
  postions!: any
  masterPositions!: Observable<any> | undefined
  telemetryConfig: NsInstanceConfig.ITelemetryConfig | null = null
  portalID = ''
  confirm = false

  private subscriptionContact: Subscription | null = null
  private recaptchaSubscription!: Subscription

  constructor(
    private signupSvc: SignupService,
    private loggerSvc: LoggerService,
    private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private recaptchaV3Service: ReCaptchaV3Service,
    @Inject(DOCUMENT) private _document: any,
    @Inject(PLATFORM_ID) private _platformId: any,
  ) {
    this.registrationForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      lastname: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      position: new FormControl('', [Validators.required, forbiddenNamesValidatorPosition(this.masterPositions)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailWhitelistPattern)]),
      department: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterDepartments)]),
      confirmBox: new FormControl(false, [Validators.required]),
      // recaptchaReactive: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit() {
    this.fetchDepartments()
    const instanceConfig = this.configSvc.instanceConfig
    this.positionsOriginal = this.configSvc.positions || []
    this.onPositionsChange()
    if (instanceConfig) {
      this.telemetryConfig = instanceConfig.telemetryConfig
      this.portalID = `${this.telemetryConfig.pdata.id}`
    }

    if (isPlatformBrowser(this._platformId)) {
      this._document.body.classList.add('cs-recaptcha')
    }
  }

  fetchDepartments() {
    this.signupSvc.getDepartments().subscribe(
      (res: any) =>  {
        if (res && res.result) {
          this.masterDepartmentsOriginal = res.result.content
          this.onDepartmentsChange()
        }
      },
      (err: any) => {
        this.loggerSvc.error('USER RATING FETCH ERROR >', err)
      }
    )
  }

  onDepartmentsChange(): void {

    // tslint:disable-next-line: no-non-null-assertion
    this.masterDepartments = this.registrationForm.get('department')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map(name => name ? this.filterDepartments(name) : this.masterDepartmentsOriginal.slice())
      )

      this.masterDepartments.subscribe((event: any) => {
        // tslint:disable-next-line: no-non-null-assertion
        this.registrationForm.get('department')!.setValidators([Validators.required, forbiddenNamesValidator(event)])
        this.registrationForm.updateValueAndValidity()
      })
  }

  onPositionsChange() {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterPositions = this.registrationForm.get('position')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map(name => name ? this.filterPositions(name) : this.positionsOriginal.slice())
      )

      this.masterPositions.subscribe((event: any) => {
        // tslint:disable-next-line: no-non-null-assertion
        this.registrationForm.get('position')!.setValidators([Validators.required, forbiddenNamesValidatorPosition(event)])
        this.registrationForm.updateValueAndValidity()
      })
  }

  private filterDepartments(name: string): any {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.masterDepartmentsOriginal.filter((option: any) => option.channel.toLowerCase().includes(filterValue))
    }
    return this.masterDepartmentsOriginal
  }

  private filterPositions(name: string): any {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.positionsOriginal.filter((option: any) => option.name.toLowerCase().includes(filterValue))
    }
    return this.positionsOriginal
  }

  public confirmChange() {
    this.confirm = !this.confirm
    this.registrationForm.patchValue({
      confirmBox: this.confirm,
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
  }

  displayFn = (value: any) =>  {
    return value ? value.channel : undefined
  }

  displayFnPosition = (value: any) =>  {
    return value ? value.name : undefined
  }

  signup() {

    this.recaptchaSubscription = this.recaptchaV3Service.execute('importantAction')
    .subscribe(
      _token => {
        // tslint:disable-next-line: no-console
        console.log('captcha validation success')

        // perform signup operations
        const req = {
          firstName: this.registrationForm.value.firstname || '',
          lastName: this.registrationForm.value.lastname || '',
          email: this.registrationForm.value.email || '',
          deptId: this.registrationForm.value.department.identifier || '',
          deptName: this.registrationForm.value.department.channel || '',
          position: this.registrationForm.value.position.name || '',
          source: `${environment.name}.${this.portalID}` || '',
        }

        // console.log('req: ', req)

        this.signupSvc.register(req).subscribe(
          (_res: any) =>  {
            // console.log('success', res)
            this.openDialog()
          },
          (err: any) => {
            this.loggerSvc.error('Error in registering new user >', err)
            if (err.error && err.error.params && err.error.params.errmsg) {
              this.openSnackbar(err.error.params.errmsg)
            } else {
              this.openSnackbar('Something went wrong, please try again later!')
            }
            // this.dialogRef.close(false)
          }
        )
      },
      error => {
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
}