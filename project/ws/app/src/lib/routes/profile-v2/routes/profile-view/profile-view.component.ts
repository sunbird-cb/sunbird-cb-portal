import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'

/* tslint:disable */
import _ from 'lodash'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators'

import { ImageCropComponent, ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { LoaderService } from '@ws/author/src/public-api'
import { PipeCertificateImageURL } from '@sunbird-cb/utils-v2'
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
import { ConfirmDialogComponent } from '@sunbird-cb/collection/src/lib/_common/confirm-dialog/confirm-dialog.component'
import { ProfileV2Service } from '../../services/profile-v2.servive'
import { environment } from 'src/environments/environment'
import { NetCoreService } from '../../../../../../../../../src/app/services/netcore.service'
import { SignupService } from 'src/app/routes/public/public-signup/signup.service'

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
// const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/
// const EMAIL_PATTERN = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+([-a-zA-Z0-9]*[a-zA-Z0-9]+)?(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/
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
  approvedDomainList: any = []
  otherDetailsForm = new UntypedFormGroup({
    employeeCode: new UntypedFormControl('', [Validators.pattern(EMP_ID_PATTERN)]),
    primaryEmail: new UntypedFormControl('', [Validators.pattern(EMAIL_PATTERN)]),
    mobile: new UntypedFormControl('', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(MOBILE_PATTERN)]),
    gender: new UntypedFormControl('', []),
    dob: new UntypedFormControl('', []),
    domicileMedium: new UntypedFormControl('', []),
    countryCode: new UntypedFormControl('', []),
    pincode: new UntypedFormControl('', [Validators.minLength(6), Validators.maxLength(6), Validators.pattern(PIN_CODE_PATTERN)]),
    category: new UntypedFormControl('', []),
    isCadre: new UntypedFormControl(false, []),
    typeOfCivilService: new UntypedFormControl(''),
    serviceType: new UntypedFormControl(''),
    cadre: new UntypedFormControl(''),
    batch: new UntypedFormControl(''),
    cadreControllingAuthority: new UntypedFormControl(''),
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
  primaryDetailsForm = new UntypedFormGroup({
    group: new UntypedFormControl('', [Validators.required]),
    designation: new UntypedFormControl('', [Validators.required]),
    searchDesignation: new UntypedFormControl(''),
  })
  approvalPendingFields = []
  rejectedByMDOData = []
  contextToken: any
  params: any

  panelOpenState = false

  groupApprovedTime = 0
  designationApprovedTime = 0
  currentDate = new Date()
  designationsMeta: any = []
  filterDesignationsMeta: any = []
  civilServiceTypes: any
  civilServiceData: any
  cadreControllingAuthority: any
  serviceListData: any
  serviceName: any
  cadre: any
  startBatch: any
  endBatch: any
  yearArray: any
  serviceId: any
  exclusionYear: any
  selectedCadreName: any
  selectedServiceName: any
  selectedCadre: any
  selectedService: any
  civilServiceName: any
  civilServiceId: any
  cadreId: any
  serviceType: any
  cadreStatus: any
  excluedYear: any
  userData: any
  editingAsWhole: any
  isMentor = false
  errorMessage: any
  isCadreStatus = false
  showBatchForNoCadre = true
  noCadreDetails = true
  saveChanges = false
  noHtmlCharacter = new RegExp(/<[^>]*>|(function[^\s]+)|(javascript:[^\s]+)/i)
  isNotMyUser = false
  isIgotOrg = false
  userDate: any
  isMatcompleteOpened = false
  designationListLoadCount = 50
  designationDefaultLoadCount = 50
  isLoadingMoreDesignations = false;
  desigantionFilterEnable = false
  editCustomDetails = false
  customAttrList: any = []
  customAttrForm: any = {}
  //@ViewChild('scrollContainer') private scrollContainer!: ElementRef;
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
    private homeService: HomePageService,
    private profileService: ProfileV2Service,
    private netCoreService: NetCoreService,
    private signupService: SignupService,
    private events: EventService,
  ) {

    if (localStorage.getItem('websiteLanguage')) {
      this.translateService.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translateService.use(lang)
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
          if (res && res !== _.get(this.portalProfile, 'personalDetails.mobile') || !_.get(this.portalProfile, 'personalDetails.phoneVerified')) {
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
    if (this.configService && this.configService.userRoles) {
      // tslint:disable-next-line:max-line-length
      this.isMentor = (this.configService.userRoles.has('MENTOR') || this.configService.userRoles.has('mentor') || this.configService.userRoles.has('Mentor')) ? true : false
    }

    this.route.queryParams.subscribe((params: Params) => {
      this.params = params
    })

    this.route.data.subscribe(data => {
      if (data.profile.data) {
        this.orgId = data.profile.data.rootOrgId
      }

      if (data.profile.data.profileDetails) {
        this.portalProfile = data.profile.data.profileDetails
        this.userDate = _.get(this.portalProfile, 'personalDetails.dob', '')
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
    // if (this.currentUser.lastName) {
    //   this.nameInitials = this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0)}

    this.getInitials()
    this.profileName = this.portalProfile.personalDetails && this.portalProfile.personalDetails.firstname
    this.prefillForm()
    this.getMasterNationality()
    this.getMasterLanguage()
    this.getGroupData()
    // this.getProfilePageMetaData()
    this.loadDesignations()
    // this.loadDesignationsData()
    //this.getMasterDesignation()
    this.getSendApprovalStatus()
    this.getRejectedStatus()
    this.getApprovedFields()
    this.getInsightsData()
    this.fetchCadreData()
    // this.getAssessmentData()
    if (this.configService && this.configService.unMappedUser
      && this.configService.unMappedUser.profileDetails
      && this.configService.unMappedUser.profileDetails.profileStatus) {
      // tslint:disable-next-line:max-line-length
      this.isNotMyUser = this.configService.unMappedUser.profileDetails.profileStatus.toLowerCase() === 'not-my-user' ? true : false
    }
    if (this.configService && this.configService.unMappedUser
      && this.configService.unMappedUser.profileDetails
      && this.configService.unMappedUser.profileDetails.employmentDetails
      && this.configService.unMappedUser.profileDetails.employmentDetails.departmentName) {
      // tslint:disable-next-line:max-line-length
      this.isIgotOrg = this.configService.unMappedUser.profileDetails.employmentDetails.departmentName.toLowerCase() === 'igot' ? true : false
    }

    this.primaryDetailsForm.get('searchDesignation')!.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        startWith(''),
      )
      .subscribe(searchText => {
        if (searchText) {
          this.desigantionFilterEnable = true
          this.filterDesignationsMeta = this.designationsMeta.filter((val: any) =>
            val && val.name.trim().toLowerCase().includes(searchText && searchText.toLowerCase())
          )
        } else {
          this.filterDesignationsMeta = this.designationsMeta.slice(0, this.designationDefaultLoadCount)
          this.desigantionFilterEnable = false
          this.designationListLoadCount = this.designationDefaultLoadCount;
          this.checkCurrentDesignationPresent()
        }
        // if (searchText) {
        //   this.loadDesignationsData(searchText); // Call loadDesignationsData with the search text
        // } else {
        //   this.filterDesignationsMeta = this.designationsMeta; // Reset to the full list if the search text is empty
        // }
      })

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
  }

  cancelCustomFormRequest() {
    this.editCustomDetails = false
  }

  // Sujith
  getService(event: any) {
    const serviceTypeControl = this.otherDetailsForm.get('serviceType')
    const cadreControl = this.otherDetailsForm.get('cadre')
    const batchControl = this.otherDetailsForm.get('batch')
    const cadreControllingAuthorityControl = this.otherDetailsForm.get('cadreControllingAuthority')

    if (serviceTypeControl) { serviceTypeControl.reset() }
    if (cadreControl) { cadreControl.reset() }
    if (batchControl) { batchControl.reset() }
    if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }

    this.serviceType = this.civilServiceData.civilServiceTypeList.find((element: any) => element.name === event)
    if (this.serviceType) {
      this.serviceListData = this.serviceType.serviceList
      this.serviceName = this.serviceListData.map((service: any) => service.name)
      this.serviceId = this.serviceType.id
      this.errorMessage = ''
    } else {
      this.errorMessage = 'Service Type not found'
    }
  }
  // Sujith
  onServiceSelect(event: any) {
    const cadreControl = this.otherDetailsForm.get('cadre')
    const batchControl = this.otherDetailsForm.get('batch')
    const cadreControllingAuthorityControl = this.otherDetailsForm.get('cadreControllingAuthority')
    if (cadreControl) { cadreControl.reset() }
    if (batchControl) { batchControl.reset() }
    if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }
    this.selectedServiceName = event.value
    if (this.serviceListData) {
      this.selectedService = this.serviceListData.find((service: any) => service.name === this.selectedServiceName)
      this.civilServiceName = this.selectedService.name
      this.civilServiceId = this.selectedService.id
      this.cadre = this.selectedService.cadreList.map((cadre: any) => cadre.name)
    }

    // if((this.selectedServiceName.trim() === 'Indian Administrative Office (IAS)') ||
    //                 (this.selectedServiceName.trim() === "Indian Police Service (IPS)") ||
    //                 (this.selectedServiceName.trim() === "Indian Forest Service (IFoS)") && !this.editDetails) {
    //                 this.showBatchForNoCadre = false
    // }
    if (this.selectedService && this.selectedService.cadreControllingAuthority) {
      this.cadreControllingAuthority = this.selectedService.cadreControllingAuthority
    } else {
      this.cadreControllingAuthority = 'NA'
    }
    if (this.selectedService && this.selectedService.cadreList && this.selectedService.cadreList.length === 0) {
      this.showBatchForNoCadre = true
      this.startBatch = this.selectedService.commonBatchStartYear
      this.endBatch = this.selectedService.commonBatchEndYear
      this.exclusionYear = this.selectedService.commonBatchExclusionYearList
      // tslint:disable
      this.yearArray = Array.from({ length: this.endBatch - this.startBatch + 1 }, (_, index) => this.startBatch + index)
        .filter(year => !this.exclusionYear.includes(year))
    } else {
      this.showBatchForNoCadre = false
    }
  }
  // Sujith
  onCadreSelect(event: any) {
    const batchControl = this.otherDetailsForm.get('batch')
    const cadreControllingAuthorityControl = this.otherDetailsForm.get('cadreControllingAuthority')

    if (batchControl) { batchControl.reset() }
    if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }
    this.selectedCadreName = event
    if (this.selectedService) {
      this.selectedCadre = this.selectedService.cadreList.find((cadre: any) => cadre.name === this.selectedCadreName)
      this.startBatch = this.selectedService.cadreList.find((cadre: any) => cadre.name === this.selectedCadreName).startBatchYear
      this.endBatch = this.selectedService.cadreList.find((cadre: any) => cadre.name === this.selectedCadreName).endBatchYear
      this.exclusionYear = this.selectedCadre.exculsionYearList
      // tslint:disable
      this.yearArray = Array.from({ length: this.endBatch - this.startBatch + 1 }, (_, index) => this.startBatch + index)
        .filter(year => !this.exclusionYear.includes(year))
      this.cadreId = this.selectedCadre.id
    }

  }
  // Sujith
  fetchCadreData() {
    if (!this.portalProfile.hasOwnProperty('cadreDetails')) {
      this.noCadreDetails = true
      this.saveChanges = true
    } else if (this.portalProfile.cadreDetails == null) {
      this.noCadreDetails = false
    }
    else {
      this.noCadreDetails = true
    }
    const cadreControllingAuthorityControl = this.otherDetailsForm.get('cadreControllingAuthority')

    if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }
    this.profileService.fetchCadre().subscribe({
      next: response => {
        this.civilServiceData = response.result.response.value.civilServiceType
        this.civilServiceTypes = this.civilServiceData.civilServiceTypeList.map((service: any) => service.name)
      },
      error: err => {
        this.errorMessage = err
      },
    })


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
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'orgDetails') {
        this.scrollToBottom()
      }
    })
  }

  scrollToBottom(): void {

    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 0)
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
      }, (_error: HttpErrorResponse) => {
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
          icon: ele.growth === 'positive' ? 'arrow_upward' : 'arrow_downward',
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
    this.editingAsWhole = true
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
    // if (this.currentUser.firstName) {
    //   if (this.currentUser.firstName.split(' ').length > 1) {
    //     const nameArr = this.currentUser.firstName.split(' ')
    //     this.nameInitials = nameArr[0].charAt(0) + nameArr[1].charAt(0)
    //   } else {
    //     this.nameInitials = this.currentUser.firstName.charAt(0)
    //   }
    // }

    if (this.portalProfile && this.portalProfile.personalDetails && this.portalProfile.personalDetails.firstname) {
      if (this.portalProfile.personalDetails.firstname.split(' ').length > 1) {
        const nameArr = this.portalProfile.personalDetails.firstname.split(' ')
        this.nameInitials = nameArr[0].charAt(0) + nameArr[1].charAt(0)
      } else {
        this.nameInitials = this.portalProfile.personalDetails.firstname.charAt(0)
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
      }, (error: HttpErrorResponse) => {
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
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('unableFetchMasterLanguageData'))
        }
      })
  }

  handleTranslateTo(menuName: string): string {
    return this.userProfileService.handleTranslateTo(menuName)
  }

  // Sujith
  prefillForm(data?: any): void {

    this.isCadreStatus = this.portalProfile.personalDetails && this.portalProfile.personalDetails.isCadre ? true : false
    if (data) {
      this.portalProfile.personalDetails.gender = data.dataToSubmit.gender
      this.portalProfile.personalDetails.dob = data.dataToSubmit.dob
      this.portalProfile.personalDetails.domicileMedium = data.dataToSubmit.domicileMedium
      this.portalProfile.personalDetails.category = data.dataToSubmit.category
      // this.portalProfile.personalDetails.pincode = data.dataToSubmit.pincode
      this.portalProfile.personalDetails.mobile = data.dataToSubmit.mobile
      this.portalProfile.personalDetails.phoneVerified = data.dataToSubmit.phoneVerified
      if (this.portalProfile.employmentDetails) {
        this.portalProfile.employmentDetails.employeeCode = data.employeeCode
        this.portalProfile.employmentDetails.pinCode = data.dataToSubmit.pincode
      }
      if (!this.portalProfile.hasOwnProperty('cadreDetails')) {
        if (data && data.dataToSubmit) {
          this.portalProfile['cadreDetails'] = {
            isCadre: false,
            civilServiceType: '',
            civilServiceName: '',
            cadreName: '',
            cadreBatch: '',
            cadreControllingAuthorityName: '',
            typeOfCivilService: ''
          }
          this.portalProfile['cadreDetails']['isCadre'] = data.dataToSubmit.isCadre
          this.portalProfile['cadreDetails']['civilServiceType'] = data.dataToSubmit.typeOfCivilService
          this.portalProfile['cadreDetails']['civilServiceName'] = data.dataToSubmit.serviceType
          this.portalProfile['cadreDetails']['cadreName'] = data.dataToSubmit.cadre
          this.portalProfile['cadreDetails']['cadreBatch'] = data.dataToSubmit.batch
          this.portalProfile['cadreDetails']['cadreControllingAuthorityName'] = this.cadreControllingAuthority
        }
      }
      if (data && data.dataToSubmit) {
        if (this.portalProfile.cadreDetails) {
          this.portalProfile.cadreDetails.isCadre = data.dataToSubmit.isCadre
          this.portalProfile.cadreDetails.civilServiceType = data.dataToSubmit.typeOfCivilService
          this.portalProfile.cadreDetails.civilServiceName = data.dataToSubmit.serviceType
          this.portalProfile.cadreDetails.cadreName = data.dataToSubmit.cadre
          this.portalProfile.cadreDetails.cadreBatch = data.dataToSubmit.batch
          this.portalProfile.cadreDetails.cadreControllingAuthorityName = this.cadreControllingAuthority
        }
      }

    }

    // if (this.portalProfile.personalDetails.dob) {
    //   console.log(this.portalProfile.personalDetails.dob, "this.portalProfile.personalDetails.dob=======")
    //   const dateArray = this.portalProfile.personalDetails.dob.split('-')
    //   this.dateOfBirth = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`)
    // }
    this.otherDetailsForm.patchValue({
      employeeCode: this.portalProfile.employmentDetails ? this.portalProfile.employmentDetails.employeeCode : '',
      primaryEmail: _.get(this.portalProfile, 'personalDetails.primaryEmail', ''),
      gender: _.get(this.portalProfile, 'personalDetails.gender', '').toUpperCase(),
      dob: this.getDateFromText(_.get(this.portalProfile, 'personalDetails.dob', '')),
      domicileMedium: _.get(this.portalProfile, 'personalDetails.domicileMedium', ''),
      mobile: _.get(this.portalProfile, 'personalDetails.mobile', ''),
      countryCode: _.get(this.portalProfile, 'personalDetails.countryCode', '+91'),
      pincode: this.portalProfile.employmentDetails ? this.portalProfile.employmentDetails.pinCode : '',
      category: _.get(this.portalProfile, 'personalDetails.category', '').toUpperCase(),
      isCadre: _.get(this.portalProfile, 'personalDetails.isCadre', '')
    });



    // ...(this.portalProfile.cadreDetails ? {
    //   typeOfCivilService: this.portalProfile.cadreDetails.civilServiceType,
    //   serviceType: this.portalProfile.cadreDetails.civilServiceName,
    //   cadre: this.portalProfile.cadreDetails.cadre,
    //   batch: this.portalProfile.cadreDetails.batch,
    //   isCadre: this.portalProfile.personalDetails.isCadre,
    //   cadreControllingAuthority: this.portalProfile.cadreDetails.cadreControllingAuthority,
    // } : {})

    if (_.get(this.portalProfile, 'personalDetails.isCadre')) {
      this.populateValues()
    }

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
    // this.fetchCadreData()
  }

  handleCancelUpdate(): void {
    this.editDetails = !this.editDetails
    this.prefillForm()
  }

  private getDateFromText(dateString: string): any {
    if (dateString) {
      const sv: string[] = dateString.split('T')
      if (sv && sv.length > 1) {
        return sv[0]
      }
      const splitValues: string[] = dateString.split('-')
      const [dd, mm, yyyy] = splitValues
      const dateToBeConverted = dd.length !== 4 ? `${yyyy}-${mm}-${dd}` : `${dd}-${mm}-${yyyy}`
      return new Date(dateToBeConverted)
    }
    return ''
  }

  // handleDateFormat(dateString: string): any {
  //   const dateArr = dateString.split('-')
  //   const newDateStr = `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`
  //   return moment(new Date(newDateStr)).format('D MMM YYYY')
  // }

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
      }, (error: any) => {
        if (!error.ok) {
          this.matSnackBar.open(_.get(error, 'error.params.errmsg') || 'Unable to resend OTP, please try again later!')
        }
      })
  }

  handleGenerateEmailOTP(verifyType?: any): void {
    this.userProfileService.getWhiteListDomain().subscribe((response: any) => {
      if (response && response.result && response.result.domains && response.result.domains.length > 0) {
        this.approvedDomainList = response.result.domains

        if (this.approvedDomainList && this.approvedDomainList.length && this.approvedDomainList.length > 0) {

          if (this.isEmailAllowed(this.otherDetailsForm.value['primaryEmail'])) {
            this.otpService.sendEmailOtp(this.otherDetailsForm.value['primaryEmail'])
              .pipe(takeUntil(this.destroySubject$))
              .subscribe((_res: any) => {
                this.matSnackBar.open(this.handleTranslateTo('otpSentEmail'))
                if (verifyType) {
                  this.handleVerifyOTP(verifyType, this.otherDetailsForm.value['primaryEmail'])
                }
              }, (error: HttpErrorResponse) => {
                if (!error.ok) {
                  this.matSnackBar.open(this.handleTranslateTo('emailOTPSentFail'))
                }
              })
          } else {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              data: {
                title: ' ',
                from: 'approvedDomain',
                acceptButton: 'OK',
                width: '60%',
              },
            })
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
              }
            })
          }
        }
      }
    })
  }

  isEmailAllowed(email: string): boolean {
    const domain = email.split('@')[1]
    return domain ? this.approvedDomainList.includes(domain) : false
  }

  handleGenerateOTP(verifyType?: string): void {
    this.otpService.sendOtp(this.otherDetailsForm.value['mobile'])
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.matSnackBar.open(this.handleTranslateTo('otpSentMobile'))
        if (verifyType) {
          this.handleVerifyOTP(verifyType, this.otherDetailsForm.value['mobile'])
        }
      }, (error: HttpErrorResponse) => {
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
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('updateEmailFailed'))
        }
      })
  }

  // Sujith
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

    const payload: any = {
      'request': {
        'userId': this.configService.unMappedUser.id,
        'profileDetails': {
          'personalDetails': {
          },
          'employmentDetails': {
            'employeeCode': this.otherDetailsForm.value['employeeCode'],
            'pinCode': this.otherDetailsForm.value['pincode'],
            'mobile': this.otherDetailsForm.value['mobile'],
          },
          'cadreDetails': {

          },
        },
      },
    }
    payload.request.profileDetails.personalDetails = dataToSubmit
    payload.request.profileDetails.personalDetails['phoneVerified'] = this.verifyMobile ? 'false' : 'true';

    if ((this.otherDetailsForm.value['typeOfCivilService'] && this.otherDetailsForm.value['serviceType'] && this.otherDetailsForm.value['batch']) || (!this.otherDetailsForm.value['isCadre'])) {
      if (this.isCadreStatus) {
        payload.request.profileDetails.cadreDetails = {
          'civilServiceTypeId': this.serviceId,
          'civilServiceType': this.otherDetailsForm.value['typeOfCivilService'],
          'civilServiceId': this.civilServiceId,
          'civilServiceName': this.otherDetailsForm.value['serviceType'],
          'cadreId': this.cadreId,
          'cadreName': this.otherDetailsForm.value['cadre'],
          'cadreBatch': this.otherDetailsForm.value['batch'],
          'cadreControllingAuthorityName': this.cadreControllingAuthority
        }
      } else {
        payload.request.profileDetails.cadreDetails = {}
      }
      this.userProfileService.editProfileDetails(payload)
        .pipe(takeUntil(this.destroySubject$))
        .subscribe((_res: any) => {
          // update cadre details in config service to enroll into Blended programs
          if (this.configService.unMappedUser && this.configService.unMappedUser.profileDetails) {
            this.configService.unMappedUser.profileDetails.cadreDetails = payload.request.profileDetails.cadreDetails
          }
          this.matSnackBar.open(this.handleTranslateTo('userDetailsUpdated'))
          this.portalProfile.personalDetails.isCadre = this.isCadreStatus
          this.editDetails = !this.editDetails
          this.prefillForm({ dataToSubmit, ...{ 'employeeCode': this.otherDetailsForm.value['employeeCode'] } })
          this.netCoreUserProfileUpdateEvent()
        }, (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.matSnackBar.open(this.handleTranslateTo('userDetailsUpdateFailed'))
            this.editDetails = !this.editDetails
            this.prefillForm({ dataToSubmit, ...{ 'employeeCode': this.otherDetailsForm.value['employeeCode'] } })
          }
        })
    }
    else {
      this.matSnackBar.open('Please fill in all mandatory cadre information to update your profile')
    }
  }

  handleTransferRequest(): void {
    const dialogRef = this.dialog.open(TransferRequestComponent, {
      data: { portalProfile: this.portalProfile, groupData: this.groupData, designationsMeta: this.designationsMeta },
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
        this.groupData = res.result && res.result.response.filter((ele: any) => ele !== 'Others')
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('groupDataFaile'))
        }
      })
  }

  loadDesignations() {
    this.userProfileService.getDesignations({}).subscribe(
      (data: any) => {
        this.designationsMeta = data.responseData

        // Initialize filtered list
        this.filterDesignationsMeta = this.designationsMeta.slice(0, this.designationDefaultLoadCount);
        this.checkCurrentDesignationPresent();

      },
      (_err: any) => {
      })
  }

  checkCurrentDesignationPresent() {

    // Get the current designation value
    const currentDesignation = this.primaryDetailsForm.get('designation')!.value;
    // Check if current designation exists in the list
    if (currentDesignation) {
      const designationExists = this.filterDesignationsMeta.some(
        (designation: any) => designation.name.toLowerCase() === currentDesignation.toLowerCase()
      );

      // If designation doesn't exist in the list, add it
      if (!designationExists) {
        // Create a new designation object to match the structure of other items
        const newDesignation = {
          name: currentDesignation,
          // Add any other required properties matching your data structure
          id: 'custom-' + Date.now(),
          status: 'Active'
        };
        // Make sure the custom designation appears in the filtered list
        if (this.filterDesignationsMeta.length >= this.designationListLoadCount) {
          // Replace the last item with the new one to maintain the same number of items
          this.filterDesignationsMeta.pop();
        }
        this.filterDesignationsMeta.unshift(newDesignation);
      }
    }
  }

  loadDesignationsData(searchText?: string) {
    let request: any = {
      "filterCriteriaMap": {
        "status": "Active"
      },
      "requestedFields": [],
      "pageNumber": 0,
      "pageSize": 20
    }
    if (searchText) {
      request['searchString'] = searchText
    }
    this.userProfileService.getDesignationV2(request).subscribe(
      (data: any) => {
        console.log(data, "data")
        if (data && data.result && data.result.result && data.result.result.data && data.result.result.data.length) {
          if (!searchText) {
            this.designationsMeta = data.result.result.data
            this.filterDesignationsMeta = this.designationsMeta
          } else {
            this.filterDesignationsMeta = data.result.result.data
          }

        }
        // this.designationsMeta = data.responseData
      },
      (_err: any) => {
      })
  }

  async getMasterDesignation() {
    this.signupService.getOrgReadData(this.orgId).subscribe((result: any) => {
      if (result && result.frameworkid) {
        this.signupService.getFrameworkInfo(result.frameworkid).subscribe((res: any) => {
          const frameworkDetails = _.get(res, 'result.framework')
          const categoriesOfFramework = _.get(frameworkDetails, 'categories', [])
          const organisationsList = this.getTermsByCode(categoriesOfFramework, 'org')
          const disOrderedList = _.get(organisationsList, '[0].children', [])
          this.designationsMeta = _.sortBy(disOrderedList, 'name')
          this.filterDesignationsMeta = this.designationsMeta
        }, (error: any) => {
          // tslint:disable-next-line
          console.error('Error occurred:', error)
        })
      }
    }, (error: any) => {
      // tslint:disable-next-line
      console.error('Error occurred:', error)
    })
  }

  private getTermsByCode(categories: any[], code: string) {
    const selectedCategory = categories.filter(
      (category: any) => category.code === code
    );
    return _.get(selectedCategory, '[0].terms', []);
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
      }, (error: HttpErrorResponse) => {
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
      }, (error: HttpErrorResponse) => {
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
      }, (error: HttpErrorResponse) => {
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
      if (!this.primaryDetailsForm.get('group')!.value || !this.primaryDetailsForm.get('designation')!.value) {
        return false
      }
      if (this.portalProfile.professionalDetails[0].group !== this.primaryDetailsForm.get('group')!.value ||
        this.portalProfile.professionalDetails[0].designation !== this.primaryDetailsForm.get('designation')!.value
      ) {
        if (this.designationsMeta.find((obj: any) => obj.name.toLowerCase() === this.primaryDetailsForm.get('designation')!.value.toLowerCase())) {
          return true
        } else {
          return false
        }
      }
      if ((this.portalProfile.professionalDetails[0].group !== this.primaryDetailsForm.get('group')!.value) &&
        ((this.designationApprovedTime <= (this.rejectedFields.groupRejectionTime + 100) &&
          this.rejectedFields.designationRejectionTime <= (this.rejectedFields.groupRejectionTime + 100)) ||
          this.GroupAndDesignationApproved)
      ) {
        return true
      }
      if ((this.portalProfile.professionalDetails[0].designation !== this.primaryDetailsForm.get('designation')!.value) &&
        ((this.groupApprovedTime <= (this.rejectedFields.designationRejectionTime + 100) &&
          this.rejectedFields.groupRejectionTime <= (this.rejectedFields.designationRejectionTime + 100)) ||
          this.GroupAndDesignationApproved)) {
        return true
      }
      return false

    } if (this.primaryDetailsForm.get('group')!.value && this.primaryDetailsForm.get('designation')!.value) {
      return true
    }
    return false
  }

  get GroupAndDesignationApproved(): Boolean {
    if ((this.designationApprovedTime === this.groupApprovedTime) ||
      (this.designationApprovedTime > this.rejectedFields.designationRejectionTime &&
        this.groupApprovedTime > this.rejectedFields.groupRejectionTime) ||
      (this.designationApprovedTime + 100 >= this.groupApprovedTime &&
        this.groupApprovedTime + 100 >= this.designationApprovedTime)
    ) {
      return true
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
      if (this.primaryDetailsForm.get('designation')!.value) {
        data['designation'] = this.primaryDetailsForm.get('designation')!.value
      }
      if (this.primaryDetailsForm.get('group')!.value) {
        data['group'] = this.primaryDetailsForm.get('group')!.value
      }
    }

    if (data.designation || data.group) {
      const postData: any = {
        'request': {
          'userId': this.configService.unMappedUser.id,
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
          this.raiseTelemetry(this.primaryDetailsForm.value['designation'])
        }, (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.matSnackBar.open(this.handleTranslateTo('transferRequestFailed'))
          }
        })
    }
  }

  raiseTelemetry(designation: any) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: designation,
        id: 'designation-master-import',
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.PROFILE,
      }
    )
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
        }, (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.matSnackBar.open(this.handleTranslateTo('unableWithdrawRequest'))
          }
        })
    })
  }

  handleUpdateName(): void {

    const regexMatch = this.profileName.match(this.noHtmlCharacter)
    if (regexMatch) {
      this.matSnackBar.open('HTML or Js is not allowed')
      return
    }

    const postData = {
      'request': {
        'userId': this.configService.unMappedUser.id,
        'profileDetails': {
          'personalDetails': {
            'firstname': this.profileName,
          },
        },
      },
    }

    this.userProfileService.editProfileDetails(postData)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.portalProfile.personalDetails.firstname = this.profileName
        if (this.configService && this.configService.userProfile && this.configService.userProfile.firstName) {
          this.configService.userProfile.firstName = this.profileName
        }

        this.getInitials()
        this.matSnackBar.open(this.handleTranslateTo('userNameUpdated'))
        this.editName = !this.editName
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('userNameUpdateFailed'))
        }
        this.editName = !this.editName
      })

    this.netCoreUserProfileNameUpdateEvent()
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
        // this.netCoreUserProfilePhotoUpdateEvent()

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

    // Clean up any panel event listeners
    const panel = document.querySelector('.mat-select-panel');
    if (panel) {
      panel.removeEventListener('scroll', this.onDesignationSelectScroll.bind(this));
    }
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

  viewMentorProfile() {
    // window.location.href = 'https://portal.karmayogi.nic.in/mentorship'
    // this.router.navigateByUrl('mentorship')
    window.open(`${environment.contentHost}/mentorship`, '_blank')
  }

  getIsCadreStatus(value: boolean) {
    this.isCadreStatus = value
    if (value) {
      this.otherDetailsForm.patchValue({
        typeOfCivilService: '',
        serviceType: '',
        cadre: '',
        batch: '',
        cadreControllingAuthority: '',
      });
    }
    else {
      this.showBatchForNoCadre = false
    }
  }

  populateValues() {
    let cadreValues: any = this.portalProfile.cadreDetails;
    this.profileService.fetchCadre().subscribe({
      next: response => {
        let civilServiceTypeList: any = response.result.response.value.civilServiceType.civilServiceTypeList
        for (let index = 0; index < civilServiceTypeList.length; index++) {
          if (civilServiceTypeList[index].id === cadreValues.civilServiceTypeId) {
            let popCivilServiceType: any = civilServiceTypeList[index];
            this.civilServiceTypes = civilServiceTypeList.map((service: any) => service.name)
            this.serviceId = civilServiceTypeList[index].id
            for (let serviceIndex = 0; serviceIndex < popCivilServiceType.serviceList.length; serviceIndex++) {
              if (popCivilServiceType.serviceList[serviceIndex].id === cadreValues.civilServiceId) {
                let popServiceType = popCivilServiceType.serviceList[serviceIndex];
                this.serviceName = popCivilServiceType.serviceList.map((service: any) => service.name)
                this.serviceListData = popCivilServiceType.serviceList
                this.civilServiceId = popCivilServiceType.serviceList[serviceIndex].id
                if (popCivilServiceType.serviceList[serviceIndex] && popCivilServiceType.serviceList[serviceIndex].name) {
                  let civilServiceName = popCivilServiceType.serviceList[serviceIndex].name
                  if ((civilServiceName.trim() === 'Indian Administrative Service (IAS)') ||
                    (civilServiceName.trim() === "Indian Police Service (IPS)") ||
                    (civilServiceName.trim() === "Indian Forest Service (IFoS)")) {
                    this.showBatchForNoCadre = false
                  }
                }

                if (!cadreValues.cadreName) {
                  this.startBatch = popCivilServiceType.serviceList[serviceIndex].commonBatchStartYear
                  this.endBatch = popCivilServiceType.serviceList[serviceIndex].commonBatchEndYear
                  this.exclusionYear = popCivilServiceType.serviceList[serviceIndex].commonBatchExclusionYearList
                  // tslint:disable
                  this.yearArray = Array.from({ length: this.endBatch - this.startBatch + 1 }, (_, index) => this.startBatch + index)
                    .filter(year => !this.exclusionYear.includes(year))
                }
                for (let cadreIndex = 0; cadreIndex < popServiceType.cadreList.length; cadreIndex++) {
                  if (popServiceType.cadreList[cadreIndex].id === cadreValues.cadreId) {
                    let popCadre: any = popServiceType.cadreList[cadreIndex];
                    this.cadre = popServiceType.cadreList.map((cadre: any) => cadre.name)
                    this.cadreId = popServiceType.cadreList[cadreIndex].id
                    this.startBatch = popCadre.startBatchYear
                    this.endBatch = popCadre.endBatchYear
                    this.exclusionYear = popCadre.exculsionYearList
                    // tslint:disable
                    this.yearArray = Array.from({ length: this.endBatch - this.startBatch + 1 }, (_, index) => this.startBatch + index)
                      .filter(year => !this.exclusionYear.includes(year))
                    for (let index = 0; index < this.yearArray.length; index++) {
                      if (this.yearArray[index] === cadreValues.cadreBatch) {
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.cadreControllingAuthority = cadreValues.cadreControllingAuthorityName
        if (this.cadreControllingAuthority) {
          this.otherDetailsForm.patchValue({
            typeOfCivilService: this.portalProfile.cadreDetails.civilServiceType,
            serviceType: this.portalProfile.cadreDetails.civilServiceName,
            cadre: this.portalProfile.cadreDetails.cadreName,
            batch: this.portalProfile.cadreDetails.cadreBatch,
            isCadre: this.portalProfile.personalDetails.isCadre,
            cadreControllingAuthority: this.portalProfile.cadreDetails.cadreControllingAuthorityName,
          });
        }
      },
      error: err => {
        this.errorMessage = err
      },
    })



  }
  // isEmailAllowed(email: string): boolean {
  //   const domain = this.extractDomain(email);
  //   return this.approvedDomainList.includes(domain);
  // }

  // private extractDomain(email: string): string {
  //   const parts = email.split('@');
  //   return parts.length > 1 ? parts[1] : '';
  // }

  onkeyDown(_event: any) {
    return this.isMatcompleteOpened
  }

  onAutoCompleteOpened() {
    this.isMatcompleteOpened = true
  }

  onAutoCompleteClosed() {
    this.isMatcompleteOpened = false
  }

  netCoreUserProfilePhotoUpdateEvent() {
    /* tslint:disable */
    console.log('this.content', this.portalProfile)
    /* tslint:enable */
    // smartech('contact', '2', {
    //   'pk^userid': this.configService.unMappedUser.identifier.trim().toLowerCase(),
    //   'FULL_NAME' : this.profileName.trim().toLowerCase(),
    // })

    if (this.configService.netcoreConfig && this.configService.netcoreConfig.netcoreWebConfig
      && this.configService.netcoreConfig.netcoreWebConfig.isActive
      && this.configService.netcoreConfig.netcoreWebConfig.events
      && this.configService.netcoreConfig.netcoreWebConfig.events.profile_update
      && this.configService.netcoreConfig.netcoreWebConfig.events.profile_update.isActive
    ) {
      let payload: any = {}
      if (this.configService && this.configService.unMappedUser && this.configService.unMappedUser.identifier) {
        payload['pk^userid'] = this.configService.unMappedUser.identifier.trim().toLowerCase()
      }
      if (this.photoUrl) {
        payload['PROFILE_PHOTO'] = this.photoUrl
      }

      this.netCoreService.netCoreUserProfilePhotoUpdate(payload)
      this.netCoreService.trackEvent('profile_update', this.configService.unMappedUser.identifier.trim().toLowerCase(), payload)
    }


  }

  netCoreUserProfileNameUpdateEvent() {
    /* tslint:disable */
    console.log('this.content', this.portalProfile)
    /* tslint:enable */
    // smartech('contact', '2', {
    //   'pk^userid': this.configService.unMappedUser.identifier.trim().toLowerCase(),
    //   'FULL_NAME' : this.profileName.trim().toLowerCase(),
    // })
    if (this.configService.netcoreConfig && this.configService.netcoreConfig.netcoreWebConfig
      && this.configService.netcoreConfig.netcoreWebConfig.isActive
      && this.configService.netcoreConfig.netcoreWebConfig.events
      && this.configService.netcoreConfig.netcoreWebConfig.events.profile_update
      && this.configService.netcoreConfig.netcoreWebConfig.events.profile_update.isActive
    ) {
      let payload: any = {}
      if (this.configService && this.configService.unMappedUser && this.configService.unMappedUser.identifier) {
        payload['pk^userid'] = this.configService.unMappedUser.identifier.trim().toLowerCase()
      }
      if (this.profileName) {
        payload['FULL_NAME'] = this.toTitleCase(this.profileName.trim().toLowerCase())
      }

      this.netCoreService.netCoreUserNameUpdate(payload)
      this.netCoreService.trackEvent('profile_update', this.configService.unMappedUser.identifier.trim().toLowerCase(), payload)
    }
  }

  netCoreUserProfileUpdateEvent() {
    /* tslint:disable */
    console.log('this.content', this.portalProfile)
    /* tslint:enable */
    // smartech('contact', '2', {
    //   'pk^userid': this.configService.unMappedUser.identifier.trim().toLowerCase(),
    //   'FULL_NAME' : this.profileName.trim().toLowerCase(),
    // })
    //let formValueChanges:any
    if (this.configService.netcoreConfig && this.configService.netcoreConfig.netcoreWebConfig
      && this.configService.netcoreConfig.netcoreWebConfig.isActive
      && this.configService.netcoreConfig.netcoreWebConfig.events
      && this.configService.netcoreConfig.netcoreWebConfig.events.profile_update
      && this.configService.netcoreConfig.netcoreWebConfig.events.profile_update.isActive
    ) {
      let profileUpdateObj: any = {}
      let profileUpdateEventObj: any = []
      if (this.configService && this.configService.unMappedUser && this.configService.unMappedUser.identifier) {
        profileUpdateObj['pk^userid'] = this.configService.unMappedUser.identifier.trim().toLowerCase()
        //profileUpdateEventObj['pk^userid'] = this.configService.unMappedUser.identifier.trim().toLowerCase()
      }





      // if (this.profileName) {
      //   profileUpdateObj['FULL_NAME'] = this.toTitleCase(this.profileName.trim())
      //  // profileUpdateEventObj['FULL_NAME'] = this.toTitleCase(this.profileName.trim())
      //  profileUpdateEventObj.push('FULL_NAME')
      // }
      // if (this.photoUrl) {
      //   profileUpdateObj['PROFILE_PHOTO'] = this.photoUrl
      //   profileUpdateEventObj['PROFILE_PHOTO'] = this.photoUrl
      // }
      if (this.portalProfile &&
        this.portalProfile.personalDetails) {

        const EMPLOYEE_ID = this.otherDetailsForm.get('employeeCode');
        const EMAIL = this.otherDetailsForm.get('primaryEmail')
        const MOBILE = this.otherDetailsForm.get('mobile')
        const MOTHER_TONGUE = this.otherDetailsForm.get('domicileMedium')
        const IS_CADRE = this.otherDetailsForm.get('isCadre')

        if (EMPLOYEE_ID?.dirty) {
          profileUpdateEventObj.push('EMPLOYEE_ID')
        }
        if (EMAIL?.dirty) {
          profileUpdateEventObj.push('EMAIL')
        }
        if (MOBILE?.dirty) {
          profileUpdateEventObj.push('MOBILE')
        }
        if (MOTHER_TONGUE?.dirty) {
          profileUpdateEventObj.push('MOTHER_TONGUE')
        }
        if (IS_CADRE?.dirty) {
          profileUpdateEventObj.push('IS_CADRE')
        }

        // if (this.portalProfile.personalDetails.gender) {
        //   profileUpdateObj['GENDER'] = this.toTitleCase(this.portalProfile.personalDetails.gender.trim())
        //   profileUpdateEventObj['GENDER'] = this.toTitleCase(this.portalProfile.personalDetails.gender.trim())
        // }
        // if (this.portalProfile.personalDetails.primaryEmail) {
        //   profileUpdateObj['EMAIL'] = this.portalProfile.personalDetails.primaryEmail.trim()
        //   // profileUpdateEventObj['EMAIL'] = this.portalProfile.personalDetails.primaryEmail.trim()
        //   profileUpdateEventObj.push('EMAIL')
        // }
        // if (this.portalProfile.personalDetails.mobile) {
        //   profileUpdateObj['MOBILE'] = this.portalProfile.personalDetails.mobile
        //   // profileUpdateEventObj['MOBILE'] = this.portalProfile.personalDetails.mobile
        //   profileUpdateEventObj.push('MOBILE')
        // }
        // if (this.portalProfile.personalDetails.dob) {
        //   profileUpdateEventObj['DOB'] = this.portalProfile.personalDetails.dob.trim()
        // }
        // if (this.portalProfile.personalDetails.domicileMedium) {
        //   profileUpdateObj['MOTHER_TONGUE'] = this.toTitleCase(this.portalProfile.personalDetails.domicileMedium.trim().toLowerCase())
        //   // profileUpdateEventObj['MOTHER_TONGUE'] = this.toTitleCase(this.portalProfile.personalDetails.domicileMedium.trim().toLowerCase())
        //   profileUpdateEventObj.push('MOTHER_TONGUE')
        // }
        // if (this.portalProfile.personalDetails.category) {
        //   profileUpdateEventObj['CATEGORY'] = this.toTitleCase(this.portalProfile.personalDetails.category.trim().toLowerCase())
        // }
        // if (this.portalProfile.personalDetails.pincode) {
        //   profileUpdateEventObj['PIN_CODE'] = this.portalProfile.personalDetails.pincode.trim()
        // }






        // if (this.portalProfile.id) {
        //   // profileUpdateEventObj['EMPLOYEE_ID'] = this.portalProfile.employmentDetails?.employeeCode.trim()

        // }
        // if (this.portalProfile.personalDetails.hasOwnProperty('isCadre')) {
        //   profileUpdateEventObj['IS_CADRE'] = this.portalProfile.personalDetails.hasOwnProperty('isCadre')
        //   profileUpdateEventObj.push('IS_CADRE')
        // }

      }

      const PROFILE_GROUP = this.primaryDetailsForm.get('group');
      const PROFILE_DESIGNATION = this.primaryDetailsForm.get('designation')

      if (PROFILE_GROUP?.dirty) {
        profileUpdateEventObj.push('PROFILE_GROUP')
      }
      if (PROFILE_DESIGNATION?.dirty) {
        profileUpdateEventObj.push('PROFILE_DESIGNATION')
      }

      if (this.portalProfile && this.portalProfile.profileDetails) {
        profileUpdateObj['PROFILE_GROUP'] = this.toTitleCase(this.portalProfile.profileDetails.professionalDetails.group.trim().toLowerCase())
        //profileUpdateEventObj['PROFILE_GROUP'] = this.toTitleCase(this.portalProfile.profileDetails.professionalDetails.group.trim().toLowerCase())
        // profileUpdateEventObj.push('PROFILE_GROUP')
      }

      if (this.portalProfile && this.portalProfile.profileDetails) {
        profileUpdateObj['PROFILE_DESIGNATION'] = this.toTitleCase(this.portalProfile.profileDetails.profileDesignationStatus.group.trim().toLowerCase())
        //profileUpdateEventObj['PROFILE_DESIGNATION'] = this.toTitleCase(this.portalProfile.profileDetails.profileDesignationStatus.group.trim().toLowerCase())
        // profileUpdateEventObj.push('PROFILE_DESIGNATION')
      }


      if (this.portalProfile &&
        this.portalProfile.cadreDetails) {
        // if (this.portalProfile.cadreDetails.civilServiceType) {
        //   profileUpdateEventObj['CIVIL_SERVICE_TYPE'] = this.portalProfile.cadreDetails.civilServiceType
        // }
        // if (this.portalProfile.cadreDetails.civilServiceName) {
        //   profileUpdateEventObj['CIVIL_SERVICE_NAME'] = this.portalProfile.cadreDetails.civilServiceName
        // }
        // if (this.portalProfile.cadreDetails.cadreName) {
        //   profileUpdateEventObj['CADRE_NAME'] = this.portalProfile.cadreDetails.cadreName
        // }
        // if (this.portalProfile.cadreDetails.cadreBatch) {
        //   profileUpdateEventObj['CADRE_BATCH'] = this.portalProfile.cadreDetails.cadreBatch
        // }
        // if (this.portalProfile.cadreDetails.cadreControllingAuthorityName) {
        //   profileUpdateEventObj['CADRE_CONTROLLING_AUTHORITY'] = this.portalProfile.cadreDetails.cadreControllingAuthorityName
        // }
      }

      if (this.portalProfile && this.portalProfile.additionalProperties) {
        // if (this.portalProfile.additionalProperties.externalSystemId) {
        //   profileUpdateEventObj['EHRMS_ID'] = this.toTitleCase(this.portalProfile.additionalProperties.externalSystemId.trim().toLowerCase())
        // }
        // if (this.portalProfile.additionalProperties.externalSystemDor) {
        //   profileUpdateEventObj['DOR'] = this.portalProfile.additionalProperties.externalSystemDor.trim()
        // }
      }


      // profileUpdateEventObj = profileUpdateEventObj.toString()
      console.log('profileUpdateEventObj', profileUpdateEventObj)

      this.netCoreService.netCoreUserProfilepdate(profileUpdateObj)
      // this.netCoreService.netCoreUserProfileUpdateEvent(profileUpdateEventObj, 'profile_update',this.configService.unMappedUser.identifier.trim().toLowerCase())
      this.netCoreService.trackEvent('profile_update', this.configService.unMappedUser.identifier.trim().toLowerCase(), profileUpdateEventObj)
    }
  }



  toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  validateName(event: any) {
    console.log('event', event)
  }

  setupScrollListener(opened: boolean): void {

    if (opened) {
      if (this.primaryDetailsForm.get('searchDesignation')) {
        this.primaryDetailsForm.get('searchDesignation')!.setValue('');
      }
      this.desigantionFilterEnable = false
      this.designationListLoadCount = this.designationDefaultLoadCount; // Reset the load count
      this.filterDesignationsMeta = this.designationsMeta.slice(0, this.designationDefaultLoadCount);
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
      this.checkCurrentDesignationPresent()
      // Wait for the panel to be rendered in the DOM
      setTimeout(() => {
        // Find the panel element
        const panel = document.querySelector('.mat-select-panel');
        if (panel) {
          // Add scroll event listener to the panel
          panel.addEventListener('scroll', this.onDesignationSelectScroll.bind(this));
        }

      }, 100);
    }
  }

  onDesignationSelectScroll(event: any): void {
    const element = event.target;

    if (!this.desigantionFilterEnable) {
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoreDesignations && this.designationsMeta.length > this.filterDesignationsMeta.length) {
          this.isLoadingMoreDesignations = true;

          // Increase the load count by designationDefaultLoadCount
          this.designationListLoadCount += this.designationDefaultLoadCount;

          // Update the filtered list with more items
          setTimeout(() => {
            this.filterDesignationsMeta = this.designationsMeta.slice(0, this.designationListLoadCount);
            this.checkCurrentDesignationPresent()
            this.isLoadingMoreDesignations = false;
          }, 500); // Small timeout to simulate loading and prevent multiple triggers
        }
      }
    }
  }
  // Add these methods to your component class

  clearSearchDesignation(event: Event): void {
    event.stopPropagation();
    if (this.primaryDetailsForm.get('searchDesignation')) {
      this.primaryDetailsForm.get('searchDesignation')!.setValue('');
    }
  }

  onDesignationDropdownClosed(): void {
    // Keep the designation value but clear the search input
    const currentDesignation = this.primaryDetailsForm.get('designation')!.value;
    setTimeout(() => {
      if (this.primaryDetailsForm.get('searchDesignation')) {
        this.primaryDetailsForm.get('searchDesignation')!.setValue('');
      }
      // Ensure the designation value remains selected
      if (currentDesignation) {
        const designationControl = this.primaryDetailsForm.get('designation');
        if (designationControl) {
          designationControl.setValue(currentDesignation);
        }
      }
    }, 100);
  }

  cancelRequest() {
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
}
