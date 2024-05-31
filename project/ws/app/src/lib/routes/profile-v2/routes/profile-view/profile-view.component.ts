import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'

/* tslint:disable */
import _ from 'lodash'
import moment from 'moment'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators'

import { ImageCropComponent, ConfigurationsService } from '@sunbird-cb/utils'
import { LoaderService } from '@ws/author/src/public-api'
import { PipeCertificateImageURL } from '@sunbird-cb/utils/src/public-api'
import { IMAGE_MAX_SIZE, PROFILE_IMAGE_SUPPORT_TYPES } from '@ws/author/src/lib/constants/upload'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { UserProfileService } from '../../../user-profile/services/user-profile.service'
import { OtpService } from '../../../user-profile/services/otp.services'

import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { NsUserProfileDetails } from '../../../user-profile/models/NsUserProfile'
import { VerifyOtpComponent } from '../../components/verify-otp/verify-otp.component'
import { TransferRequestComponent } from '../../components/transfer-request/transfer-request.component'
import { WithdrawRequestComponent } from '../../components/withdraw-request/withdraw-request.component'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { DesignationRequestComponent } from '../../components/designation-request/designation-request.component'
import { HomePageService } from 'src/app/services/home-page.service'
import { RejectionReasonPopupComponent } from '../../components/rejection-reason-popup/rejection-reason-popup.component'

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
}
const EMAIL_PATTERN = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const MOBILE_PATTERN = /^[0]?[6789]\d{9}$/
const PIN_CODE_PATTERN = /^[1-9][0-9]{5}$/
const EMP_ID_PATTERN = /^[a-z0-9]+$/i

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  /* tslint:disable */
  host: { class: 'flex margin-bottom-l' },
  /* tslint:enable */
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class ProfileViewComponent implements OnInit, AfterViewInit, OnDestroy {

  currentUsername: any
  pageData: any
  orgId: any
  selectedTabIndex: any
  insightsData: any
  insightsDataLoading = false
  discussion = {
    loadSkeleton: false,
    data: undefined,
    error: false,
  }
  recentRequests = {
    data: undefined,
    error: false,
    loadSkeleton: false,
  }
  updatesPosts = {
    data: undefined,
    error: false,
    loadSkeleton: false,
  }
  showCreds = false
  credMessage = 'View my credentials'
  assessmentsData: any
  isCurrentUser!: boolean

  private destroySubject$ = new Subject()
  portalProfile!: NSProfileDataV2.IProfile
  currentUser: any
  nameInitials = ''
  verifyEmail = false
  verifyMobile = false
  countryCodes: any[] = []
  countryCodesBackUp: any[] = []
  nationalityData: any[] = []
  editDetails = false
  editProfile = false
  editName = false
  eUserGender = Object.keys(NsUserProfileDetails.EUserGender)
  eCategory = Object.keys(NsUserProfileDetails.ECategory)
  masterLanguages: any[] | undefined
  masterLanguageBackup: any[] | undefined
  dateOfBirth: any | undefined
  groupData: any | undefined
  // profileMetaData: any | undefined
  imageTypes = PROFILE_IMAGE_SUPPORT_TYPES
  photoUrl!: string | ArrayBuffer | null
  profileName = ''
  enableWTR = false
  enableWR = false
  // feedbackInfo = ''
  skeletonLoader = false
  otherDetailsForm = new FormGroup({
    employeeCode: new FormControl('', [Validators.pattern(EMP_ID_PATTERN)]),
    primaryEmail: new FormControl('', [Validators.pattern(EMAIL_PATTERN)]),
    mobile: new FormControl('', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(MOBILE_PATTERN)]),
    gender: new FormControl('', []),
    dob: new FormControl('', []),
    domicileMedium: new FormControl('', []),
    countryCode: new FormControl('', []),
    pincode: new FormControl('', [Validators.minLength(6), Validators.maxLength(6), Validators.pattern(PIN_CODE_PATTERN)]),
    category: new FormControl('', []),
  })
  unVerifiedObj = {
    designation: '',
    group: '',
    organization: '',
    groupRequestTime: 0,
    designationRequestTime: 0,
  }
  rejectedFields: any = {
    name: '',
    group: '',
    designation: '',
    groupRejectionComments: '',
    designationRejectionComments: '',
    groupRejectionTime: 0,
    designationRejectionTime: 0,
  }
  primaryDetailsForm = new FormGroup({
    group: new FormControl('', [Validators.required]),
    designation: new FormControl('', [Validators.required]),
  })
  approvalPendingFields = []
  rejectedByMDOData = []
  contextToken: any
  params: any

  panelOpenState = false

  groupApprovedTime = 0
  designationApprovedTime = 0
  currentDate = new Date()
  designationsMeta: any

  constructor(
    public dialog: MatDialog,
    private configService: ConfigurationsService,
    public router: Router,
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private userProfileService: UserProfileService,
    private translateService: TranslateService,
    private otpService: OtpService,
    private loader: LoaderService,
    private pipeImgUrl: PipeCertificateImageURL,
    private homeService: HomePageService
  ) {

    if (localStorage.getItem('websiteLanguage')) {
      this.translateService.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translateService.use(lang)
    }

    if (this.otherDetailsForm.get('domicileMedium')) {
      this.otherDetailsForm.get('domicileMedium')!.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        startWith(''),
      )
      .subscribe(res => {
        if (this.masterLanguageBackup) {
          this.masterLanguages = this.masterLanguageBackup.filter(item => item.name.toLowerCase().includes(res && res.toLowerCase()))
        }
      })
    }

    if (this.otherDetailsForm.get('countryCode')) {
      this.otherDetailsForm.get('countryCode')!.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        startWith('')
      )
      .subscribe(res => {
        if (this.countryCodesBackUp) {
          this.countryCodes = this.countryCodesBackUp.filter(item => item.includes(res))
        }
      })
    }

    // To check the email entered by the user is same or not, validating the email to show the Get OTP.
    if (this.otherDetailsForm.get('primaryEmail')) {
      this.otherDetailsForm.get('primaryEmail')!.valueChanges
      .subscribe(res => {
        if (res && res !== this.portalProfile.personalDetails.primaryEmail) {
          if (EMAIL_PATTERN.test(res)) {
            this.verifyEmail = true
            this.otherDetailsForm.setErrors({ invalid: false })
          } else {
            this.verifyEmail = false
            this.otherDetailsForm.setErrors({ invalid: false })
          }
        } else {
          this.verifyEmail = false
          this.otherDetailsForm.setErrors({ invalid: false })
        }
      })
    }

    if (this.otherDetailsForm.get('mobile')) {
      this.otherDetailsForm.get('mobile')!.valueChanges
      .subscribe(res => {
        if (res && res !== this.portalProfile.personalDetails.mobile) {
          if (MOBILE_PATTERN.test(res)) {
            this.verifyMobile = true
          } else {
            this.verifyMobile = false
          }
        } else {
          this.verifyMobile = false
        }
      })
    }

    this.pageData = this.route.parent && this.route.parent.snapshot.data.pageData.data
    this.currentUser = this.configService && this.configService.userProfile

    this.route.queryParams.subscribe((params: Params) => {
      this.params = params
    })

    this.route.data.subscribe(data => {
      if (data.profile.data) {
        this.orgId = data.profile.data.rootOrgId
      }

      if (data.profile.data.profileDetails) {
        this.portalProfile = data.profile.data.profileDetails
      }

      const user = this.portalProfile.userId || this.portalProfile.id || _.get(data, 'profile.data.id') || ''
      if (this.portalProfile && !(this.portalProfile.id && this.portalProfile.userId)) {
        this.portalProfile.id = user
        this.portalProfile.userId = user
      }

      if (user === this.currentUser.userId) {
        this.isCurrentUser = true
        this.currentUsername = this.configService.userProfile && this.configService.userProfile.userName
      } else {
        this.isCurrentUser = false
        this.currentUsername = this.portalProfile.personalDetails && this.portalProfile.personalDetails !== null
          ? this.portalProfile.personalDetails.userName
          : this.portalProfile.userName
      }
    })

  }

  ngOnInit() {
    if (this.currentUser.lastName) {
      this.nameInitials = this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0)

    }

    this.getInitials()
    this.profileName = this.portalProfile.personalDetails && this.portalProfile.personalDetails.firstname

    this.prefillForm()
    this.getMasterNationality()
    this.getMasterLanguage()
    this.getGroupData()
    // this.getProfilePageMetaData()
    this.loadDesignations()
    this.getSendApprovalStatus()
    this.getRejectedStatus()
    this.getApprovedFields()
    this.getInsightsData()
    this.getAssessmentData()
  }

  fetchDiscussionsData(): void {
    this.discussion.loadSkeleton = true
    this.homeService.getDiscussionsData(this.currentUser.userName)
    .pipe(takeUntil(this.destroySubject$))
    .subscribe(
      (res: any) => {
        this.discussion.loadSkeleton = false
        this.updatesPosts.loadSkeleton = false
        this.discussion.data = res && res.latestPosts
        this.updatesPosts.data = res && res.latestPosts && res.latestPosts.sort((x: any, y: any) => {
          return y.timestamp - x.timestamp
        })
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.discussion.loadSkeleton = false
          this.updatesPosts.loadSkeleton = false
          this.discussion.error = true
          this.updatesPosts.error = true
          this.matSnackBar.open(this.handleTranslateTo('discussionsDataFail'))
        }
      }
    )
  }

  ngAfterViewInit(): void {
    if (this.params && this.params.tab) {
      this.selectedTabIndex = this.params.tab
      const matTabGroupElem = document.getElementById('matTabGroup')
      if (matTabGroupElem) {
        window.scrollTo({
          top: (matTabGroupElem.offsetTop - 120),
          behavior: 'smooth',
        })
      }
    }
  }

  getInsightsData() {
    this.insightsDataLoading = true
    const request = {
      request: {
        filters: {
          primaryCategory: 'programs',
          organisations: [
            'across',
            this.orgId,
          ],
        },
      },
    }
    this.homeService.getInsightsData(request)
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((res: any) => {
      if (res.result.response) {
        this.insightsData = res.result.response

        this.constructNudgeData()
        if (this.insightsData && this.insightsData['weekly-claps']) {
          this.insightsData['weeklyClaps'] = this.insightsData['weekly-claps']
        }
      } else {
        this.insightsDataLoading = false
      }
    },         (_error: HttpErrorResponse) => {
      this.insightsDataLoading = false
      this.matSnackBar.open(this.handleTranslateTo('insightsDataFail'))
    })
  }

  constructNudgeData() {
    const nudgeData: any = {
      type: 'data',
      iconsDisplay: false,
      cardClass: 'slider-container',
      height: 'auto',
      width: '',
      sliderData: [],
      negativeDisplay: false,
      'dot-default': 'dot-grey',
      'dot-active': 'dot-active',
    }
    const sliderData: { title: any; icon: string; data: string; colorData: string; }[] = []
    this.insightsData.nudges.forEach((ele: any) => {
      if (ele) {
        const data = {
          title: ele.label,
          icon: ele.growth === 'positive' ?  'arrow_upward' : 'arrow_downward',
          data: ele.growth === 'positive' && ele.progress > 1 ? `+${Math.round(ele.progress)}%` : '',
          colorData: ele.growth === 'positive' ? 'color-green' : 'color-red',
        }
        sliderData.push(data)
      }
    })
    nudgeData.sliderData = sliderData
    this.insightsData['sliderData'] = nudgeData
    this.insightsDataLoading = false
  }

  toggleCreds() {
    this.showCreds = !this.showCreds
    if (this.showCreds) {
      this.credMessage = this.handleTranslateTo('hideCredentials')
    } else {
      this.credMessage = this.handleTranslateTo('viewCredentials')
    }
  }

  copyToClipboard(text: string) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    this.openSnackbar('copied')
  }

  getAssessmentData() {
    this.homeService.getAssessmentinfo()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe(
      (res: any) => {
        if (res && res.result && res.result.response) {
          this.assessmentsData = res.result.response
        }
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('assessmentDataFail'))
        }
      }
    )
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.matSnackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  handleEditOtherDetails(): void {
    if (this.portalProfile.personalDetails.primaryEmail) {
      if (this.otherDetailsForm.get('primaryEmail')) {
        this.otherDetailsForm.get('primaryEmail')!.setValidators([Validators.required,
          Validators.pattern(EMAIL_PATTERN)])
        this.otherDetailsForm.get('primaryEmail')!.updateValueAndValidity()

      }

    }
    if (this.portalProfile.personalDetails.mobile) {
      if (this.otherDetailsForm.get('mobile')) {
        this.otherDetailsForm.get('mobile')!.setValidators([Validators.required, Validators.pattern(MOBILE_PATTERN)])
        this.otherDetailsForm.get('mobile')!.updateValueAndValidity()
      }
    }
  }

  getInitials(): void {
    if (this.currentUser.firstName) {
      if (this.currentUser.firstName.split(' ').length > 1) {
        const nameArr = this.currentUser.firstName.split(' ')
        this.nameInitials = nameArr[0].charAt(0) + nameArr[1].charAt(0)
      } else {
        this.nameInitials = this.currentUser.firstName.charAt(0)
      }
    }
  }

  getMasterNationality(): void {
    this.userProfileService.getMasterNationality()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((res: any) => {
      if (res.nationality) {
        res.nationality.forEach((item: any) => {
          this.countryCodes.push(item.countryCode)
          this.countryCodesBackUp.push(item.countryCode)
          this.nationalityData.push(item.name)
        })
      }
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('unableFetchMasterNation'))
      }
    })
  }

  getMasterLanguage(): void {
    this.userProfileService.getMasterLanguages()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((res: any) => {
      this.masterLanguages = res.languages
      this.masterLanguageBackup = res.languages
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('unableFetchMasterLanguageData'))
      }
    })

  }

  handleTranslateTo(menuName: string): string {
    return this.userProfileService.handleTranslateTo(menuName)
  }

  prefillForm(data ?: any): void {
    if (data) {
      this.portalProfile.personalDetails.gender = data.dataToSubmit.gender
      this.portalProfile.personalDetails.dob = data.dataToSubmit.dob
      this.portalProfile.personalDetails.domicileMedium = data.dataToSubmit.domicileMedium
      this.portalProfile.personalDetails.category = data.dataToSubmit.category
      this.portalProfile.personalDetails.pincode = data.dataToSubmit.pincode
      this.portalProfile.personalDetails.mobile = data.dataToSubmit.mobile
      if (this.portalProfile.employmentDetails) {
        this.portalProfile.employmentDetails.employeeCode = data.employeeCode
      }
    }

    if (this.portalProfile.personalDetails.dob) {
      const dateArray = this.portalProfile.personalDetails.dob.split('-')
      this.dateOfBirth = new Date(`${dateArray[1]}/${dateArray[0]}/${dateArray[2]}`)
    }

    this.otherDetailsForm.patchValue({
      employeeCode: this.portalProfile.employmentDetails && this.portalProfile.employmentDetails.employeeCode || '',
      primaryEmail: this.portalProfile.personalDetails.primaryEmail,
      gender: this.portalProfile.personalDetails.gender && this.portalProfile.personalDetails.gender.toUpperCase(),
      dob: this.dateOfBirth,
      domicileMedium: this.portalProfile.personalDetails.domicileMedium,
      mobile: this.portalProfile.personalDetails.mobile,
      countryCode: this.portalProfile.personalDetails.countryCode || '+91',
      pincode: this.portalProfile.personalDetails.pincode,
      category: this.portalProfile.personalDetails.category && this.portalProfile.personalDetails.category.toUpperCase(),
    })

    if ((this.portalProfile.professionalDetails && this.portalProfile.professionalDetails.length)) {
      this.primaryDetailsForm.patchValue({
        group: this.portalProfile.professionalDetails[0].group,
        designation: this.portalProfile.professionalDetails[0].designation,
      })
    } else {
      this.primaryDetailsForm.patchValue({
        group: '',
        designation: '',
      })
    }
  }

  handleCancelUpdate(): void {
    this.editDetails = !this.editDetails
    this.prefillForm()
  }

  handleDateFormat(dateString: string): any {
    const dateArr = dateString.split('-')
    const newDateStr = `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`
    return moment(new Date(newDateStr)).format('D MMM YYYY')
  }

  handleVerifyOTP(verifyType: string, _value?: string): void {
    const dialogRef = this.dialog.open(VerifyOtpComponent, {
      data: { type: verifyType, value: _value },
      disableClose: true,
      panelClass: 'common-modal',
    })

    dialogRef.componentInstance.resendOTP.subscribe((data: any) => {
      this.handleResendOTP(data)
    })

    dialogRef.componentInstance.otpVerified.subscribe((data: any) => {
      this.contextToken = data.token
      if (data.type === 'email') {
        this.verifyEmail = false
      } else {
        this.verifyMobile = false
      }
    })
  }

  handleResendOTP(data: any): void {
    let otpValue$: any
    if (data.type === 'email') {
      otpValue$ = this.otpService.sendEmailOtp(data.value)
    } else {
      otpValue$ = this.otpService.resendOtp(data.value)
    }

    otpValue$.pipe(takeUntil(this.destroySubject$))
    .subscribe((_res: any) => {
      if (data.type === 'email') {
        this.matSnackBar.open(this.handleTranslateTo('otpSentEmail'))
      } else {
        this.matSnackBar.open(this.handleTranslateTo('otpSentMobile'))
      }
    },         (error: any) => {
      if (!error.ok) {
        this.matSnackBar.open(_.get(error, 'error.params.errmsg') ||  'Unable to resend OTP, please try again later!')
      }
    })
  }

  handleGenerateEmailOTP(verifyType?: any): void {
    this.otpService.sendEmailOtp(this.otherDetailsForm.value['primaryEmail'])
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_res: any) => {
      this.matSnackBar.open(this.handleTranslateTo('otpSentEmail'))
      if (verifyType) {
        this.handleVerifyOTP(verifyType, this.otherDetailsForm.value['primaryEmail'])
      }
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('emailOTPSentFail'))
      }
    })
  }

  handleGenerateOTP(verifyType?: string): void {
    this.otpService.sendOtp(this.otherDetailsForm.value['mobile'])
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_res: any) => {
      this.matSnackBar.open(this.handleTranslateTo('otpSentMobile'))
      if (verifyType) {
        this.handleVerifyOTP(verifyType, this.otherDetailsForm.value['mobile'])
      }
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('mobileOTPSentFail'))
      }
    })
  }

  updateEmail(email: string): void {
    const postData = {
      request: {
        'userId': this.configService.unMappedUser.id,
        'contextToken': this.contextToken,
        'profileDetails': {
          'personalDetails': {
            'primaryEmail': email,
          },
        },
      },
    }

    this.userProfileService.updatePrimaryEmailDetails(postData)
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_res: any) => {
      this.portalProfile.personalDetails.primaryEmail = email
      this.matSnackBar.open(this.handleTranslateTo('emailUpdated'))
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('updateEmailFailed'))
      }
    })
  }

  handleSaveOtherDetails(): void {
    if (this.portalProfile.personalDetails.primaryEmail !== this.otherDetailsForm.value['primaryEmail']) {
      this.updateEmail(this.otherDetailsForm.value['primaryEmail'])
    }

    const dataToSubmit = { ...this.otherDetailsForm.value }
    if (dataToSubmit.dob) {
      dataToSubmit.dob =
      `${new Date(dataToSubmit.dob).getDate()}-${new Date(dataToSubmit.dob).getMonth() + 1}-${new Date(dataToSubmit.dob).getFullYear()}`
    }
    delete dataToSubmit.countryCode
    delete dataToSubmit.employeeCode
    delete dataToSubmit.primaryEmail

    const payload = {
      'request': {
        'userId': this.configService.unMappedUser.id,
        'profileDetails': {
          'personalDetails': {},
          'employmentDetails': {
            'employeeCode': this.otherDetailsForm.value['employeeCode'],
            'pincode': this.otherDetailsForm.value['pincode'],
            'mobile': this.otherDetailsForm.value['mobile'],
          },
        },
      },
    }
    payload.request.profileDetails.personalDetails = dataToSubmit

    this.userProfileService.editProfileDetails(payload)
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_res: any) => {
      this.matSnackBar.open(this.handleTranslateTo('userDetailsUpdated'))
      this.editDetails = !this.editDetails
      this.prefillForm({ dataToSubmit, ...{ 'employeeCode': this.otherDetailsForm.value['employeeCode'] } })
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('userDetailsUpdateFailed'))
        this.editDetails = !this.editDetails
        this.prefillForm()
      }
    })
  }

  handleTransferRequest(): void {
    const dialogRef = this.dialog.open(TransferRequestComponent, {
      data: { portalProfile : this.portalProfile, groupData: this.groupData, designationsMeta: this.designationsMeta },
      disableClose: true,
      panelClass: 'common-modal',
    })

    dialogRef.componentInstance.enableWithdraw.subscribe((value: boolean) => {
      if (value) {
        this.enableWTR = true
        this.getSendApprovalStatus()
        this.portalProfile.verifiedKarmayogi = false
      }
    })
  }

  handleWithdrawTransferRequest(): void {
    const dialogRef = this.dialog.open(WithdrawRequestComponent, {
      data: {
        approvalPendingFields: this.approvalPendingFields,
        withDrawType: 'department',
      },
      disableClose: true,
      panelClass: 'common-modal',
    })

    dialogRef.componentInstance.enableMakeTransfer.subscribe((value: boolean) => {
      if (value) {
        this.enableWTR = false
        this.unVerifiedObj.group = ''
        this.unVerifiedObj.designation = ''
      }
    })
  }

  handleEmpty(type: string): void {
    if (type === 'mobile') {
      if (this.portalProfile.personalDetails.mobile && !this.otherDetailsForm.value['mobile']) {
        this.otherDetailsForm.setErrors({ valid: false })
      }
    }

    if (type === 'primaryEmail') {
      if (!this.portalProfile.personalDetails.primaryEmail && !this.otherDetailsForm.value['primaryEmail']) {
        this.otherDetailsForm.setErrors({ valid: false })
      }
    }
  }

  getGroupData(): void {
    this.userProfileService.getGroups()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((res: any) => {
      this.groupData = res.result && res.result.response
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('groupDataFaile'))
      }
    })
  }

  loadDesignations() {
    this.userProfileService.getDesignations({}).subscribe(
      (data: any) => {
        this.designationsMeta = data.responseData
      },
      (_err: any) => {
      })
  }

  // getProfilePageMetaData(): void {
  //   this.userProfileService.getProfilePageMeta()
  //   .pipe(takeUntil(this.destroySubject$))
  //   .subscribe(res => {
  //     this.profileMetaData = res
  //   },         (error: HttpErrorResponse) => {
  //     if (!error.ok) {
  //       this.matSnackBar.open(this.handleTranslateTo('profilePageFetchFailed'))
  //     }
  //   })
  // }

  getApprovedFields(): void {
    this.userProfileService.fetchApprovedFields()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_res: any) => {
      _res.result.data.filter((obj: any) => {
        this.groupApprovedTime = (obj.hasOwnProperty('group') && obj.lastUpdatedOn > this.groupApprovedTime) ?
          obj.lastUpdatedOn : this.groupApprovedTime

        this.designationApprovedTime = (obj.hasOwnProperty('designation') && obj.lastUpdatedOn > this.designationApprovedTime) ?
          obj.lastUpdatedOn : this.designationApprovedTime
      })
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('approvedStatusFailed'))
      }
      this.skeletonLoader = false
    })
  }

  getSendApprovalStatus(): void {
  this.skeletonLoader = true
    this.userProfileService.fetchApprovalPendingFields()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_res: any) => {
      this.unVerifiedObj.groupRequestTime = 0
      this.unVerifiedObj.designationRequestTime = 0
      this.approvalPendingFields = _res.result.data

      if (!this.approvalPendingFields || !this.approvalPendingFields.length) {
        this.enableWTR = false
        this.skeletonLoader = false
        return
      }
      const exists = this.approvalPendingFields.filter((obj: any) => {
        if (obj.hasOwnProperty('name')) {
          this.unVerifiedObj.organization = obj.name
        }
        if (obj.hasOwnProperty('group') && obj.lastUpdatedOn > this.unVerifiedObj.groupRequestTime) {
          this.unVerifiedObj.group = obj.group
          this.unVerifiedObj.groupRequestTime = obj.lastUpdatedOn
        }
        if (obj.hasOwnProperty('designation') && obj.lastUpdatedOn > this.unVerifiedObj.designationRequestTime) {
          this.unVerifiedObj.designation = obj.designation
          this.unVerifiedObj.designationRequestTime = obj.lastUpdatedOn
        }
        return obj.hasOwnProperty('name')
      }).length > 0

      if (exists) {
        this.enableWTR = true
      } else {
        this.enableWR = true
      }
      this.skeletonLoader = false
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('approvalStatusFailed'))
      }
      this.skeletonLoader = false
    })
  }

  getRejectedStatus(): void {
    this.skeletonLoader = true
    this.userProfileService.listRejectedFields()
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((res: any) => {
      if (res.result && res.result.data && Array.isArray(res.result.data)) {
        this.rejectedByMDOData = res.result.data
        res.result.data.forEach((obj: any) => {
          if (obj.hasOwnProperty('name')) {
            this.rejectedFields.name = obj.name
          }
          if (obj.hasOwnProperty('group') && obj.lastUpdatedOn > this.rejectedFields.groupRejectionTime) {
            this.rejectedFields.group = obj.group
            this.rejectedFields.groupRejectionComments = obj.comment
            this.rejectedFields.groupRejectionTime = obj.lastUpdatedOn
          }
          if (obj.hasOwnProperty('designation') && obj.lastUpdatedOn > this.rejectedFields.designationRejectionTime) {
            this.rejectedFields.designation = obj.designation
            this.rejectedFields.designationRejectionComments = obj.comment
            this.rejectedFields.designationRejectionTime = obj.lastUpdatedOn
          }
        })
      }
      this.skeletonLoader = false
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('rejectedStatusFailed'))
      }
      this.skeletonLoader = false
    })
  }

  get showApprovalStatus(): boolean {
    if (
      this.groupApprovedTime < this.rejectedFields.groupRejectionTime ||
      this.groupApprovedTime < this.unVerifiedObj.groupRequestTime ||
      this.designationApprovedTime < this.rejectedFields.designationRejectionTime ||
      this.designationApprovedTime < this.unVerifiedObj.designationRequestTime
    ) {
      return true
    }
    return false
  }

  get showGroupPending(): boolean {
    if (
      this.groupApprovedTime < this.unVerifiedObj.groupRequestTime &&
      this.rejectedFields.groupRejectionTime < this.unVerifiedObj.groupRequestTime &&
      this.unVerifiedObj.group
    ) {
      if ((this.unVerifiedObj.groupRequestTime + 100) < this.rejectedFields.designationRejectionTime ||
      (this.unVerifiedObj.groupRequestTime + 100) < this.unVerifiedObj.designationRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showGroupRejection(): boolean {
    if (
      this.groupApprovedTime < this.rejectedFields.groupRejectionTime &&
      this.unVerifiedObj.groupRequestTime < this.rejectedFields.groupRejectionTime &&
      this.rejectedFields.group
    ) {
      if ((this.rejectedFields.groupRejectionTime + 100) < this.rejectedFields.designationRejectionTime ||
      (this.rejectedFields.groupRejectionTime + 100) < this.unVerifiedObj.designationRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showDesignationPending(): boolean {
    if (
      this.designationApprovedTime < this.unVerifiedObj.designationRequestTime &&
      this.rejectedFields.designationRejectionTime < this.unVerifiedObj.designationRequestTime &&
      this.unVerifiedObj.designation
    ) {
      if ((this.unVerifiedObj.designationRequestTime + 100) < this.rejectedFields.groupRejectionTime ||
      (this.unVerifiedObj.designationRequestTime + 100) < this.unVerifiedObj.groupRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showDesignationRejection(): boolean {
    if (
      this.designationApprovedTime < this.rejectedFields.designationRejectionTime &&
      this.unVerifiedObj.designationRequestTime < this.rejectedFields.designationRejectionTime &&
      this.rejectedFields.designation
    ) {
      if ((this.rejectedFields.designationRejectionTime + 100) < this.rejectedFields.groupRejectionTime ||
      (this.rejectedFields.designationRejectionTime + 100) < this.unVerifiedObj.groupRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get enableEditBtn(): boolean {
    if (this.portalProfile.professionalDetails && this.portalProfile.professionalDetails.length) {
      if (this.portalProfile.professionalDetails[0].group !== this.primaryDetailsForm.get('group')!.value &&
      this.portalProfile.professionalDetails[0].designation !== this.primaryDetailsForm.get('designation')!.value
      ) {
        return true

      }
    }

    if (this.portalProfile.professionalDetails && this.portalProfile.professionalDetails.length) {
      if (this.portalProfile.professionalDetails[0].group !== this.primaryDetailsForm.get('group')!.value &&
      ((this.designationApprovedTime + 100) <= this.rejectedFields.groupRejectionTime ||
      // (this.designationApprovedTime - 100) <= this.rejectedFields.groupRejectionTime ||
      this.designationApprovedTime === this.groupApprovedTime)) {
        return true
      }
    }

    if (this.portalProfile.professionalDetails && this.portalProfile.professionalDetails.length) {
      if (this.portalProfile.professionalDetails[0].designation !== this.primaryDetailsForm.get('designation')!.value &&
      (
        // (this.groupApprovedTime + 100) <= this.rejectedFields.designationRejectionTime ||
        (this.groupApprovedTime - 100) <= this.rejectedFields.designationRejectionTime ||
        this.designationApprovedTime === this.groupApprovedTime)) {
        return true
      }
    }

    return false
  }

  handleSendApproval(): void {
    const data: any = {
    }
    if (this.portalProfile.professionalDetails && this.portalProfile.professionalDetails.length) {
      if (this.portalProfile.professionalDetails &&
        this.portalProfile.professionalDetails[0].designation !== this.primaryDetailsForm.get('designation')!.value) {
        data['designation'] = this.primaryDetailsForm.get('designation')!.value
      }
      if (this.portalProfile.professionalDetails &&
        this.portalProfile.professionalDetails[0].group !== this.primaryDetailsForm.get('group')!.value) {
        data['group'] = this.primaryDetailsForm.get('group')!.value
      }
    } else {
      data['designation'] = this.primaryDetailsForm.get('designation')!.value
      data['group'] = this.primaryDetailsForm.get('group')!.value
    }

    if (data.designation || data.group) {
    const postData: any = {
      'request': {
        'userId': this.configService.unMappedUser.id,
        'employmentDetails': {
          'departmentName': this.primaryDetailsForm.value['designation'],
        },
        'profileDetails': {
          'professionalDetails': [],
        },
      },
    }

      postData.request.profileDetails.professionalDetails.push(data)
      this.userProfileService.editProfileDetails(postData)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.matSnackBar.open(this.handleTranslateTo('requestSent'))
        this.editProfile = !this.editProfile
        this.enableWR = true
        this.portalProfile.verifiedKarmayogi = false
        this.getSendApprovalStatus()
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('transferRequestFailed'))
        }
      })
    }

  }

  showWithdrawRequestPopup() {
    const dialogRef = this.dialog.open(WithdrawRequestComponent, {
      data: {
        withDrawType: 'primaryDetails',
      },
      disableClose: true,
      panelClass: 'common-modal',
    })

    dialogRef.afterClosed().subscribe((value: boolean) => {
      if (value) {
        this.handleWithdrawRequest()
      }
    })
  }

  handleWithdrawRequest(): void {
    this.approvalPendingFields.forEach((_obj: any) => {
      this.userProfileService.withDrawRequest(this.configService.unMappedUser.id, _obj.wfId)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.getSendApprovalStatus()
        this.unVerifiedObj.group = ''
        this.unVerifiedObj.designation = ''
        this.matSnackBar.open(this.handleTranslateTo('withdrawRequestSuccess'))
        this.enableWR = false
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('unableWithdrawRequest'))
        }
      })
    })
  }

  handleUpdateName(): void {
    const postData = {
      'request': {
        'userId': this.configService.unMappedUser.id,
        'profileDetails' : {
          'personalDetails' : {
            'firstname': this.profileName,
          },
        },
      },
    }

    this.userProfileService.editProfileDetails(postData)
    .pipe(takeUntil(this.destroySubject$))
    .subscribe((_res: any) => {
      this.portalProfile.personalDetails.firstname = this.profileName
      this.getInitials()
      this.matSnackBar.open(this.handleTranslateTo('userNameUpdated'))
      this.editName = !this.editName
    },         (error: HttpErrorResponse) => {
      if (!error.ok) {
        this.matSnackBar.open(this.handleTranslateTo('userNameUpdateFailed'))
      }
      this.editName = !this.editName
    })
  }

  async onSubmit() {
    const reqUpdates = {
      request: {
        userId: this.configService.unMappedUser.id,
        profileDetails:
        {
          profileImageUrl: this.photoUrl,
        },
      },
    }
    this.userProfileService.editProfileDetails(reqUpdates).subscribe(
      (_res: any) => {
        this.matSnackBar.open(this.handleTranslateTo('profileImageUpdated'))
        this.portalProfile.profileImageUrl = (this.photoUrl as any)

      },
      (err: HttpErrorResponse) => {
        const errMsg = _.get(err, 'error.params.errmsg')
        this.matSnackBar.open(errMsg || this.handleTranslateTo('uploadImageFailed'))
      }
    )
  }

  handleUploadProfileImg(file: File) {
    const formData = new FormData()
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
      this.matSnackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.INVALID_IMG_FORMAT,
        },
        duration: NOTIFICATION_TIME * 1500,
      })
      return
    }

    if (file.size > IMAGE_MAX_SIZE) {
      this.matSnackBar.openFromComponent(NotificationComponent, {
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
        width: 272,
        height: 148,
        isThumbnail: true,
        imageFileName: fileName,
      },
    })

    dialogRef.afterClosed().subscribe({
      next: (result: File) => {
        if (result) {
          formData.append('data', result, fileName)
          this.createUrl(result, fileName)
          this.loader.changeLoad.next(true)
        }
      },
    })
  }

  createUrl(file: File, fileName: string) {
    const formData = new FormData()
    formData.append('data', file, fileName)
    this.userProfileService.uploadProfilePhoto(formData).subscribe((res: any) => {
      if (res && res.result) {
        this.photoUrl = this.pipeImgUrl.transform(res.result.url)
        this.onSubmit()
      }
    })
  }

  handleDesignationRequest(): void {
    this.dialog.open(DesignationRequestComponent, {
      data: { portalProfile: this.portalProfile },
      disableClose: true,
      panelClass: 'common-modal',
    })
  }

  ngOnDestroy() {
    this.destroySubject$.unsubscribe()
  }

  viewReason(comments: string) {
    this.dialog.open(RejectionReasonPopupComponent, {
      data: {
        comments,
        buttonText: 'OK',
      },
      disableClose: true,
      width: '500px',
      maxWidth: '90vw',
    })
  }
}
