import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core'
import { Subscription, Observable, interval } from 'rxjs'
import { UntypedFormGroup, UntypedFormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms'
import { SignupService } from './signup.service'
import { LoggerService, ConfigurationsService, NsInstanceConfig, MultilingualTranslationsService, WsEvents, EventService, TelemetryService } from '@sunbird-cb/utils-v2'
import { startWith, map, pairwise, debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { SignupSuccessDialogueComponent } from './signup-success-dialogue/signup-success-dialogue/signup-success-dialogue.component'
import { DOCUMENT, isPlatformBrowser } from '@angular/common'
// tslint:disable-next-line: import-name
import _ from 'lodash'
import { ActivatedRoute, Router } from '@angular/router'
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component'
import { TranslateService } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { DomSanitizer } from '@angular/platform-browser'
import { DialogBoxComponent as ZohoDialogComponent } from '@ws/app/src/lib/routes/profile-v3/components/dialog-box/dialog-box.component'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { UserProfileService } from '@ws/app/src/lib/routes/user-profile/services/user-profile.service'

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
  @ViewChild('designation', { read: ElementRef }) designationRef?: ElementRef
  @ViewChild('ministry', { read: ElementRef }) ministryRef?: ElementRef
  @ViewChild('state', { read: ElementRef }) stateRef?: ElementRef
  @ViewChild('department', { read: ElementRef }) departmentRef?: ElementRef
  @ViewChild('organisation', { read: ElementRef }) organisationRef?: ElementRef
  registrationFormStepOne!: UntypedFormGroup
  registrationFormStepTwo!: UntypedFormGroup
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
  filteredOrgList: any = [{
    "id": -1,
    "orgName": "N/A",
    "channel": "N/A",
    "mapId": "N/A",
    "orgCode": null,
    "parentMapId": null,
    "sbOrgId": "N/A",
    "sbRootOrgId": null,
    "sbOrgType": "N/A",
    "sbOrgSubType": "N/A",
    "l1MapId": null,
    "l2MapId": null,
    "l3MapId": null,
    "l1OrgName": null,
    "l2OrgName": null
  }]
  orgList: any
  resultFetched = false
  heirarchyObject: any
  hideOrg = false
  emailPattern = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
  zohoHtml: any
  zohoUrl: any = '/assets/static-data/zoho-code.html'
  environment!: any
  desigantionFilterEnable = false
  isLoadingMoreDesignations = false;
  designationOffset = 0
  odcsDesignationCount = 0
  defaultSearchDesignationCount = 0
  designationListLoadCount = 50
  designationDefaultLoadCount = 50
  noMoreLegacyDesignations = false
  designationSearchText = ''
  designationInitInProgress = false
  scrollListenerAttached = false
  nodalRedirectionUrl = ''

  /* ministry variables */
  ministryFilterEnable = false
  isLoadingMoreMinistrys = false;
  ministryOffset = 0
  defaultSearchMinistryCount = 0
  ministryListLoadCount = 50
  ministryDefaultLoadCount = 50
  noMoreLegacyMinistrys = false
  ministrySearchText = ''
  ministryInitInProgress = false

  /* State Variables */

  stateFilterEnable = false
  isLoadingMoreStates = false;
  stateOffset = 0
  defaultSearchStateCount = 0
  stateListLoadCount = 50
  stateDefaultLoadCount = 50
  noMoreLegacyStates = false
  stateSearchText = ''
  stateInitInProgress = false

  /* Department variables */

  departmentFilterEnable = false
  isLoadingMoreDepartments = false;
  departmentOffset = 0
  defaultSearchDepartmentCount = 0
  departmentListLoadCount = 50
  departmentDefaultLoadCount = 50
  noMoreLegacyDepartments = false
  departmentSearchText = ''
  departmentInitInProgress = false

  /* Department variables */

  organisationFilterEnable = false
  isLoadingMoreOrganisations = false;
  organisationOffset = 0
  defaultSearchOrganisationCount = 0
  organisationListLoadCount = 50
  organisationDefaultLoadCount = 50
  noMoreLegacyOrganisations = false
  organisationSearchText = ''
  organisationInitInProgress = false

  currentMinistry: any = {}

  private subscriptionContact: Subscription | null = null
  private recaptchaSubscription!: Subscription
  private userdataSubscription!: Subscription
  searching = false
  groupsOriginal: any = []

  selectedLanguage = 'en'
  multiLang: any = []
  isMultiLangEnabled: any
  masterData: any = {}
  currentStep = 'step1'
  constructor(
    private signupSvc: SignupService,
    private usersService: UserProfileService,
    private loggerSvc: LoggerService,
    private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service,
    private router: Router,
    @Inject(DOCUMENT) private _document: any,
    @Inject(PLATFORM_ID) private _platformId: any,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private eventService: EventService,
    private telemetrySvc: TelemetryService
  ) {

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

    let userData: any = {}
    this.userdataSubscription = this.signupSvc.updateSignupDataObservable.subscribe((res: any) => {
      userData = res
    })
    this.isMobileVerified = userData && userData.isMobileVerified || false
    this.isEmailVerified = userData && userData.isEmailVerified || false
    this.registrationFormStepOne = new UntypedFormGroup({

      email: new UntypedFormControl(userData && userData.email || '', [Validators.required, Validators.pattern(this.emailPattern)]),
      type: new UntypedFormControl('ministry', [Validators.required]),
      // ministry: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterMinisteries)]),
      // department: new FormControl('', [forbiddenNamesValidator(this.masterDepartments)]),
      // organisation: new FormControl('', [Validators.required, Validators.pattern(this.customCharsPattern)]),
      ministry: new UntypedFormControl('', [Validators.required]),
      searchMinistry: new UntypedFormControl('', []),
      organisation: new UntypedFormControl('', [Validators.required]),
      searchOrganisation: new UntypedFormControl('', []),
      // recaptchaReactive: new FormControl(null, [Validators.required]),
      position: new UntypedFormControl('', [Validators.required]),
      searchDesignation: new UntypedFormControl('', []),
      state: new UntypedFormControl('', []),
      searchState: new UntypedFormControl('', []),
      department: new UntypedFormControl('', []),
      searchDepartment: new UntypedFormControl('', []),
    })
    this.registrationFormStepTwo = new UntypedFormGroup({
      firstname: new UntypedFormControl(userData && userData.firstname || '', [Validators.required, Validators.pattern(this.namePatern)]),
      // lastname: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      // tslint:disable-next-line:max-line-length
      // position: new FormControl('', [Validators.required,  Validators.pattern(this.customCharsPattern), forbiddenNamesValidatorPosition(this.masterPositions)]),
      // tslint:disable-next-line:max-line-length
      group: new UntypedFormControl('', [Validators.required]),

      // department: new FormControl('', [Validators.required, forbiddenNamesValidator(this.masterDepartments)]),
      mobile: new UntypedFormControl(userData && userData.mobile || '', [Validators.required,
      Validators.pattern(this.phoneNumberPattern), Validators.maxLength(12)]),
      confirmBox: new UntypedFormControl(false, [Validators.required]),
      confirmTermsBox: new UntypedFormControl(false, [Validators.required]),
      type: new UntypedFormControl('ministry', [Validators.required]),
    })
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.isMultilingualEnabled) {
      this.isMultiLangEnabled = this.configSvc.instanceConfig.isMultilingualEnabled
    }
    if (this.registrationFormStepOne.get('searchDesignation')) {
      // tslint:disable-next-line
      this.registrationFormStepOne.get('searchDesignation')!.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          const txt = res?.toString()?.trim() ?? ''
          if (txt?.length) {
            this.desigantionFilterEnable = true
            // If org has IGOT designations, call the IGOT API; otherwise filter from local backup
            if (this.masterData && this.masterData.designationBackup) {
              this.masterData.designation = this.masterData.designationBackup.filter((item: any) =>
                item.name.toLowerCase().includes(txt.toLowerCase()))
            }
          } else {
            if (this.masterData && this.masterData.designationBackup) {
              this.masterData.designation = this.masterData.designationBackup.slice(0, this.designationDefaultLoadCount)
              this.desigantionFilterEnable = false
              this.checkCurrentDesignationPresent()
            }
          }
        })
    }
    if (this.registrationFormStepOne.get('searchMinistry')) {
      // tslint:disable-next-line
      this.registrationFormStepOne.get('searchMinistry')!.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          const txt = res?.toString()?.trim() ?? ''
          if (txt?.length) {
            this.ministryFilterEnable = true
            // If org has IGOT ministry, call the IGOT API; otherwise filter from local backup
            if (this.masterData && this.masterData.ministryBackup) {
              this.masterData.ministry = this.masterData.ministryBackup.filter((item: any) =>
                item.identifier.toLowerCase().includes(txt.toLowerCase()))
            }
          } else {
            if (this.masterData && this.masterData.ministryBackup) {
              this.masterData.ministry = this.masterData.ministryBackup.slice(0, this.ministryDefaultLoadCount)
              this.ministryFilterEnable = false
              this.checkCurrentMinistryPresent()
            }
          }
        })
    }
    if (this.registrationFormStepOne.get('searchState')) {
      // tslint:disable-next-line
      this.registrationFormStepOne.get('searchState')!.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          const txt = res?.toString()?.trim() ?? ''
          if (txt?.length) {
            this.stateFilterEnable = true
            // If org has IGOT state, call the IGOT API; otherwise filter from local backup
            if (this.masterData && this.masterData.stateBackup) {
              this.masterData.state = this.masterData.stateBackup.filter((item: any) =>
                item.identifier.toLowerCase().includes(txt.toLowerCase()))
            }
          } else {
            if (this.masterData && this.masterData.stateBackup) {
              this.masterData.state = this.masterData.stateBackup.slice(0, this.stateDefaultLoadCount)
              this.stateFilterEnable = false
              this.checkCurrentStatePresent()
            }
          }
        })
    }
    if (this.registrationFormStepOne.get('searchDepartment')) {
      // tslint:disable-next-line
      this.registrationFormStepOne.get('searchDepartment')!.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          const txt = res?.toString()?.trim() ?? ''
          if (txt?.length) {
            this.departmentFilterEnable = true
            // If org has IGOT department, call the IGOT API; otherwise filter from local backup
            if (this.masterData && this.masterData.departmentBackup) {
              this.masterData.department = this.masterData.departmentBackup.filter((item: any) =>
                item.identifier.toLowerCase().includes(txt.toLowerCase()))
            }
          } else {
            if (this.masterData && this.masterData.departmentBackup) {
              this.masterData.department = this.masterData.departmentBackup.slice(0, this.departmentDefaultLoadCount)
              this.departmentFilterEnable = false
              this.checkCurrentDepartmentPresent()
            }
          }
        })
    }
    if (this.registrationFormStepOne.get('searchOrganisation')) {
      // tslint:disable-next-line
      this.registrationFormStepOne.get('searchOrganisation')!.valueChanges
        .pipe(
          debounceTime(100),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          const txt = res?.toString()?.trim() ?? ''
          if (txt?.length) {
            this.organisationFilterEnable = true
            // If org has IGOT organisation, call the IGOT API; otherwise filter from local backup
            if (this.masterData && this.masterData.organisationBackup) {
              this.masterData.organisation = this.masterData.organisationBackup.filter((item: any) =>
                item.identifier.toLowerCase().includes(txt.toLowerCase()))
            }
          } else {
            if (this.masterData && this.masterData.organisationBackup) {
              this.masterData.organisation = this.masterData.organisationBackup.slice(0, this.organisationDefaultLoadCount)
              this.organisationFilterEnable = false
              this.checkCurrentOrganisationPresent()
            }
          }
        })
    }
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
      this.multiLang = instanceConfig.websitelanguages
    }

    if (isPlatformBrowser(this._platformId)) {
      this._document.body.classList.add('cs-recaptcha')
    }
    this.http.get(this.zohoUrl, { responseType: 'text' }).subscribe(res => {
      this.zohoHtml = this.sanitizer.bypassSecurityTrustHtml(res)
    })
    if (!this.masterData['designationBackup']) {
      this.getDesignationSafe()
    }
    if (!this.masterData['ministryBackup']) {
      this.getMinistryData()
    }

    this.masterData.organisationBackup = []
    this.masterData.departmentBackup = []
    this.masterData.organisationBackup.push({
      "identifier": "-1",
      "orgHierarchyFrameworkStatus": null,
      "orgName": "N/A",
      "sbOrgType": null,
      "description": null,
      "sbOrgSubType": null,
      "orgHierarchyFrameworkId": null
    },)
    this.masterData.departmentBackup.push({
      "identifier": "-1",
      "orgHierarchyFrameworkStatus": null,
      "orgName": "N/A",
      "sbOrgType": null,
      "description": null,
      "sbOrgSubType": null,
      "orgHierarchyFrameworkId": null
    },)

  }
  private getDesignationSafe(): void {
    if (this.designationInitInProgress || this.isLoadingMoreDesignations) {
      return
    }
    this.designationInitInProgress = true
    this.getDesignation()
  }

  getDesignation(searchText?: string, offset?: number): void {
    // avoid running on server-side render
    if (!isPlatformBrowser(this._platformId)) {
      return
    }

    // clear any previous debug hooks
    if (!searchText || searchText?.length === 0) {
      // noop
    }

    const reqOffset = (typeof offset === 'number') ? offset : this.designationOffset
    let reqLimit = this.designationDefaultLoadCount
    const pageIndex = reqLimit > 0 ? Math.floor(reqOffset / reqLimit) : 0
    // if we're requesting from first page, clear the no-more-data guard
    if (pageIndex === 0) {
      this.noMoreLegacyDesignations = false
      reqLimit = 50
    }
    const requestBody: any = {
      filterCriteriaMap: {
        status: 'Active'
      },
      requestedFields: [],
      pageNumber: pageIndex,
      pageSize: reqLimit,
    }
    if (searchText?.length) {
      requestBody['searchString'] = searchText
      // when searching, start from first page
      requestBody.pageNumber = 0
      // allow larger page for search if needed
      requestBody.pageSize = pageIndex === 0 ? 50 : this.designationListLoadCount
      // reset guard when performing a fresh search
      this.noMoreLegacyDesignations = false
    }

    // indicate loading state so scroll handlers don't trigger parallel calls
    this.isLoadingMoreDesignations = true

    this.usersService.searchPublicDesignation(requestBody).pipe(finalize(() => {
      this.isLoadingMoreDesignations = false
      this.designationInitInProgress = false
    }))
      .subscribe({
        next: (res: any) => {
          const content = _.get(res, 'result.result.data', [])
          const mapped = content.map((item: any) => ({
            name: item?.designation || '',
            status: item?.status || 'Active',
          }))

          // total count may be present in different keys depending on API version.
          // Prefer 'result.result.totalcount' (legacy lower-case) then data.totalCount, then totalCount
          const total = _.get(res, 'result.result.totalcount', _.get(res, 'result.result.data.totalCount', _.get(res, 'result.result.totalCount', 0)))
          this.defaultSearchDesignationCount = total

          // If offset is zero (first page) replace backup, otherwise append + dedupe
          if (!this.masterData['designationBackup'] || reqOffset === 0) {
            this.masterData['designationBackup'] = mapped
          } else {
            const combined = (this.masterData['designationBackup'] || []).concat(mapped)
            this.masterData['designationBackup'] = _.uniqBy(combined, (it: any) => (it?.name || '').toLowerCase())
          }

          // If server returned no new items, mark as no-more-data to stop further scroll requests
          if (!mapped || mapped?.length === 0) {
            this.noMoreLegacyDesignations = true
          }

          // If we've loaded at least the total count, mark no-more-data
          if (this.defaultSearchDesignationCount && (this.masterData['designationBackup'] || []).length >= this.defaultSearchDesignationCount) {
            this.noMoreLegacyDesignations = true
          }

          // Ensure visible list matches the requested display count
          this.masterData['designation'] = (this.masterData['designationBackup'] || []).slice(0, this.designationListLoadCount)
          // loading flag cleared in finalize()
          this.checkCurrentDesignationPresent()
        },
        error: () => {
          // Stop further automatic calls on repeated errors to avoid tight loops
          // loading flag cleared in finalize()
          this.noMoreLegacyDesignations = true
          // this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })
  }
  checkCurrentDesignationPresent() {
    // Get the current designation value
    const currentDesignation = this.registrationFormStepOne.get('position')!.value
    // Check if current designation exists in the list
    if (currentDesignation) {
      const designationExists = this.masterData?.designation.some(
        (designation: any) => designation?.name.toLowerCase() === currentDesignation.toLowerCase()
      )

      // If designation doesn't exist in the list, add it
      if (!designationExists) {
        // Create a new designation object to match the structure of other items
        const newDesignation = {
          name: currentDesignation,
          // Add any other required properties matching your data structure
          id: 'custom-' + Date.now(),
          description: currentDesignation
        }
        // Make sure the custom designation appears in the filtered list
        if (this.masterData?.designation?.length >= this.designationListLoadCount) {
          // Replace the last item with the new one to maintain the same number of items
          this.masterData?.designation.pop()
        }
        this.masterData?.designation?.unshift(newDesignation)
        this.isLoadingMoreDesignations = false
      }
    }
  }
  onDesignationDropdownClosed(): void {
    // Keep the designation value but clear the search input
    const currentDesignation = this.registrationFormStepOne.get('position')!.value
    setTimeout(() => {
      if (this.registrationFormStepOne.get('searchDesignation')) {
        this.registrationFormStepOne.get('searchDesignation')!.setValue('')
      }
      // Ensure the designation value remains selected
      if (currentDesignation) {
        const designationControl = this.registrationFormStepOne.get('designation')
        if (designationControl) {
          designationControl.setValue(currentDesignation)
        }
      }
    }, 100)
  }

  designationSearch(evt: any) {
    const searchText = evt?.target?.value
    const txt = (searchText || '').toString().trim()
    if (this.isLoadingMoreDesignations) return

    this.designationSearchText = txt
    if (txt?.length) {
      this.desigantionFilterEnable = true
      this.isLoadingMoreDesignations = true
      this.getDesignation(txt, 0)
    } else if (this.masterData && this.masterData?.designationBackup) {
      this.masterData.designation = this.masterData?.designationBackup.slice(0, this.designationDefaultLoadCount)
      this.desigantionFilterEnable = false
      this.checkCurrentDesignationPresent()
    }
  }
  setupScrollListener(opened: boolean): void {
    if (opened) {
      if (!this.scrollListenerAttached) {
        this.scrollListenerAttached = true

        this.desigantionFilterEnable = false
        this.designationListLoadCount = this.designationDefaultLoadCount
        this.designationOffset = 0

        this.isLoadingMoreDesignations = true
        this.getDesignation(undefined, 0)

        // Clear search box once
        if (this.registrationFormStepOne.get('searchDesignation')) {
          this.registrationFormStepOne.get('searchDesignation')!.setValue('')
        }

        setTimeout(() => {
          const searchInput = document.querySelector('.search-input') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          }
        }, 100)

        // Attach scroll listener safely
        setTimeout(() => {
          const panel = document.querySelector('.mat-select-panel.search-panel') as HTMLElement | null
          if (panel) {
            // align panel width to trigger
            try {
              const triggerEl = this.designationRef && this.designationRef.nativeElement as HTMLElement
              if (triggerEl) {
                const rect = triggerEl.getBoundingClientRect()
                // set width and left so panel aligns exactly below the trigger
                panel.style.width = `${Math.round(rect.width)}px`
                // leave left to overlay positioning but nudge if necessary
                // compute left relative to viewport and apply to panel
                const overlayLeft = rect.left
                panel.style.left = `${Math.round(overlayLeft)}px`
              }
            } catch (e) {
              // ignore DOM errors in SSR or unexpected cases
            }

            const scrollHandler = this.onDesignationSelectScroll.bind(this)
            panel.addEventListener('scroll', scrollHandler, { passive: true })
          }
        }, 150)
      }
    } else {
      // Dropdown closed — reset scroll flag so it can reattach next time
      this.scrollListenerAttached = false
    }
  }

  onDesignationSelectScroll(event: any): void {
    const element = event?.target
    if (!this.desigantionFilterEnable) {
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element?.clientHeight >= element?.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoreDesignations) {
          // If org uses IGOT designation taxonomy, request more from the API by increasing the limit
          if (this.masterData?.designationBackup?.length > this.masterData?.designation?.length) {
            // Local pagination: expand the sliced list
            this.isLoadingMoreDesignations = true
            this.designationListLoadCount += this.designationDefaultLoadCount
            // Update the filtered list with more items
            setTimeout(() => {
              this.masterData.designation = this.masterData?.designationBackup?.slice(0, this.designationListLoadCount)
              this.checkCurrentDesignationPresent()
              this.isLoadingMoreDesignations = false
            }, 500) // Small timeout to simulate loading and prevent multiple triggers
          } else {
            // Legacy (server) pagination: request next page if total not reached
            const loadedLegacy = (this.masterData?.designationBackup || []).length
            if (!this.noMoreLegacyDesignations && this.defaultSearchDesignationCount && loadedLegacy < this.defaultSearchDesignationCount) {
              this.isLoadingMoreDesignations = true
              this.designationOffset = (this.designationOffset || 0) + this.designationDefaultLoadCount
              // increase display count to include newly fetched items
              this.designationListLoadCount += this.designationDefaultLoadCount
              this.getDesignation(undefined, this.designationOffset)
            }
          }
        }
      }
    }
  }

  get typeValueStartCase() {
    // tslint:disable-next-line: no-non-null-assertion
    return _.startCase(this.registrationFormStepOne.get('type')!.value)
  }

  get typeValue() {
    // tslint:disable-next-line: no-non-null-assertion
    return this.registrationFormStepOne.get('type')!.value
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
    this.registrationFormStepOne.get('organisation')!.setValue('')
    this.heirarchyObject = null
  }
  mdoRedirect() {
    this.environment = environment
    const sitePath = this.environment.sitePath
    const domain = sitePath.split('.').slice(1).join('.')
    const newUrl = `https://${domain}/#/mdoList#mdoUserList`
    window.location.href = newUrl
  }

  // onPositionsChange() {
  //   // tslint:disable-next-line: no-non-null-assertion
  //   this.masterPositions = this.registrationFormStepOne.get('position')!.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       startWith(''),
  //       map(value => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
  //       map(name => name ? this.filterPositions(name) : this.positionsOriginal.slice())
  //     )

  //   this.masterPositions.subscribe((event: any) => {
  //     // tslint:disable-next-line: no-non-null-assertion
  //     this.registrationFormStepOne.get('position')!.setValidators([Validators.required, forbiddenNamesValidatorPosition(event)])
  //     this.registrationFormStepOne.updateValueAndValidity()
  //   })
  // }

  // onGroupChange() {
  //   // tslint:disable-next-line: no-non-null-assertion
  //   this.masterGroup = this.registrationFormStepOne.get('group')!.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       startWith(''),
  //       map((value: any) => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
  //       map((name: any) => name ? this.filterGroups(name) : this.groupsOriginal.slice())
  //     )

  //   this.masterGroup.subscribe((event: any) => {
  //     // tslint:disable-next-line: no-non-null-assertion
  //     this.registrationFormStepOne.get('group')!.setValidators([Validators.required])
  //     this.registrationFormStepOne.updateValueAndValidity()
  //   })
  // }

  filterOrgsSearch(orgname: string = '') {
    const filterValue = orgname.toLowerCase()
    return this.signupSvc.searchOrgs(filterValue, this.typeValue).subscribe((res: any) => {
      this.resultFetched = true
      this.searching = false

      this.filteredOrgList = res.result.response.filter((org: any) => {
        return org.orgName.toLowerCase().indexOf(filterValue) >= 0
      })
    }, (err: any) => {
      this.searching = false
      this.loggerSvc.error('Error in fetching organisations >', err)
      if (err.error && err.error.params && err.error.params.errmsg) {
        this.openSnackbar(err.error.params.errmsg)
      } else {
        this.openSnackbar(this.translateLabels('somethingWentWrong', 'common'))
      }
    })
  }

  async searchOrgs(searchValue: string) {
    this.searching = true
    if (!searchValue) {
      this.openSnackbar(this.translateLabels('enterOrganisationName', 'publicsignup'))
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
    this.registrationFormStepOne.get('organisation')!.valueChanges.subscribe(() => {
      this.resultFetched = false
      this.registrationFormStepOne.updateValueAndValidity()
    })
  }

  orgClicked(event: any) {
    if (event) {
      if (event.option && event.option.value && event.option.value.orgName) {
        const frmctr = this.registrationFormStepOne.get('organisation') as UntypedFormControl
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
    const ctrl = this.registrationFormStepTwo.get('mobile')
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
    const ctrl = this.registrationFormStepOne.get('email')
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
    const mob = this.registrationFormStepTwo.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.signupSvc.sendOtp(mob.value, 'phone').subscribe(() => {
        this.otpSend = true
        alert(this.translateLabels('anOtpHasBeenSentToMobile', 'publicsignup'))
        this.startCountDown()
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open(this.translateLabels('pleaseEnterValidMobileNumber', 'publicsignup'))
    }
  }

  resendOTP() {
    const mob = this.registrationFormStepTwo.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.signupSvc.resendOtp(mob.value, 'phone').subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpSend = true
          this.disableVerifyBtn = false
          alert(this.translateLabels('anOtpHasBeenSentToMobile', 'publicsignup'))
          this.startCountDown()
        }
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open(this.translateLabels('pleaseEnterValidMobileNumber', 'publicsignup'))
    }
  }

  verifyOtp(otp: any) {
    // console.log(otp)
    const mob = this.registrationFormStepTwo.get('mobile')

    if (otp && otp.value) {
      if (otp && otp.value.length < 4) {
        this.snackBar.open(this.translateLabels('pleaseEnterValidOtp', 'publicsignup'))
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
      this.snackBar.open(this.translateLabels('pleaseEnterValidOtp', 'publicsignup'))
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
    const email = this.registrationFormStepOne.get('email')
    if (email && email.value && email.valid) {
      this.signupSvc.sendOtp(email.value, 'email').subscribe(() => {
        this.otpEmailSend = true
        alert(this.translateLabels('anOtpHasBeenSentToEmail', 'publicsignup'))
        this.startCountDownEmail()
        // tslint:disable-next-line: align
      }, (error: any) => {
        const isError = _.get(error, 'error.params.errmsg')
        const errMsg = isError ? "Your email domain isn’t recognised — please contact your department for registration." : "Please try again later"
        this.snackBar.open(errMsg)
      })
    } else {
      this.snackBar.open(this.translateLabels('validEmail', 'publicsignup'))
    }
  }

  resendOTPEmail() {
    const email = this.registrationFormStepOne.get('email')
    if (email && email.value && email.valid) {
      this.signupSvc.resendOtp(email.value, 'email').subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpEmailSend = true
          alert(this.translateLabels('anOtpHasBeenSentToEmail', 'publicsignup'))
          this.startCountDownEmail()
        }
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open(this.translateLabels('validEmail', 'publicsignup'))
    }
  }

  verifyOtpEmail(otp: any) {
    // console.log(otp)
    const email = this.registrationFormStepOne.get('email')
    if (otp && otp.value) {
      if (otp && otp.value.length < 4) {
        this.snackBar.open(this.translateLabels('pleaseEnterValidOtp', 'publicsignup'))
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
      this.snackBar.open(this.translateLabels('pleaseEnterValidOtp', 'publicsignup'))
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
    this.registrationFormStepOne.patchValue({
      confirmBox: this.confirm,
    })
  }

  public confirmTermsChange() {
    this.confirmTerms = !this.confirmTerms
    this.registrationFormStepOne.patchValue({
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
          let req: any
          let orgId = ''
          let orgName = ''
          let channel = ''
          let organisationType = ''
          let organisationSubType = ''
          if (this.registrationFormStepOne.value.type === 'ministry') {
            if (this.heirarchyObject.orgName === 'N/A') {
              orgId = this.registrationFormStepOne.value.ministry
              orgName = this.currentMinistry?.orgName
              channel = this.currentMinistry?.channel
              organisationType = this.currentMinistry.sbOrgType
              organisationSubType = this.currentMinistry.sbOrgSubType
            } else {
              orgId = this.heirarchyObject.identifier
              orgName = this.heirarchyObject.orgName
              channel = this.heirarchyObject.channel
              organisationSubType = this.heirarchyObject.sbOrgSubType
              organisationType = this.heirarchyObject.sbOrgType
            }
          } else if (this.registrationFormStepOne.value.type === 'state') {
            if (this.heirarchyObject.orgName === 'N/A') {
              if (this.registrationFormStepOne.value.department === '-1') {
                orgId = this.registrationFormStepOne.value.state
                orgName = this.currentMinistry?.orgName
                channel = this.currentMinistry?.channel
                organisationType = this.currentMinistry.sbOrgType
                organisationSubType = this.currentMinistry.sbOrgSubType
              } else {
                orgId = this.registrationFormStepOne.value.department
                orgName = this.currentMinistry?.orgName
                channel = this.currentMinistry?.channel
                organisationType = this.currentMinistry.sbOrgType
                organisationSubType = this.currentMinistry.sbOrgSubType
              }
            } else {
              orgId = this.heirarchyObject.identifier
              orgName = this.heirarchyObject.orgName
              channel = this.heirarchyObject.channel
              organisationSubType = this.heirarchyObject.sbOrgSubType
              organisationType = this.heirarchyObject.sbOrgType
            }
          }
          if (this.heirarchyObject) {
            req = {
              firstName: this.registrationFormStepTwo.value.firstname || '',
              // lastName: this.registrationFormStepOne.value.lastname || '',
              email: this.registrationFormStepOne.value.email || '',
              phone: `${this.registrationFormStepTwo.value.mobile}` || '',
              // position: this.registrationFormStepOne.value.position.name || '',
              group: this.registrationFormStepTwo.value.group || '',
              source: `${environment.name}.${this.portalID}` || '',
              orgName: orgName,
              channel: channel,
              organisationType: organisationType,
              organisationSubType: organisationSubType,
              mapId: orgId,
              sbOrgId: orgId,
              position: this.registrationFormStepOne.value.position || '',
            }
          }

          console.log('req ===: ', req)
          this.signupSvc.register(req).subscribe(
            (_res: any) => {
              this.openDialog()
              this.disableBtn = false
              this.isMobileVerified = true
              this.raiseSignupInteractTelementry()
            },
            (err: any) => {
              this.disableBtn = false
              this.loggerSvc.error('Error in registering new user >', err)
              if (err.error && err.error.params && err.error.params.errmsg) {
                this.openSnackbar(err.error.params.errmsg)
              } else {
                this.openSnackbar(this.translateLabels('somethingWentWrong', 'common'))
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
  //   return this.registrationFormStepOne.get('ministry') as FormControl
  // }
  // get department(): FormControl {
  //   return this.registrationFormStepOne.get('department') as FormControl
  // }
  // get organisation(): FormControl {
  //   return this.registrationFormStepOne.get('organisation') as FormControl
  // }

  navigateTo(param?: any) {
    const formData = this.registrationFormStepOne.value
    const url = '/public/request'
    // tslint:disable-next-line: max-line-length
    this.router.navigate([url], { queryParams: { type: param }, state: { userform: formData, isMobileVerified: this.isMobileVerified, isEmailVerified: this.isEmailVerified } })
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
    return this.langtranslations.translateActualLabel(label, type, '')
  }
  getZohoForm() {
    const dialogRef = this.dialog.open(ZohoDialogComponent, {
      width: '45%',
      data: {
        view: 'zohoform',
        value: this.zohoHtml,
      },
    })
    dialogRef.afterClosed().subscribe(() => {
    })
    setTimeout(() => {
      this.callXMLRequest()
    }, 0)
  }

  callXMLRequest() {
    let webFormxhr: any = {}
    webFormxhr = new XMLHttpRequest()
    // tslint:disable-next-line: prefer-template
    webFormxhr.open('GET', 'https://desk.zoho.in/support/GenerateCaptcha?action=getNewCaptcha&_=' + new Date().getTime(), true)
    webFormxhr.onreadystatechange = () => {
      if (webFormxhr.readyState === 4 && webFormxhr.status === 200) {
        try {
          const response = (webFormxhr.responseText != null) ? JSON.parse(webFormxhr.responseText) : ''
          const zsCaptchaUrl: any = document.getElementById('zsCaptchaUrl')
          if (zsCaptchaUrl) {
            zsCaptchaUrl.src = response.captchaUrl
            zsCaptchaUrl.style.display = 'block'
          }
          const xJdfEaS: any = document.getElementsByName('xJdfEaS')[0]
          xJdfEaS.value = response.captchaDigest
          const zsCaptchaLoading: any = document.getElementById('zsCaptchaLoading')
          zsCaptchaLoading.style.display = 'none'
          const zsCaptcha: any = document.getElementById('zsCaptcha')
          zsCaptcha.style.display = 'block'
          const refreshCaptcha: any = document.getElementById('refreshCaptcha')
          if (refreshCaptcha) {
            refreshCaptcha.addEventListener('click', () => {
              this.callXMLRequest()
            })
          }
        } catch (e) {
        }
      }
    }
    webFormxhr.send()
  }

  raiseSignupInteractTelementry() {
    this.eventService.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'sign-up',
        pageid: "/public/signup"
      },
      {},
      {
        module: "User Registration",
      }
    )

    setTimeout(() => {
      this.telemetrySvc.end(
        {
          type: WsEvents.EnumInteractTypes.CLICK,
          id: 'sign-up',
          pageid: "/public/signup"
        }, {},
        {
          module: "User Registration",
        })

    }, 2000)

  }

  goToNextStep() {
    if (this.registrationFormStepOne.valid) {
      this.currentStep = 'step2'
    } else {
      this.currentStep = 'step2'
      this.snackBar.open('Please fill all required fields')
    }

  }

  goToPrevStep() {

    this.currentStep = 'step1'

  }


  /** Ministry Data */

  getMinistryData(searchText?: string, offset?: number): void {
    // this.masterData['ministry'] = []
    // avoid running on server-side render
    if (!isPlatformBrowser(this._platformId)) {
      return
    }

    // clear any previous debug hooks
    if (!searchText || searchText?.length === 0) {
      // noop
    }

    const reqOffset = (typeof offset === 'number') ? offset : this.ministryOffset
    const reqLimit = this.ministryDefaultLoadCount
    console.log('reqOffset--', reqOffset)
    console.log('reqLimit--', reqLimit)
    const pageIndex = reqLimit > 0 ? Math.floor(reqOffset / reqLimit) : 0
    // if we're requesting from first page, clear the no-more-data guard
    if (pageIndex === 0) {
      this.noMoreLegacyMinistrys = false
    }
    const requestBody: any = {
      "request": {
        "filters": {
          "status": 1,
          "sbOrgType": this.registrationFormStepOne.controls.type.value
        },
        "query": "",
        "limit": reqLimit,
        "offset": reqLimit > 0 ? pageIndex * reqLimit : this.ministryDefaultLoadCount,
        "fields": [
          "identifier",
          "orgName",
          "description",
          "orgHierarchyFrameworkId",
          "orgHierarchyFrameworkStatus",
          "sbOrgType",
          "sbOrgSubType",
          "channel"
        ]
      }
    }

    if (searchText?.length) {
      requestBody["request"]['query'] = searchText
      this.noMoreLegacyMinistrys = false
    }

    // indicate loading state so scroll handlers don't trigger parallel calls
    this.isLoadingMoreMinistrys = true
    console.log('requestBody--', requestBody)
    this.signupSvc.getStateOrMinistyForRegistration(requestBody).pipe(finalize(() => {
      this.isLoadingMoreMinistrys = false
      this.ministryInitInProgress = false
    }))
      .subscribe({
        next: (res: any) => {
          const content = _.get(res, 'result.response.content', [])

          const mapped = content.filter(
            (item: any) => item && item.sbOrgType === 'ministry'
          )

          // total count may be present in different keys depending on API version.
          // Prefer 'result.result.totalcount' (legacy lower-case) then data.totalCount, then totalCount
          const total = _.get(res, 'result.response.count', _.get(res, 'result.response.count', _.get(res, 'result.response.count', 0)))
          this.defaultSearchMinistryCount = total

          // If offset is zero (first page) replace backup, otherwise append + dedupe
          // if (!this.masterData['ministry'] || reqOffset === 0) {
          //   this.masterData['ministry'] = mapped
          // } else {
          //   const combined = (this.masterData['ministry'] || []).concat(mapped)
          //   this.masterData['ministry'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
          // }

          if (!this.masterData['ministryBackup'] || reqOffset === 0) {
            this.masterData['ministryBackup'] = mapped
          } else {
            const combined = (this.masterData['ministryBackup'] || []).concat(mapped)
            this.masterData['ministryBackup'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
          }

          // If server returned no new items, mark as no-more-data to stop further scroll requests
          if (!mapped || mapped?.length === 0) {
            this.noMoreLegacyMinistrys = true
          }
          // If we've loaded at least the total count, mark no-more-data
          if (this.defaultSearchMinistryCount && (this.masterData['ministryBackup'] || []).length >= this.defaultSearchMinistryCount) {
            this.noMoreLegacyMinistrys = true
          }
          // Ensure visible list matches the requested display count
          this.masterData['ministry'] = (this.masterData['ministryBackup'] || []).slice(0, this.ministryListLoadCount)
          // loading flag cleared in finalize()
          this.checkCurrentMinistryPresent()
        },
        error: () => {
          // Stop further automatic calls on repeated errors to avoid tight loops
          // loading flag cleared in finalize()
          this.noMoreLegacyMinistrys = true
          // this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })
  }

  setupScrollListenerForMinistry(opened: boolean): void {
    let scrollListenerAttached = false
    if (opened) {
      if (!scrollListenerAttached) {
        scrollListenerAttached = true

        this.ministryFilterEnable = false
        this.ministryListLoadCount = this.ministryDefaultLoadCount
        this.ministryOffset = 0

        this.isLoadingMoreMinistrys = true
        this.getMinistryData(undefined, 0)

        // Clear search box once
        if (this.registrationFormStepOne.get('searchMinistry')) {
          this.registrationFormStepOne.get('searchMinistry')!.setValue('')
        }

        setTimeout(() => {
          const searchInput = document.querySelector('.search-input-ministry') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          }
        }, 100)

        // Attach scroll listener safely
        setTimeout(() => {
          const panel = document.querySelector('.mat-select-panel.search-panel-ministry') as HTMLElement | null
          if (panel) {
            // align panel width to trigger
            try {
              const triggerEl = this.ministryRef && this.ministryRef.nativeElement as HTMLElement
              if (triggerEl) {
                const rect = triggerEl.getBoundingClientRect()
                // set width and left so panel aligns exactly below the trigger
                panel.style.width = `${Math.round(rect.width)}px`
                // leave left to overlay positioning but nudge if necessary
                // compute left relative to viewport and apply to panel
                const overlayLeft = rect.left
                panel.style.left = `${Math.round(overlayLeft)}px`
              }
            } catch (e) {
              // ignore DOM errors in SSR or unexpected cases
            }

            const scrollHandler = this.onMinistrySelectScroll.bind(this)
            panel.addEventListener('scroll', scrollHandler, { passive: true })
          }
        }, 150)
      }
    } else {
      // Dropdown closed — reset scroll flag so it can reattach next time
      scrollListenerAttached = false
    }
  }

  onMinistrySelectScroll(event: any): void {
    const element = event?.target
    if (!this.ministryFilterEnable) {
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element?.clientHeight >= element?.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoreMinistrys) {
          // If org uses IGOT ministry taxonomy, request more from the API by increasing the limit
          if (this.masterData?.ministryBackup?.length > this.masterData?.ministry?.length) {
            // Local pagination: expand the sliced list
            this.isLoadingMoreMinistrys = true
            this.ministryListLoadCount += this.ministryDefaultLoadCount
            // Update the filtered list with more items
            setTimeout(() => {
              this.masterData.ministry = this.masterData?.ministryBackup?.slice(0, this.ministryListLoadCount)
              this.checkCurrentMinistryPresent()
              this.isLoadingMoreMinistrys = false
            }, 500) // Small timeout to simulate loading and prevent multiple triggers
          } else {
            // Legacy (server) pagination: request next page if total not reached
            const loadedLegacy = (this.masterData?.ministryBackup || []).length
            if (!this.noMoreLegacyMinistrys && this.defaultSearchMinistryCount && loadedLegacy < this.defaultSearchMinistryCount) {
              this.isLoadingMoreMinistrys = true
              this.ministryOffset = (this.ministryOffset || 0) + this.ministryDefaultLoadCount
              // increase display count to include newly fetched items
              this.ministryListLoadCount += this.ministryDefaultLoadCount
              this.getMinistryData(undefined, this.ministryOffset)
            }
          }
        }
      }
    }
  }

  checkCurrentMinistryPresent() {
    // Get the current designation value
    const currentMinistry = this.registrationFormStepOne.get('ministry')!.value
    // Check if current designation exists in the list
    if (currentMinistry) {
      const ministryExists = this.masterData?.ministry.some(
        (ministry: any) => ministry?.identifier.toLowerCase() === currentMinistry.toLowerCase()
      )

      // If designation doesn't exist in the list, add it
      if (!ministryExists) {
        // Create a new designation object to match the structure of other items
        const newMinistry = {
          identifier: currentMinistry,

        }
        // Make sure the custom designation appears in the filtered list
        if (this.masterData?.ministry?.length >= this.ministryListLoadCount) {
          // Replace the last item with the new one to maintain the same number of items
          this.masterData?.ministry.pop()
        }
        this.masterData?.ministry?.unshift(newMinistry)
        this.isLoadingMoreMinistrys = false
      }
    }
  }

  ministrySearch(evt: any) {
    const searchText = evt?.target?.value
    const txt = (searchText || '').toString().trim()
    if (this.isLoadingMoreMinistrys) return

    this.ministrySearchText = txt
    if (txt?.length) {
      this.ministryFilterEnable = true
      this.isLoadingMoreMinistrys = true
      this.getMinistryData(txt, 0)
    } else if (this.masterData && this.masterData?.ministryBackup) {
      this.masterData.ministry = this.masterData?.ministryBackup.slice(0, this.ministryDefaultLoadCount)
      this.ministryFilterEnable = false
      this.checkCurrentMinistryPresent()
    }
  }

  /** State Data */

  getStateData(searchText?: string, offset?: number): void {
    // avoid running on server-side render
    if (!isPlatformBrowser(this._platformId)) {
      return
    }

    // clear any previous debug hooks
    if (!searchText || searchText?.length === 0) {
      // noop
    }

    const reqOffset = (typeof offset === 'number') ? offset : this.stateOffset
    const reqLimit = this.stateDefaultLoadCount
    const pageIndex = reqLimit > 0 ? Math.floor(reqOffset / reqLimit) : 0
    // if we're requesting from first page, clear the no-more-data guard
    console.log('reqOffset--', reqOffset)
    console.log('reqLimit--', reqLimit)
    console.log('stateDefaultLoadCount--', this.stateDefaultLoadCount)
    if (pageIndex === 0) {
      this.noMoreLegacyStates = false
    }
    const requestBody: any = {
      "request": {
        "filters": {
          "status": 1,
          "sbOrgType": this.registrationFormStepOne.controls.type.value
        },
        "query": "",
        "limit": reqLimit,
        "offset": reqLimit > 0 ? pageIndex * reqLimit : this.stateDefaultLoadCount,
        "fields": [
          "identifier",
          "orgName",
          "description",
          "orgHierarchyFrameworkId",
          "orgHierarchyFrameworkStatus",
          "sbOrgType",
          "sbOrgSubType",
          "channel"
        ]
      }
    }

    if (searchText?.length) {
      requestBody["request"]['query'] = searchText
      this.noMoreLegacyStates = false
    }

    // indicate loading state so scroll handlers don't trigger parallel calls
    this.isLoadingMoreStates = true

    this.signupSvc.getStateOrMinistyForRegistration(requestBody).pipe(finalize(() => {
      this.isLoadingMoreStates = false
      this.stateInitInProgress = false
    }))
      .subscribe({
        next: (res: any) => {
          const content = _.get(res, 'result.response.content', [])

          const mapped = content.filter(
            (item: any) => item && item.sbOrgType === 'state'
          )

          // total count may be present in different keys depending on API version.
          // Prefer 'result.result.totalcount' (legacy lower-case) then data.totalCount, then totalCount
          const total = _.get(res, 'result.response.count', _.get(res, 'result.response.count', _.get(res, 'result.response.count', 0)))
          this.defaultSearchStateCount = total

          // If offset is zero (first page) replace backup, otherwise append + dedupe
          // if (!this.masterData['ministry'] || reqOffset === 0) {
          //   this.masterData['ministry'] = mapped
          // } else {
          //   const combined = (this.masterData['ministry'] || []).concat(mapped)
          //   this.masterData['ministry'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
          // }

          if (!this.masterData['stateBackup'] || reqOffset === 0) {
            this.masterData['stateBackup'] = mapped
          } else {
            const combined = (this.masterData['stateBackup'] || []).concat(mapped)
            this.masterData['stateBackup'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
          }

          // If server returned no new items, mark as no-more-data to stop further scroll requests
          if (!mapped || mapped?.length === 0) {
            this.noMoreLegacyStates = true
          }
          console.log(this.masterData['state'])
          // If we've loaded at least the total count, mark no-more-data
          if (this.defaultSearchStateCount && (this.masterData['stateBackup'] || []).length >= this.defaultSearchStateCount) {
            this.noMoreLegacyStates = true
          }
          console.log(this.masterData['state'])
          // Ensure visible list matches the requested display count
          this.masterData['state'] = (this.masterData['stateBackup'] || []).slice(0, this.stateListLoadCount)
          console.log(this.masterData['state'])
          // loading flag cleared in finalize()
          this.checkCurrentStatePresent()
        },
        error: () => {
          // Stop further automatic calls on repeated errors to avoid tight loops
          // loading flag cleared in finalize()
          this.noMoreLegacyStates = true
          // this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })
  }

  setupScrollListenerForState(opened: boolean): void {
    let scrollListenerAttached = false
    if (opened) {
      if (!scrollListenerAttached) {
        scrollListenerAttached = true

        this.stateFilterEnable = false
        this.stateListLoadCount = this.stateDefaultLoadCount
        this.stateOffset = 0

        this.isLoadingMoreStates = true
        this.getStateData(undefined, 0)

        // Clear search box once
        if (this.registrationFormStepTwo.get('searchState')) {
          this.registrationFormStepTwo.get('searchState')!.setValue('')
        }

        setTimeout(() => {
          const searchInput = document.querySelector('.search-input-state') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          }
        }, 100)

        // Attach scroll listener safely
        setTimeout(() => {
          const panel = document.querySelector('.mat-select-panel.search-panel-state') as HTMLElement | null
          if (panel) {
            // align panel width to trigger
            try {
              const triggerEl = this.stateRef && this.stateRef.nativeElement as HTMLElement
              if (triggerEl) {
                const rect = triggerEl.getBoundingClientRect()
                // set width and left so panel aligns exactly below the trigger
                panel.style.width = `${Math.round(rect.width)}px`
                // leave left to overlay positioning but nudge if necessary
                // compute left relative to viewport and apply to panel
                const overlayLeft = rect.left
                panel.style.left = `${Math.round(overlayLeft)}px`
              }
            } catch (e) {
              // ignore DOM errors in SSR or unexpected cases
            }

            const scrollHandler = this.onStateSelectScroll.bind(this)
            panel.addEventListener('scroll', scrollHandler, { passive: true })
          }
        }, 150)
      }
    } else {
      // Dropdown closed — reset scroll flag so it can reattach next time
      scrollListenerAttached = false
    }
  }

  onStateSelectScroll(event: any): void {
    const element = event?.target
    if (!this.stateFilterEnable) {
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element?.clientHeight >= element?.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoreStates) {
          // If org uses IGOT ministry taxonomy, request more from the API by increasing the limit
          if (this.masterData?.stateBackup?.length > this.masterData?.state?.length) {
            // Local pagination: expand the sliced list
            this.isLoadingMoreStates = true
            this.stateListLoadCount += this.stateDefaultLoadCount
            // Update the filtered list with more items
            setTimeout(() => {
              this.masterData.state = this.masterData?.stateBackup?.slice(0, this.stateListLoadCount)
              this.checkCurrentStatePresent()
              this.isLoadingMoreStates = false
            }, 500) // Small timeout to simulate loading and prevent multiple triggers
          } else {
            // Legacy (server) pagination: request next page if total not reached
            const loadedLegacy = (this.masterData?.stateBackup || []).length
            if (!this.noMoreLegacyStates && this.defaultSearchStateCount && loadedLegacy < this.defaultSearchStateCount) {
              this.isLoadingMoreStates = true
              this.stateOffset = (this.stateOffset || 0) + this.stateDefaultLoadCount
              // increase display count to include newly fetched items
              this.stateListLoadCount += this.stateDefaultLoadCount
              this.getStateData(undefined, this.stateOffset)
            }
          }
        }
      }
    }
  }

  checkCurrentStatePresent() {
    // Get the current designation value
    const currentState = this.registrationFormStepOne.get('state')!.value
    // Check if current designation exists in the list
    if (currentState) {
      const stateExists = this.masterData?.state.some(
        (state: any) => state?.identifier.toLowerCase() === currentState.toLowerCase()
      )

      // If designation doesn't exist in the list, add it
      if (!stateExists) {
        // Create a new designation object to match the structure of other items
        const newState = {
          identifier: currentState,

        }
        // Make sure the custom designation appears in the filtered list
        if (this.masterData?.state?.length >= this.stateListLoadCount) {
          // Replace the last item with the new one to maintain the same number of items
          this.masterData?.state.pop()
        }
        this.masterData?.state?.unshift(newState)
        this.isLoadingMoreStates = false
      }
    }
  }

  stateSearch(evt: any) {
    const searchText = evt?.target?.value
    const txt = (searchText || '').toString().trim()
    if (this.isLoadingMoreStates) return

    this.stateSearchText = txt
    if (txt?.length) {
      this.stateFilterEnable = true
      this.isLoadingMoreStates = true
      this.getStateData(txt, 0)
    } else if (this.masterData && this.masterData?.stateBackup) {
      this.masterData.state = this.masterData?.stateBackup.slice(0, this.stateDefaultLoadCount)
      this.stateFilterEnable = false
      this.checkCurrentStatePresent()
    }
  }

  /** Department Data */

  getDepartmentData(searchText?: string, offset?: number): void {
    //this.masterData['department'] = []
    // avoid running on server-side render
    if (!isPlatformBrowser(this._platformId)) {
      return
    }

    // clear any previous debug hooks
    if (!searchText || searchText?.length === 0) {
      // noop
    }

    const reqOffset = (typeof offset === 'number') ? offset : this.departmentOffset
    const reqLimit = this.departmentDefaultLoadCount
    const pageIndex = reqLimit > 0 ? Math.floor(reqOffset / reqLimit) : 0
    // if we're requesting from first page, clear the no-more-data guard
    if (pageIndex === 0) {
      this.noMoreLegacyDepartments = false
    }
    const requestBody: any = {
      "request": {
        "filters": {
          "status": 1,
          "sbOrgType": this.registrationFormStepOne.controls.type.value,
          "levelZeroOrgId": this.registrationFormStepOne.controls.state.value,
        },
        "query": "",
        "limit": reqLimit,
        "offset": reqLimit > 0 ? pageIndex * reqLimit : this.departmentDefaultLoadCount,
        "fields": [
          "identifier",
          "orgName",
          "description",
          "orgHierarchyFrameworkId",
          "orgHierarchyFrameworkStatus",
          "sbOrgType",
          "sbOrgSubType",
          "channel"
        ]
      }
    }

    if (searchText?.length) {
      requestBody["request"]['query'] = searchText
      this.noMoreLegacyDepartments = false
    }

    // indicate loading department so scroll handlers don't trigger parallel calls
    this.isLoadingMoreDepartments = true

    this.signupSvc.getStateOrMinistyForRegistration(requestBody).pipe(finalize(() => {
      this.isLoadingMoreStates = false
      this.stateInitInProgress = false
    }))
      .subscribe({
        next: (res: any) => {
          // const content = _.get(res, 'result.response.content', [])
          const mapped = _.get(res, 'result.response.content', [])
          // const mapped = content.filter(
          //   (item: any) => item && item.sbOrgType === 'state'
          // );

          if (mapped?.length === 0 || searchText?.length) {
            this.masterData['departmentBackup'] =
              this.masterData['departmentBackup'].filter(
                (item: any) => item.orgName === 'N/A'
              )
          }


          // total count may be present in different keys depending on API version.
          // Prefer 'result.result.totalcount' (legacy lower-case) then data.totalCount, then totalCount
          const total = _.get(res, 'result.response.count', _.get(res, 'result.response.count', _.get(res, 'result.response.count', 0)))
          this.defaultSearchDepartmentCount = total

          // If offset is zero (first page) replace backup, otherwise append + dedupe
          // if (!this.masterData['ministry'] || reqOffset === 0) {
          //   this.masterData['ministry'] = mapped
          // } else {
          //   const combined = (this.masterData['ministry'] || []).concat(mapped)
          //   this.masterData['ministry'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
          // }

          if (!this.masterData['departmentBackup'] || reqOffset === 0) {
            // this.masterData['departmentBackup'] = mapped
            const combined = (this.masterData['departmentBackup'] || []).concat(mapped)
            this.masterData['departmentBackup'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
          } else {
            const combined = (this.masterData['departmentBackup'] || []).concat(mapped)
            this.masterData['departmentBackup'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
          }

          // If server returned no new items, mark as no-more-data to stop further scroll requests
          if (!mapped || mapped?.length === 0) {
            this.noMoreLegacyDepartments = true
          }
          // If we've loaded at least the total count, mark no-more-data
          if (this.defaultSearchDepartmentCount && (this.masterData['departmentBackup'] || []).length >= this.defaultSearchDepartmentCount) {
            this.noMoreLegacyDepartments = true
          }
          // Ensure visible list matches the requested display count
          this.masterData['department'] = (this.masterData['departmentBackup'] || []).slice(0, this.departmentListLoadCount)
          console.log(this.masterData['department'])
          // loading flag cleared in finalize()
          this.isLoadingMoreDepartments = false
          this.checkCurrentDepartmentPresent()
        },
        error: () => {
          // Stop further automatic calls on repeated errors to avoid tight loops
          // loading flag cleared in finalize()
          this.noMoreLegacyDepartments = true
          // this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })
  }

  setupScrollListenerForDepartment(opened: boolean): void {
    let scrollListenerAttached = false
    if (opened) {
      if (!scrollListenerAttached) {
        scrollListenerAttached = true

        this.departmentFilterEnable = false
        this.departmentListLoadCount = this.departmentDefaultLoadCount
        this.departmentOffset = 0

        this.isLoadingMoreDepartments = true
        this.getDepartmentData(undefined, 0)

        // Clear search box once
        if (this.registrationFormStepOne.get('searchDepartment')) {
          this.registrationFormStepOne.get('searchDepartment')!.setValue('')
        }

        setTimeout(() => {
          const searchInput = document.querySelector('.search-input-deaprtment') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          }
        }, 100)

        // Attach scroll listener safely
        setTimeout(() => {
          const panel = document.querySelector('.mat-select-panel.search-panel-department') as HTMLElement | null
          if (panel) {
            // align panel width to trigger
            try {
              const triggerEl = this.departmentRef && this.departmentRef.nativeElement as HTMLElement
              if (triggerEl) {
                const rect = triggerEl.getBoundingClientRect()
                // set width and left so panel aligns exactly below the trigger
                panel.style.width = `${Math.round(rect.width)}px`
                // leave left to overlay positioning but nudge if necessary
                // compute left relative to viewport and apply to panel
                const overlayLeft = rect.left
                panel.style.left = `${Math.round(overlayLeft)}px`
              }
            } catch (e) {
              // ignore DOM errors in SSR or unexpected cases
            }

            const scrollHandler = this.onDepartmentSelectScroll.bind(this)
            panel.addEventListener('scroll', scrollHandler, { passive: true })
          }
        }, 150)
      }
    } else {
      // Dropdown closed — reset scroll flag so it can reattach next time
      scrollListenerAttached = false
    }
  }

  onDepartmentSelectScroll(event: any): void {
    const element = event?.target
    if (!this.departmentFilterEnable) {
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element?.clientHeight >= element?.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoreDepartments) {
          // If org uses IGOT ministry taxonomy, request more from the API by increasing the limit
          if (this.masterData?.departmentBackup?.length > this.masterData?.department?.length) {
            // Local pagination: expand the sliced list
            this.isLoadingMoreDepartments = true
            this.departmentListLoadCount += this.departmentDefaultLoadCount
            // Update the filtered list with more items
            setTimeout(() => {
              this.masterData.department = this.masterData?.departmentBackup?.slice(0, this.departmentListLoadCount)
              this.checkCurrentDepartmentPresent()
              this.isLoadingMoreDepartments = false
            }, 500) // Small timeout to simulate loading and prevent multiple triggers
          } else {
            // Legacy (server) pagination: request next page if total not reached
            const loadedLegacy = (this.masterData?.departmentBackup || []).length
            if (!this.noMoreLegacyDepartments && this.defaultSearchDepartmentCount && loadedLegacy < this.defaultSearchDepartmentCount) {
              this.isLoadingMoreDepartments = true
              this.departmentOffset = (this.stateOffset || 0) + this.departmentDefaultLoadCount
              // increase display count to include newly fetched items
              this.departmentListLoadCount += this.departmentDefaultLoadCount
              this.getDepartmentData(undefined, this.departmentOffset)
            }
          }
        }
      }
    }
  }

  checkCurrentDepartmentPresent() {
    // Get the current designation value
    const currentDepartment = this.registrationFormStepOne.get('department')!.value
    // Check if current designation exists in the list
    if (currentDepartment) {
      const departmentExists = this.masterData?.department.some(
        (department: any) => department?.identifier.toLowerCase() === currentDepartment.toLowerCase()
      )

      // If designation doesn't exist in the list, add it
      if (!departmentExists) {
        // Create a new designation object to match the structure of other items
        const newDepartment = {
          identifier: currentDepartment,

        }
        // Make sure the custom designation appears in the filtered list
        if (this.masterData?.department?.length >= this.departmentListLoadCount) {
          // Replace the last item with the new one to maintain the same number of items
          this.masterData?.deaprtment.pop()
        }
        this.masterData?.department?.unshift(newDepartment)
        this.isLoadingMoreDepartments = false
      }
    }
  }

  departmentSearch(evt: any) {
    const searchText = evt?.target?.value
    const txt = (searchText || '').toString().trim()
    if (this.isLoadingMoreDepartments) return

    this.departmentSearchText = txt
    if (txt.length === 0) {
      this.departmentFilterEnable = true
      this.isLoadingMoreDepartments = true
      this.getDepartmentData(txt, 0)
    }
    else if (txt?.length) {
      this.departmentFilterEnable = true
      this.isLoadingMoreDepartments = true
      this.getDepartmentData(txt, 0)
    } else if (this.masterData && this.masterData?.departmentBackup) {
      this.masterData.department = this.masterData?.departmentBackup.slice(0, this.departmentDefaultLoadCount)
      this.departmentFilterEnable = false
      this.checkCurrentDepartmentPresent()
    }


  }

  /** Organisation Data */

  getOrganisationData(searchText?: string, offset?: number): void {
    // this.masterData['organisation'] = []
    // avoid running on server-side render

    if (!isPlatformBrowser(this._platformId)) {
      return
    }

    // clear any previous debug hooks
    if (!searchText || searchText?.length === 0) {
      // noop
    }

    const reqOffset = (typeof offset === 'number') ? offset : this.organisationOffset
    const reqLimit = this.organisationDefaultLoadCount
    const pageIndex = reqLimit > 0 ? Math.floor(reqOffset / reqLimit) : 0
    // if we're requesting from first page, clear the no-more-data guard
    if (pageIndex === 0) {
      this.noMoreLegacyOrganisations = false
    }
    let requestBody: any = {}
    if (this.registrationFormStepOne.controls.type.value === 'ministry') {
      requestBody = {
        "request": {
          "filters": {
            "status": 1,
            "levelZeroOrgId": this.registrationFormStepOne.controls.ministry.value,
            "hierarchyRequestType": "All"
          },
          "query": "",
          "limit": reqLimit,
          "offset": reqLimit > 0 ? pageIndex * reqLimit : this.organisationDefaultLoadCount,
          "fields": [
            "identifier",
            "orgName",
            "description",
            "parentOrgName",
            "orgHierarchyFrameworkId",
            "orgHierarchyFrameworkStatus",
            "sbOrgType",
            "sbOrgSubType",
            "channel"
          ]
        }
      }
    } else if (this.registrationFormStepOne.controls.type.value === 'state') {
      requestBody = {
        "request": {
          "filters": {
            "status": 1,
            "levelZeroOrgId": this.registrationFormStepOne.controls.state.value,
            "levelOneOrgId": this.registrationFormStepOne.controls.department.value,
            "hierarchyRequestType": "All"
          },
          "query": "",
          "limit": reqLimit,
          "offset": reqLimit > 0 ? pageIndex * reqLimit : this.organisationDefaultLoadCount,
          "fields": [
            "identifier",
            "orgName",
            "description",
            "parentOrgName",
            "orgHierarchyFrameworkId",
            "orgHierarchyFrameworkStatus",
            "sbOrgType",
            "sbOrgSubType",
            "channel"
          ]
        }
      }
    }


    if (searchText?.length) {
      requestBody["request"]['query'] = searchText
      this.noMoreLegacyOrganisations = false
    }

    // indicate loading organisation so scroll handlers don't trigger parallel calls
    this.isLoadingMoreOrganisations = true

    this.signupSvc.getStateOrMinistyForRegistration(requestBody).pipe(finalize(() => {
      this.isLoadingMoreOrganisations = false
      this.organisationInitInProgress = false
    }))
      .subscribe({
        next: (res: any) => {
          // const content = _.get(res, 'result.response.content', [])
          const mapped = _.get(res, 'result.response.content', [])
          // const mapped = content.filter(
          //   (item: any) => item && item.sbOrgType === 'state'
          // );
          // if(res && res.result && res.result.response && res.result.response.content && res.result.response.content.length === 0) {


          if (mapped?.length === 0 || searchText?.length) {
            this.masterData['organisationBackup'] =
              this.masterData['organisationBackup'].filter(
                (item: any) => item.orgName === 'N/A'
              )
          }
          // }
          // total count may be present in different keys depending on API version.
          // Prefer 'result.result.totalcount' (legacy lower-case) then data.totalCount, then totalCount
          const total = _.get(res, 'result.response.count', _.get(res, 'result.response.count', _.get(res, 'result.response.count', 0)))
          this.defaultSearchOrganisationCount = total

          // If offset is zero (first page) replace backup, otherwise append + dedupe
          // if (!this.masterData['ministry'] || reqOffset === 0) {
          //   this.masterData['ministry'] = mapped
          // } else {
          //   const combined = (this.masterData['ministry'] || []).concat(mapped)
          //   this.masterData['ministry'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
          // }

          if (!this.masterData['organisationBackup'] || reqOffset === 0) {
            const combined = (this.masterData['organisationBackup'] || []).concat(mapped)
            this.masterData['organisationBackup'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
            // this.masterData['organisationBackup'] = mapped
          } else {
            const combined = (this.masterData['organisationBackup'] || []).concat(mapped)
            this.masterData['organisationBackup'] = _.uniqBy(combined, (it: any) => (it?.identifier || '').toLowerCase())
          }

          // If server returned no new items, mark as no-more-data to stop further scroll requests
          if (!mapped || mapped?.length === 0) {
            this.noMoreLegacyOrganisations = true
          }
          // If we've loaded at least the total count, mark no-more-data
          if (this.defaultSearchOrganisationCount && (this.masterData['organisationBackup'] || []).length >= this.defaultSearchOrganisationCount) {
            this.noMoreLegacyOrganisations = true
          }
          // Ensure visible list matches the requested display count
          this.masterData['organisation'] = (this.masterData['organisationBackup'] || []).slice(0, this.organisationListLoadCount)
          console.log(this.masterData['organisation'])
          // loading flag cleared in finalize()
          this.isLoadingMoreOrganisations = false
          this.checkCurrentOrganisationPresent()
        },
        error: () => {
          // Stop further automatic calls on repeated errors to avoid tight loops
          // loading flag cleared in finalize()
          this.noMoreLegacyOrganisations = true
          // this.matSnackBar.open('Unable to fetch designation details, please try again later!')
        }
      })
  }

  setupScrollListenerForOrganisation(opened: boolean): void {
    let scrollListenerAttached = false
    if (opened) {
      if (!scrollListenerAttached) {
        scrollListenerAttached = true

        this.organisationFilterEnable = false
        this.organisationListLoadCount = this.organisationDefaultLoadCount
        this.organisationOffset = 0

        this.isLoadingMoreOrganisations = true
        this.getOrganisationData(undefined, 0)

        // Clear search box once
        if (this.registrationFormStepOne.get('searchDepartment')) {
          this.registrationFormStepOne.get('searchDepartment')!.setValue('')
        }

        setTimeout(() => {
          const searchInput = document.querySelector('.search-input-organisation') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          }
        }, 100)

        // Attach scroll listener safely
        setTimeout(() => {
          const panel = document.querySelector('.mat-select-panel.search-panel-organisation') as HTMLElement | null
          if (panel) {
            // align panel width to trigger
            try {
              const triggerEl = this.organisationRef && this.organisationRef.nativeElement as HTMLElement
              if (triggerEl) {
                const rect = triggerEl.getBoundingClientRect()
                // set width and left so panel aligns exactly below the trigger
                panel.style.width = `${Math.round(rect.width)}px`
                // leave left to overlay positioning but nudge if necessary
                // compute left relative to viewport and apply to panel
                const overlayLeft = rect.left
                panel.style.left = `${Math.round(overlayLeft)}px`
              }
            } catch (e) {
              // ignore DOM errors in SSR or unexpected cases
            }

            const scrollHandler = this.onOrganisationSelectScroll.bind(this)
            panel.addEventListener('scroll', scrollHandler, { passive: true })
          }
        }, 150)
      }
    } else {
      // Dropdown closed — reset scroll flag so it can reattach next time
      scrollListenerAttached = false
    }
  }

  onOrganisationSelectScroll(event: any): void {
    const element = event?.target
    if (!this.organisationFilterEnable) {
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element?.clientHeight >= element?.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoreOrganisations) {
          // If org uses IGOT ministry taxonomy, request more from the API by increasing the limit
          if (this.masterData?.organisationBackup?.length > this.masterData?.organisation?.length) {
            // Local pagination: expand the sliced list
            this.isLoadingMoreOrganisations = true
            this.organisationListLoadCount += this.organisationDefaultLoadCount
            // Update the filtered list with more items
            setTimeout(() => {
              this.masterData.organisation = this.masterData?.organisationBackup?.slice(0, this.organisationListLoadCount)
              this.checkCurrentOrganisationPresent()
              this.isLoadingMoreOrganisations = false
            }, 500) // Small timeout to simulate loading and prevent multiple triggers
          } else {
            // Legacy (server) pagination: request next page if total not reached
            const loadedLegacy = (this.masterData?.organisationBackup || []).length
            if (!this.noMoreLegacyOrganisations && this.defaultSearchOrganisationCount && loadedLegacy < this.defaultSearchOrganisationCount) {
              this.isLoadingMoreOrganisations = true
              this.organisationOffset = (this.stateOffset || 0) + this.organisationDefaultLoadCount
              // increase display count to include newly fetched items
              this.organisationListLoadCount += this.organisationDefaultLoadCount
              this.getOrganisationData(undefined, this.organisationOffset)
            }
          }
        }
      }
    }
  }

  checkCurrentOrganisationPresent() {
    // Get the current designation value
    const currentOrganisation = this.registrationFormStepOne.get('organisation')!.value
    // Check if current designation exists in the list
    if (currentOrganisation) {
      const organisationExists = this.masterData?.organisation.some(
        (organisation: any) => organisation?.identifier.toLowerCase() === currentOrganisation.toLowerCase()
      )

      // If designation doesn't exist in the list, add it
      if (!organisationExists) {
        // Create a new designation object to match the structure of other items
        const newOrganisation = {
          identifier: currentOrganisation,

        }
        // Make sure the custom designation appears in the filtered list
        if (this.masterData?.organisation?.length >= this.organisationListLoadCount) {
          // Replace the last item with the new one to maintain the same number of items
          this.masterData?.organisation.pop()
        }
        this.masterData?.organisation?.unshift(newOrganisation)
        this.isLoadingMoreOrganisations = false
      }
    }
  }

  organisationSearch(evt: any) {
    const searchText = evt?.target?.value
    const txt = (searchText || '').toString().trim()
    if (this.isLoadingMoreOrganisations) return

    this.organisationSearchText = txt
    if (txt.length === 0) {
      this.organisationFilterEnable = true
      this.isLoadingMoreOrganisations = true
      this.getOrganisationData(txt, 0)
    } else if (txt?.length) {
      this.organisationFilterEnable = true
      this.isLoadingMoreOrganisations = true
      this.getOrganisationData(txt, 0)
    } else if (this.masterData && this.masterData?.organisationBackup) {
      this.masterData.organisation = this.masterData?.organisationBackup.slice(0, this.organisationDefaultLoadCount)
      this.organisationFilterEnable = false
      this.checkCurrentOrganisationPresent()
    }
  }

  onTypeChange(event: any) {
    if (event && event.value && event.value === 'state') {
      this.getStateData()
      const control = this.registrationFormStepOne.get('ministry')
      control?.clearValidators()
      control?.updateValueAndValidity()
      const stateControl = this.registrationFormStepOne.get('state')
      stateControl?.setValidators([Validators.required])
      stateControl?.updateValueAndValidity()
      const departmentControl = this.registrationFormStepOne.get('department')
      departmentControl?.setValidators([Validators.required])
      departmentControl?.updateValueAndValidity()
    } else {
      const control = this.registrationFormStepOne.get('ministry')
      control?.setValidators([Validators.required])
      control?.updateValueAndValidity()
      const stateControl = this.registrationFormStepOne.get('state')
      stateControl?.clearValidators()
      stateControl?.updateValueAndValidity()
      const departmentControl = this.registrationFormStepOne.get('department')
      departmentControl?.clearValidators()
      departmentControl?.updateValueAndValidity()
      this.getMinistryData()
    }
    if (this.registrationFormStepOne.get('organisation')) {
      this.registrationFormStepOne.get('organisation')!.setValue('')
    }
    if (this.registrationFormStepOne.get('designation')) {
      this.registrationFormStepOne.get('designation')!.setValue('')
    }
  }

  onStateChanged(event: any) {
    if (event && event.value) {
      if (event && event.value) {
        if (this.masterData['stateBackup'] && this.masterData['stateBackup'].length) {
          this.currentMinistry = _.find(this.masterData.stateBackup, { identifier: event.value })
        }
      }
    }
    this.getDepartmentData()
  }

  onMinistryChange(event: any) {
    if (event && event.value) {
      if (this.masterData['ministryBackup'] && this.masterData['ministryBackup'].length) {
        this.currentMinistry = _.find(this.masterData.ministryBackup, { identifier: event.value })
      }
    }
    if (this.registrationFormStepOne.get('organisation')) {
      this.registrationFormStepOne.get('organisation')!.setValue('')
    }
    this.getOrganisationData()
  }

  onDepartmentChange(event: any) {
    if (event && event.value && event.value !== "-1") {
      if (this.masterData['departmentBackup'] && this.masterData['departmentBackup'].length) {
        this.currentMinistry = _.find(this.masterData.departmentBackup, { identifier: event.value })
      }
    }
    this.getOrganisationData()
  }

  onOrganisationChanged(event: any) {
    if (event.value) {
      this.heirarchyObject = _.find(this.masterData.organisation, { identifier: event.value })
    }
  }
}