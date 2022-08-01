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
// tslint:disable-next-line: import-name
import _ from 'lodash'

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
  namePatern = `^[a-zA-Z']{1,32}$`
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
  disableBtn = false
  orgRequired = false
  ministeries: any[] = []
  masterMinisteries!: Observable<any> | undefined
  orgs: any[] = []
  masterOrgs!: Observable<any> | undefined

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
      // department: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterDepartments)]),
      confirmBox: new FormControl(false, [Validators.required]),
      type: new FormControl('ministry', [Validators.required]),
      ministry: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterMinisteries)]),
      department: new FormControl('', [forbiddenNamesValidator(this.masterDepartments)]),
      organisation: new FormControl('', [forbiddenNamesValidator(this.masterOrgs)]),
      // recaptchaReactive: new FormControl(null, [Validators.required]),
    })
  }

  ngOnInit() {
    this.fetchDropDownValues('ministry')
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

    // tslint:disable-next-line: no-non-null-assertion
    this.registrationForm.get('type')!.valueChanges.subscribe((value: any) => {
      if (value) {
        this.fetchDropDownValues(value)
      }
  })
  }

  get typeValueStartCase() {
    // tslint:disable-next-line: no-non-null-assertion
    return _.startCase(this.registrationForm.get('type')!.value)
  }

  get typeValue() {
    // tslint:disable-next-line: no-non-null-assertion
    return this.registrationForm.get('type')!.value
  }

  fetchDropDownValues(type: string) {
    this.clearValues()
    if (type === 'state') {
      this.signupSvc.getStatesOrMinisteries('state').subscribe(res => {
        if (res && res.result && res.result && res.result.response && res.result.response.content) {
          this.ministeries = res.result.response.content
          this.onMinisteriesChange()
        }
      })
    }
    if (type === 'ministry') {
        this.signupSvc.getStatesOrMinisteries('ministry').subscribe(res => {
          if (res && res.result && res.result && res.result.response && res.result.response.content) {
            this.ministeries = res.result.response.content
            this.onMinisteriesChange()
          }
        })
    }
  }

  clearValues() {
    // tslint:disable-next-line: no-non-null-assertion
    this.registrationForm.get('ministry')!.setValue('')
    // tslint:disable-next-line: no-non-null-assertion
    this.registrationForm.get('department')!.setValue('')
    // tslint:disable-next-line: no-non-null-assertion
    this.registrationForm.get('organisation')!.setValue('')
  }

  onMinisteriesChange() {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterMinisteries = this.registrationForm.get('ministry')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.orgname ? value.orgname : '')),
        map(orgname => orgname ? this.filterMinisteries(orgname) : this.ministeries.slice())
      )

    this.masterMinisteries.subscribe((event: any) => {
      // tslint:disable-next-line: no-non-null-assertion
      this.registrationForm.get('ministry')!.setValidators([Validators.required, forbiddenNamesValidator(event)])
      this.registrationForm.updateValueAndValidity()
    })
  }

  onDepartmentChange() {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterDepartments = this.registrationForm.get('department')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.orgname ? value.orgname : '')),
        map(orgname => orgname ? this.filterDepartments(orgname) : this.departments.slice())
      )

    this.masterDepartments.subscribe((event: any) => {
      // tslint:disable-next-line: no-non-null-assertion
      this.registrationForm.get('department')!.setValidators([forbiddenNamesValidator(event)])
      // tslint:disable-next-line: no-non-null-assertion
      // this.registrationForm.get('department')!.setValidators(null)
      this.registrationForm.updateValueAndValidity()
    })
  }
  onOrgsChange() {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterOrgs = this.registrationForm.get('organisation')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.orgname ? value.orgname : '')),
        map(orgname => orgname ? this.filterOrgs(orgname) : this.orgs.slice())
      )

    this.masterOrgs.subscribe((_event: any) => {
      // tslint:disable-next-line: no-non-null-assertion
      // this.registrationForm.get('organisation')!.setValidators([forbiddenNamesValidator(event)])
      // tslint:disable-next-line: no-non-null-assertion
      // this.registrationForm.get('organisation')!.setValidators(null)
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

  filterMinisteries(orgname: string) {
    if (orgname) {
      const filterValue = orgname.toLowerCase()
      return this.ministeries.filter((option: any) => option.orgname.toLowerCase().includes(filterValue))
    }
    return this.ministeries
  }

  filterDepartments(orgname: string) {
    if (orgname) {
      const filterValue = orgname.toLowerCase()
      return this.departments.filter((option: any) => option.orgname.toLowerCase().includes(filterValue))
    }
    return this.departments
  }

  filterOrgs(orgname: string) {
    if (orgname) {
      const filterValue = orgname.toLowerCase()
      return this.orgs.filter((option: any) => option.orgname.toLowerCase().includes(filterValue))
    }
    return this.orgs
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

  displayFn = (value: any) =>  {
    return value ? value.channel : undefined
  }

  displayFnPosition = (value: any) =>  {
    return value ? value.name : undefined
  }

  signup() {
    this.disableBtn = true
    this.recaptchaSubscription = this.recaptchaV3Service.execute('importantAction')
    .subscribe(
      _token => {
        // tslint:disable-next-line: no-console
        console.log('captcha validation success')

        // to get the org details from either ministry/state, or department or organisation which ever user has filled
        let hierarchyObj
        let req: any
        if (this.registrationForm.value.ministry) {
          hierarchyObj = this.registrationForm.value.ministry
          if (this.registrationForm.value.department) {
            hierarchyObj = this.registrationForm.value.department
            if (this.registrationForm.value.organisation) {
              hierarchyObj = this.registrationForm.value.organisation
            }
          }
        }
        // console.log('hierarchyObj: ', hierarchyObj)
        if (hierarchyObj) {
          req = {
            firstName: this.registrationForm.value.firstname || '',
            lastName: this.registrationForm.value.lastname || '',
            email: this.registrationForm.value.email || '',
            // deptId: this.registrationForm.value.department.identifier || '',
            // deptName: this.registrationForm.value.department.channel || '',
            position: this.registrationForm.value.position.name || '',
            source: `${environment.name}.${this.portalID}` || '',
            orgName: hierarchyObj.orgname || '',
            channel: hierarchyObj.orgname || '',
            organisationType: hierarchyObj.sborgtype || '',
            organisationSubType: hierarchyObj.sbsuborgtype || '',
            mapId: hierarchyObj.mapid || '',
            sbRootOrgId: hierarchyObj.sbrootorgid,
            sbOrgId: hierarchyObj.sborgid,
          }
        }

        // console.log('req: ', req)

        this.signupSvc.register(req).subscribe(
          (_res: any) =>  {
            // console.log('success', res)
            this.openDialog()
            this.disableBtn = false
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

  ministrySelected(value: any) {
    if (value && value.mapid) {
      this.signupSvc.getDeparmentsOfState(value.mapid).subscribe(res => {
        if (res && res.result && res.result && res.result.response && res.result.response.content) {
          this.departments = res.result.response.content

          // to reset department and organisation values when minstry/state is changed
          // tslint:disable-next-line: no-non-null-assertion
          this.registrationForm.get('department')!.setValue('')
          // tslint:disable-next-line: no-non-null-assertion
          this.registrationForm.get('organisation')!.setValue('')
          this.onDepartmentChange()
        }
      })
    }
  }

  departmentSelected(value: any) {
    if (value && value.mapid) {
      this.signupSvc.getOrgsOfDepartment(value.mapid).subscribe(res => {
        if (res && res.result && res.result && res.result.response && res.result.response.content) {
          this.orgs = res.result.response.content

           // If value in department is NA then make the organisation field as required
            // tslint:disable-next-line: no-non-null-assertion
            // const value = this.registrationForm.get('department')!.value
            if (value && (value.orgname === 'NA' || value.orgname === 'na')) {
              this.orgRequired = true
              // tslint:disable-next-line: no-non-null-assertion
              this.registrationForm.get('organisation')!.setValidators([Validators.required, forbiddenNamesValidatorNonEmpty(this.orgs)])
            } else {
              this.orgRequired = false
              // tslint:disable-next-line: no-non-null-assertion
              this.registrationForm.get('organisation')!.setValidators([forbiddenNamesValidator(this.orgs)])
            }
          // to reset organisation values when department is changed
          // tslint:disable-next-line: no-non-null-assertion
          this.registrationForm.get('organisation')!.setValue('')
          this.registrationForm.updateValueAndValidity()
          this.onOrgsChange()
        }
      })
    }
  }

  displayFnState = (value: any) => {
    return value ? value.orgname : undefined
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
}
