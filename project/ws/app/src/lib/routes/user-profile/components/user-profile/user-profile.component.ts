import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormArray, UntypedFormBuilder, AbstractControl, ValidatorFn } from '@angular/forms'
import { ENTER, COMMA } from '@angular/cdk/keycodes'
import { Subscription, Observable, interval, forkJoin } from 'rxjs'
import { startWith, map, debounceTime, distinctUntilChanged, pairwise } from 'rxjs/operators'
import { AppDateAdapter, APP_DATE_FORMATS, changeformat } from '../../services/format-datepicker'
import { ImageCropComponent, ConfigurationsService, WsEvents, EventService, PipeCertificateImageURL, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import { IMAGE_MAX_SIZE, PROFILE_IMAGE_SUPPORT_TYPES } from '@ws/author/src/lib/constants/upload'
import { UserProfileService } from '../../services/user-profile.service'
import { Router, ActivatedRoute } from '@angular/router'

import {
  INationality,
  ILanguages,
  IChipItems,
  IGovtOrgMeta,
  IIndustriesMeta,
  IProfileAcademics,
  INation,
  IdegreesMeta,
  INameField,
  ICountry,
} from '../../models/user-profile.model'
import { NsUserProfileDetails } from '@ws/app/src/lib/routes/user-profile/models/NsUserProfile'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { LoaderService } from '@ws/author/src/public-api'
/* tslint:disable */
import * as _ from 'lodash'
import { OtpService } from '../../services/otp.services';
import { environment } from 'src/environments/environment'
import { TranslateService } from '@ngx-translate/core'
import { RequestDialogComponent } from '../request-dialog/request-dialog.component'
import { USER_PROFILE_MSG_CONFIG } from './user-profile-constant'
import { MatLegacyChipInputEvent as MatChipInputEvent } from '@angular/material/legacy-chips'
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs'

/* tslint:enable */

export function forbiddenNamesValidator(optionsArray: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!optionsArray) {
      return null
      // tslint:disable-next-line: no-else-after-return
    } else {
      const index = optionsArray.findIndex((op: any) => {
        // tslint:disable-next-line: prefer-template
        return new RegExp('^' + op.name + '$').test(control.value)
      })
      return index < 0 ? { forbiddenNames: { value: control.value } } : null
    }
  }
}
@Component({
  selector: 'ws-app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [
    PipeCertificateImageURL,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  createUserForm: UntypedFormGroup
  unseenCtrl!: UntypedFormControl
  unseenCtrlSub!: Subscription
  uploadSaveData = false
  selectedIndex = 0
  groupsOriginal: any = []
  masterGroup: any
  masterNationality: Observable<INation[]> | undefined
  country: Observable<INation[]> | undefined
  masterLanguages: Observable<ILanguages[]> | undefined
  masterKnownLanguages: Observable<ILanguages[]> | undefined
  masterNationalities: INation[] = []
  countries: INation[] = []
  masterLanguagesEntries!: ILanguages[]
  selectedKnowLangs: ILanguages[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA]
  public personalInterests: IChipItems[] = []
  public selectedHobbies: IChipItems[] = []
  ePrimaryEmailType = NsUserProfileDetails.EPrimaryEmailType
  eUserGender = NsUserProfileDetails.EUserGender
  eMaritalStatus = NsUserProfileDetails.EMaritalStatus
  eCategory = NsUserProfileDetails.ECategory
  userProfileFields!: NsUserProfileDetails.IUserProfileFields
  inReview = 'In Review!'
  imageTypes = PROFILE_IMAGE_SUPPORT_TYPES
  today = new Date()
  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'
  pincodePattern = '(^[0-9]{6}$)'
  yearPattern = '(^[0-9]{4}$)'
  namePatern = `^[a-zA-Z\\s\\']{1,32}$`
  telephonePattern = `^[0-9]+-?[0-9]+$`
  emailLengthVal = false
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  @ViewChild('knownLanguagesInput', { static: true }) knownLanguagesInputRef!: ElementRef<HTMLInputElement>
  isEditEnabled = false
  tncAccepted = false
  isOfficialEmail = false
  govtOrgMeta!: IGovtOrgMeta
  industriesMeta!: IIndustriesMeta
  degreesMeta!: IdegreesMeta
  designationsMeta!: any // IdesignationsMeta
  public degrees!: UntypedFormArray
  public postDegrees!: UntypedFormArray
  public degreeInstitutes = []
  public postDegreeInstitutes = []
  public countryCodes: string[] = []
  gradePayData!: any
  showDesignationOther!: boolean
  showOrgnameOther!: boolean
  showIndustryOther!: boolean
  showGraduationDegreeOther!: boolean
  showPostDegreeOther!: boolean
  photoUrl!: string | ArrayBuffer | null
  isForcedUpdate = false
  userProfileData!: any
  allDept: any = []
  approvalConfig!: NsUserProfileDetails.IApprovals
  unApprovedField!: any[]
  unApprovedReq!: any
  changedProperties: any = {}
  otpSend = false
  otpVerified = false
  OTP_TIMER = environment.resendOTPTIme
  timerSubscription: Subscription | null = null
  timeLeftforOTP = 0
  isMobileVerified = false
  degreefilteredOptions: INameField[] | undefined
  postDegreefilteredOptions: INameField[] | undefined
  disableVerifyBtn = false
  karmayogiBadge = false
  isVerifiedAlready = false
  selectedtags: any[] = []
  eHRMSId: any
  eHRMSName: any
  verifiedKarmayogiMsg!: any
  rejectedKarmayogiMsg!: any
  rejectedReq!: any
  isverifiedKBKeyExist!: boolean
  isverifiedKeyInAppv!: boolean
  isReqVKBuser = false
  isSaveButtoDisable = false
  isEhrmsId: any
  ehrmsInfo: any
  userData!: any

  otpEmailSend = true
  showUpdateEmail = false
  isOtpSent = false
  emailRegix = `^[\\w\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
  updatePrimaryEmail: UntypedFormControl
  emailOtp: UntypedFormControl
  emailTimerSubscription: Subscription | null = null
  emailTimeLeftforOTP = 0
  disableVerifyEmailBtn = false
  emailOtpVerified = false

  constructor(
    private snackBar: MatSnackBar,
    private userProfileSvc: UserProfileService,
    private configSvc: ConfigurationsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private loader: LoaderService,
    private eventSvc: EventService,
    private otpService: OtpService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private pipeImgUrl: PipeCertificateImageURL
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }

    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })

    this.approvalConfig = this.route.snapshot.data.pageData.data
    this.isForcedUpdate = !!this.route.snapshot.paramMap.get('isForcedUpdate')

    this.updatePrimaryEmail = new UntypedFormControl('',
                                              [Validators.required,
        Validators.email,
        Validators.pattern(this.emailRegix),
      ]
    )
    this.emailOtp = new UntypedFormControl('')

    this.createUserForm = new UntypedFormGroup({
      firstname: new UntypedFormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      middlename: new UntypedFormControl('', [Validators.pattern(this.namePatern)]),
      // surname: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      photo: new UntypedFormControl('', []),
      countryCode: new UntypedFormControl('+91', [Validators.required]),
      mobile: new UntypedFormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
      telephone: new UntypedFormControl('', [Validators.pattern(this.telephonePattern)]),
      primaryEmail: new UntypedFormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      primaryEmailType: new UntypedFormControl(this.assignPrimaryEmailTypeCheckBox(this.ePrimaryEmailType.OFFICIAL), []),
      secondaryEmail: new UntypedFormControl('', []),
      nationality: new UntypedFormControl('', []),
      dob: new UntypedFormControl('', [Validators.required]),
      gender: new UntypedFormControl('', [Validators.required]),
      maritalStatus: new UntypedFormControl('', []),
      domicileMedium: new UntypedFormControl('', []),
      knownLanguages: new UntypedFormControl([], []),
      residenceAddress: new UntypedFormControl('', []),
      category: new UntypedFormControl('', [Validators.required]),
      pincode: new UntypedFormControl('', [Validators.required, Validators.pattern(this.pincodePattern)]),
      schoolName10: new UntypedFormControl('', []),
      yop10: new UntypedFormControl('', [Validators.pattern(this.yearPattern)]),
      schoolName12: new UntypedFormControl('', []),
      yop12: new UntypedFormControl('', [Validators.pattern(this.yearPattern)]),
      degrees: this.fb.array([this.createDegree()]),
      postDegrees: this.fb.array([this.createDegree()]),
      certificationDesc: new UntypedFormControl('', []),
      interests: new UntypedFormControl('', []),
      hobbies: new UntypedFormControl('', []),
      skillAquiredDesc: new UntypedFormControl('', []),
      isGovtOrg: new UntypedFormControl(false, []),
      orgName: new UntypedFormControl('', []),
      orgNameOther: new UntypedFormControl('', []),
      industry: new UntypedFormControl('', []),
      industryOther: new UntypedFormControl('', []),
      designation: new UntypedFormControl('', [Validators.required]),
      designationOther: new UntypedFormControl('', []),
      location: new UntypedFormControl('', []),
      locationOther: new UntypedFormControl('', []),
      doj: new UntypedFormControl('', []),
      orgDesc: new UntypedFormControl('', []),
      payType: new UntypedFormControl('', []),
      service: new UntypedFormControl('', []),
      cadre: new UntypedFormControl('', []),
      allotmentYear: new UntypedFormControl('', [Validators.pattern(this.yearPattern)]),
      otherDetailsDoj: new UntypedFormControl('', []),
      civilListNo: new UntypedFormControl('', []),
      employeeCode: new UntypedFormControl('', []),
      otherDetailsOfficeAddress: new UntypedFormControl('', []),
      otherDetailsOfficePinCode: new UntypedFormControl('', []),
      departmentName: new UntypedFormControl('', []),
      verifiedKarmayogi: new UntypedFormControl(this.karmayogiBadge, []),
      group: new UntypedFormControl('', [Validators.required]),
      eHRMSId: new UntypedFormControl({ value: '', disabled: true }, []),
      eHRMSName: new UntypedFormControl({ value: '', disabled: true }, []),
    })

  }
  async init() {
    await this.loadDesignations()
    this.fetchMeta()
  }
  ngOnInit() {
    this.verifiedKarmayogiMsg = USER_PROFILE_MSG_CONFIG.verifiedKarmayogi
    this.rejectedKarmayogiMsg = USER_PROFILE_MSG_CONFIG.rejectedKarmayogiMsg
    const approvalData = _.compact(_.map(this.approvalConfig, (v, k) => {
      return v.approvalRequired ? { [k]: v } : null
    }))

    if (approvalData.length > 0) {
      // need to call search API
    }
    this.init()
    this.getUserAllDetails()
    this.checkIfMobileNoChanged()
    this.onPhoneChange()
    this.onEmailChange()
    // this.onGroupChange()
  }

  displayFnPosition = (value: any) => {
    return value ? value.name : undefined
  }
  checkIfMobileNoChanged(): void {
    // this.createUserForm.controls['mobile'].valueChanges.subscribe((oldValue: any) => {
    //   if (oldValue) { }
    //   this.isMobileVerified = false
    // })
    const ctrl = this.createUserForm.get('mobile')
    if (ctrl) {
      ctrl
        .valueChanges
        .pipe(startWith(null), pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          if (!(prev == null && next)) {
            this.isMobileVerified = false
          }
        })
    }
  }

  fetchMeta() {
    this.userProfileSvc.getMasterCountries().subscribe(
      data => {
        data.countries.map((item: ICountry) => {
          this.countries.push({ name: item.name })
          // this.countryCodes.push(item.countryCode)
        })
        this.onChangesCountry()
      },
      (_err: any) => {
      })

    this.userProfileSvc.getGroups().subscribe(data => {
      const res = data.result.response
      res.map((value: any) => {
        this.groupsOriginal.push({ name: value })
      })
      this.onGroupChange()
    },
                                              (_err: any) => {
      })

    this.userProfileSvc.getMasterNationality().subscribe(
      data => {
        data.nationality.map((item: INationality) => {
          this.masterNationalities.push({ name: item.name })
          this.countryCodes.push(item.countryCode)
        })

        this.createUserForm.patchValue({
          countryCode: '+91',
        })

        if (this.createUserForm.value.nationality === null || this.createUserForm.value.nationality === undefined) {
          this.createUserForm.patchValue({
            nationality: 'Indian',
          })
        }
        this.onChangesNationality()
      },
      (_err: any) => {
      })

    this.userProfileSvc.getMasterLanguages().subscribe(
      data => {
        this.masterLanguagesEntries = data.languages
        this.onChangesLanuage()
        this.onChangesKnownLanuage()
      },
      (_err: any) => {
      })
    this.userProfileSvc.getProfilePageMeta().subscribe(
      data => {
        this.govtOrgMeta = data.govtOrg
        this.industriesMeta = data.industries
        this.degreesMeta = data.degrees
        this.gradePayData = data.designations.gradePay.sort((a: any, b: any) => {
          return a.name - b.name
        })
        // this.designationsMeta = data.designations
        this.onChangesDegrees()
        this.onChangesPostDegrees()
      },
      (_err: any) => {
      })
    this.userProfileSvc.getAllDepartments().subscribe(
      (data: any) => {
        const newData = data.map((el: any) => {
          return el.trim()
        })
        this.allDept = newData.sort((a: any, b: any) => {
          return a.toLowerCase().localeCompare(b.toLowerCase())
        })

      },
      (_err: any) => {
      })
  }

  async loadDesignations() {
    await this.userProfileSvc.getDesignations({}).subscribe(
      (data: any) => {
        this.designationsMeta = data.responseData
      },
      (_err: any) => {
      })
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

  createDegree(): UntypedFormGroup {
    return this.fb.group({
      degree: new UntypedFormControl('', []),
      instituteName: new UntypedFormControl('', []),
      yop: new UntypedFormControl('', [Validators.pattern(this.yearPattern)]),
      graduationOther: new UntypedFormControl('', []),
    })
  }

  isVerifiedKBReq() {
    if (this.isVerifiedAlready) {
      this.isReqVKBuser = false
    } else if (this.isverifiedKeyInAppv) {
      this.isReqVKBuser = false // if inreview
    } else if ((!this.isVerifiedAlready || !this.isverifiedKeyInAppv) && this.isverifiedKBKeyExist) {
      this.isReqVKBuser = true // reject case
    } else if (!this.isVerifiedAlready && !this.isverifiedKeyInAppv && !this.isverifiedKBKeyExist) {
      this.isReqVKBuser = false // firsttime user
    }
  }

  isAllowed(name: string) {
    if (name && !!this.unApprovedField && this.unApprovedField.length > 0) {
      return !!!(this.unApprovedField.indexOf(name) >= 0)
    } return true
  }

  createDegreeWithValues(degree: any): UntypedFormGroup {
    return this.fb.group({
      degree: new UntypedFormControl(degree.degree, []),
      instituteName: new UntypedFormControl(degree.instituteName, []),
      yop: new UntypedFormControl(degree.yop, [Validators.pattern(this.yearPattern)]),
      graduationOther: new UntypedFormControl(degree.graduationOther, []),
    })
  }

  public addDegree() {
    this.degrees = this.createUserForm.get('degrees') as UntypedFormArray
    this.degrees.push(this.createDegree())
  }

  public addDegreeValues(degree: any) {
    this.degrees = this.createUserForm.get('degrees') as UntypedFormArray
    this.degrees.push(this.createDegreeWithValues(degree))
  }

  get degreesControls() {
    const deg = this.createUserForm.get('degrees')
    return (<any>deg)['controls']
  }

  public removeDegrees(i: number) {
    this.degrees.removeAt(i)
  }

  public addPostDegree() {
    this.postDegrees = this.createUserForm.get('postDegrees') as UntypedFormArray
    this.postDegrees.push(this.createDegree())
  }

  public addPostDegreeValues(degree: any) {
    this.postDegrees = this.createUserForm.get('postDegrees') as UntypedFormArray
    this.postDegrees.push(this.createDegreeWithValues(degree))
  }

  get postDegreesControls() {
    const deg = this.createUserForm.get('postDegrees')
    return (<any>deg)['controls']
  }

  public removePostDegrees(i: number) {
    this.postDegrees.removeAt(i)
  }
  onGroupChange() {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterGroup = this.createUserForm.get('group')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map((value: any) => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map((name: any) => name ? this.filterGroups(name) : this.groupsOriginal.slice())
      )
    // this.masterGroup.subscribe(() => {
    //   // tslint:disable-next-line: no-non-null-assertion
    //   this.createUserForm.get('group')!.setValidators([Validators.required])
    //   this.createUserForm.updateValueAndValidity()
    // })
  }

  private filterGroups(name: string): any {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.groupsOriginal.filter((option: any) => option.toLowerCase().includes(filterValue))
    }
    return this.groupsOriginal
  }

  onChangesNationality(): void {

    if (this.createUserForm.get('nationality') != null) {
      // tslint:disable-next-line: no-non-null-assertion
      this.masterNationality = this.createUserForm.get('nationality')!.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          startWith(''),
          map(value => typeof value === 'string' ? value : (value && value.name ? value.name : '')),
          map(name => name ? this.filterNationality(name) : this.masterNationalities.slice())
        )
      // const newLocal = 'nationality'
      // this.masterNationality.subscribe(event => {
      //   // tslint:disable-next-line: no-non-null-assertion
      //   this.createUserForm.get(newLocal)!.setValidators([Validators.required])

      //   this.createUserForm.updateValueAndValidity()

      // })

    }
  }

  onChangesCountry(): void {
    // tslint:disable-next-line: no-non-null-assertion
    this.country = this.createUserForm.get('location')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map(name => name ? this.filterCountry(name) : this.countries.slice()),
      )
  }

  onChangesLanuage(): void {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterLanguages = this.createUserForm.get('domicileMedium')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map(name => name ? this.filterLanguage(name) : this.masterLanguagesEntries.slice()),
      )
  }

  onChangesKnownLanuage(): void {
    // tslint:disable-next-line: no-non-null-assertion
    this.masterKnownLanguages = this.createUserForm.get('knownLanguages')!.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map(value => typeof value === 'string' || 'ILanguages' ? value : value.name),
        map(name => {
          if (name) {
            if (name.constructor === Array) {
              return this.filterMultiLanguage(name)
            }
            return this.filterLanguage(name)
          }
          return this.masterLanguagesEntries.slice()
        })
      )
  }

  onChangesDegrees() {
    const controls = this.createUserForm.get('degrees') as UntypedFormArray
    // tslint:disable-next-line: no-non-null-assertion
    if (controls.length > 0) {
      // tslint:disable-next-line: no-non-null-assertion
      controls.at(controls.length - 1)!.get('degree')!.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith<string | INameField>(''),
        map(value => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map(name => name ? this.filterDegrees(name) : this.degreesMeta.graduations.slice()),
      ).subscribe(val => this.degreefilteredOptions = val)
    }
  }

  onChangesPostDegrees() {
    const controls = this.createUserForm.get('postDegrees') as UntypedFormArray
    // tslint:disable-next-line: no-non-null-assertion
    if (controls.length > 0) {
      // tslint:disable-next-line: no-non-null-assertion
      controls.at(controls.length - 1)!.get('degree')!.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith<string | INameField>(''),
        map(value => typeof (value) === 'string' ? value : (value && value.name ? value.name : '')),
        map(name => name ? this.filterPostDegrees(name) : this.degreesMeta.postGraduations.slice()),
      ).subscribe(val => this.postDegreefilteredOptions = val)
    }
  }

  verifiedKarmayogiCheck() {
    this.karmayogiBadge = !this.karmayogiBadge
    this.createUserForm.patchValue({ verifiedKarmayogi: this.karmayogiBadge })
  }

  private filterNationality(name: string): INation[] {

    if (name) {
      const filterValue = name.toLowerCase()
      return this.masterNationalities.filter(option => option.name.toLowerCase().includes(filterValue))
    }
    return this.masterNationalities
  }

  private filterCountry(name: string): INation[] {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.countries.filter(option => option.name.toLowerCase().includes(filterValue))
    }
    return this.countries
  }

  private filterLanguage(name: string): ILanguages[] {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.masterLanguagesEntries.filter(option => option.name.toLowerCase().includes(filterValue))
    }
    return this.masterLanguagesEntries
  }

  private filterMultiLanguage(name: string[]): ILanguages[] {
    if (name) {
      const filterValue = name.map(n => n.toLowerCase())
      return this.masterLanguagesEntries.filter(option => {
        // option.name.toLowerCase().includes(filterValue))
        filterValue.map(f => {
          return option.name.toLowerCase().includes(f)
        })
      })
    }
    return this.masterLanguagesEntries
  }

  private filterDegrees(name: string): INameField[] {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.degreesMeta.graduations.filter(option => option.name.toLowerCase().includes(filterValue))
    }
    return this.degreesMeta.graduations
  }

  private filterPostDegrees(name: string): INameField[] {
    if (name) {
      const filterValue = name.toLowerCase()
      return this.degreesMeta.postGraduations.filter(option => option.name.toLowerCase().includes(filterValue))
    }
    return this.degreesMeta.postGraduations
  }

  ngOnDestroy() {
    if (this.unseenCtrlSub && !this.unseenCtrlSub.closed) {
      this.unseenCtrlSub.unsubscribe()
    }
  }

  public selectKnowLanguage(data: any, input: any) {
    const value: ILanguages = data.option.value
    if (!this.selectedKnowLangs.includes(value)) {
      this.selectedKnowLangs.push(data.option.value)
    }
    if (this.knownLanguagesInputRef && this.knownLanguagesInputRef.nativeElement) {
      this.knownLanguagesInputRef.nativeElement.value = ''
    }
    if (input && input.value) {
      input.value = ''
    }
    // this.knownLanguagesInputRef.nativeElement.value = ''
    if (this.createUserForm.get('knownLanguages')) {
      // tslint:disable-next-line: no-non-null-assertion
      this.createUserForm.get('knownLanguages')!.setValue(null)
    }
  }

  public removeKnowLanguage(lang: any) {
    const index = this.selectedKnowLangs.indexOf(lang)

    if (index >= 0) {
      this.selectedKnowLangs.splice(index, 1)
    }

  }

  add(event: MatChipInputEvent): void {
    const input = event.input
    const value = event.value as unknown as ILanguages

    // Add our fruit
    if ((value || '')) {
      this.selectedKnowLangs.push(value)
    }

    // Reset the input value
    if (input) {
      input.value = ''
    }
    if (this.knownLanguagesInputRef && this.knownLanguagesInputRef.nativeElement) {
      this.knownLanguagesInputRef.nativeElement.value = ''
    }
    if (this.createUserForm.get('knownLanguages')) {
      // tslint:disable-next-line: no-non-null-assertion
      this.createUserForm.get('knownLanguages')!.setValue(null)
    }
  }

  addPersonalInterests(event: MatChipInputEvent): void {
    const input = event.input
    const value = event.value as unknown as IChipItems

    if ((value || '')) {
      this.personalInterests.push(value)
    }

    if (input) {
      input.value = ''
    }

    // this.knownLanguagesInputRef.nativeElement.value = ''
    if (this.createUserForm.get('interests')) {
      // tslint:disable-next-line: no-non-null-assertion
      this.createUserForm.get('interests')!.setValue(null)
    }
  }

  addHobbies(event: MatChipInputEvent) {
    const input = event.input
    const value = event.value as unknown as IChipItems

    if ((value || '')) {
      this.selectedHobbies.push(value)
    }

    if (input) {
      input.value = ''
    }

    if (this.createUserForm.get('hobbies')) {
      // tslint:disable-next-line: no-non-null-assertion
      this.createUserForm.get('hobbies')!.setValue(null)
    }
  }

  removePersonalInterests(interest: any) {
    const index = this.personalInterests.indexOf(interest)

    if (index >= 0) {
      this.personalInterests.splice(index, 1)
    }
  }

  removeHobbies(interest: any) {
    const index = this.selectedHobbies.indexOf(interest)
    if (index >= 0) {
      this.selectedHobbies.splice(index, 1)
    }
  }

  getUserAllDetails() {
    if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.id) {
      forkJoin([this.userProfileSvc.getUserdetailsFromRegistry(this.configSvc.unMappedUser.id),
        this.userProfileSvc.listApprovalPendingFields(), this.userProfileSvc.listRejectedFields()]
        ).subscribe(
        ([userres, unApprovedres, rejectedres]) => {
          const userdata = userres

          if (unApprovedres && unApprovedres.result && unApprovedres.result.data) {
            const keyFields = _.get(unApprovedres, 'result.data')
            this.unApprovedReq = _.get(unApprovedres, 'result.data')
            this.unApprovedField = Object.keys(keyFields)
            this.isverifiedKeyInAppv = this.unApprovedReq.hasOwnProperty('verifiedKarmayogi')
          }

          if (rejectedres && rejectedres.result && rejectedres.result.data) {
            this.rejectedReq = _.get(rejectedres, 'result.data')
            this.isverifiedKBKeyExist = this.rejectedReq.hasOwnProperty('verifiedKarmayogi')
          }

          this.getUserDetails(userdata)
        },
        (err: any) => {
          if (err) { this.openSnackbar('Something went wrong, please try again later!') }
        }
      )
    } else {
      if (this.configSvc.userProfile) {
        const tempData = this.configSvc.userProfile
        this.userProfileData = _.get(this.configSvc, 'unMappedUser.profileDetails')
        this.createUserForm.patchValue({
          firstname: tempData.firstName,
          // surname: tempData.lastName,
          primaryEmail: _.get(this.configSvc.unMappedUser, 'profileDetails.personalDetails.primaryEmail') || tempData.email,
          orgName: tempData.rootOrgName,

        })
      }
    }
  }

  getUserDetails(data: any) {
      // if (this.configSvc.unMappedUser && this.configSvc.unMappedUser.id) {
      // if (this.configSvc.userProfile) {
      // this.userProfileSvc.getUserdetailsFromRegistry(this.configSvc.unMappedUser.id).subscribe(
      // (data: any) => {
      // tslint:disable-next-line: max-line-length
      if (data && data.profileDetails && data.profileDetails.additionalProperties && data.profileDetails.additionalProperties.externalSystem === 'DoPT eHRMS') {
        this.isEhrmsId = data.profileDetails.additionalProperties.externalSystemId
      }

      const userData = {
        ...data.profileDetails || _.get(this.configSvc.unMappedUser, 'profileDetails'),
        id: data.id, userId: data.userId,
      }
      if (data.profileDetails && (userData.id || userData.userId)) {
        this.isMobileVerified = _.get(data, 'profileDetails.personalDetails.phoneVerified') && true
        const academics = this.populateAcademics(userData)
        this.setDegreeValuesArray(academics)
        this.setPostDegreeValuesArray(academics)
        const organisations = this.populateOrganisationDetails(userData)
        this.constructFormFromRegistry(userData, academics, organisations)
        this.populateChips(userData)
        this.isVerifiedKBReq()
        this.userProfileData = userData
        if (this.userProfileData && this.userProfileData.additionalProperties) {
          this.selectedtags = this.userProfileData.additionalProperties.tag || []
          this.eHRMSId = this.userProfileData.additionalProperties.externalSystemId
          this.eHRMSName = this.userProfileData.additionalProperties.externalSystem
        }
      } else {
        if (this.configSvc.userProfile) {
          this.userProfileData = { ...userData, id: this.configSvc.userProfile.userId, userId: this.configSvc.userProfile.userId }
          this.createUserForm.patchValue({
            firstname: this.configSvc.userProfile.firstName,
            // surname: this.configSvc.userProfile.lastName,
            primaryEmail: _.get(this.userProfileData, 'personalDetails.primaryEmail') || this.configSvc.userProfile.email,
            orgName: this.configSvc.userProfile.rootOrgName,
          })
          if (this.userProfileData && this.userProfileData.additionalProperties) {
            this.selectedtags = this.userProfileData.additionalProperties.tag || []
            this.eHRMSId = this.userProfileData.additionalProperties.externalSystemId
            this.eHRMSName = this.userProfileData.additionalProperties.externalSystem
          }
        }
      }
      // this.handleFormData(data[0])
      // },
    // }
  }

  private populateOrganisationDetails(data: any) {
    let org = {
      isGovtOrg: true,
      orgName: '',
      industry: '',
      designation: '',
      group: '',
      location: '',
      responsibilities: '',
      doj: '',
      orgDesc: '',
      completePostalAddress: '',
      orgNameOther: '',
      industryOther: '',
      eHRMSId: '',
      eHRMSName: '',
    }
    // tslint:disable-next-line: max-line-length
    if ((data && data.professionalDetails && data.professionalDetails.length > 0) || (this.unApprovedField && this.unApprovedField.length > 0)) {
      const organisation = data && data.professionalDetails ? data.professionalDetails[0] : null
      org = {
        isGovtOrg: organisation && organisation.organisationType ? organisation.organisationType : true,
        orgName: this.unApprovedReq && this.unApprovedReq.name ? this.unApprovedReq.name : organisation ? organisation.name : '',
        // tslint:disable-next-line: max-line-length
        orgNameOther: this.unApprovedReq && this.unApprovedReq.nameOther ? this.unApprovedReq.nameOther : organisation ? organisation.nameOther : '',
        // tslint:disable-next-line: max-line-length
        industry: this.unApprovedReq && this.unApprovedReq.industry ? this.unApprovedReq.industry : organisation ? organisation.industry : '',
        // tslint:disable-next-line: max-line-length
        industryOther: this.unApprovedReq && this.unApprovedReq.industryOther ? this.unApprovedReq.industryOther : organisation ? organisation.industryOther : '',
        // tslint:disable-next-line: max-line-length
        designation: this.unApprovedReq && this.unApprovedReq.designation ? this.unApprovedReq.designation.toUpperCase() : organisation ? organisation.designation.toUpperCase() : '',
        // tslint:disable-next-line: max-line-length
        group: this.unApprovedReq && this.unApprovedReq.group ? this.unApprovedReq.group : organisation ? organisation.group : '',
        // tslint:disable-next-line: max-line-length
        location: this.unApprovedReq && this.unApprovedReq.location ? this.unApprovedReq.location : organisation ? organisation.location : '',
        responsibilities: organisation ? organisation.responsibilities : '',
        // tslint:disable-next-line: max-line-length
        doj: this.unApprovedReq && this.unApprovedReq.doj ? this.getDateFromText(this.unApprovedReq.doj) : organisation ? this.getDateFromText(organisation.doj) : '',
        // tslint:disable-next-line: max-line-length
        orgDesc: this.unApprovedReq && this.unApprovedReq.description ? this.unApprovedReq.description : organisation ? organisation.description : '',
        completePostalAddress: organisation ? organisation.completePostalAddress : '',
        eHRMSId: _.get(data, 'additionalProperties.externalSystemId') || '',
        eHRMSName: _.get(data, 'additionalProperties.externalSystem') || '',
      }
      if (organisation && organisation.organisationType === 'Government') {
        org.isGovtOrg = true
      } else {
        org.isGovtOrg = false
      }
    }
    return org
  }

  private populateAcademics(data: any) {
    const academics: NsUserProfileDetails.IAcademics = {
      X_STANDARD: {
        schoolName10: '',
        yop10: '',
      },
      XII_STANDARD: {
        schoolName12: '',
        yop12: '',
      },
      degree: [],
      postDegree: [],
    }
    if (data.academics && Array.isArray(data.academics)) {
      data.academics.map((item: any) => {
        switch (item.type) {
          case 'X_STANDARD': academics.X_STANDARD.schoolName10 = item.nameOfInstitute
            academics.X_STANDARD.yop10 = item.yearOfPassing
            break
          case 'XII_STANDARD': academics.XII_STANDARD.schoolName12 = item.nameOfInstitute
            academics.XII_STANDARD.yop12 = item.yearOfPassing
            break
          case 'GRADUATE': academics.degree.push({
            degree: item.nameOfQualification,
            instituteName: item.nameOfInstitute,
            yop: item.yearOfPassing,
            graduationOther: item.nameOfOtherQualification,
          })
            break
          case 'POSTGRADUATE': academics.postDegree.push({
            degree: item.nameOfQualification,
            instituteName: item.nameOfInstitute,
            yop: item.yearOfPassing,
            graduationOther: item.nameOfOtherQualification,
          })
            break
        }
      })
    }
    return academics
  }

  private populateChips(data: any) {
    if (data.personalDetails.knownLanguages && data.personalDetails.knownLanguages.length) {
      data.personalDetails.knownLanguages.map((lang: ILanguages) => {
        if (lang) {
          this.selectedKnowLangs.push(lang)
        }
      })
    }
    if (data.interests && data.interests.professional && data.interests.professional.length) {
      data.interests.professional.map((interest: IChipItems) => {
        if (interest) {
          this.personalInterests.push(interest)
        }
      })
    }
    if (data.interests && data.interests.hobbies && data.interests.hobbies.length) {
      data.interests.hobbies.map((interest: IChipItems) => {
        if (interest) {
          this.selectedHobbies.push(interest)
        }
      })
    }
  }

  private filterPrimaryEmailType(data: any) {
    if (data.personalDetails.officialEmail) {
      this.isOfficialEmail = true
    } else {
      this.isOfficialEmail = false
    }
    // this.cd.detectChanges()
    return this.ePrimaryEmailType.OFFICIAL
    // this.assignPrimaryEmailTypeCheckBox(this.ePrimaryEmailType.PERSONAL)
    // return this.ePrimaryEmailType.PERSONAL
  }

  private constructFormFromRegistry(data: any, academics: NsUserProfileDetails.IAcademics, organisation: any) {
    /* tslint:disable */
    this.createUserForm.patchValue({
      firstname: data.personalDetails.firstname,
      middlename: data.personalDetails.middlename,
      // surname: data.personalDetails.surname,
      photo: data.photo,
      dob: this.getDateFromText(data.personalDetails.dob),
      nationality: data.personalDetails.nationality,
      domicileMedium: data.personalDetails.domicileMedium,
      gender: data.personalDetails.gender,
      maritalStatus: data.personalDetails.maritalStatus,
      category: data.personalDetails.category,
      knownLanguages: data.personalDetails.knownLanguages,
      countryCode: data.personalDetails.countryCode || '+91',
      mobile: data.personalDetails.mobile,
      telephone: this.checkvalue(data.personalDetails.telephone),
      primaryEmail: data.personalDetails.primaryEmail || '',
      secondaryEmail: data.personalDetails.personalEmail,
      primaryEmailType: this.filterPrimaryEmailType(data),
      residenceAddress: data.personalDetails.postalAddress,
      pincode: data.personalDetails.pincode,
      schoolName10: academics.X_STANDARD.schoolName10,
      yop10: academics.X_STANDARD.yop10,
      schoolName12: academics.XII_STANDARD.schoolName12,
      yop12: academics.XII_STANDARD.yop12,
      isGovtOrg: organisation.isGovtOrg,
      //orgName: organisation.orgName,
      industry: organisation.industry,
      designation: organisation.designation || _.get(data, 'professionalDetails.designation'),
      group: organisation.group || _.get(data, 'professionalDetails.group'),
      location: organisation.location,
      doj: organisation.doj,
      orgDesc: organisation.orgDesc,
      orgNameOther: organisation.orgNameOther,
      industryOther: organisation.industryOther,
      designationOther: organisation.designationOther,
      orgName: _.get(data, 'employmentDetails.departmentName') || '',
      service: _.get(data, 'employmentDetails.service') || '',
      cadre: _.get(data, 'employmentDetails.cadre') || '',
      allotmentYear: this.checkvalue(_.get(data, 'employmentDetails.allotmentYearOfService') || ''),
      otherDetailsDoj: this.getDateFromText(_.get(data, 'employmentDetails.dojOfService') || ''),
      payType: _.get(data, 'employmentDetails.payType') || '',
      civilListNo: _.get(data, 'employmentDetails.civilListNo') || '',
      employeeCode: this.checkvalue(_.get(data, 'employmentDetails.employeeCode') || ''),
      otherDetailsOfficeAddress: this.checkvalue(_.get(data, 'employmentDetails.officialPostalAddress') || ''),
      otherDetailsOfficePinCode: this.checkvalue(_.get(data, 'employmentDetails.pinCode') || ''),
      skillAquiredDesc: _.get(data, 'skills.additionalSkills') || '',
      certificationDesc: _.get(data, 'skills.certificateDetails') || '',
      verifiedKarmayogi: data.verifiedKarmayogi,
      eHRMSId: _.get(data, 'additionalProperties.externalSystemId') || '',
      eHRMSName: _.get(data, 'additionalProperties.externalSystem') || ''
    },
      {
        emitEvent: true,
      })
    if (data.verifiedKarmayogi) {
      this.isVerifiedAlready = data.verifiedKarmayogi
      this.karmayogiBadge = data.verifiedKarmayogi
      this.createUserForm.patchValue({
        verifiedKarmayogi: data.verifiedKarmayogi
      })
    }
    /* tslint:enable */
    this.cd.detectChanges()
    this.cd.markForCheck()
    this.setDropDownOther(organisation, academics)
    this.setProfilePhotoValue(data)
  }
  onPhoneChange() {
    const ctrl = this.createUserForm.get('mobile')
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
    const ctrl = this.updatePrimaryEmail
    if (ctrl) {
      ctrl
        .valueChanges
        .pipe(startWith(null), pairwise())
        .subscribe(([prev, next]: [any, any]) => {
          if (!(prev == null && next)) {
            this.isOtpSent = false
            this.disableVerifyEmailBtn = false
            this.emailOtp.setValue('')
          }
        })
    }
  }
  checkvalue(value: any) {
    if (value && value === 'undefined') {
      // tslint:disable-next-line:no-parameter-reassignment
      value = ''
    } else {
      return value
    }
  }

  numericOnly(event: any): boolean {
    const pattren = /^([0-9])$/
    const result = pattren.test(event.key)
    return result
  }

  setProfilePhotoValue(data: any) {
    this.photoUrl = data.profileImageUrl || undefined
  }

  setDropDownOther(organisation?: any, academics?: any) {
    if (organisation.designation === 'Other') {
      this.showDesignationOther = true
    } else {
      this.showDesignationOther = false
    }
    if (organisation.orgName === 'Other') {
      this.showOrgnameOther = true
    } else {
      this.showOrgnameOther = false
    }
    if (organisation.industry === 'Other') {
      this.showIndustryOther = true
    }
    if (academics.degree === 'Other') {
      this.showGraduationDegreeOther = true
    }
    if (organisation.postGraduation === 'Other') {
      this.showPostDegreeOther = true
    }
  }

  private setDegreeValuesArray(academics: any) {
    this.degrees = this.createUserForm.get('degrees') as UntypedFormArray
    this.degrees.removeAt(0)
    academics.degree.map((degree: any) => { this.addDegreeValues(degree as UntypedFormArray) })
  }

  private setPostDegreeValuesArray(academics: any) {
    this.postDegrees = this.createUserForm.get('postDegrees') as UntypedFormArray
    this.postDegrees.removeAt(0)
    academics.postDegree.map((degree: any) => { this.addPostDegreeValues(degree as UntypedFormArray) })
  }

  private getAcademics(form: any) {
    const academics = []
    academics.push(this.getClass10(form))
    academics.push(this.getClass12(form))
    academics.push(...this.getDegree(form, 'GRADUATE'))
    academics.push(...this.getPostDegree(form, 'POSTGRADUATE'))
    return academics
  }

  getClass10(form: any): IProfileAcademics {
    return ({
      nameOfQualification: '',
      type: 'X_STANDARD',
      nameOfInstitute: form.value.schoolName10,
      yearOfPassing: `${form.value.yop10}`,
    })
  }

  getClass12(form: any): IProfileAcademics {
    return ({
      nameOfQualification: '',
      type: 'XII_STANDARD',
      nameOfInstitute: form.value.schoolName12,
      yearOfPassing: `${form.value.yop12}`,
    })
  }

  getDegree(form: any, degreeType: string): IProfileAcademics[] {
    const formatedDegrees: IProfileAcademics[] = []
    form.value.degrees.map((degree: any) => {
      formatedDegrees.push({
        nameOfQualification: degree.degree,
        type: degreeType,
        nameOfInstitute: degree.instituteName,
        yearOfPassing: `${degree.yop}`,
        nameOfOtherQualification: degree.graduationOther,
      })
    })
    return formatedDegrees
  }

  getPostDegree(form: any, degreeType: string): IProfileAcademics[] {
    const formatedDegrees: IProfileAcademics[] = []
    form.value.postDegrees.map((degree: any) => {
      formatedDegrees.push({
        nameOfQualification: degree.degree,
        type: degreeType,
        nameOfInstitute: degree.instituteName,
        yearOfPassing: `${degree.yop}`,
        nameOfOtherQualification: degree.graduationOther,
      })
    })
    return formatedDegrees
  }

  getEditedValues(form: any) {

    const personalDetail: any = {}
    const personalDetailsFields = ['firstname', 'middlename', 'surname',
      'dob', 'nationality', 'domicileMedium', 'gender', 'maritalStatus', 'photo',
      'category', 'knownLanguages', 'countryCode', 'mobile', 'phoneVerified', 'telephone',
      'primaryEmail', 'officialEmail', 'personalEmail', 'postalAddress',
      'pincode', 'secondaryEmail', 'residenceAddress', 'primaryEmailType']
    const skillsFields = ['skillAquiredDesc', 'certificationDesc']
    const skills: any = {}
    const interestsFields = ['interests', 'hobbies']
    const interests: any = {}
    const employmentDetails: any = {}
    const employmentDetailsFields = ['service', 'cadre', 'allotmentYear',
      'otherDetailsDoj', 'payType', 'civilListNo', 'employeeCode',
      'otherDetailsOfficeAddress', 'otherDetailsOfficePinCode', 'orgName', 'orgNameOther',
    ]
    const professionalDetailsFields = ['isGovtOrg', 'industry', 'designation', 'location',
      'doj', 'orgDesc', 'orgNameOther', 'industryOther', 'orgName', 'group']
    const professionalDetails: any = []
    const organisations: any = {}
    // let academics = {}
    // let academicsFields = ['schoolName10','yearOfPassing', 'schoolName',
    //   'yearOfPassing12', 'instituteName','yOP', 'institute', 'yOP1' ]
    // let ProfessionalDetails = ['govtOrg']

    Object.keys(this.createUserForm.controls).forEach(name => {
      const currentControl = this.createUserForm.controls[name]
      if (form.value.primaryEmailType === this.ePrimaryEmailType.OFFICIAL) {
        personalDetail['officialEmail'] = form.value.primaryEmail
      } else {
        personalDetail['officialEmail'] = ''
      }
      if (currentControl.dirty) {
        personalDetailsFields.forEach(item => {
          if (item === 'phoneVerified') {
            personalDetail[item] = this.isMobileVerified
          }
          if (item === name) {

            switch (name) {

              case 'knownLanguages': return personalDetail['knownLanguages'] = form.value.knownLanguages
              case 'dob': return personalDetail['dob'] = form.value.dob
              case 'nationality': return personalDetail['nationality'] = form.value.nationality
              case 'secondaryEmail': return personalDetail['personalEmail'] = form.value.secondaryEmail
              case 'residenceAddress': return personalDetail['postalAddress'] = form.value.residenceAddress
              case 'telephone': return personalDetail['telephone'] = `${form.value.telephone}` || ''
              case 'phoneVerified': return personalDetail['phoneVerified'] = this.isMobileVerified
            }
            personalDetail[name] = currentControl.value

          }
        })
        skillsFields.forEach(item => {
          if (item === name) {
            if (name === 'skillAquiredDesc') { skills['additionalSkills'] = currentControl.value }
            if (name === 'certificationDesc') { skills['certificateDetails'] = currentControl.value }
          }
        })
        interestsFields.forEach(item => {
          if (item === name) {
            if (name === 'interests') { interests['professional'] = form.value.interests }
            if (name === 'hobbies') { interests['hobbies'] = form.value.hobbies }

          }
        })
        employmentDetailsFields.forEach(item => {
          if (item === name) {
            switch (name) {
              case 'allotmentYear': return employmentDetails['allotmentYearOfService'] = form.value.allotmentYear
              case 'civilListNo': return employmentDetails['civilListNo'] = form.value.civilListNo
              case 'employeeCode': return employmentDetails['employeeCode'] = form.value.employeeCode
              case 'otherDetailsDoj': return employmentDetails['dojOfService'] = form.value.otherDetailsDoj
              case 'otherDetailsOfficeAddress': return employmentDetails['officialPostalAddress'] = currentControl.value
              case 'otherDetailsOfficePinCode': return employmentDetails['pinCode'] = form.value.otherDetailsOfficePinCode
              case 'orgName' || 'orgNameOther': return employmentDetails['departmentName'] = currentControl.value || ''
              default: return employmentDetails[name] = currentControl.value
            }

          }
        })
        professionalDetailsFields.forEach(item => {

          if (item === name) {
            switch (name) {
              case 'orgName': return organisations['name'] = form.value.orgName
              // tslint:disable-next-line
              case 'orgNameOther': return organisations['nameOther'] = form.value.orgNameOther
              // tslint:disable-next-line
              case 'designation': return organisations['designation'] = form.value.designation === 'Other' ? form.value.designationOther : form.value.designation
              case 'group': return organisations['group'] = form.value.group
              case 'doj': return organisations['doj'] = form.value.doj
              case 'orgDesc': return organisations['description'] = form.value.orgDesc
              case 'isGovtOrg': {
                if (form.value.isGovtOrg) {
                  return organisations['organisationType'] = 'Government'
                }
                return organisations['organisationType'] = 'Non-Government'
              }
              default: return organisations[name] = currentControl.value
            }
          }

        })
      }

    })

    if (Object.keys(organisations).length > 0) { professionalDetails.push(organisations) }
    this.changedProperties = {
      profileDetails: {
        ...(Object.keys(personalDetail).length > 0) && { personalDetails: personalDetail },
        ...(Object.keys(skills).length > 0) && { skills },
        ...(Object.keys(interests).length > 0) && { interests },
        ...(Object.keys(employmentDetails).length > 0) && { employmentDetails },
        ...(Object.keys(professionalDetails).length > 0) && { professionalDetails },
        ...(this.userProfileData && this.userProfileData.profileImageUrl !== this.photoUrl ?
          { profileImageUrl: this.photoUrl } : null),
        academics: this.getAcademics(form),
      },
    }

  }

  async onSubmit(form: any) {
    this.uploadSaveData = true
    // DO some customization on the input data
    form.controls['knownLanguages'].value = this.selectedKnowLangs
    form.value.interests = this.personalInterests
    form.value.hobbies = this.selectedHobbies
    form.value.dob = changeformat(new Date(`${form.value.dob}`))
    form.value.allotmentYear = `${form.value.allotmentYear}`
    form.value.civilListNo = `${form.value.civilListNo}`
    form.value.employeeCode = `${form.value.employeeCode}`
    form.value.otherDetailsOfficePinCode = `${form.value.otherDetailsOfficePinCode}`
    if (form.value.otherDetailsDoj) {
      form.value.otherDetailsDoj = changeformat(new Date(`${form.value.otherDetailsDoj}`))
    }
    if (form.value.doj) {
      form.value.doj = changeformat(new Date(`${form.value.doj}`))
    }
    this.getEditedValues(form)
    // Construct the request structure for open saber
    // const profileRequest = this.constructReq(form)
    // let appdata = [] as any
    // appdata = profileRequest.approvalData !== undefined ? profileRequest.approvalData : []
    // const reqUpdate = {
    //   request: {
    //     userId: this.configSvc.unMappedUser.id,
    //     profileDetails: profileRequest.profileReq,
    //   },
    // }

    const reqUpdates = {
      request: {
        userId: this.configSvc.unMappedUser.id,
        profileDetails:
        {
          profileImageUrl: this.photoUrl,
        },
        ...this.changedProperties,
      },

    }
    reqUpdates.request.profileDetails.personalDetails['knownLanguages'] = this.selectedKnowLangs
    reqUpdates.request.profileDetails.personalDetails['nationality'] = form.value.nationality
    // if (!this.isVerifiedAlready && form.value.verifiedKarmayogi === true) {
    //   reqUpdates.request.profileDetails.verifiedKarmayogi = form.value.verifiedKarmayogi
    // }
    if (!this.isVerifiedAlready && !this.unApprovedReq.hasOwnProperty('verifiedKarmayogi')
      && form.value.verifiedKarmayogi === true) {
      reqUpdates.request.profileDetails.verifiedKarmayogi = form.value.verifiedKarmayogi
    } else if (!this.isVerifiedAlready && !this.isverifiedKeyInAppv && !this.isverifiedKBKeyExist) {
      reqUpdates.request.profileDetails.verifiedKarmayogi = true
    }
    this.userProfileSvc.editProfileDetails(reqUpdates).subscribe(
      res => {
        this.uploadSaveData = false
        if (res.params.status === 'success') {
          this.openSnackbar(this.toastSuccess.nativeElement.value)
          this.router.navigate(['/app/person-profile/me'])
          if ('professionalDetails' in reqUpdates.request.profileDetails) {
            if ('personalDetails' in reqUpdates.request.profileDetails ||
              'employmentDetails' in reqUpdates.request.profileDetails ||
              'academics' in reqUpdates.request.profileDetails ||
              'interests' in reqUpdates.request.profileDetails ||
              'skills' in reqUpdates.request.profileDetails) {
              if (res.result && res.result.personalDetails && res.result.personalDetails.status === 'success'
                && res.result.transitionDetails.status === 'success') {
                this.openSnackbar(this.toastSuccess.nativeElement.value)
                // this.router.navigate(['/app/person-profile', (this.userProfileData.userId || this.userProfileData.id)])
                this.router.navigate(['/app/person-profile/me'])
              }
            } else {
              if (res.result && res.result.transitionDetails && res.result.transitionDetails.status === 'success') {
                this.openSnackbar(this.toastSuccess.nativeElement.value)
                // this.router.navigate(['/app/person-profile', (this.userProfileData.userId || this.userProfileData.id)])
                this.router.navigate(['/app/person-profile/me'])
              }
            }
          } else {
            if ('personalDetails' in reqUpdates.request.profileDetails ||
              'employmentDetails' in reqUpdates.request.profileDetails ||
              'interests' in reqUpdates.request.profileDetails ||
              'academics' in reqUpdates.request.profileDetails ||
              'skills' in reqUpdates.request.profileDetails) {
              if (res.result && res.result.personalDetails && res.result.personalDetails.status === 'success') {
                this.openSnackbar(this.toastSuccess.nativeElement.value)
                // this.router.navigate(['/app/person-profile', (this.userProfileData.userId || this.userProfileData.id)])
                this.router.navigate(['/app/person-profile/me'])
              }
            } else {
              // this.uploadSaveData = false
              this.openSnackbar(this.toastError.nativeElement.value, this.userProfileData.id)
            }
          }
          this.configSvc.updateGlobalProfile(true)
        } else {
          this.openSnackbar(this.toastError.nativeElement.value)
        }
      },
      (err: any) => {
        const errMsg = _.get(err, 'error.params.errmsg')
        if (errMsg) {
          this.openSnackbar(errMsg)
        } else {
          this.openSnackbar(this.toastError.nativeElement.value)
        }
        this.uploadSaveData = false
      }
    )
    // this.userProfileSvc.updateProfileDetails(reqUpdate).subscribe(
    //   () => {
    //     if (appdata !== undefined && appdata.length > 0) {
    //       if (this.configSvc.userProfile) {
    //         this.userProfileSvc.getUserdetailsFromRegistry(this.configSvc.unMappedUser.id).subscribe(
    //           (data: any) => {
    //             const dat = data.profileDetails
    //             if (dat) {
    //               const academics = this.populateAcademics(dat.academics)
    //               this.setDegreeValuesArray(academics)
    //               this.setPostDegreeValuesArray(academics)
    //               // const organisations = this.populateOrganisationDetails(data[0])
    //               // this.constructFormFromRegistry(data[0], academics, organisations)
    //               this.populateChips(dat)
    //               this.userProfileData = dat
    //               let deptNameValue = ''
    //               if (this.userProfileData && this.userProfileData.professionalDetails
    //                 && this.userProfileData.professionalDetails.length > 0) {
    //                 deptNameValue = form.value.orgName || form.value.orgNameOther || ''
    //               }
    //               const profDetails = {
    //                 state: 'INITIATE',
    //                 action: 'INITIATE',
    //                 userId: this.userProfileData.userId,
    //                 applicationId: this.userProfileData.userId,
    //                 actorUserId: this.userProfileData.userId,
    //                 serviceName: 'profile',
    //                 comment: '',
    //                 wfId: '',
    //                 deptName: deptNameValue,
    //                 updateFieldValues: profileRequest.approvalData,
    //               }
    //               if (deptNameValue && (profDetails.updateFieldValues || []).length > 0) {
    //                 this.userProfileSvc.approveRequest(profDetails).subscribe(() => {
    //                   form.reset()
    //                   this.uploadSaveData = false
    //                   this.configSvc.profileDetailsStatus = true
    //                   this.openSnackbar(this.toastSuccess.nativeElement.value)
    //                   if (!this.isForcedUpdate && this.userProfileData) {
    //                     this.router.navigate(['/app/person-profile', (this.userProfileData.userId || this.userProfileData.id)])
    //                   } else {
    //                     setTimeout(() => {
    //                       // do nothing
    //                       // tslint:disable-next-line
    //                     }, 1000)
    //                     this.router.navigate(['page', 'home'])
    //                   }
    //                 }
    //                   ,
    //                   // tslint:disable-next-line:align
    //                   () => {
    //                     this.openSnackbar(this.toastError.nativeElement.value)
    //                     this.uploadSaveData = false
    //                   })
    //               } else {
    //                 this.uploadSaveData = false
    //                 this.configSvc.profileDetailsStatus = true
    //                 this.openSnackbar(this.toastSuccess.nativeElement.value)
    //                 if (!this.isForcedUpdate && this.userProfileData) {
    //                   // const organisations = this.populateOrganisationDetails(data[0])
    //                   // this.constructFormFromRegistry(data[0], academics, organisations)
    //                   this.router.navigate(['/app/person-profile', (this.userProfileData.userId || this.userProfileData.id)])
    //                 } else {
    //                   setTimeout(() => {
    //                     // do nothing
    //                     // tslint:disable-next-line
    //                   }, 1000)
    //                   this.router.navigate(['page', 'home'])
    //                 }
    //               }
    //             } else {
    //               form.reset()
    //               this.uploadSaveData = false
    //               this.configSvc.profileDetailsStatus = true
    //               this.openSnackbar(this.toastSuccess.nativeElement.value)
    //               if (!this.isForcedUpdate && this.userProfileData) {
    //                 this.router.navigate(['/app/person-profile', (this.userProfileData.userId || this.userProfileData.id)])
    //               } else {
    //                 setTimeout(() => {
    //                   // do nothing
    //                   // tslint:disable-next-line
    //                 }, 1000)
    //                 this.router.navigate(['page', 'home'])
    //               }
    //             }
    //             // this.handleFormData(data[0])
    //           },
    //           (_err: any) => {
    //             if (_err) {
    //               window.location.reload()
    //             }
    //           })
    //       }
    //     } else {
    //       form.reset()
    //       this.uploadSaveData = false
    //       this.configSvc.profileDetailsStatus = true
    //       this.openSnackbar(this.toastSuccess.nativeElement.value)
    //       if (!this.isForcedUpdate && this.userProfileData) {
    //         this.router.navigate(['/app/person-profile', (this.userProfileData.userId || this.userProfileData.id)])
    //       } else {
    //         setTimeout(() => {
    //           // do nothing
    //           // tslint:disable-next-line
    //         }, 1000)
    //         this.router.navigate(['page', 'home'])
    //       }
    //     }
    //   }
    //   ,
    //   () => {
    //     this.openSnackbar(this.toastError.nativeElement.value)
    //     this.uploadSaveData = false
    //   })
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  formNext() {
    if (this.selectedIndex === 3) {
      this.selectedIndex = 0
    } else {
      this.selectedIndex = this.selectedIndex + 1
    }
  }
  public navigateBack() {
    this.router.navigate(['page', 'home'])
  }

  public officialEmailCheck() {
    this.isOfficialEmail = !this.isOfficialEmail
    this.assignPrimaryEmailType(this.isOfficialEmail)
  }

  private assignPrimaryEmailType(isOfficialEmail: boolean) {
    if (isOfficialEmail) {
      this.createUserForm.patchValue({
        primaryEmailType: this.ePrimaryEmailType.OFFICIAL,
      })
    } else {
      this.createUserForm.patchValue({
        primaryEmailType: this.ePrimaryEmailType.PERSONAL,
      })
    }
  }

  private assignPrimaryEmailTypeCheckBox(primaryEmailType: any) {
    if (primaryEmailType === this.ePrimaryEmailType.OFFICIAL) {
      this.isOfficialEmail = true
    } else {
      this.isOfficialEmail = false
    }
    // this.assignPrimaryEmailType(this.isOfficialEmail)
  }

  private getDateFromText(dateString: string): any {
    if (dateString) {
      const splitValues: string[] = dateString.split('-')
      const [dd, mm, yyyy] = splitValues
      const dateToBeConverted = `${yyyy}-${mm}-${dd}`
      return new Date(dateToBeConverted)
    }
    return ''
  }

  otherDropDownChange(value: any, field: string) {
    if (field === 'orgname' && value !== 'Other') {
      this.showOrgnameOther = false
      this.createUserForm.controls['orgNameOther'].setValue('')
    }
    if (field === 'industry' && value !== 'Other') {
      this.showIndustryOther = false
      this.createUserForm.controls['industryOther'].setValue('')
    }
    if (field === 'designation' && value !== 'Other') {
      this.showDesignationOther = false
      this.createUserForm.controls['designationOther'].setValue('')
    }
    if (field === 'graduation' && value !== 'Other') {
      this.showGraduationDegreeOther = false
      this.createDegree()
    }
    if (field === 'postDegree' && value !== 'Other') {
      this.showPostDegreeOther = false
      this.createDegree()
    }
  }

  uploadProfileImg(file: File) {
    const formdata = new FormData()
    const fileName = file.name.replace(/[^A-Za-z0-9.]/g, '')
    if (
      !(
        PROFILE_IMAGE_SUPPORT_TYPES.indexOf(
          `.${fileName
            .toLowerCase()
            .split('.')
            .pop()}`,
        ) > -1
      )
    ) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.INVALID_IMG_FORMAT,
        },
        duration: NOTIFICATION_TIME * 1500,
      })
      return
    }

    if (file.size > IMAGE_MAX_SIZE) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.PROFILE_IMG_SIZE_ERROR,
        },
        duration: NOTIFICATION_TIME * 1500,
      })
      return
    }

    const dialogRef = this.dialog.open(ImageCropComponent, {
      width: '70%',
      data: {
        isRoundCrop: true,
        imageFile: file,
        width: 265,
        height: 150,
        isThumbnail: true,
        imageFileName: fileName,
      },
    })

    dialogRef.afterClosed().subscribe({
      next: (result: File) => {
        if (result) {
          formdata.append('data', result, fileName)
          this.createUrl(result, fileName)
          this.loader.changeLoad.next(true)
          // const reader = new FileReader()
          // reader.readAsDataURL(result)
          // reader.onload = _event => {
          //   this.photoUrl = reader.result
          //   if (this.createUserForm.get('photo') !== undefined) {
          //     // tslint:disable-next-line: no-non-null-assertion
          //     this.createUserForm.get('photo')!.setValue(this.photoUrl)
          //   }
          // }
        }
      },
    })
  }

  createUrl(file: File, fileName: string) {
    const formdata = new FormData()
    formdata.append('data', file, fileName)
    this.userProfileSvc.uploadProfilePhoto(formdata).subscribe((res: any) => {
      if (res && res.result) {
        this.photoUrl = this.pipeImgUrl.transform(res.result.url)
        this.onSubmit(this.createUserForm)
      }
    })
  }

  sendOtp() {
    const mob = this.createUserForm.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.otpService.sendOtp(mob.value).subscribe(() => {
        this.otpSend = true
        alert('An OTP has been sent to your mobile number')
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
    const mob = this.createUserForm.get('mobile')
    if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
      this.otpService.resendOtp(mob.value).subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.otpSend = true
          this.disableVerifyBtn = false
          alert('An OTP has been sent to your mobile number')
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
    const mob = this.createUserForm.get('mobile')
    if (otp && otp.value) {
      if (mob && mob.value && Math.floor(mob.value) && mob.valid) {
        this.otpService.verifyOTP(otp.value, mob.value).subscribe((res: any) => {
          if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
            this.otpVerified = true
            const reqUpdates = {
              request: {
                userId: this.configSvc.unMappedUser.id,
                profileDetails: {
                  personalDetails: {
                    mobile: mob.value,
                    phoneVerified: true,
                  },
                },
              },
            }
            this.userProfileSvc.editProfileDetails(reqUpdates).subscribe((updateRes: any) => {

              if (updateRes) {
                this.isMobileVerified = true
              }
              // tslint:disable-next-line:align
            }, (error: any) => {

              this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
            }
            )
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
  public tabClicked(tabEvent: MatTabChangeEvent) {
    this.ehrmsInfo = tabEvent.tab.textLabel
    if (tabEvent.tab.textLabel === 'e-HRMS details' || tabEvent.index === 2) {
      this.isSaveButtoDisable = true
    } else {
      this.isSaveButtoDisable = false
    }
    const data: WsEvents.ITelemetryTabData = {
      label: `${tabEvent.tab.textLabel}`,
      index: tabEvent.index,
    }
    this.eventSvc.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.PROFILE_EDIT_TAB,
        id: `${_.camelCase(data.label)}-tab`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.PROFILE,
      }
    )

  }
  translateTo(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'userProfile.' + menuName.replace(/\s/g, '')
    return this.translate.instant(translationKey)
  }
  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
  dialogReqHelp(type: string) {
    const mob = this.createUserForm.controls['mobile'].value
    const primaryEmail = this.createUserForm.controls['primaryEmail'].value
    const fullname = this.createUserForm.controls['firstname'].value
    const dialogRef = this.dialog.open(RequestDialogComponent, {
      hasBackdrop: false,
      width: '420px',
      height: '380px',
      data: { reqType: type, mobile: mob, email: primaryEmail, name: fullname },
    })
    dialogRef.afterClosed().subscribe(() => {
    })
  }

  cancleEmailUpdate () {
    this.showUpdateEmail = false
    this.isOtpSent = false
    this.updatePrimaryEmail.enable()
    this.updatePrimaryEmail.setValue(null)
    this.updatePrimaryEmail.markAsUntouched()
    this.updatePrimaryEmail.markAsPristine()
    this.emailOtp.setValue(null)
    this.emailOtp.markAsUntouched()
    this.emailOtp.markAsPristine()
  }

  onClickshowUpdateEmail () {
    this.showUpdateEmail = true
  }

  sendOtpToEmail () {
    const emailId = this.updatePrimaryEmail.value
    const primaryEmail = this.createUserForm.controls['primaryEmail'].value
    if (emailId === primaryEmail) {
      this.snackBar.open('Existing email id and updating email id are same')
    } else {
      if (emailId) {
        this.otpService.sendEmailOtp(emailId).subscribe(() => {
          this.isOtpSent = true
          this.disableVerifyEmailBtn = false
          // this.updatePrimaryEmail.disable()
          alert('An OTP has been sent to your email')
          this.startEmailOtpCountDown()
          // tslint:disable-next-line: align
        }, (error: any) => {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
        })
      } else {
        this.snackBar.open('Please enter a valid email')
      }
    }
  }

  startEmailOtpCountDown () {
    const startTime = Date.now()
    this.emailTimeLeftforOTP = this.OTP_TIMER
    // && this.primaryCategory !== this.ePrimaryCategory.PRACTICE_RESOURCE
    if (this.OTP_TIMER > 0
    ) {
      this.emailTimerSubscription = interval(1000)
        .pipe(
          map(
            () =>
              startTime + this.OTP_TIMER - Date.now(),
          ),
        )
        .subscribe(_timeRemaining => {
          this.emailTimeLeftforOTP -= 1
          if (this.emailTimeLeftforOTP < 0) {
            this.emailTimeLeftforOTP = 0
            if (this.emailTimerSubscription) {
              this.emailTimerSubscription.unsubscribe()
            }
            // this.submitQuiz()
          }
        })
    }
  }

  resendOtpToEmail() {
    const emailId = this.updatePrimaryEmail.value
    if (emailId) {
      this.otpService.reSendEmailOtp(emailId).subscribe(() => {
        this.isOtpSent = true
        this.disableVerifyEmailBtn = false
        // this.updatePrimaryEmail.disable()
        alert('An OTP has been sent to your email')
        this.startEmailOtpCountDown()
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
      })
    } else {
      this.snackBar.open('Please enter a valid email')
    }
  }

  submitEmailOtp(emailOtp: UntypedFormControl) {
    const email = this.updatePrimaryEmail.value
    if (emailOtp.value) {
      this.otpService.verifyEmailOTP(emailOtp.value, email).subscribe((res: any) => {
        if ((_.get(res, 'result.response')).toUpperCase() === 'SUCCESS') {
          this.emailOtpVerified = true
          if (res && res.result && res.result.contextToken) {
            const reqUpdates = {
              request: {
                'userId': this.configSvc.unMappedUser.id,
                'contextToken': res.result.contextToken,
                'profileDetails': {
                  'personalDetails': {
                      'primaryEmail': email,
                  },
                },
              },
            }
            this.userProfileSvc.updatePrimaryEmailDetails(reqUpdates).subscribe((_updateRes: any) => {
              this.snackBar.open(this.translateTo('updateEamilConfirmation'))
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['app/user-profile/details'])
              })
              // tslint:disable-next-line:align
            }, (error: any) => {

              this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
            })
          }

        }
        // tslint:disable-next-line: align
      }, (error: any) => {
        this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Please try again later')
        if (error.error && error.error.result) {
          this.disableVerifyEmailBtn = error.error.result.remainingAttempt === 0 ? true : false
        }
      })
    }
  }
}
