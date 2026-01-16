import { DatePipe } from '@angular/common'
import { Component, OnInit, Inject, ViewChild, ElementRef, HostListener } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { UserProfileService } from '../../../user-profile/services/user-profile.service'
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { Subject } from 'rxjs'
import { NsUserProfileDetails } from '../../../user-profile/models/NsUserProfile'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { ProfileV2Service } from '../../../profile-v2/services/profile-v2.servive'
import { OtpService } from '../../../user-profile/services/otp.services'
import { NPSGridService } from '@sunbird-cb/collection/src/lib/grid-layout/nps-grid.service'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
/* tslint:disable */
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'
// import { SignupService } from 'src/app/routes/public/public-signup/signup.service'
import { designation } from '../../../profile-v2/models/profile-revamp.model'

const MOBILE_PATTERN = /^[0]?[6789]\d{9}$/
const PIN_CODE_PATTERN = /^[1-9][0-9]{5}$/
const EMP_ID_PATTERN = /^[a-z0-9]+$/i
/* tslint:disable */
const EMAIL_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9._-]*[a-zA-Z0-9]+@[a-zA-Z0-9]+([-a-zA-Z0-9]*[a-zA-Z0-9]+)?(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}$/

@Component({
  selector: 'ws-app-enroll-profile-form',
  templateUrl: './enroll-profile-form.component.html',
  styleUrls: ['./enroll-profile-form.component.scss'],
})
export class EnrollProfileFormComponent implements OnInit {
  public afterSubmitAction = this.checkAfterSubmit.bind(this)
  isReadOnly = false
  batchDetails: any
  customForm: boolean = false
  userDetailsForm: FormGroup
  groupData: any | undefined
  private destroySubject$ = new Subject()
  designationsMeta: any = []
  // filterDesignationsMeta: any = []
  eUserGender = Object.keys(NsUserProfileDetails.EUserGender)
  masterLanguages: any
  masterLanguageBackup: any
  eCategory = Object.keys(NsUserProfileDetails.ECategory)
  userProfileObject: any
  eligible: boolean = false
  isCadreStatus = false
  showBatchForNoCadre = true
  civilServiceData: any
  civilServiceTypes: any
  serviceName: any
  serviceType: any
  serviceListData: any
  serviceId: any
  errorMessage: any
  selectedServiceName: any
  selectedService: any
  civilServiceName: any
  civilServiceId: any
  cadreId: any
  cadre: any
  cadreControllingAuthority: any
  startBatch: any
  endBatch: any
  yearArray: any
  exclusionYear: any
  selectedCadreName: any
  selectedCadre: any
  verifyMobile: boolean = false
  otpSent: boolean = false
  emailOtpSent: boolean = false
  otpEntered = ''
  mVerified: boolean = false
  eVerified: boolean = false
  @ViewChild('timerDiv', { static: false }) timerDiv !: any
  @ViewChild('emailTimerDiv', { static: false }) emailTimerDiv !: any
  timeLeft = 150
  emailTimeLeft = 150
  interval: any
  emailInterval: any
  showResendOTP = false
  showEmailResendOTP = false
  otpForm: FormGroup
  emailOtpForm: FormGroup
  showname = false
  showDesignation = false
  showGroup = false
  showEmployeeCode = false
  showMobile = false
  showGender = false
  showDob = false
  showCategory = false
  showDecimalMedium = false
  showPinCode = false
  showCadreDetails = false
  updateProfile = false
  pendingFileds: any
  pGroup: any
  pDesignation: any
  isLoading: boolean = false
  canShowEmployeeCode: boolean = false
  canshowMobile: boolean = false
  canShowGender: boolean = false
  canShowDob: boolean = false
  canShowDomicileMedium: boolean = false
  canShowCategory: boolean = false
  canShowpinCode: boolean = false
  canShowshowCadreDetails: boolean = false
  canShowGroup: boolean = false
  canShowDesignation: boolean = false
  selectedDate: any
  showCounter: number = 0
  disableCounter: number = 0
  canShowEmail: boolean = false
  showEmail: boolean = false
  canShowName: boolean = false
  canShowOrg: boolean = false
  showOrg: boolean = false
  surveyId: any
  showDoptChanges: boolean = false
  profileFormType: any
  verifyEmail = false
  approvedDomainList: any = []
  contextToken: any
  currentDate = new Date()
  openDesignationDropdown = false
  openLanguageDropdown = false
  canShowOtherDesignation = false
  designationListLoadCount = 50
  addLoader = 0
  isLoadingMoreDesignations = false;
  designationDefaultLoadCount =  50
  desigantionFilterEnable = false
  organisationId = ''
  selectedOrgHasDesignations = false;
  designationsOffset = 0;
  designationSearchText = '';
  designationsTotalCount = 0;
  formId: string = '';
  formsDetils: any;
  @ViewChild('textBox') textBox!: ElementRef
  @ViewChild('dropdown') dropdown!: ElementRef
  @ViewChild('languageTextBox') languageTextBox!: ElementRef
  @ViewChild('languageDropdown') languageDropdown!: ElementRef
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EnrollProfileFormComponent>,
    private userProfileService: UserProfileService,
    private configSrc: ConfigurationsService,
    private profileV2Svc: ProfileV2Service,
    private otpService: OtpService,
    private npsSvc: NPSGridService,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    // private signupService: SignupService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    if (localStorage.getItem('websiteLanguage')) {
      this.translateService.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translateService.use(lang)
    }

    this.batchDetails = this.data.batchData
    this.surveyId = this.data.surveyId
    this.showDoptChanges = this.data.showDoptChanges
    this.profileFormType = this.batchDetails.batchAttributes.userProfileFileds
    this.userDetailsForm = new FormGroup({
      name: new FormControl(''),
      organisation: new FormControl(''),
      group: new FormControl(''),
      designation: new FormControl(''),
      employeeCode: new FormControl(''),
      primaryEmail: new FormControl('', [Validators.pattern(EMAIL_PATTERN)]),
      mobile: new FormControl(''),
      gender: new FormControl('', []),
      dob: new FormControl('', []),
      domicileMedium: new FormControl(''),
      category: new FormControl('', []),
      pinCode: new FormControl(''),
      isCadre: new FormControl(),
      typeOfCivilService: new FormControl(''),
      serviceType: new FormControl(''),
      cadreName: new FormControl(''),
      cadreBatch: new FormControl(''),
      cadreControllingAuthority: new FormControl(''),
      otherDesignation: new FormControl(''),
      searchDesignation: new FormControl('')
    })
    this.isLoading = true
    this.userProfileObject = this.configSrc.unMappedUser
    this.organisationId = _.get(this.userProfileObject, 'rootOrgId', _.get(this.userProfileObject, 'personalDetails.rootOrgId', ''))

    this.otpForm = new FormGroup({
      otp: new FormControl('', Validators.required)
    })
    this.emailOtpForm = new FormGroup({
      eOtp: new FormControl('', Validators.required)
    })

    // To check the mobile number entered by the user is same or not, validating the mobile number to show the Get OTP.
    if (this.userDetailsForm.get('mobile')) {
      this.userDetailsForm.get('mobile')!.valueChanges
        .subscribe(res => {
          if (res && res !== this.userProfileObject.profileDetails.personalDetails.mobile ||
            !this.userProfileObject.profileDetails.personalDetails.phoneVerified) {
            if (MOBILE_PATTERN.test(res)) {
              this.verifyMobile = true
              this.mVerified = false
            } else {
              this.verifyMobile = false
            }
          } else {
            this.verifyMobile = false
          }
        })
    }

    // To check the email entered by the user is same or not, validating the email to show the Get OTP.
    if (this.userDetailsForm.get('primaryEmail')) {
      this.userDetailsForm.get('primaryEmail')!.valueChanges
        .subscribe(res => {
          if (res && res !== this.userProfileObject.profileDetails.personalDetails.primaryEmail) {
            if (EMAIL_PATTERN.test(res)) {
              this.verifyEmail = true
              this.eVerified = false
            } else {
              this.verifyEmail = false
            }
          } else {
            this.verifyEmail = false
            this.eVerified = true
          }
        })
    }
  }

  scrollToActive(type: any): void {
    let activeElement: any
    let container: any
    if (type === 'language') {
      container = this.languageDropdown.nativeElement
      activeElement = container.querySelector('.language-item-active')
    } else if (type === 'designation') {
      container = this.dropdown.nativeElement
      activeElement = container.querySelector('.item-active')
    }
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  @HostListener('document:click', ['$event'])

  handleClickOutside(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement
    if (
      this.textBox && !this.textBox.nativeElement.contains(clickedElement) &&
      this.dropdown && !this.dropdown.nativeElement.contains(clickedElement)
    ) {
      this.openDesignationDropdown = false
    }
    if (
      this.languageTextBox && !this.languageTextBox.nativeElement.contains(clickedElement) &&
      this.languageDropdown && !this.languageDropdown.nativeElement.contains(clickedElement)
    ) {
      this.openLanguageDropdown = false
    }
  }
  onDesignationsFocus() {
    // this.openDesignationDropdown = true
    setTimeout(() => {
      this.scrollToActive('designation')
    }, 100)
  }
  onLanguageFocus() {
    this.openLanguageDropdown = true
    setTimeout(() => {
      this.scrollToActive('language')
    }, 100)
  }

  filterLanguage(value: any) {
    if (value.length) {
      this.masterLanguages = this.masterLanguageBackup.filter((val: any) =>
        val && val.name.trim().toLowerCase().includes(value.toLowerCase())
      )
      if (this.masterLanguages.length === 0) {
        const usernameControl = this.userDetailsForm.get('domicileMedium')
        if (usernameControl) {
          usernameControl.setErrors({ required: true });
        }
      }
    }
    this.openLanguageDropdown = true
  }

  // filterdesignation(value: any) {
  //   if (value.length) {
  //     this.desigantionFilterEnable =true
  //     this.filterDesignationsMeta = this.designationsMeta.filter((val: any) =>
  //       val && val.name.trim().toLowerCase().includes(value.toLowerCase())
  //     )
  //     if (this.filterDesignationsMeta.length === 0) {
  //       const usernameControl = this.userDetailsForm.get('designation')
  //       if (usernameControl) {
  //         usernameControl.setErrors({ required: true });
  //       }
  //     }
  //   } else {
  //     this.filterDesignationsMeta = this.designationsMeta.slice(0, this.designationDefaultLoadCount)
  //     this.desigantionFilterEnable =false

  //     this.designationListLoadCount = this.designationDefaultLoadCount;
  //   }
  //   // this.openDesignationDropdown = true
  // }

  // async getMasterDesignation() {
  //   this.signupService.getOrgReadData(this.userProfileObject.rootOrgId).subscribe((result: any) => {
  //     if (result && result.frameworkid) {
  //       this.signupService.getFrameworkInfo(result.frameworkid).subscribe((res: any) => {
  //         const frameworkDetails = _.get(res, 'result.framework')
  //         const categoriesOfFramework = _.get(frameworkDetails, 'categories', [])
  //         const organisationsList = this.getTermsByCode(categoriesOfFramework, 'org')
  //         const disOrderedList = _.get(organisationsList, '[0].children', [])
  //         this.designationsMeta = _.sortBy(disOrderedList, 'name')
  //         this.filterDesignationsMeta = this.designationsMeta.slice(0, this.designationDefaultLoadCount)
  //         if (this.canShowDesignation) {
  //           let field = this.userDetailsForm.get('designation')
  //           if (field && field.value) {
  //             let _value = field.value.toLowerCase()
  //             if (!this.designationsMeta.find((d: any) => d.name.toLowerCase() === _value)) {
  //               field.patchValue('')
  //             }
  //           }
  //         }
  //       }, (error: any) => {
  //         // tslint:disable-next-line
  //         console.error('Error occurred:', error)
  //       })
  //     }
  //   }, (error: any) => {
  //     // tslint:disable-next-line
  //     console.error('Error occurred:', error)
  //   })
  // }

  // private getTermsByCode(categories: any[], code: string) {
  //   const selectedCategory = categories.filter(
  //     (category: any) => category.code === code
  //   );
  //   return _.get(selectedCategory, '[0].terms', []);
  // }

  preventBlur(event: MouseEvent): void {
    event.preventDefault()
  }
  preventLanguageBlur(event: MouseEvent): void {
    event.preventDefault()
  }

  selectDesignation(designation: any) {
    this.userDetailsForm.patchValue({ designation: designation })
    const fieldControl = this.userDetailsForm.get('otherDesignation')
    if (this.showDoptChanges && designation === 'Others') {
      if (fieldControl) {
        fieldControl.setValidators([Validators.required]);
        fieldControl.updateValueAndValidity()
      }
      this.canShowOtherDesignation = true
    } else {
      if (fieldControl) {
        fieldControl.clearValidators()
        fieldControl.updateValueAndValidity()
      }
      this.canShowOtherDesignation = false
    }
    this.openDesignationDropdown = false
  }


  selectLanguage(language: any) {
    this.userDetailsForm.patchValue({ domicileMedium: language })
    this.openLanguageDropdown = false
  }

  isEmailAllowed(email: string): boolean {
    const domain = email.split('@')[1]
    return domain ? this.approvedDomainList.includes(domain) : false
  }

  handleGenerateEmailOTP(verifyType?: any): void {
    console.log(verifyType)
    this.userProfileService.getWhiteListDomain().subscribe((response: any) => {
      if (response && response.result && response.result.domains && response.result.domains.length > 0) {
        this.approvedDomainList = response.result.domains
        if (this.approvedDomainList && this.approvedDomainList.length && this.approvedDomainList.length > 0) {
          if (this.isEmailAllowed(this.userDetailsForm.value['primaryEmail'])) {
            this.otpService.sendEmailOtp(this.userDetailsForm.value['primaryEmail'])
              .pipe(takeUntil(this.destroySubject$))
              .subscribe((_res: any) => {
                this.emailOtpForm.reset()
                if (verifyType) {
                  this.emailOtpSent = true
                  this.startEmailTimer()
                  this.snackBar.open(this.handleTranslateTo('otpSentEmail'))
                }
              }, (error: HttpErrorResponse) => {
                if (!error.ok) {
                  this.snackBar.open(this.handleTranslateTo('emailOTPSentFail'))
                }
              }
              )
          } else {
            this.snackBar.open(this.handleTranslateTo('emailApprovedPopupMsg'))
          }
        }
      }
    })
  }

  handleGenerateOTP(verifyType?: string): void {
    this.otpService.sendOtp(this.userDetailsForm.value['mobile'])
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.snackBar.open(this.handleTranslateTo('otpSentMobile'))
        this.otpForm.reset()
        if (verifyType) {
          this.otpSent = true
          this.startTimer()
          //this.handleVerifyOTP(verifyType, this.userDetailsForm.value['mobile'])
        }
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.snackBar.open(this.handleTranslateTo('mobileOTPSentFail'))
        }
      })
  }

  handleResendOTP(): void {
    this.timeLeft = 150
    this.showResendOTP = true
    this.startTimer()
    let otpValue$: any
    otpValue$ = this.otpService.resendOtp(this.userDetailsForm.controls['mobile'].value)

    otpValue$.pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.snackBar.open(this.handleTranslateTo('otpSentMobile'))
      }, (error: any) => {
        if (!error.ok) {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Unable to resend OTP, please try again later!')
        }
      })
  }

  handleResendEmailOTP(): void {
    this.emailTimeLeft = 150
    this.showEmailResendOTP = true
    this.startEmailTimer()
    let otpValue$: any
    otpValue$ = this.otpService.sendEmailOtp(this.userDetailsForm.controls['primaryEmail'].value)
    otpValue$.pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.snackBar.open(this.handleTranslateTo('otpSentEmail'))
      }, (error: any) => {
        if (!error.ok) {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || 'Unable to resend OTP, please try again later!')
        }
      })
  }

  verifyEmailOTP(): void {
    this.otpService.verifyEmailOTP(this.emailOtpForm.controls['eOtp'].value, this.userDetailsForm.controls['primaryEmail'].value)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.snackBar.open(this.handleTranslateTo('OTPSentSuccess'))
        this.verifyEmail = true
        this.eVerified = true
        this.emailOtpSent = false
        this.contextToken = _res.result.contextToken
        this.emailOtpForm.reset()
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || this.handleTranslateTo('OTPVerifyFailed'))
        }
      })
  }

  verifyMobileOTP(): void {
    this.otpService.verifyOTP(this.otpForm.controls['otp'].value, this.userDetailsForm.controls['mobile'].value)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.snackBar.open(this.handleTranslateTo('OTPSentSuccess'))
        this.verifyMobile = true
        this.mVerified = true
        this.otpSent = false
        this.otpForm.reset()
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.snackBar.open(_.get(error, 'error.params.errmsg') || this.handleTranslateTo('OTPVerifyFailed'))
        }
      })
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft = this.timeLeft - 1
        if (this.timerDiv) {
          this.timerDiv.nativeElement.innerHTML = `${Math.floor(this.timeLeft / 60)}m: ${this.timeLeft % 60}s`
        }
      } else {
        clearInterval(this.interval)
        this.showResendOTP = true
      }
    }, 1000)
  }

  startEmailTimer() {
    this.emailInterval = setInterval(() => {
      if (this.emailTimeLeft > 0) {
        this.emailTimeLeft = this.emailTimeLeft - 1
        if (this.emailTimerDiv) {
          this.emailTimerDiv.nativeElement.innerHTML = `${Math.floor(this.emailTimeLeft / 60)}m: ${this.emailTimeLeft % 60}s`
        }
      } else {
        clearInterval(this.emailInterval)
        this.showEmailResendOTP = true
      }
    }, 1000)
  }

  public checkAfterSubmit(_e: any) {
    // this.renderSubject.next()
    // tslint:disable-next-line:no-console
    console.log('Form is submitted successfully')
    if (this.batchDetails.batchAttributes.userProfileFileds &&
      this.batchDetails.batchAttributes.userProfileFileds === "Available user filled iGOT profile") {
      this.submitSurevy(true)
    }
    if (this.batchDetails.batchAttributes.userProfileFileds && !this.updateProfile &&
      (this.batchDetails.batchAttributes.userProfileFileds === "Full iGOT profile" ||
        this.batchDetails.batchAttributes.userProfileFileds === "Custom iGOT profile")) {
      this.submitSurevy(true)
    }
    this.openSnackbar('Form is submitted successfully')
    this.dialogRef.close(true)
  }

  closePopup() {
    this.dialogRef.close(true)
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  ngOnInit() {
    this.formId = _.get(this.data, 'batchData.batchAttributes.profileSurveyId')
    this.getFormDetails()
    this.setValueChangeFunctions()
    this.fetchCadreData()
    this.getGroupData()
    this.getPendingDetails()
    setTimeout(() => {
      // this.loadDesignations()
      this.checkSelectedOrgHasDesignations();
      //this.getMasterDesignation()
      this.getMasterLanguage()
    }, 500)
  }

  getFormDetails() {
    if (this.formId) {
      this.profileV2Svc.getFormV2ByID(this.formId).subscribe((responce: any) => {
        if (responce) {
          this.formsDetils = _.get(responce, 'result.response', {})
        }
      })
    }
  }

  setValueChangeFunctions() {
    const searchDesignationControl = this.userDetailsForm.get('searchDesignation')
    if (searchDesignationControl) {
      let settingValueChange = true
      searchDesignationControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe(searchText => {
          this.designationsOffset = 0
          if (searchText && searchText.length > 1) {
          this.designationSearchText = searchText
            this.getdesignationsMeta()
          } else if (!searchText) {
          this.designationSearchText = searchText
            if(!settingValueChange) {
              this.getdesignationsMeta() 
            }
            this.checkCurrentDesignationPresent()
          }
          settingValueChange = false
        })
    }
  }

  fetchCadreData() {
    this.addLoader = this.addLoader + 1
    this.profileV2Svc.fetchCadre().subscribe((response: any) => {
      this.addLoader = this.addLoader - 1
      this.civilServiceData = response.result.response.value.civilServiceType
      this.civilServiceTypes = this.civilServiceData.civilServiceTypeList.map((service: any) => service.name)
    })
  }

  getIsCadreStatus(value: boolean) {
    this.isCadreStatus = value
    if (value) {
      this.userDetailsForm.patchValue({
        typeOfCivilService: '',
        serviceType: '',
        cadreName: '',
        cadreBatch: '',
        cadreControllingAuthority: '',
      })
      this.addValidators()
    }

    else {
      this.showBatchForNoCadre = false
      this.removeValidators()
    }
  }

  getAllErrors(): string[] {
    const errorMessages: string[] = [];
    Object.keys(this.userDetailsForm.controls).forEach((key) => {
      const controlErrors = this.userDetailsForm.controls[key].errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((errorKey) => {
          switch (errorKey) {
            case 'required':
              errorMessages.push(`${key} is required.`);
              break;
            case 'minlength':
              const requiredLength = controlErrors['minlength'].requiredLength;
              errorMessages.push(`${key} must be at least ${requiredLength} characters long.`);
              break;
            case 'email':
              errorMessages.push(`Please enter a valid email address.`);
              break;
            // Add more cases for other validators as needed
          }
        });
      }
    });
    return errorMessages;
  }

  addValidators() {
    const fieldControl0 = this.userDetailsForm.get('isCadre')
    if (fieldControl0) {
      fieldControl0.setValidators([Validators.required]);
      fieldControl0.updateValueAndValidity()
    }
    const fieldControl = this.userDetailsForm.get('typeOfCivilService')
    if (fieldControl) {
      fieldControl.setValidators([Validators.required]);
      fieldControl.updateValueAndValidity()
    }
    const fieldControl1 = this.userDetailsForm.get('serviceType')
    if (fieldControl1) {
      fieldControl1.setValidators([Validators.required]);
      fieldControl1.updateValueAndValidity()
    }
    const fieldControl3 = this.userDetailsForm.get('cadreBatch')
    if (fieldControl3) {
      fieldControl3.setValidators([Validators.required]);
      fieldControl3.updateValueAndValidity()
    }
  }

  removeValidators() {
    const fieldControl = this.userDetailsForm.get('typeOfCivilService')
    if (fieldControl) {
      fieldControl.clearValidators()
      fieldControl.updateValueAndValidity()
    }
    const fieldControl1 = this.userDetailsForm.get('serviceType')
    if (fieldControl1) {
      fieldControl1.clearValidators()
      fieldControl1.updateValueAndValidity()
    }
    const fieldControl2 = this.userDetailsForm.get('cadreName')
    if (fieldControl2) {
      fieldControl2.clearValidators()
      fieldControl2.updateValueAndValidity()
    }
    const fieldControl3 = this.userDetailsForm.get('cadreBatch')
    if (fieldControl3) {
      fieldControl3.clearValidators()
      fieldControl3.updateValueAndValidity()
    }
  }

  getService(event: any) {
    const serviceTypeControl = this.userDetailsForm.get('serviceType')
    const cadreControl = this.userDetailsForm.get('cadreName')
    const batchControl = this.userDetailsForm.get('cadreBatch')
    const cadreControllingAuthorityControl = this.userDetailsForm.get('cadreControllingAuthority')

    if (serviceTypeControl) { serviceTypeControl.reset() }
    if (cadreControl) { cadreControl.reset() }
    if (batchControl) { batchControl.reset() }
    if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }

    this.serviceType = this.civilServiceData.civilServiceTypeList.find((element: any) => element.name === event)
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

  onServiceSelect(event: any) {
    const cadreControl = this.userDetailsForm.get('cadreName')
    const batchControl = this.userDetailsForm.get('cadreBatch')
    const cadreControllingAuthorityControl = this.userDetailsForm.get('cadreControllingAuthority')
    if (cadreControl) { cadreControl.reset() }
    if (batchControl) { batchControl.reset() }
    if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }
    this.selectedServiceName = event.value
    if (this.serviceListData) {
      this.selectedService = this.serviceListData.find((service: any) => service.name === this.selectedServiceName)
      if (this.selectedService) {
        this.civilServiceName = this.selectedService.name
        this.civilServiceId = this.selectedService.id
        this.cadre = this.selectedService.cadreList ? this.selectedService.cadreList.map((cadre: any) => cadre.name) : []
      }
    }
    if (this.selectedService && this.selectedService.cadreControllingAuthority) {
      this.cadreControllingAuthority = this.selectedService.cadreControllingAuthority
    } else {
      this.cadreControllingAuthority = 'NA'
    }
    if (this.selectedService && this.selectedService.cadreList.length === 0) {
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

  onCadreSelect(event: any) {
    const batchControl = this.userDetailsForm.get('cadreBatch')
    const cadreControllingAuthorityControl = this.userDetailsForm.get('cadreControllingAuthority')

    if (batchControl) { batchControl.reset() }
    if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }
    this.selectedCadreName = event
    if (this.selectedService) {
      this.selectedCadre = this.selectedService.cadreList.find((cadre: any) => cadre.name === this.selectedCadreName)
      this.startBatch = this.selectedCadre ? this.selectedCadre.startBatchYear : ''
      this.endBatch = this.selectedCadre ? this.selectedCadre.endBatchYear : ''
      this.exclusionYear = this.selectedCadre ? this.selectedCadre.exculsionYearList : ''
      // tslint:disable
      this.yearArray = Array.from({ length: this.endBatch - this.startBatch + 1 }, (_, index) => this.startBatch + index)
        .filter(year => !this.exclusionYear.includes(year))
      this.cadreId = this.selectedCadre ? this.selectedCadre.id : ''
    }

  }

  getPendingDetails() {
    this.addLoader = this.addLoader + 1
    this.profileV2Svc.fetchApprovalDetails().subscribe((resp: any) => {
      this.addLoader = this.addLoader - 1
      if (resp && resp.result && resp.result.data) {
        this.pendingFileds = resp.result.data
        if (this.pendingFileds.length > 0) {
          this.pendingFileds.forEach((user: any) => {
            if (user['group']) {
              let ctrl = this.userDetailsForm.get('group')
              if (ctrl) {
                ctrl.patchValue({ group: user['group'] })
                this.pGroup = user['group']
              }
            }
            if (user['designation']) {
              let ctrl = this.userDetailsForm.get('designation')
              if (ctrl) {
                ctrl.patchValue({ designation: user['designation'] })
                this.pDesignation = user['designation']
              }
            }
          })
        }
      }
      this.isLoading = false
      this.defineFormAttributes()
    }, error => {
      // tslint:disable-next-line:no-console
      console.log(error)
      this.addLoader = this.addLoader - 1
      this.isLoading = false
    })
  }

  defineFormAttributes() {
    if (this.batchDetails.batchAttributes.userProfileFileds &&
      this.batchDetails.batchAttributes.bpEnrolMandatoryProfileFields) {
      let customAttr = this.batchDetails.batchAttributes.bpEnrolMandatoryProfileFields
      console.log("customAttr ", customAttr)
      if (this.findAttr(customAttr, 'name')) {
        this.canShowName = true
        this.showname = true
        const fieldControl = this.userDetailsForm.get('name')
        if (fieldControl) {
          fieldControl.setValue(this.userProfileObject.profileDetails.personalDetails.firstname)
          fieldControl.disable()
        }
        if (this.profileFormType === 'Available user filled iGOT profile' &&
          !this.userProfileObject.profileDetails.personalDetails.firstname
        ) {
          this.canShowName = false
          this.showname = false
        }
      }

      if (this.findAttr(customAttr, 'email')) {
        this.canShowEmail = true
        const fieldControl = this.userDetailsForm.get('primaryEmail')
        if (fieldControl) {
          fieldControl.setValue(this.userProfileObject.profileDetails.personalDetails.primaryEmail)
          if (this.userProfileObject.profileDetails.personalDetails.primaryEmail) {
            fieldControl.setValue(this.userProfileObject.profileDetails.personalDetails.primaryEmail)
            this.eVerified = true
          } else if (this.profileFormType === 'Available user filled iGOT profile') {
            this.showEmail = false
          } else {
            this.showEmail = true
          }
        }
      } else {
        this.eVerified = true
      }

      if (this.findAttr(customAttr, 'organisation')) {
        this.canShowOrg = true
        this.showOrg = true
        const fieldControl = this.userDetailsForm.get('organisation')
        if (fieldControl) {
          fieldControl.setValue(this.userProfileObject.profileDetails.employmentDetails.departmentName)
          fieldControl.disable()
        }
        if (this.profileFormType === 'Available user filled iGOT profile' &&
          !this.userProfileObject.profileDetails.employmentDetails.departmentName
        ) {
          this.canShowOrg = false
          this.showOrg = false
        }
      }

      if (this.findAttr(customAttr, 'group')) {
        this.canShowGroup = true
        this.showGroup = true
        const fieldControl = this.userDetailsForm.get('group')
        if (fieldControl) {
          if (this.pGroup) {
            fieldControl.setValue(this.pGroup)
            // if (this.profileFormType === 'Available user filled iGOT profile') {
            //   this.canShowGroup = true
            //   this.showGroup = true
            // }
          } else {
            if (this.userProfileObject.profileDetails.professionalDetails &&
              this.userProfileObject.profileDetails.professionalDetails.length &&
              this.userProfileObject.profileDetails.professionalDetails[0].group
            ) {
              fieldControl.setValue(this.userProfileObject.profileDetails.professionalDetails[0].group)
              // if (this.profileFormType === 'Available user filled iGOT profile') {
              //   this.canShowGroup = false
              //   this.showGroup = false
              // }
            }
          }
          fieldControl.setValidators([Validators.required])
          fieldControl.updateValueAndValidity()
        }
      }
      if (this.findAttr(customAttr, 'designation')) {
        this.canShowDesignation = true
        this.showDesignation = true
        const fieldControl = this.userDetailsForm.get('designation')
        if (fieldControl) {
          if (this.pDesignation) {
            fieldControl.patchValue(this.pDesignation)
            // if (this.profileFormType === 'Available user filled iGOT profile') {
            //   this.canShowDesignation = true
            //   this.showDesignation = true
            // }
          } else {
            if (this.userProfileObject.profileDetails.professionalDetails &&
              this.userProfileObject.profileDetails.professionalDetails.length &&
              this.userProfileObject.profileDetails.professionalDetails[0].designation) {
              fieldControl.patchValue(this.userProfileObject.profileDetails.professionalDetails[0].designation)
              // if (this.profileFormType === 'Available user filled iGOT profile') {
              //   this.canShowDesignation = false
              //   this.showDesignation = false
              // }
            }
          }
          fieldControl.setValidators([Validators.required])
          fieldControl.updateValueAndValidity()
        }
      }
      if (this.findAttr(customAttr, 'employeeCode')) {
        this.canShowEmployeeCode = true
        const contrl = this.userDetailsForm.get('employeeCode')
        if (contrl) {
          if (this.userProfileObject.profileDetails.employmentDetails.employeeCode) {
            contrl.setValue(this.userProfileObject.profileDetails.employmentDetails.employeeCode)
            contrl.setValidators([Validators.required, Validators.pattern(EMP_ID_PATTERN)])
            contrl.updateValueAndValidity()
          } else if (this.profileFormType === 'Available user filled iGOT profile') {
            this.canShowEmployeeCode = false
          } else {
            this.showEmployeeCode = true
            contrl.setValidators([Validators.required, Validators.pattern(EMP_ID_PATTERN)]);
            contrl.updateValueAndValidity()
          }
        }
      }

      if (this.findAttr(customAttr, 'mobile')) {
        this.canshowMobile = true
        const contrl = this.userDetailsForm.get('mobile')
        if (contrl) {
          if (this.userProfileObject.profileDetails.personalDetails.mobile && this.userProfileObject.profileDetails.personalDetails.phoneVerified) {
            contrl.setValue(this.userProfileObject.profileDetails.personalDetails.mobile)
            this.mVerified = true
            contrl.setValidators([Validators.minLength(10), Validators.maxLength(10), Validators.pattern(MOBILE_PATTERN)]);
            contrl.updateValueAndValidity()
          } else if (this.profileFormType === 'Available user filled iGOT profile') {
            this.canshowMobile = false
            this.mVerified = true
          } else {
            this.showMobile = true
            contrl.setValidators([Validators.minLength(10), Validators.maxLength(10), Validators.pattern(MOBILE_PATTERN)]);
            contrl.updateValueAndValidity()
          }
        }
      }

      if (this.canshowMobile === false) {
        this.mVerified = true
      }

      if (this.findAttr(customAttr, 'gender')) {
        this.canShowGender = true
        const contrl = this.userDetailsForm.get('gender')
        if (contrl) {
          if (this.userProfileObject.profileDetails.personalDetails.gender) {
            contrl.setValue(this.userProfileObject.profileDetails.personalDetails.gender)
            contrl.setValidators([Validators.required])
            contrl.updateValueAndValidity()
          } else if (this.profileFormType === 'Available user filled iGOT profile') {
            this.canShowGender = false
          } else {
            this.showGender = true
            contrl.setValidators([Validators.required])
            contrl.updateValueAndValidity()
          }
        }
      }

      if (this.findAttr(customAttr, 'dob')) {
        this.canShowDob = true
        const contrl = this.userDetailsForm.get('dob')
        if (contrl) {
          if (this.userProfileObject.profileDetails.personalDetails.dob) {
            let _dob: any = this.userProfileObject.profileDetails.personalDetails.dob
            const [day, month, year] = _dob.split('-')
            const date = new Date(Number(year), Number(month) - 1, Number(day))
            const formattedDay = String(date.getDate()).padStart(2, '0')
            const formattedMonth = String(date.getMonth() + 1).padStart(2, '0')
            const formattedYear = date.getFullYear()
            this.selectedDate = new Date(`${formattedYear}-${formattedMonth}-${formattedDay}`)
            contrl.setValue(this.selectedDate)
            contrl.setValidators([Validators.required])
            contrl.updateValueAndValidity()
          } else if (this.profileFormType === 'Available user filled iGOT profile') {
            this.canShowDob = false
          } else {
            this.showDob = true
            contrl.setValidators([Validators.required])
            contrl.updateValueAndValidity()
          }
        }
      }

      if (this.findAttr(customAttr, 'domicileMedium')) {
        this.canShowDomicileMedium = true
        const contrl = this.userDetailsForm.get('domicileMedium')
        if (contrl) {
          if (this.userProfileObject.profileDetails.personalDetails.domicileMedium) {
            contrl.setValue(this.userProfileObject.profileDetails.personalDetails.domicileMedium)
            contrl.setValidators([Validators.required])
            contrl.updateValueAndValidity()
          } else if (this.profileFormType === 'Available user filled iGOT profile') {
            this.canShowDomicileMedium = false
          } else {
            this.showDecimalMedium = true
            contrl.setValidators([Validators.required])
            contrl.updateValueAndValidity()
          }
        }
      }

      if (this.findAttr(customAttr, 'category')) {
        this.canShowCategory = true
        const contrl = this.userDetailsForm.get('category')
        if (contrl) {
          if (this.userProfileObject.profileDetails.personalDetails.category) {
            contrl.setValue(this.userProfileObject.profileDetails.personalDetails.category)
            contrl.setValidators([Validators.required])
            contrl.updateValueAndValidity()
          } else if (this.profileFormType === 'Available user filled iGOT profile') {
            this.canShowCategory = false
          } else {
            this.showCategory = true
            contrl.setValidators([Validators.required])
            contrl.updateValueAndValidity()
          }
        }
      }

      if (this.findAttr(customAttr, 'pinCode')) {
        this.canShowpinCode = true
        const contrl = this.userDetailsForm.get('pinCode')
        if (contrl) {
          if (this.userProfileObject.profileDetails.employmentDetails.pinCode) {
            contrl.setValue(this.userProfileObject.profileDetails.employmentDetails.pinCode)
            contrl.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(PIN_CODE_PATTERN)])
            contrl.updateValueAndValidity()
          } else if (this.profileFormType === 'Available user filled iGOT profile') {
            this.canShowpinCode = false
          } else {
            this.showPinCode = true
            contrl.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(PIN_CODE_PATTERN)])
            contrl.updateValueAndValidity()
          }
        }
      }

      if (this.findAttr(customAttr, 'cadreDetails')) {
        this.canShowshowCadreDetails = true
        const contrl = this.userDetailsForm.get('isCadre')
        if (contrl) {
          if (Object.keys(this.userProfileObject.profileDetails.personalDetails).includes('isCadre')) {
            if (this.userProfileObject.profileDetails.personalDetails.isCadre === true) {
              contrl.setValue(true)
              this.isCadreStatus = true
              this.serviceId = this.userProfileObject.profileDetails.cadreDetails.civilServiceTypeId
              this.civilServiceId = this.userProfileObject.profileDetails.cadreDetails.civilServiceId
              this.cadreId = this.userProfileObject.profileDetails.cadreDetails.cadreId
              this.cadreControllingAuthority = this.userProfileObject.profileDetails.cadreDetails.cadreControllingAuthorityName
              setTimeout(() => {
                this.getService(this.userProfileObject.profileDetails.cadreDetails.civilServiceType)
                this.onServiceSelect({ value: this.userProfileObject.profileDetails.cadreDetails.civilServiceName })
                if (this.userProfileObject.profileDetails.cadreDetails.cadreName) {
                  this.onCadreSelect(this.userProfileObject.profileDetails.cadreDetails.cadreName)
                }
                this.userDetailsForm.patchValue({
                  typeOfCivilService: this.userProfileObject.profileDetails.cadreDetails.civilServiceType,
                  serviceType: this.userProfileObject.profileDetails.cadreDetails.civilServiceName,
                  cadreName: this.userProfileObject.profileDetails.cadreDetails.cadreName,
                  cadreBatch: this.userProfileObject.profileDetails.cadreDetails.cadreBatch,
                  cadreControllingAuthority: this.userProfileObject.profileDetails.cadreDetails.cadreControllingAuthorityName,
                })
              }, 1000)
            } else {
              contrl.setValue(false)
              this.isCadreStatus = false
            }
          } else if (this.profileFormType === 'Available user filled iGOT profile') {
            this.canShowshowCadreDetails = false
            this.isCadreStatus = false
          } else {
            contrl.setValidators([Validators.required])
            contrl.updateValueAndValidity()
          }
        }
      }
    }
  }

  findAttr(customAttr: any, fName: any) {
    if (fName === 'name') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.personalDetails.firstname')
    }
    if (fName === 'email') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.personalDetails.primaryEmail')
    }
    if (fName === 'organisation') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.employmentDetails.departmentName')
    }
    if (fName === 'group') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.professionalDetails.group')
    }
    if (fName === 'designation') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.professionalDetails.designation')
    }
    if (fName === 'employeeCode') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.employmentDetails.employeeCode')
    }
    if (fName === 'mobile') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.personalDetails.mobile')
    }
    if (fName === 'gender') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.personalDetails.gender')
    }
    if (fName === 'dob') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.personalDetails.dob')
    }
    if (fName === 'domicileMedium') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.personalDetails.domicileMedium')
    }
    if (fName === 'category') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.personalDetails.category')
    }
    if (fName === 'pinCode') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.employmentDetails.pinCode')
    }
    if (fName === 'cadreDetails') {
      return customAttr.find((_field: any) => _field.field === 'profileDetails.cadreDetails.civilServiceType')
    }

  }

  findInProfile(attr: string) {
    if (attr === 'name') {
      return this.userProfileObject.profileDetails.personalDetails.firstName || this.userProfileObject.profileDetails.personalDetails.firstname
    }
    if (attr === 'group') {
      return (!this.userProfileObject.profileDetails.profileGroupStatus) ||
        this.userProfileObject.profileDetails.profileGroupStatus === 'NOT-VERIFIED' || (this.pGroup ? true : false)
    }
    if (attr === 'designation') {
      return (!this.userProfileObject.profileDetails.profileDesignationStatus) ||
        this.userProfileObject.profileDetails.profileDesignationStatus === 'NOT-VERIFIED' || (this.pDesignation ? true : false)
    }
  }

  getGroupData(): void {
    this.addLoader = this.addLoader + 1
    this.userProfileService.getGroups()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.addLoader = this.addLoader - 1
        this.groupData = res.result && res.result.response.filter((ele: any) => ele !== 'Others')
      }, (error: HttpErrorResponse) => {
        this.addLoader = this.addLoader - 1
        if (!error.ok) {
          this.snackBar.open(this.handleTranslateTo('groupDataFaile'))
        }
      })
  }

  handleTranslateTo(menuName: string): string {
    return this.userProfileService.handleTranslateTo(menuName)
  }

  checkSelectedOrgHasDesignations(): void {
    if(this.organisationId) {
      const igotDesignationBody: any = {
        request: {
          filters: {
            status: 'Live',
            category: 'designation',
            categories: [
              this.organisationId + '_odcs_designation',
            ],
            objectType: 'Term',
          },
          fields: ['name'],
          offset: 0,
          limit: 1,
          sort_by: {
            lastUpdatedOn: 'desc',
            objectType: 'Term',
          },
          facets: [],
        },
      };
      this.userProfileService.searchIgotDesignation(igotDesignationBody).subscribe({
        next: (res: any) => {
          const count = _.get(res, 'result.count', 0);
          this.selectedOrgHasDesignations = count > 0;
          this.getdesignationsMeta();
        },
        error: () => {
          this.selectedOrgHasDesignations = false;
          this.getdesignationsMeta();
        }
      });
    } else {
      this.selectedOrgHasDesignations = false;
      this.getdesignationsMeta();
    }
  }

  getdesignationsMeta() {
    this.isLoadingMoreDesignations = true;
    if (this.selectedOrgHasDesignations) {
      this.getIgotDesignations();
    } else {
      this.getDefaultDesignations();
    }
  }

  private getIgotDesignations() {
    const requestBody: any = {
      request: {
        filters: {
          status: "Live",
          category: "designation",
          categories: [
            this.organisationId + '_odcs_designation',
          ],
          objectType: "Term"
        },
        fields: [
          "name"
        ],
        offset: this.designationsOffset,
        limit: this.designationListLoadCount,
        sort_by: {
          lastUpdatedOn: "desc",
          objectType: "Term"
        },
        facets: []
      }
    };
    if(this.designationSearchText){
      requestBody['request']['query'] = this.designationSearchText;
    }
    this.userProfileService.searchIgotDesignation(requestBody).subscribe({
      next: (res: any) => {
        this.isLoadingMoreDesignations = false;
        if(this.designationsOffset === 0) {
          this.designationsMeta = _.get(res, 'result.Term', []) as designation[];
        } else {
          this.designationsMeta = [...this.designationsMeta, ..._.get(res, 'result.Term', []) as designation[]];
        }
        this.designationsTotalCount = _.get(res, 'result.count', 0);
        this.checkCurrentDesignationPresent();
      },
      error: () => {
        this.isLoadingMoreDesignations = false;
        this.openSnackbar('Something went wrong. Please refresh or try again later.');
      }
    });
  }
  
    private getDefaultDesignations() {
      const requestBody: any = {
        filterCriteriaMap: {
          status: 'Active'
        },
        requestedFields: [],
        pageNumber: this.designationsOffset,
        pageSize: this.designationListLoadCount
      }
      if (this.designationSearchText) {
        requestBody['searchString'] = this.designationSearchText
      }
      this.userProfileService.searchDesignation(requestBody).subscribe({
        next: (res: any) => {
          this.isLoadingMoreDesignations = false;
          const content = _.get(res, 'result.result.data', []) as designation[];
          const mapped = content.map((item: any) => ({
            name: item.designation || '',
            status: item.status || 'Active',
          }));
          if (this.designationsOffset === 0) {
            this.designationsMeta = mapped;
          } else {
            this.designationsMeta = [...this.designationsMeta, ...mapped];
          }
          this.designationsTotalCount = _.get(res, 'result.result.totalCount', 0);
          this.checkCurrentDesignationPresent();
        },
        error: () => {
          this.isLoadingMoreDesignations = false;
          this.openSnackbar('Something went wrong. Please refresh or try again later.');
        }
      });
    }

  getMasterLanguage(): void {
    this.userProfileService.getMasterLanguages()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.masterLanguages = res.languages
        this.masterLanguageBackup = res.languages
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.snackBar.open(this.handleTranslateTo('unableFetchMasterLanguageData'))
        }
      })
  }

  handleEmpty(type: string): void {
    if (type === 'mobile') {
      if (this.userProfileObject.profileDetails.personalDetails.mobile && !this.userDetailsForm.controls['mobile'].value) {
        this.userDetailsForm.controls['mobile'].setErrors({ valid: false })
      }
    }
    if (type === 'primaryEmail') {
      if (!this.userProfileObject.profileDetails.personalDetails.primaryEmail && !this.userProfileObject.profileDetails.value['primaryEmail']) {
        this.userDetailsForm.setErrors({ valid: false })
      }
    }
  }
  onSubmitForm(form: any) {
    /* tslint:disable */
    console.log(form)
    let payload = this.generateProfilePayload()
    if ((this.canShowDesignation || this.canShowGroup) && !this.showDoptChanges) {
      if (this.pendingFileds) {
        this.pendingFileds.forEach((_obj: any) => {
          if (Object.keys(_obj).includes('designation')) {
            this.addLoader = this.addLoader + 1
            this.profileV2Svc.withDrawApprovalRequest(this.configSrc.unMappedUser.id, _obj.wfId).subscribe((resp: any) => {
              if (resp && resp.result) {
                this.addLoader = this.addLoader - 1
                /* tslint:disable */
                console.log(resp.result.message)
              }
            }, (error: HttpErrorResponse) => {
              if (error) {
                this.addLoader = this.addLoader - 1
              }
            })
          }
          if (Object.keys(_obj).includes('group')) {
            this.addLoader = this.addLoader + 1
            this.profileV2Svc.withDrawApprovalRequest(this.configSrc.unMappedUser.id, _obj.wfId).subscribe((resp: any) => {
              if (resp && resp.result) {
                this.addLoader = this.addLoader - 1
                /* tslint:disable */
                console.log(resp.result.message)
              }
            }, (error: HttpErrorResponse) => {
              if (error) {
                this.addLoader = this.addLoader - 1
              }
            })
          }
        })
        if (this.userProfileObject.profileDetails.personalDetails.primaryEmail !== this.userDetailsForm.value.primaryEmail && this.canShowEmail) {
          this.updateEmail(this.userDetailsForm.value.primaryEmail)
        }
        this.submitProfile(payload)
      }
    } else {
      if (this.userProfileObject.profileDetails.personalDetails.primaryEmail !== this.userDetailsForm.value.primaryEmail && this.canShowEmail) {
        this.updateEmail(this.userDetailsForm.value.primaryEmail)
      }
      this.submitProfile(payload)
    }
  }

  submitProfile(payload: any) {
    if (payload && payload['request'] && payload['request']['profileDetails'] && payload['request']['profileDetails']['personalDetails'] && payload['request']['profileDetails']['personalDetails']['dob']) {
      let dobFormat = payload['request']['profileDetails']['personalDetails']['dob'];
      let dob = `${new Date(dobFormat).getDate()}-${new Date(dobFormat).getMonth() + 1}-${new Date(dobFormat).getFullYear()}`
      payload['request']['profileDetails']['personalDetails']['dob'] = dob
    }
    if (this.updateProfile) {
      this.addLoader = this.addLoader + 1
      this.userProfileService.editProfileDetails(payload).subscribe((res: any) => {
        this.addLoader = this.addLoader - 1
        if (res.responseCode === 'OK') {
          this.submitSurevy(true)
        }
      }, error => {
        this.addLoader = this.addLoader - 1
        /* tslint:disable */
        console.log(error)
        this.snackBar.open("something went wrong!")
      })
    }
  }

  submitSurevy(status: any) {
    let surevyPayload = {
      formId: _.get(this.data, 'batchData.batchAttributes.profileSurveyId'),
      version: 4,
      status: 'SUBMITTED',
      responses: this.genereateSurveyPayload(status),
      contextId: _.get(this.data, 'batchData.courseId'),
      contextName: _.get(this.data, 'courseName', ''),
    }
    this.addLoader = this.addLoader + 1
    this.npsSvc.submitBpFormWithProfileDetails(surevyPayload).subscribe((resp: any) => {
      this.addLoader = this.addLoader - 1
      if (_.get(resp, 'params.status') === 'success') {
        this.customForm = false
        this.snackBar.open("Form is submitted successfully")
        this.closePopup()
      }
      if (resp && resp.statusCode && resp.statusCode !== 200) {
        this.customForm = false
        this.snackBar.open(resp.errorMessage)
      }
    }, error => {
      this.addLoader = this.addLoader - 1
      /* tslint:disable */
      console.log(error)
      this.snackBar.open("something went wrong!")
    })
  }

  generateProfilePayload() {
    let payload: any = {
      request: {
        userId: this.userProfileObject.identifier,
        profileDetails: {
          employmentDetails: {},
          personalDetails: {},
          // cadreDetails: {},
        }
      }
    }
    let _professionalDetails: any = {}
    let updateProfessionalDetails: boolean = false
    if (this.showGroup && this.userDetailsForm.controls['group'].value && !this.showDoptChanges) {
      _professionalDetails['group'] = this.userDetailsForm.controls['group'].value
      this.updateProfile = true
      updateProfessionalDetails = true
    }
    if (this.showDesignation && this.userDetailsForm.controls['designation'].value && !this.showDoptChanges) {
      _professionalDetails['designation'] = this.userDetailsForm.controls['designation'].value
      this.updateProfile = true
      updateProfessionalDetails = true
    }
    if (updateProfessionalDetails) {
      payload.request.profileDetails['professionalDetails'] = [_professionalDetails]
    }
    if (this.userDetailsForm.controls['employeeCode'].value) {
      payload.request.profileDetails.employmentDetails['employeeCode'] = this.userDetailsForm.controls['employeeCode'].value
      this.updateProfile = true
    }
    if (this.userDetailsForm.controls['mobile'].value) {
      payload.request.profileDetails.personalDetails['mobile'] = this.userDetailsForm.controls['mobile'].value
      payload.request.profileDetails.personalDetails['phoneVerified'] = true
      this.updateProfile = true
    }
    if (this.userDetailsForm.controls['gender'].value) {
      payload.request.profileDetails.personalDetails['gender'] = this.userDetailsForm.controls['gender'].value
      this.updateProfile = true
    }
    if (this.userDetailsForm.controls['dob'].value) {
      payload.request.profileDetails.personalDetails['dob'] = this.userDetailsForm.controls['dob'].value
      this.updateProfile = true
    }
    if (this.userDetailsForm.controls['domicileMedium'].value) {
      payload.request.profileDetails.personalDetails['domicileMedium'] = this.userDetailsForm.controls['domicileMedium'].value
      this.updateProfile = true
    }
    if (this.userDetailsForm.controls['category'].value) {
      payload.request.profileDetails.personalDetails['category'] = this.userDetailsForm.controls['category'].value
      this.updateProfile = true
    }
    if (this.userDetailsForm.controls['pinCode'].value) {
      payload.request.profileDetails.employmentDetails['pinCode'] = this.userDetailsForm.controls['pinCode'].value
      payload.request.profileDetails.personalDetails['pincode'] = this.userDetailsForm.controls['pinCode'].value
      this.updateProfile = true
    }
    if (this.canShowshowCadreDetails && !this.showDoptChanges) {
      let _cadreDetails: any = {}
      payload.request.profileDetails.personalDetails['isCadre'] = this.userDetailsForm.controls['isCadre'].value
      this.updateProfile = true
      if (this.userDetailsForm.controls['isCadre'].value) {
        _cadreDetails['civilServiceType'] = this.userDetailsForm.controls['typeOfCivilService'].value
        _cadreDetails['civilServiceName'] = this.userDetailsForm.controls['serviceType'].value
        _cadreDetails['cadreName'] = this.userDetailsForm.controls['cadreName'].value
        _cadreDetails['cadreBatch'] = this.userDetailsForm.controls['cadreBatch'].value
        _cadreDetails['cadreControllingAuthorityName'] = this.cadreControllingAuthority
        _cadreDetails['cadreId'] = this.cadreId
        _cadreDetails['civilServiceId'] = this.civilServiceId
        _cadreDetails['civilServiceTypeId'] = this.serviceId
        payload.request.profileDetails['cadreDetails'] = _cadreDetails
      }
    }
    return payload
  }

  formatDate(_dob: string | Date): string {
    let dateObj: Date | null = null;
    if (_dob instanceof Date) {
      dateObj = _dob;
    } else if (typeof _dob === 'string') {
      const parts = _dob.split('-');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      } else {
        const parsed = new Date(_dob);
        if (!isNaN(parsed.getTime())) {
          dateObj = parsed;
        }
      }
    }
    if (!dateObj || isNaN(dateObj.getTime())) {
      return '';
    }
    return this.datePipe.transform(dateObj, 'yyyy-MM-dd') || '';
  }

  getQuestionId(fieldName: string): string {
    if (!fieldName || !this.formsDetils.fields) {
      return '';
    }

    const field = this.formsDetils.fields.find((f: any) => f.field === fieldName) || {};
    return field.id || '';
  }

  genereateSurveyPayload(status: any) {
    let dataObject: any = []
    this.batchDetails.batchAttributes.bpEnrolMandatoryProfileFields.forEach((_field: any) => {
      const fieldToAdd = {
        questionId: this.getQuestionId(_field.field),
        question: _field.displayName,
        answer: '',
        answerType: _field.fieldType
      }
      if (_field.field === 'profileDetails.personalDetails.firstname') {
        fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.personalDetails.firstName', _.get(this.userProfileObject, 'profileDetails.personalDetails.firstname', ''))
        dataObject.push(fieldToAdd)
        // dataObject[_field.name] = this.userProfileObject.profileDetails.personalDetails.firstName || this.userProfileObject.profileDetails.personalDetails.firstname
      }
      if (_field.field === 'profileDetails.employmentDetails.departmentName') {
        fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.employmentDetails.departmentName', 'N/A')
        dataObject.push(fieldToAdd)
        // dataObject[_field.name] = this.userProfileObject.profileDetails.employmentDetails && this.userProfileObject.profileDetails.employmentDetails.departmentName ?
        //   this.userProfileObject.profileDetails.employmentDetails.departmentName : "N/A"
      }
      if (_field.field === 'profileDetails.professionalDetails.group') {
        if (this.showGroup && status) {
          fieldToAdd.answer = this.userDetailsForm.controls['group'].value
          // dataObject[_field.name] = this.userDetailsForm.controls['group'].value
        } else {
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.professionalDetails[0].group', 'N/A')
          // dataObject[_field.name] = this.userProfileObject.profileDetails.professionalDetails && this.userProfileObject.profileDetails.professionalDetails[0].group ?
          //   this.userProfileObject.profileDetails.professionalDetails[0].group : "N/A"
        }
        dataObject.push(fieldToAdd)
      }
      if (_field.field === 'profileDetails.professionalDetails.designation') {
        if (this.showDesignation && status) {
          if (this.showDoptChanges && this.userDetailsForm.controls['designation'] &&
            this.userDetailsForm.controls['designation'].value === 'Others' && this.userDetailsForm.controls['otherDesignation']) {
            // dataObject[_field.name] = this.userDetailsForm.controls['otherDesignation'].value
            fieldToAdd.answer = this.userDetailsForm.controls['otherDesignation'].value
          } else {
            // dataObject[_field.name] = this.userDetailsForm.controls['designation'].value
            fieldToAdd.answer = this.userDetailsForm.controls['designation'].value
          }
          dataObject.push(fieldToAdd)
        } else {
          // dataObject[_field.name] = this.userProfileObject.profileDetails.professionalDetails && this.userProfileObject.profileDetails.professionalDetails[0].designation ?
          //   this.userProfileObject.profileDetails.professionalDetails[0].designation : "N/A"
            fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.professionalDetails[0].designation', 'N/A')
            dataObject.push(fieldToAdd)
        }
      }

      if (_field.field === 'profileDetails.employmentDetails.employeeCode') {
        if (this.showEmployeeCode && status) {
          // dataObject[_field.name] = this.userDetailsForm.controls['employeeCode'].value
          fieldToAdd.answer = this.userDetailsForm.controls['employeeCode'].value
        } else {
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.employmentDetails.employeeCode', 'N/A')
          // dataObject[_field.name] = this.userProfileObject.profileDetails.employmentDetails && this.userProfileObject.profileDetails.employmentDetails.employeeCode ?
          //   this.userProfileObject.profileDetails.employmentDetails.employeeCode : "N/A"
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.personalDetails.primaryEmail') {
        fieldToAdd.answer = this.userProfileObject.profileDetails.personalDetails.primaryEmail
        dataObject.push(fieldToAdd)
        // dataObject[_field.name] = this.userProfileObject.profileDetails.personalDetails.primaryEmail
      }

      if (_field.field === 'profileDetails.personalDetails.mobile') {
        if (this.showMobile && status) {
          fieldToAdd.answer = this.userDetailsForm.controls['mobile'].value
          // dataObject[_field.name] = this.userDetailsForm.controls['mobile'].value
        } else {
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.personalDetails.mobile', 'N/A')
          // dataObject[_field.name] = this.userProfileObject.profileDetails.personalDetails && this.userProfileObject.profileDetails.personalDetails.mobile ?
          //   this.userProfileObject.profileDetails.personalDetails.mobile : "N/A"
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.personalDetails.dob') {
        if (this.showDob && status) {
          let _dob: any = this.userDetailsForm.controls['dob'].value
          // dataObject[_field.name] = this.formatDate(_dob)
          fieldToAdd.answer = this.formatDate(_dob)
          dataObject.push(fieldToAdd)
        } else {
          if (this.userProfileObject.profileDetails.personalDetails && this.userProfileObject.profileDetails.personalDetails.dob) {
            let _dob: any = this.userProfileObject.profileDetails.personalDetails.dob
            const [day, month, year] = _dob.split('-')
            const date = new Date(Number(year), Number(month) - 1, Number(day))
            const formattedDay = String(date.getDate()).padStart(2, '0')
            const formattedMonth = String(date.getMonth() + 1).padStart(2, '0')
            const formattedYear = date.getFullYear()
            // dataObject[_field.name] = `${formattedYear}-${formattedMonth}-${formattedDay}`
            fieldToAdd.answer = `${formattedYear}-${formattedMonth}-${formattedDay}`
          } else {
            // dataObject[_field.name] = "1950-06-01"
            fieldToAdd.answer = "1950-06-01"
          }
          dataObject.push(fieldToAdd)
        }
      }

      if (_field.field === 'profileDetails.personalDetails.gender') {
        if (this.showGender && status) {
          fieldToAdd.answer = this.userDetailsForm.controls['gender'].value
          // dataObject[_field.name] = this.userDetailsForm.controls['gender'].value
        } else {
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.personalDetails.gender', 'N/A')
          // dataObject[_field.name] = this.userProfileObject.profileDetails.personalDetails && this.userProfileObject.profileDetails.personalDetails.gender ?
          //   this.userProfileObject.profileDetails.personalDetails.gender : "N/A"
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.personalDetails.domicileMedium') {
        if (this.showDecimalMedium && status) {
          // dataObject[_field.name] = this.userDetailsForm.controls['domicileMedium'].value
          fieldToAdd.answer = this.userDetailsForm.controls['domicileMedium'].value
        } else {
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.personalDetails.domicileMedium', 'N/A')
          // dataObject[_field.name] = this.userProfileObject.profileDetails.personalDetails && this.userProfileObject.profileDetails.personalDetails.domicileMedium ?
          //   this.userProfileObject.profileDetails.personalDetails.domicileMedium : "N/A"
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.personalDetails.category') {
        if (this.showCategory && status) {
          fieldToAdd.answer = this.userDetailsForm.controls['category'].value
          // dataObject[_field.name] = this.userDetailsForm.controls['category'].value
        } else {
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.personalDetails.category', 'N/A')
          // dataObject[_field.name] = this.userProfileObject.profileDetails.personalDetails && this.userProfileObject.profileDetails.personalDetails.category ?
          //   this.userProfileObject.profileDetails.personalDetails.category : "N/A"
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.employmentDetails.pinCode') {
        if (this.showPinCode && status) {
          fieldToAdd.answer = this.userDetailsForm.controls['pinCode'].value
          // dataObject[_field.name] = this.userDetailsForm.controls['pinCode'].value
        } else {
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.employmentDetails.pinCode', 'N/A')
          // dataObject[_field.name] = this.userProfileObject.profileDetails.employmentDetails && this.userProfileObject.profileDetails.employmentDetails.pinCode ?
          //   this.userProfileObject.profileDetails.employmentDetails.pinCode : "N/A"
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.cadreDetails') {
        if (this.canShowshowCadreDetails && this.userDetailsForm.controls['isCadre'].value && status) {
          // dataObject[_field.name] = this.userDetailsForm.controls['isCadre'].value
          fieldToAdd.answer = this.userDetailsForm.controls['isCadre'].value
        } else {
          // dataObject[_field.name] = this.userProfileObject.profileDetails &&
          //   this.userProfileObject.profileDetails.personalDetails.isCadre ? 'Yes' : 'No'
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.personalDetails.isCadre') ? 'Yes' : 'No'
        }
        dataObject.push(fieldToAdd)
      }
      if (_field.field === 'profileDetails.cadreDetails.civilServiceType') {
        if (this.canShowshowCadreDetails && this.userDetailsForm.controls['isCadre'].value && status) {
          // dataObject[_field.name] = this.userDetailsForm.controls['typeOfCivilService'].value
          fieldToAdd.answer = this.userDetailsForm.controls['typeOfCivilService'].value
        } else {
          // dataObject[_field.name] = this.userProfileObject.profileDetails.cadreDetails && this.userProfileObject.profileDetails.cadreDetails.civilServiceType ?
          //   this.userProfileObject.profileDetails.cadreDetails.civilServiceType : 'N/A'
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.cadreDetails.civilServiceType', 'N/A')
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.cadreDetails.civilServiceName') {
        if (this.canShowshowCadreDetails && this.userDetailsForm.controls['isCadre'].value && status) {
          // dataObject[_field.name] = this.userDetailsForm.controls['serviceType'].value
          fieldToAdd.answer = this.userDetailsForm.controls['serviceType'].value
        } else {
          // dataObject[_field.name] = this.userProfileObject.profileDetails.cadreDetails && this.userProfileObject.profileDetails.cadreDetails.civilServiceName ?
          //   this.userProfileObject.profileDetails.cadreDetails.civilServiceName : 'N/A'
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.cadreDetails.civilServiceName', 'N/A')
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.cadreDetails.cadreName') {
        if (this.canShowshowCadreDetails && this.userDetailsForm.controls['isCadre'].value && status) {
          // dataObject[_field.name] = this.userDetailsForm.controls['cadreName'].value
          fieldToAdd.answer = this.userDetailsForm.controls['cadreName'].value
        } else {
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.cadreDetails.cadreName', 'N/A')
          // dataObject[_field.name] = this.userProfileObject.profileDetails.cadreDetails && this.userProfileObject.profileDetails.cadreDetails.cadreName ?
          //   this.userProfileObject.profileDetails.cadreDetails.cadreName : 'N/A'
        }
        dataObject.push(fieldToAdd)
      }
      if (_field.field === 'profileDetails.cadreDetails.cadreBatch') {
        if (this.canShowshowCadreDetails && this.userDetailsForm.controls['isCadre'].value && status) {
          // dataObject[_field.name] = this.userDetailsForm.controls['cadreBatch'].value
          fieldToAdd.answer = this.userDetailsForm.controls['cadreBatch'].value
        } else {
          // dataObject[_field.name] = this.userProfileObject.profileDetails.cadreDetails && this.userProfileObject.profileDetails.cadreDetails.cadreBatch ?
          //   JSON.stringify(this.userProfileObject.profileDetails.cadreDetails.cadreBatch) : 'N/A'
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.cadreDetails.cadreBatch') ? JSON.stringify(this.userProfileObject.profileDetails.cadreDetails.cadreBatch) : 'N/A'
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.cadreDetails.cadreControllingAuthorityName') {
        if (this.canShowshowCadreDetails && this.userDetailsForm.controls['isCadre'].value && status) {
          // dataObject[_field.name] = this.cadreControllingAuthority
          fieldToAdd.answer = this.cadreControllingAuthority
        } else {
          // dataObject[_field.name] = this.userProfileObject.profileDetails.cadreDetails && this.userProfileObject.profileDetails.cadreDetails.cadreControllingAuthorityName ?
          //   this.userProfileObject.profileDetails.cadreDetails.cadreControllingAuthorityName : 'N/A'
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.cadreDetails.cadreControllingAuthorityName', 'N/A')
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.additionalProperties.externalSystemId') {
        if (this.userProfileObject.profileDetails.additionalProperties &&
          this.userProfileObject.profileDetails.additionalProperties.externalSystemId) {
          // dataObject[_field.name] = this.userProfileObject.profileDetails.additionalProperties && this.userProfileObject.profileDetails.additionalProperties.externalSystemId
          //   ? this.userProfileObject.profileDetails.additionalProperties.externalSystemId : "N/A"
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.additionalProperties.externalSystemId', 'N/A')
        } else {
          dataObject[_field.name] = 'N/A'
        }
        dataObject.push(fieldToAdd)
      }

      if (_field.field === 'profileDetails.additionalProperties.externalSystemDor') {
        if (this.userProfileObject.profileDetails.additionalProperties &&
          this.userProfileObject.profileDetails.additionalProperties.externalSystemDor) {
          // dataObject[_field.name] = this.userProfileObject.profileDetails.additionalProperties && this.userProfileObject.profileDetails.additionalProperties.externalSystemDor
          //   ? this.userProfileObject.profileDetails.additionalProperties.externalSystemDor : "N/A"
          fieldToAdd.answer = _.get(this.userProfileObject, 'profileDetails.additionalProperties.externalSystemDor', 'N/A')
        } else {
          // dataObject[_field.name] = 'N/A'
          fieldToAdd.answer = 'N/A'
        }
        dataObject.push(fieldToAdd)
      }
    })

    return dataObject
  }

  updateEmail(email: string): void {
    const postData = {
      request: {
        'userId': this.configSrc.unMappedUser.id,
        'contextToken': this.contextToken,
        'profileDetails': {
          'personalDetails': {
            'primaryEmail': email,
          },
        },
      },
    }

    this.addLoader = this.addLoader + 1
    this.userProfileService.updatePrimaryEmailDetails(postData)
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((_res: any) => {
        this.addLoader = this.addLoader - 1
        this.userProfileObject.profileDetails.personalDetails.primaryEmail = email
        this.snackBar.open(this.handleTranslateTo('emailUpdated'))
      }, (error: HttpErrorResponse) => {
        this.addLoader = this.addLoader - 1
        if (!error.ok) {
          this.snackBar.open(this.handleTranslateTo('updateEmailFailed'))
        }
      })
  }

  setupScrollListener(opened: boolean): void {
    const searchDesignationControl = this.userDetailsForm.get('searchDesignation');
    if (opened && searchDesignationControl) {
      searchDesignationControl.setValue('')
      this.designationsOffset = 0
      this.designationsMeta = [];
      this.getdesignationsMeta()
      const searchInput = document.querySelector('.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
      const panel = document.querySelector('.mat-select-panel');
      if (panel) {
        panel.addEventListener('scroll', this.onDesignationSelectScroll.bind(this));
      }
    }
  }

  onDesignationSelectScroll(event: any): void {
    const element = event.target;
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoreDesignations && this.designationsMeta.length < this.designationsTotalCount) {
          this.isLoadingMoreDesignations = true;
          this.designationsOffset += 1;
          this.getdesignationsMeta()
        }
      }
  }

  checkCurrentDesignationPresent() {
    // Get the current designation value
    const searchDesignationControl = this.userDetailsForm.get('designation');
    const currentDesignation = searchDesignationControl ? searchDesignationControl.value : '';
    // Check if current designation exists in the list
    if (currentDesignation) {
      const designationExists = this.designationsMeta.some(
        (designation: any) => designation.name.toLowerCase() === currentDesignation.toLowerCase()
      );

      // If designation doesn't exist in the list, add it
      if (!designationExists) {
        // Create a new designation object to match the structure of other items
        const newDesignation = {
          name: currentDesignation,
          status: 'Active'
        };
        this.designationsMeta.unshift(newDesignation);
      }
    }
  }

  onDesignationDropdownClosed(): void {
    const searchDesignationControl = this.userDetailsForm.get('searchDesignation');
    if (searchDesignationControl) {
      searchDesignationControl.setValue('')
      this.designationSearchText = ''
    }
    this.checkCurrentDesignationPresent()
  }

}
