import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef, MAT_LEGACY_DIALOG_DATA, MatLegacyDialog } from '@angular/material/legacy-dialog';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EMAIL_PATTERN, EMP_ID_PATTERN, IMAGE_SIZE_1MB, MOBILE_PATTERN, PIN_CODE_PATTERN, state } from '../../models/profile-revamp.model';
import { ProfileV2RevampService } from '../../services/profile-v2-revamp.service';
import { ConfirmDialogComponent } from '@sunbird-cb/collection/src/lib/_common/confirm-dialog/confirm-dialog.component'
import { OtpService } from '../../../user-profile/services/otp.services';
import { VerifyOtpComponent } from '../../components/verify-otp/verify-otp.component'
import { RejectionReasonPopupComponent } from '../../components/rejection-reason-popup/rejection-reason-popup.component'
import { WithdrawRequestComponent } from '../../components/withdraw-request/withdraw-request.component'
import { NsUserProfileDetails } from '../../../user-profile/models/NsUserProfile'
import { DatePipe, Location } from '@angular/common';
import { ConfigurationsService, ImageCropComponent, PipeCertificateImageURL } from '@sunbird-cb/utils-v2';
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { PROFILE_IMAGE_SUPPORT_TYPES } from '@ws/author/src/lib/constants/upload'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage';
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant';
import { UserProfileService } from '../../../user-profile/services/user-profile.service';
import { TranslateService } from '@ngx-translate/core';
// import { Router } from '@angular/router';


@Component({  
  selector: 'ws-app-prfile-edit-v2',
  templateUrl: './prfile-edit-v2.component.html',
  styleUrls: ['./prfile-edit-v2.component.scss']
})

export class PrfileEditV2Component implements OnInit, OnDestroy {
  header = '';
  profileDetails: any;
  profileForm!: FormGroup;
  currentDate: Date = new Date();
  initilisationInProgress = true;

  orgHasDesignations = false;

  profileImage: string | null = null;
  profileImageChanged = false;
  userInitials = '';
  statesList: state[] = [];
  districtsList: string[] = [];

  groupsList: any[] = [];
  designationsMeta: any[] = [];
  designationsTotalCount = 0
  designationSearchText = ''
  designationsOffset = 0
  filterDesignationsMeta: any = []
  isLoadingMoreDesignations = false;
  designationListLoadCount = 50

  // Transfer Organization properties
  transferOrganizationData: any[] = []
  transferOrgFilterData: any[] = []
  transferOrgListLoadCount = 20
  transferOrgDefaultLoadCount = 20
  isLoadingMoreTransferOrg = false
  transferOrgDataTotalCount = 0
  selectedTransferOrgId: string = ''

  verifyEmail: boolean = false;
  verifyMobile: boolean = false;
  approvedDomainList: any = []
  destroySubject$ = new Subject()
  contextToken: any
  eUserGender = Object.keys(NsUserProfileDetails.EUserGender)
  eCategory = Object.keys(NsUserProfileDetails.ECategory)
  masterLanguageBackup: any[] = [];
  masterLanguages: any[] = [];
  isMatcompleteOpened = false
  isCadreStatus = false
  showBatchForNoCadre = true
  civilServiceTypeId = '';
  civilServiceId = '';
  cadreId = '';
  noCadreDetails = true
  civilServiceData: any
  civilServiceTypes: any[] = []
  serviceType: any
  serviceListData: any
  serviceNamesList: any
  serviceId: any
  yearArray: any = []
  selectedServiceName: any
  selectedService: any
  civilServiceName: any
  cadreList: any[] = []
  cadreControllingAuthority: any
  startBatch: any;
  endBatch: any;
  exclusionYear: any;
  selectedCadreName: any;
  selectedCadre: any;
  nodalEmail: string = ''
  nodalName: string = ''

  // Approval status properties for Mandatory Section
  groupApprovedTime = 0
  designationApprovedTime = 0
  organizationApprovedTime = 0
  panelOpenState = false
  isIgotOrg = false
  isNotMyUser = false
  enableWTR = false
  enableWR = false
  approvalPendingFields: any[] = []
  submitbtnLoading: boolean = false


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatLegacyDialogRef<PrfileEditV2Component>,
    @Inject(MAT_LEGACY_DIALOG_DATA) public data: any,
    private profileV2RevampService: ProfileV2RevampService,
    private snackBar: MatLegacySnackBar,
    private otpService: OtpService,
    private dialog: MatLegacyDialog,
    private datePipe: DatePipe,
    private pipeImgUrl: PipeCertificateImageURL,
    private userProfileService: UserProfileService,
    private configSvc: ConfigurationsService,
    private translate: TranslateService,
    // private router: Router,
    private location: Location
  ) {
    
    // Handle both data structures - direct and wrapped in dialogDetails
    const hasDialogDetails = this.data && this.data.hasOwnProperty('dialogDetails');
    
    this.header = hasDialogDetails ? _.get(this.data, 'dialogDetails.header', '') : _.get(this.data, 'header', '');
    this.profileDetails = hasDialogDetails ? _.get(this.data, 'dialogDetails.profileDetails', {}) : _.get(this.data, 'profileDetails', {});
    this.profileImage = hasDialogDetails ? _.get(this.data, 'dialogDetails.profileImage', null) : _.get(this.data, 'profileImage', null);
    
    // groupsList can come from either location
    this.groupsList = _.get(this.data, 'groupsList', []);
    if (!this.groupsList.length && hasDialogDetails) {
      this.groupsList = _.get(this.data, 'dialogDetails.groupsList', []);
    }
    
    // These fields are always at the top level when passed from openProfileEditDialog or handleEditMandatoryDetails
    this.enableWTR = _.get(this.data, 'enableWTR', false);
    this.enableWR = _.get(this.data, 'enableWR', false);
    this.approvalPendingFields = _.get(this.data, 'approvalPendingFields', []);
   
  }

  ngOnInit(): void {
    this.initForm();
    this.loadDynamicEmail();
    if (this.header === 'Mandatory Section') {
      this.getApprovedFields();
      this.isNotMyUser = _.get(this.configSvc, 'unMappedUser.profileDetails.profileStatus', '').toLowerCase() === 'not-my-user' ? true : false;
      this.isIgotOrg = _.get(this.configSvc, 'unMappedUser.profileDetails.employmentDetails.departmentName', '').toLowerCase() === 'igot' ? true : false;
    }
  }

loadDynamicEmail() {
  const rootOrgId = _.get(this.configSvc, 'userProfile.rootOrgId', '')
  const tryRoles = ['MDO_LEADER', 'MDO_ADMIN']
  let roleIdx = 0

  const fetchEmailByRole = (role: string) => {
    this.profileV2RevampService.fetchNodalDetails(rootOrgId, role).subscribe(res => {
      if (res?.result?.response?.content?.length) {
        const nodalPerson = res.result.response.content[0]
        this.nodalEmail = nodalPerson?.profileDetails?.personalDetails?.primaryEmail || this.nodalEmail
        this.nodalName = nodalPerson?.firstName
        this.getDesignationHint()
      } else if (roleIdx === 0) {
        // If MDO_LEADER failed and this was the first attempt, try MDO_ADMIN
        roleIdx++
        fetchEmailByRole(tryRoles[roleIdx])
      }
    },
    _err => {
      if (roleIdx === 0) {
        roleIdx++
        fetchEmailByRole(tryRoles[roleIdx])
      }
      // If second role also errors, keep defaults (do nothing)
    })
  }

  fetchEmailByRole(tryRoles[roleIdx])
}


getDesignationHint(): string {
  const translatedString = this.translate.instant('NetworkV2Profile.designationHint')
  return translatedString
    .replace('%EMAIL%', `<span class="note-email">${this.nodalEmail}</span>`)
    .replace('%NAME%', `<b>(${this.nodalName})</b>`);
}


  private initForm(): void {
    switch (this.header) {
      case 'Profile':
        this.createProfileForm();
        this.getInitials();
        this.getStatesList();
        break;
      case 'Primary Details':
        this.createPrimaryDetailsForm();
        this.checkOrgHasDesignations();
        // this.getdesignationsMeta();
        break;
      case 'Mandatory Section':
        this.createMandatoryDetailsForm();
        this.checkOrgHasDesignations();
        // this.getdesignationsMeta();
        break;
      case 'About Me':
        this.createAboutMeForm();
        break;
      case 'Other Details':
        this.createOtherDetailsForm();
        break;
      default:
        this.profileForm = this.fb.group({});
    }
  }

  //#region (profile)
  private createProfileForm(): void {
    this.profileImage = _.get(this.profileDetails, 'profileImage', null);
    this.profileForm = this.fb.group({
      firstname: [_.get(this.profileDetails, 'firstname', ''), [Validators.required, Validators.pattern(/^(?! )[a-zA-Z]+(?: [a-zA-Z]+)*(?<! )$/), Validators.maxLength(200), Validators.minLength(2)]],
      state: [_.get(this.profileDetails, 'state', '')],
      district: [_.get(this.profileDetails, 'district', '')]
    });
    setTimeout(() => {
      this.initilisationInProgress = false;
    }, 10)
  }

  getInitials(): void {
    const userName = _.get(this.profileDetails, 'firstname', '');
    if (userName) {
      if (userName.split(' ').length > 1) {
        const nameArr = userName.split(' ')
        this.userInitials = nameArr[0].charAt(0) + nameArr[1].charAt(0)
      } else {
        this.userInitials = userName.charAt(0)
      }
    }
  }

  getStatesList() {
    this.profileV2RevampService.getStatesList().subscribe({
      next: (res: any) => {
        this.statesList = _.get(res, 'result.statesList', []) as state[];
        if (_.get(this.profileDetails, 'state', '')) {
          const stateControl = this.profileForm ? this.profileForm.get('state') : null;
          if (stateControl) {
            stateControl.patchValue(_.get(this.profileDetails, 'state', ''));
          }
          this.getDistrictsList(_.get(this.profileDetails, 'state', ''), true);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.statesList = [];
        this.openSnackbar(_.get(err, 'error.params.errmsg', 'Something went wrong'));
      }
    })
  }

  getDistrictsList(state: string, isFirstTime: boolean = false) {
    this.profileV2RevampService.getDistrictsList(state).subscribe({
      next: (res: any) => {
        this.districtsList = _.get(res, 'result.districtsList[0].districts', []) as string[];
        const districtControl = this.profileForm ? this.profileForm.get('district') : null;
        if (districtControl) {
          if (isFirstTime) {
            districtControl.patchValue(_.get(this.profileDetails, 'district', ''));
          } else {
            districtControl.patchValue('');
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.districtsList = [];
        this.openSnackbar(_.get(err, 'error.params.errmsg', 'Something went wrong'));
      }
    })
  }

  get customNameValidation(): string {
    const userName = this.profileForm.get('firstname');
    if (userName && userName.value) {
      if (/[@#$%^&*()_+={}[\]|\\:;"<>?,./~`]/.test(userName.value) && /\d/.test(userName.value)) {
        return 'NetworkV2Profile.invalidNameFormat';
      } else if (!userName.value.trim()) {
        return 'NetworkV2Profile.nameIsRequired';
      } else if (/^\s|\s$/.test(userName.value)) {
        return 'NetworkV2Profile.nameCannotStartOrEndWithSpace';
      } else if (/^[-']|[-']$/.test(userName.value) || /[@#$%^&*()_+={}[\]|\\:;"<>?,./~`]/.test(userName.value)) {
        return 'NetworkV2Profile.specialCharNotAllowedInName';
      } else if (/\d/.test(userName.value)) {
        return 'NetworkV2Profile.nameCannotContainNumbers';
      } else if (/(\s{2,}|[-']{2,})/.test(userName.value)) {
        return 'NetworkV2Profile.pleaseAvoidMultipleSpaces';
      }
    }
    return 'NetworkV2Profile.invalidNameFormat'
  }


  //#region (profile image)

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
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.INVALID_IMG_FORMAT,
          },
          duration: NOTIFICATION_TIME * 1500,
        })
        return
      }
  
      if (file.size > IMAGE_SIZE_1MB * 2) {
        this.openSnackbar(this.handleTranslateTo('profileImageSizeLimit'))
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
            const reader = new FileReader();
            reader.onload = () => {
              this.genrateProfileImageUrl(result, fileName);
            };
            reader.readAsDataURL(result);
          }
        },
      })
    }

  genrateProfileImageUrl(file: any, fileName?: string) {
    if(file) {
      const formdata = new FormData()
      formdata.append('data', file, fileName)
      this.profileV2RevampService.updateProfilePic(formdata).subscribe({
        next: (res: any) => {
          const createdUrl = _.get(res, 'result.url', '')
          const folderNameToSplit = '/profileImage/'
          const urlSplice = createdUrl.split(folderNameToSplit)[1]
          this.profileImage = this.pipeImgUrl.transform(`${folderNameToSplit}${urlSplice}`)
          this.profileImageChanged = true
        }
      })
    }
  }
  uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      this.handleUploadProfileImg(file);
    };
    input.click();
  }

  deleteImage() {
    this.profileImage = '';
    this.profileImageChanged = true
  }
  //#endregion (end of profile image)
  //#endregion (profile)

  //#region (primary details)
  private createPrimaryDetailsForm(): void {
    this.profileForm = this.fb.group({
      group: [_.get(this.profileDetails, 'group', ''), Validators.required],
      designation: [_.get(this.profileDetails, 'designation', ''), Validators.required],
      searchDesignation: [''],
    });
    this.checkCurrentDesignationPresent();
    setTimeout(() => {
      this.initilisationInProgress = false;
    }, 10)
    const searchDesignationControl = this.profileForm.get('searchDesignation');
    if (searchDesignationControl) {
      let settingValueChange = true
      searchDesignationControl.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(searchText => {
          this.designationsOffset = 0
          if (searchText && searchText.length > 1) {
            this.designationSearchText = searchText // to avoid api call with single character
            this.getdesignationsMeta()
          } else if(!searchText) {
            if(!settingValueChange) {
              this.designationSearchText = searchText
              this.getdesignationsMeta() 
            }
            this.checkCurrentDesignationPresent()
          }
          settingValueChange = false
        })
    }
  }

  checkOrgHasDesignations(): void {
    const igotDesignationBody: any = {
      request: {
        filters: {
          status: 'Live',
          category: 'designation',
          categories: [
            _.get(this.configSvc, 'userProfile.rootOrgId', '') + '_odcs_designation'
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
    this.profileV2RevampService.searchIgotDesignation(igotDesignationBody).subscribe({
      next: (res: any) => {
        const count = _.get(res, 'result.count', 0);
        this.orgHasDesignations = count > 0;
        this.getdesignationsMeta();
      },
      error: () => {
        this.orgHasDesignations = false;
        this.getdesignationsMeta();
      }
    });
  }

  getdesignationsMeta() {
    this.isLoadingMoreDesignations = true;
    if (this.header === 'Mandatory Section') {
        this.getDefaultDesignations();
    } else {
      if (this.orgHasDesignations) {
        this.getIgotDesignations();
      } else {
        this.getDefaultDesignations();
      }
    }
  }

  setDesignationResults(data: any[], totalCount: number) {
    if (this.designationsOffset === 0) {
      this.designationsMeta = data;
    } else {
      this.designationsMeta = [...this.designationsMeta, ...data];
    }
    this.designationsTotalCount = totalCount;
    this.isLoadingMoreDesignations = false;
    this.checkCurrentDesignationPresent();
  }

  getIgotDesignations() {
    const igotDesignationBody: any = {
      request: {
        filters: {
          status: 'Live',
          category: 'designation',
          categories: [
            _.get(this.configSvc, 'userProfile.rootOrgId', '') + '_odcs_designation'
          ],
          objectType: 'Term',
        },
        fields: ['name'],
        offset: this.designationsOffset,
        limit: this.designationListLoadCount,
        sort_by: {
          lastUpdatedOn: 'desc',
          objectType: 'Term',
        },
        facets: [],
      },
    };
    if (this.designationSearchText) {
      igotDesignationBody['request']['query'] = this.designationSearchText;
    }
    this.profileV2RevampService.searchIgotDesignation(igotDesignationBody).subscribe({
      next: (res: any) => {
        const igotData = _.get(res, 'result.Term', []);
        const data = igotData.map((item: any) => ({ designation: item.name, status: 'Active' }));
        const totalCount = _.get(res, 'result.count', igotData.length);
        this.setDesignationResults(data, totalCount);
      },
      error: () => {
        this.isLoadingMoreDesignations = false;
        this.openSnackbar('Something went wrong. Please refresh or try again later.');
      },
    });
  }

  getDefaultDesignations() {
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
    this.profileV2RevampService.searchDesignation(requestBody).subscribe({
      next: (res: any) => {
        const data = _.get(res, 'result.result.data', []);
        const totalCount = _.get(res, 'result.result.totalCount', 0);
        this.setDesignationResults(data, totalCount);
      },
      error: () => {
        this.isLoadingMoreDesignations = false;
        this.openSnackbar('Something went wrong. Please refresh or try again later.')
      }
    })
  }

  setupScrollListener(opened: boolean): void {
    const searchDesignationControl = this.profileForm.get('searchDesignation');
    if (opened && searchDesignationControl) {
      searchDesignationControl.setValue('')
      this.designationsOffset = 0
      this.getdesignationsMeta()
      const searchInput = document.querySelector('.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
      this.checkCurrentDesignationPresent()
      const panel = document.querySelector('.mat-select-panel');
      if (panel) {
        // Add scroll event listener to the panel
        panel.addEventListener('scroll', this.onDesignationSelectScroll.bind(this));
      }
    }
  }

  onDesignationSelectScroll(event: any): void {
    const element = event.target;

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
    const searchDesignationControl = this.profileForm.get('designation');
    const currentDesignation = searchDesignationControl ? searchDesignationControl.value : '';
    // Check if current designation exists in the list
    if (currentDesignation) {
      const designationExists = this.designationsMeta.some(
        (designation: any) => designation.designation.toLowerCase() === currentDesignation.toLowerCase()
      );

      // If designation doesn't exist in the list, add it
      if (!designationExists) {
        // Create a new designation object to match the structure of other items
        const newDesignation = {
          designation: currentDesignation,
          status: 'Active'
        };
        this.designationsMeta.unshift(newDesignation);
      }
    }
  }

  onDesignationDropdownClosed(): void {
    const searchDesignationControl = this.profileForm.get('searchDesignation');
    if (searchDesignationControl) {
      searchDesignationControl.setValue('')
      this.designationSearchText = ''
    }
    this.checkCurrentDesignationPresent()
  }

  // #endregion (end of primary details)

  private createAboutMeForm(): void {
    this.profileForm = this.fb.group({
      aboutme: [_.get(this.profileDetails, 'aboutme', ''), [Validators.maxLength(2000)]]
    });
    setTimeout(() => {
      this.initilisationInProgress = false;
    }, 10)
  }

  //#region (other details)
  private createOtherDetailsForm(): void {
    const dob = _.get(this.profileDetails, 'dob', '');
    this.profileForm = this.fb.group({
      employeeCode: [_.get(this.profileDetails, 'employeeCode', ''), [Validators.pattern(EMP_ID_PATTERN)]],
      primaryEmail: [_.get(this.profileDetails, 'primaryEmail', ''), [Validators.pattern(EMAIL_PATTERN)]],
      gender: [_.get(this.profileDetails, 'gender', ''), []],
      dob: [dob ? new Date(dob) : '', []],
      category: [_.get(this.profileDetails, 'category', ''), []],
      pinCode: [_.get(this.profileDetails, 'pinCode', ''), [Validators.minLength(6), Validators.maxLength(6), Validators.pattern(PIN_CODE_PATTERN)]],
      mobile: [_.get(this.profileDetails, 'mobile', ''), [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(MOBILE_PATTERN)]],
      domicileMedium: [_.get(this.profileDetails, 'domicileMedium', ''), []],
      isCadre: [_.get(this.profileDetails, 'isCadre')],
      civilServiceType: [_.get(this.profileDetails, 'civilServiceType', ''), []],
      civilServiceName: [_.get(this.profileDetails, 'civilServiceName', ''), []],
      cadreName: [_.get(this.profileDetails, 'cadreName', ''), []],
      cadreBatch: [_.get(this.profileDetails, 'cadreBatch', ''), []],
      cadreControllingAuthorityName: [_.get(this.profileDetails, 'cadreControllingAuthorityName', ''), []],
      isOnCentralDeputation: [_.get(this.profileDetails, 'isOnCentralDeputation', false), []],
    });
    this.civilServiceTypeId = _.get(this.profileDetails, 'civilServiceTypeId', '');
    this.civilServiceId = _.get(this.profileDetails, 'civilServiceId', '');
    this.cadreId = _.get(this.profileDetails, 'cadreId', '');
    this.cadreControllingAuthority = _.get(this.profileDetails, 'cadreControllingAuthorityName', '');
    this.isCadreStatus = _.get(this.profileDetails, 'isCadre', false);

    this.fetchCadreData();
    this.getMasterLanguage();
    this.valueCahngeMethosdsForOtherDetails();
    setTimeout(() => {
      this.initilisationInProgress = false;
    }, 10)
  }

  fetchCadreData() {
    if (!this.profileDetails.hasOwnProperty('cadreDetails')) {
      this.noCadreDetails = true
      // this.saveChanges = true
    } else if (this.profileDetails.cadreDetails == null) {
      this.noCadreDetails = false
    }
    else {
      this.noCadreDetails = true
    }
    const cadreControllingAuthorityControl = this.profileForm.get('cadreControllingAuthority')

    if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }
    this.profileV2RevampService.fetchCadre().subscribe({
      next: response => {
        this.civilServiceData = _.get(response, 'result.response.value.civilServiceType')
        this.civilServiceTypes = _.get(this.civilServiceData, 'civilServiceTypeList', []).map((service: any) => service.name)
        if (_.get(this.profileDetails, 'civilServiceType', '')) {
          this.getService(_.get(this.profileDetails, 'civilServiceType', ''), false);
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err) {
          this.openSnackbar(this.handleTranslateTo('unableFetchCadreData'))
        }
      },
    })
  }
  getMasterLanguage(): void {
    this.profileV2RevampService.getMasterLanguages()
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        this.masterLanguages = res.languages
        this.masterLanguageBackup = res.languages
        const domicileMediumControl = this.profileForm.get('domicileMedium');
        if (domicileMediumControl) {
          domicileMediumControl.patchValue(_.get(this.profileDetails, 'domicileMedium', ''));
          domicileMediumControl.updateValueAndValidity();
        }
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.openSnackbar(this.handleTranslateTo('unableFetchMasterLanguageData'))
        }
      })
  }

  get primaryEmailControl() {
    return this.profileForm.get('primaryEmail');
  }
  get mobileControl() {
    const mobileControl = this.profileForm.get('mobile');
    return mobileControl;
  }

  get showCadreDetails(): boolean {
    const servicesList = [
      'Indian Administrative Service (IAS)',
      'Indian Police Service (IPS)',
      'Indian Forest Service (IFoS)'
    ]
    const serviceNameControl = this.profileForm.get('civilServiceName');
    const typeOfCivilServiceControl = this.profileForm.get('civilServiceType');
    const isCadreControl = this.profileForm.get('isCadre');
    if (typeOfCivilServiceControl && typeOfCivilServiceControl.value &&
      serviceNameControl && serviceNameControl.value &&
      isCadreControl && isCadreControl.value &&
      servicesList.includes(serviceNameControl.value)) {
      return true;
    }
    const cadreNameControl = this.profileForm.get('cadreName');
    if (cadreNameControl) {
      this.removeValidation(cadreNameControl);
    }
    return false;
  }

  get showBatchDetails(): boolean {
    const servicesList = [
      'Indian Administrative Service (IAS)',
      'Indian Police Service (IPS)',
      'Indian Forest Service (IFoS)'
    ]
    const serviceNameControl = this.profileForm.get('civilServiceName');
    const typeOfCivilServiceControl = this.profileForm.get('civilServiceType');
    const isCadreControl = this.profileForm.get('isCadre');
    const cadreNameControl = this.profileForm.get('cadreName');
    if (
      typeOfCivilServiceControl && typeOfCivilServiceControl.value &&
      serviceNameControl && serviceNameControl.value &&
      isCadreControl && isCadreControl.value && (
        (
          servicesList.includes(serviceNameControl.value) &&
          cadreNameControl && cadreNameControl.value
        ) || (
          !servicesList.includes(serviceNameControl.value)
        )
      )
    ) {
      return true;
    }
    return false
  }

  get showControllingAuthority(): boolean {
    const isCadreControl = this.profileForm.get('isCadre');
    const cadreBatchControl = this.profileForm.get('cadreBatch');
    if (isCadreControl && isCadreControl.value && cadreBatchControl && cadreBatchControl.value) {
      return true;
    }
    return false
  }

  get showCentralDeputation(): boolean {
    const civilServiceTypeControl = this.profileForm.get('civilServiceType');
    const isCadreControl = this.profileForm.get('isCadre');
    const cadreNameControl = this.profileForm.get('cadreName');
    const cadreBatchControl = this.profileForm.get('cadreBatch');
    if (
      civilServiceTypeControl && civilServiceTypeControl.value === 'All India Services' &&
      isCadreControl && !!isCadreControl.value &&
      cadreNameControl && !!cadreNameControl.value &&
      cadreBatchControl && !!cadreBatchControl.value
    ) {
      return true;
    }
    return false;
  }

  valueCahngeMethosdsForOtherDetails(): void {
    const primaryEmailControl = this.primaryEmailControl;
    const mobileControl = this.mobileControl;
    const domicileMediumControl = this.profileForm.get('domicileMedium');

    if (primaryEmailControl) {
      primaryEmailControl.valueChanges.subscribe((value: string) => {
        if (value && value !== _.get(this.profileDetails, 'primaryEmail', '')) {
          if (EMAIL_PATTERN.test(value)) {
            this.verifyEmail = true
          } else {
            this.verifyEmail = false
          }
        } else if (!value) {
          this.verifyEmail = false;
        } else if (value === _.get(this.profileDetails, 'primaryEmail', '')) {
          this.verifyEmail = false
        }
      })
    }

    if (mobileControl) {
      mobileControl.valueChanges.subscribe((value: string) => {
        if (value && value !== _.get(this.profileDetails, 'mobile', '')) {
          if (MOBILE_PATTERN.test(value)) {
            this.verifyMobile = true
          } else {
            this.verifyMobile = false
          }
        } else if (!value || value === _.get(this.profileDetails, 'mobile', '')) {
          this.verifyMobile = false;
        }
      })
    }

    if (domicileMediumControl) {
      domicileMediumControl.valueChanges
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

  getIsCadreStatus(value: boolean) {
    this.isCadreStatus = value
    const typeOfCivilServiceControl = this.profileForm.get('civilServiceType');
    const serviceNameControl = this.profileForm.get('civilServiceName');
    const cadreNameControl = this.profileForm.get('cadreName');
    const cadreBatchControl = this.profileForm.get('cadreBatch');
    const cadreControllingAuthorityControl = this.profileForm.get('cadreControllingAuthority');
    if (value) {
      this.addValidation(typeOfCivilServiceControl);
      this.addValidation(serviceNameControl);
      this.addValidation(cadreNameControl);
      this.addValidation(cadreBatchControl);
      this.addValidation(cadreControllingAuthorityControl);
      this.civilServiceTypeId = '';
      this.civilServiceId = '';
      this.cadreId = '';
    }
    else {
      this.showBatchForNoCadre = false
      this.removeValidation(typeOfCivilServiceControl);
      this.removeValidation(serviceNameControl);
      this.removeValidation(cadreNameControl);
      this.removeValidation(cadreBatchControl);
      this.removeValidation(cadreControllingAuthorityControl);
    }
  }

  addValidation(control: any) {
    if (control) {
      control.reset();
      control.setValidators([Validators.required]);
      control.updateValueAndValidity();
      control.markAsUntouched();
    }
  }

  removeValidation(control: any) {
    if (control) {
      control.reset();
      control.clearValidators();
      control.updateValueAndValidity();
      control.markAsUntouched();
    }
  }

  getService(event: any, isReset: boolean = true) {
    const serviceNameControl = this.profileForm.get('civilServiceName')
    const cadreControl = this.profileForm.get('cadreName')
    const batchControl = this.profileForm.get('cadreBatch')
    const cadreControllingAuthorityControl = this.profileForm.get('cadreControllingAuthority')
    if (isReset) {
      if (serviceNameControl) { serviceNameControl.reset() }
      if (cadreControl) { cadreControl.reset() }
      if (batchControl) { batchControl.reset() }
      if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }
    }

    this.serviceType = _.get(this.civilServiceData, 'civilServiceTypeList', []).find((element: any) => element.name === event)
    if (this.serviceType) {
      this.serviceListData = this.serviceType.serviceList
      this.serviceNamesList = this.serviceListData.map((service: any) => service.name)
      this.serviceId = this.serviceType.id
      if (!isReset && serviceNameControl && serviceNameControl.value) {
        serviceNameControl.updateValueAndValidity()
        this.onServiceSelect(serviceNameControl.value, false)
      }
    }
  }

  onServiceSelect(event: any, isReset: boolean = true) {
    const cadreControl = this.profileForm.get('cadreName')
    const batchControl = this.profileForm.get('cadreBatch')
    const cadreControllingAuthorityControl = this.profileForm.get('cadreControllingAuthority')
    if (isReset) {
      if (cadreControl) { cadreControl.reset() }
      if (batchControl) { batchControl.reset() }
      if (cadreControllingAuthorityControl) { cadreControllingAuthorityControl.reset() }
    }
    this.selectedServiceName = event
    if (this.serviceListData) {
      this.selectedService = this.serviceListData.find((service: any) => service.name === this.selectedServiceName)
      this.civilServiceName = this.selectedService.name
      this.civilServiceId = this.selectedService.id
      this.cadreList = this.selectedService.cadreList ? this.selectedService.cadreList.map((cadre: any) => cadre.name) : []
    }
    if (this.selectedService && this.selectedService.cadreControllingAuthority) {
      this.cadreControllingAuthority = this.selectedService.cadreControllingAuthority
    } else {
      this.cadreControllingAuthority = 'NA'
    }
    if (this.selectedService && this.selectedService.cadreList &&
      (this.selectedService.cadreList.length === 0 ||
        !isReset && batchControl && batchControl.value)
    ) {
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
    if (!isReset && cadreControl && batchControl) {
      cadreControl.updateValueAndValidity()
      batchControl.updateValueAndValidity()
    }
  }

  onCadreSelect(event: any) {
    const batchControl = this.profileForm.get('cadreBatch')
    const cadreControllingAuthorityControl = this.profileForm.get('cadreControllingAuthority')

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

  handleGenerateEmailOTP(verifyType?: any): void {
    this.profileV2RevampService.getWhiteListDomain().subscribe((response: any) => {
      if (_.get(response, 'result.domains').length > 0) {
        this.approvedDomainList = response.result.domains
        if (this.approvedDomainList && this.approvedDomainList.length > 0) {
          if (this.primaryEmailControl && this.isEmailAllowed(this.primaryEmailControl.value)) {
            this.otpService.sendEmailOtp(this.primaryEmailControl.value)
              .pipe(takeUntil(this.destroySubject$))
              .subscribe((_res: any) => {
                this.openSnackbar(this.handleTranslateTo('otpSentEmail'))
                if (verifyType) {
                  this.handleVerifyOTP(verifyType, this.primaryEmailControl?.value)
                }
              }, (error: HttpErrorResponse) => {
                if (!error.ok) {
                  this.openSnackbar(this.handleTranslateTo('emailOTPSentFail'))
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
          this.openSnackbar(this.handleTranslateTo('otpSentEmail'))
        } else {
          this.openSnackbar(this.handleTranslateTo('otpSentMobile'))
        }
      }, (error: any) => {
        if (!error.ok) {
          this.openSnackbar(_.get(error, 'error.params.errmsg') || 'Unable to resend OTP, please try again later!')
        }
      })
  }

  isEmailAllowed(email: string): boolean {
    const domain = email.split('@')[1]
    return domain ? this.approvedDomainList.includes(domain) : false
  }

  handleGenerateOTP(verifyType?: string): void {
    if (this.mobileControl) {
      this.otpService.sendOtp(this.mobileControl.value)
        .pipe(takeUntil(this.destroySubject$))
        .subscribe((_res: any) => {
          this.openSnackbar(this.handleTranslateTo('otpSentMobile'))
          if (verifyType && this.mobileControl) {
            this.handleVerifyOTP(verifyType, this.mobileControl.value)
          }
        }, (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.openSnackbar(this.handleTranslateTo('mobileOTPSentFail'))
          }
        })
    }
  }

  handleEmpty(type: string): void {
    if (type === 'mobile') {
      if (_.get(this.profileDetails, 'mobile', '') && this.mobileControl && !this.mobileControl.value) {
        this.profileForm.setErrors({ valid: false })
      }
    }

    if (type === 'primaryEmail') {
      if (!_.get(this.profileDetails, 'primaryEmail', '') && this.primaryEmailControl && !this.primaryEmailControl.value) {
        this.profileForm.setErrors({ valid: false })
      }
    }
  }

  onkeyDown(_event: any) {
    return this.isMatcompleteOpened
  }

  onAutoCompleteOpened() {
    this.isMatcompleteOpened = true
  }

  onAutoCompleteClosed() {
    this.isMatcompleteOpened = false
  }

  //#endregion (end of other details)

  handleSubmit(): void {
    if (this.profileForm) {
      if (this.canSaveChanges) {
        const profileData = this.profileForm.value;
        if (this.profileImageChanged) {
          profileData['profileImageUrl'] = this.profileImage;
          const firstNameControl = this.profileForm.get('firstName');
          if (firstNameControl && !firstNameControl.value) {
            profileData['firstName'] = this.profileDetails['firstName'];
          }
        }
        if (this.header === 'Other Details') {
          this.genrateOtehrDetailsForm()
        } else if (this.header === 'Mandatory Section') {
          this.generateMandatorySectionForm()
        } else {
          this.dialogRef.close(this.profileForm.value);
        }
      } else {
        this.markFormGroupTouched(this.profileForm);
      }
    }
  }

  generateMandatorySectionForm(): void {
    this.submitbtnLoading = true
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const primaryDetails = _.get(this.data, 'primaryDetails', this.profileDetails);
  
      
      // MANDATORY: Always include userId and profileDetails with lastProfileVerificationPromptDate
      const postData: any = {
        'request': {
          'userId': this.configSvc.unMappedUser.id,
          'profileDetails': {
            'personalDetails': {
              'lastProfileVerificationPromptDate': new Date().getTime().toString()
            }
          }
        },
      }

      // Only add employmentDetails if transferOrganization changed
      if (formValue.transferOrganization && formValue.transferOrganization !== _.get(primaryDetails, 'departmentName', '')) {
        postData.request.employmentDetails = {
          'departmentName': formValue.transferOrganization,
        }
      }

      // Check if any professional details changed
      const groupChanged = formValue.group && formValue.group !== _.get(primaryDetails, 'group', '');
      const designationChanged = formValue.designation && formValue.designation !== _.get(primaryDetails, 'designation', '');
      const orgChanged =  formValue.transferOrganization &&  formValue.transferOrganization !== _.get(primaryDetails, 'departmentName', '');

      if (groupChanged || designationChanged || orgChanged) {
        postData.request.profileDetails.professionalDetails = [{
          ...(orgChanged ? { name: formValue.transferOrganization } : null),
          ...(designationChanged ? { designation: formValue.designation } : null),
          ...(groupChanged ? { group: formValue.group } : null),
        }]
      }

      // Check if any personal details changed and add them to existing personalDetails
      const emailChanged = formValue.primaryEmail !== _.get(primaryDetails, 'primaryEmail', '');
      const mobileChanged = formValue.mobile !== _.get(primaryDetails, 'mobile', '');

      if (emailChanged) {
        postData.request.profileDetails.personalDetails.primaryEmail = formValue.primaryEmail;
      }
      
      if (mobileChanged) {
        postData.request.profileDetails.personalDetails.mobile = formValue.mobile;
      }

      this.userProfileService.editProfileDetails(postData)
        .pipe(takeUntil(this.destroySubject$))
        .subscribe({
          next: (_res: any) => {
            this.openSnackbar('Your request has been sent for approval')
            this.submitbtnLoading = false
            this.location.replaceState('/page/home');
            window.location.reload();
          },
          error: (error: HttpErrorResponse) => {
            this.submitbtnLoading = false
            if (error?.error?.params?.errmsg) {
              this.openSnackbar(error?.error?.params?.errmsg)
            } else {
              this.openSnackbar('Request failed. Please try again.')
            }
          }
        })
    }
  }

  genrateOtehrDetailsForm(): void {
    const formBody: any = this.profileForm.value
    // if (this.primaryEmailControl && _.get(this.profileDetails, 'primaryEmail', '') !== this.primaryEmailControl.value) {
    //   this.updateEmail(this.primaryEmailControl.value)
    // }
    if (formBody && formBody.dob) {
      const dobDate = new Date(formBody.dob);
      formBody.dob = this.datePipe.transform(dobDate, 'dd-MM-yyyy')
    }
    const typeOfCivilServiceControl = this.profileForm.get('civilServiceType');
    const serviceNameControl = this.profileForm.get('civilServiceName');
    const isCadreControl = this.profileForm.get('isCadre');
    const cadreBatchControl = this.profileForm.get('cadreBatch')
    const isOnCentralDeputationControl = this.profileForm.get('isOnCentralDeputation');
    if (typeOfCivilServiceControl && serviceNameControl && isCadreControl && cadreBatchControl) {
      if ((
        typeOfCivilServiceControl.value &&
        serviceNameControl.value &&
        cadreBatchControl.value
      ) || isCadreControl.value) {
        formBody['civilServiceTypeId'] = this.serviceId || '';
        formBody['civilServiceId'] = this.civilServiceId || '';
        formBody['cadreId'] = this.cadreId || '';
        formBody['cadreControllingAuthorityName'] = this.cadreControllingAuthority || '';
        formBody['isOnCentralDeputation'] = isOnCentralDeputationControl?.value || false;
      } else {
        formBody['civilServiceType'] = '';
        formBody['civilServiceName'] = '';
        formBody['isCadre'] = false;
        formBody['cadreBatch'] = '';
        formBody['cadreControllingAuthorityName'] = '';
        formBody['civilServiceTypeId'] = '';
        formBody['civilServiceId'] = '';
        formBody['cadreControllingAuthorityName'] = '';
        formBody['cadreBatch'] = '';
        formBody['isOnCentralDeputation'] = false;

      }
    }
    this.dialogRef.close(formBody);
  }

  handleCancel(): void {
    this.dialogRef.close();
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.profileForm.get(controlName);
    return control?.touched && control?.hasError(errorName) || false;
  }

  get canSaveChanges(): boolean {
    if (!this.profileForm || this.initilisationInProgress) {
      return false;
    }
    const isFormValid = this.profileForm.valid;
    
    switch (this.header) {
      case 'Profile':
        if (isFormValid || this.profileImageChanged) {
          return true
        }
        return false
      case 'Primary Details':
        if (isFormValid) {
          return true
        }
        return false
      case 'Mandatory Section':
        if (isFormValid && !this.verifyEmail && !this.verifyMobile) {
          return true
        }
        return false
      case 'About Me':
        if (isFormValid) {
          return true
        }
        return false
      case 'Other Details':
        if (isFormValid && !this.verifyEmail && !this.verifyMobile) {
          return true
        }
        return false
    }
    return true
  }

  get enableEditBtn(): boolean {
    const groupControl = this.profileForm.get('group');
    const designationControl = this.profileForm.get('designation');
    
    // Check if both controls exist and form is valid
    if (!groupControl || !designationControl || !this.profileForm.valid) {
      return false;
    }
    
    // Enable button if both group and designation have values (on load or after changes)
    const hasGroupValue = groupControl.value && groupControl.value.trim() !== '';
    const hasDesignationValue = designationControl.value && designationControl.value.trim() !== '';
    
    return hasGroupValue && hasDesignationValue;
  }

  handleTranslateTo(menuName: string): string {
    return this.profileV2RevampService.handleTranslateTo(menuName)
  }

  handleTranslateToProfile(menuName: string): string {
    return this.userProfileService.handleTranslateTo(menuName)
  }

  openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

  // Transfer Organization Methods
  getTransferOrgRequest(_newCall: boolean, offsetValue: number, searchText: string): any {
    const request: any = {
      "request": {
        "filters": {
          "isTenant": true,
          "status": 1,
          "isMdo": true,
          "isCbp": true
        },
        "fields": ["channel", "rootOrgId"],
        "limit": this.transferOrgDefaultLoadCount,
        "offset": offsetValue
      }
    }

    if (searchText && searchText.trim() !== '') {
      request.request.query = searchText;
    }
    return request
  }

  getAllTransferOrgData(onLoad: boolean, offsetValue: number, searchText: string): void {
    this.userProfileService.getOrganizationData(this.getTransferOrgRequest(onLoad, offsetValue, searchText))
      .pipe(takeUntil(this.destroySubject$))
      .subscribe({
        next: (res: any) => {
          if (res && res.result && res.result.response && res.result.response.content && res.result.response.content.length) {
            const newData = res.result.response.content;

            if (onLoad) {
              // When dropdown is open, only show API results (no initial org prepended)
              this.transferOrganizationData = [...newData];
              this.transferOrgDataTotalCount = res.result.response.count;
            } else {
              this.transferOrganizationData = [...this.transferOrganizationData, ...newData];
            }
            this.transferOrgFilterData = this.transferOrganizationData;
          } else {
            if (onLoad) {
              // If no results from API, show empty list
              this.transferOrganizationData = [];
              this.transferOrgFilterData = [];
            }
          }
          this.isLoadingMoreTransferOrg = false
        },
        error: (error: HttpErrorResponse) => {
          this.isLoadingMoreTransferOrg = false
          if (!error.ok) {
            this.openSnackbar('Failed to fetch organizations')
          }
        }
      })
  }

  onTransferOrgSelectionChange(org: any) {
    if (org && org.channel) {
      this.selectedTransferOrgId = org.rootOrgId
      this.profileForm.controls['transferOrganization'].setValue(org.channel)
    }
  }

   private getInitialOrgFromUnmappedUser(): any {
    const rootOrg = _.get(this.configSvc, 'unMappedUser.rootOrg', null);
    if (rootOrg && rootOrg.channel) {
      return {
        channel: rootOrg.channel,
        isRootOrg: rootOrg.isRootOrg !== undefined ? rootOrg.isRootOrg : true,
        rootOrgId: rootOrg.rootOrgId || rootOrg.id || ''
      };
    }
    return null;
  }

  /**
   * This method sets the initial unmapped user org if available.
   */
  private async loadTransferOrgAndSetValue() {
    // Get the initial org from unmapped user
    const initialOrg = this.getInitialOrgFromUnmappedUser();

    // If no match or no departmentName, set the initial org from unmapped user
    if (initialOrg) {
      // Add the initial org to transferOrganizationData so it appears in the dropdown
      this.transferOrganizationData = [initialOrg];
      this.transferOrgFilterData = [initialOrg];

      // Set the form value to the channel string (not the object) to match mat-option [value]
      this.profileForm.get('transferOrganization')?.setValue(initialOrg.channel);
      this.selectedTransferOrgId = initialOrg.rootOrgId;
    }
  }

  setupTransferOrgScrollListener(opened: boolean): void {
    if (opened) {
      if (this.profileForm.get('searchTransferOrganization')?.value) {
        this.profileForm.get('searchTransferOrganization')!.setValue('');
      } else {
        this.getAllTransferOrgData(true, 0, '');
      }
      this.transferOrgListLoadCount = this.transferOrgDefaultLoadCount;

      setTimeout(() => {
        const searchInput = document.querySelector('.search-org-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);

      setTimeout(() => {
        const panel = document.querySelector('.mat-select-panel');
        if (panel) {
          panel.addEventListener('scroll', this.onTransferOrgSelectScroll.bind(this));
        }
      }, 100);
    } else {
      // Dropdown is closed: if no selection was made, reset to the initial unmapped user org
      const currentValue = this.profileForm.get('transferOrganization')?.value;
      const initialOrg = this.getInitialOrgFromUnmappedUser();

      // If nothing was selected or the user didn't select anything from the API results
      if (!currentValue) {
        // Reset to initial value from unmapped user
        this.loadTransferOrgAndSetValue();
      } else {
        // Check if the selected value exists in the current data (API results)
        const selectedOrgExists = this.transferOrganizationData.find((org: any) => org.channel === currentValue);

        // If the selected value doesn't exist in API results and matches initial org, restore initial org
        if (!selectedOrgExists && initialOrg && currentValue === initialOrg.channel) {
          this.loadTransferOrgAndSetValue();
        }
      }
    }
  }

  onTransferOrgSelectScroll(event: any): void {
    const element = event.target;

    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5) {
      if (!this.isLoadingMoreTransferOrg && this.transferOrganizationData.length < this.transferOrgDataTotalCount) {
        this.isLoadingMoreTransferOrg = true;
        const nextOffset = this.transferOrganizationData.length;
        this.getAllTransferOrgData(false, nextOffset, this.profileForm.get('searchTransferOrganization')?.value || '');
        this.transferOrgListLoadCount += this.transferOrgDefaultLoadCount;
      }
    }
  }

  trackByOrgFn(_index: number, item: any): string {
    return item.channel
  }

  get searchTransferOrganization() {
    return this.profileForm.get('searchTransferOrganization');
  }

  // Approval status methods for Mandatory Section
  getApprovedFields(): void {
    const requesrtBody = {
      serviceName: 'profile',
      applicationStatus: 'APPROVED',
    }
    this.profileV2RevampService.fetchApprovalDetails(requesrtBody)
      .subscribe((_res: any) => {
        if (_res && _res.result && _res.result.data && Array.isArray(_res.result.data)) {
          _res.result.data.filter((obj: any) => {
            this.groupApprovedTime = (obj.hasOwnProperty('group') && obj.lastUpdatedOn > this.groupApprovedTime) ?
              obj.lastUpdatedOn : this.groupApprovedTime

            this.designationApprovedTime = (obj.hasOwnProperty('designation') && obj.lastUpdatedOn > this.designationApprovedTime) ?
              obj.lastUpdatedOn : this.designationApprovedTime

            this.organizationApprovedTime = (obj.hasOwnProperty('organization') && obj.lastUpdatedOn > this.organizationApprovedTime) ?
              obj.lastUpdatedOn : this.organizationApprovedTime
          })
        }
      }, (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.openSnackbar(this.handleTranslateTo('somethingWentWrongPleaseTryAgain'))
        }
      })
  }

  get showApprovalStatus(): boolean {
    if (
      (this.groupApprovedTime < _.get(this.data, 'rejectedFields.groupRejectionTime', 0) ||
        this.groupApprovedTime < _.get(this.data, 'unVerifiedObj.groupRequestTime', 0) ||
        this.designationApprovedTime < _.get(this.data, 'rejectedFields.designationRejectionTime', 0) ||
        this.designationApprovedTime < _.get(this.data, 'unVerifiedObj.designationRequestTime', 0) ||
        this.organizationApprovedTime < _.get(this.data, 'rejectedFields.organizationRejectionTime', 0) ||
        this.organizationApprovedTime < _.get(this.data, 'unVerifiedObj.organizationRequestTime', 0)) &&
      _.get(this.data, 'isCurrentUser', false)
    ) {
      return true
    }
    return false
  }

  get showOrganizationPending(): boolean {
    const unVerifiedObj = _.get(this.data, 'unVerifiedObj', {});
    const rejectedFields = _.get(this.data, 'rejectedFields', {});
    if (
      this.organizationApprovedTime < unVerifiedObj.organizationRequestTime &&
      rejectedFields.organizationRejectionTime < unVerifiedObj.organizationRequestTime &&
      unVerifiedObj.organization
    ) {
      if ((unVerifiedObj.organizationRequestTime + 100) < rejectedFields.designationRejectionTime ||
        (unVerifiedObj.organizationRequestTime + 100) < unVerifiedObj.designationRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showOrganizationRejection(): boolean {
    const unVerifiedObj = _.get(this.data, 'unVerifiedObj', {});
    const rejectedFields = _.get(this.data, 'rejectedFields', {});
    if (
      this.organizationApprovedTime < rejectedFields.organizationRejectionTime &&
      unVerifiedObj.organizationRequestTime < rejectedFields.organizationRejectionTime &&
      rejectedFields.organization
    ) {
      if ((rejectedFields.organizationRejectionTime + 100) < rejectedFields.designationRejectionTime ||
        (rejectedFields.organizationRejectionTime + 100) < unVerifiedObj.designationRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showGroupPending(): boolean {
    const unVerifiedObj = _.get(this.data, 'unVerifiedObj', {});
    const rejectedFields = _.get(this.data, 'rejectedFields', {});
    if (
      this.groupApprovedTime < unVerifiedObj.groupRequestTime &&
      rejectedFields.groupRejectionTime < unVerifiedObj.groupRequestTime &&
      unVerifiedObj.group
    ) {
      if ((unVerifiedObj.groupRequestTime + 100) < rejectedFields.designationRejectionTime ||
        (unVerifiedObj.groupRequestTime + 100) < unVerifiedObj.designationRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showGroupRejection(): boolean {
    const unVerifiedObj = _.get(this.data, 'unVerifiedObj', {});
    const rejectedFields = _.get(this.data, 'rejectedFields', {});
    if (
      this.groupApprovedTime < rejectedFields.groupRejectionTime &&
      unVerifiedObj.groupRequestTime < rejectedFields.groupRejectionTime &&
      rejectedFields.group
    ) {
      if ((rejectedFields.groupRejectionTime + 100) < rejectedFields.designationRejectionTime ||
        (rejectedFields.groupRejectionTime + 100) < unVerifiedObj.designationRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showDesignationPending(): boolean {
    const unVerifiedObj = _.get(this.data, 'unVerifiedObj', {});
    const rejectedFields = _.get(this.data, 'rejectedFields', {});
    if (
      this.designationApprovedTime < unVerifiedObj.designationRequestTime &&
      rejectedFields.designationRejectionTime < unVerifiedObj.designationRequestTime &&
      unVerifiedObj.designation
    ) {
      if ((unVerifiedObj.designationRequestTime + 100) < rejectedFields.groupRejectionTime ||
        (unVerifiedObj.designationRequestTime + 100) < unVerifiedObj.groupRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  get showDesignationRejection(): boolean {
    const unVerifiedObj = _.get(this.data, 'unVerifiedObj', {});
    const rejectedFields = _.get(this.data, 'rejectedFields', {});
    if (
      this.designationApprovedTime < rejectedFields.designationRejectionTime &&
      unVerifiedObj.designationRequestTime < rejectedFields.designationRejectionTime &&
      rejectedFields.designation
    ) {
      if ((rejectedFields.designationRejectionTime + 100) < rejectedFields.groupRejectionTime ||
        (rejectedFields.designationRejectionTime + 100) < unVerifiedObj.groupRequestTime) {
        return false
      }
      return true
    }
    return false
  }

  openProfileEditDialog(header: string): void {
    // This method can be used if needed for nested dialog opening
    console.log('Open profile edit dialog:', header);
  }

  getSendApprovalStatus(): void {
    // Refresh approval status
    this.getApprovedFields();
  }

  updateWithdrawalStatus(): void {
    // Update withdrawal status if needed
  }

  viewReason(comments: string): void {
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

  get showWithdrawRequestBtn(): boolean {
    if (this.enableWR && !(this.isNotMyUser && this.isIgotOrg)) {
      return true
    }
    return false
  }

  showWithdrawRequestPopup() {
    // If organization transfer is pending, open withdraw dialog in 'department' mode so
    // the dialog itself performs the withdraw and emits an event on success.
    if (this.showOrganizationPending || this.isOrganizationPending) {
      const dialogRef = this.dialog.open(WithdrawRequestComponent, {
        data: {
          withDrawType: 'department',
          approvalPendingFields: this.approvalPendingFields,
        },
        disableClose: true,
        panelClass: 'common-modal',
      })

      // Listen for the component emitter to know when withdraw succeeded and enable transfer
      const compInstance: any = dialogRef.componentInstance;
      if (compInstance && compInstance.enableMakeTransfer) {
        compInstance.enableMakeTransfer.pipe(takeUntil(this.destroySubject$)).subscribe(() => {
          // Clear pending and rejected fields data (organization prioritized)
          if (this.data.unVerifiedObj) {
            this.data.unVerifiedObj.organization = ''
            this.data.unVerifiedObj.organizationRequestTime = 0
            this.data.unVerifiedObj.group = ''
            this.data.unVerifiedObj.designation = ''
            this.data.unVerifiedObj.groupRequestTime = 0
            this.data.unVerifiedObj.designationRequestTime = 0
          }
          if (this.data.rejectedFields) {
            this.data.rejectedFields.organization = ''
            this.data.rejectedFields.organizationRejectionTime = 0
            this.data.rejectedFields.group = ''
            this.data.rejectedFields.designation = ''
            this.data.rejectedFields.groupRejectionTime = 0
            this.data.rejectedFields.designationRejectionTime = 0
          }

          // Enable form fields
          const groupControl = this.profileForm.get('group');
          const designationControl = this.profileForm.get('designation');
          const transferOrgControl = this.profileForm.get('transferOrganization');
          if (groupControl && groupControl.disabled) { groupControl.enable(); }
          if (designationControl && designationControl.disabled) { designationControl.enable(); }
          if (transferOrgControl && transferOrgControl.disabled) { transferOrgControl.enable(); }

          this.openSnackbar(this.handleTranslateTo('withdrawRequestSuccess'))
          this.enableWR = false
          this.getApprovedFields()
        })
      }
      return
    }

    // Default behavior: open simple withdraw for primary details
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
      const userId = _.get(this.configSvc.unMappedUser, 'id')
      const payload = {
        action: 'WITHDRAW',
        state: 'SEND_FOR_APPROVAL',
        userId: userId,
        applicationId: userId,
        actorUserId: userId,
        wfId: _obj.wfId,
        serviceName: 'profile',
        updateFieldValues: [],
        comment: '',
      }
      this.profileV2RevampService.withDrawRequest(payload)
        .subscribe((_res: any) => {
          // Clear pending and rejected fields data
          if (this.data.unVerifiedObj) {
            this.data.unVerifiedObj.group = ''
            this.data.unVerifiedObj.designation = ''
            this.data.unVerifiedObj.organization = ''
            this.data.unVerifiedObj.groupRequestTime = 0
            this.data.unVerifiedObj.designationRequestTime = 0
          }
          if (this.data.rejectedFields) {
            this.data.rejectedFields.group = ''
            this.data.rejectedFields.designation = ''
            this.data.rejectedFields.organization = ''
            this.data.rejectedFields.groupRejectionTime = 0
            this.data.rejectedFields.designationRejectionTime = 0
          }
          
          // Enable all form fields
          const groupControl = this.profileForm.get('group');
          const designationControl = this.profileForm.get('designation');
          const transferOrgControl = this.profileForm.get('transferOrganization');
          
          if (groupControl && groupControl.disabled) groupControl.enable();
          if (designationControl && designationControl.disabled) designationControl.enable();
          if (transferOrgControl && transferOrgControl.disabled) transferOrgControl.enable();
          
          this.openSnackbar(this.handleTranslateTo('withdrawRequestSuccess'))
          this.enableWR = false
          
          // Refresh approval fields to update timestamps
          this.getApprovedFields()
        }, (error: HttpErrorResponse) => {
          if (!error.ok) {
            this.openSnackbar(this.handleTranslateTo('unableWithdrawRequest'))
          }
        })
    })
  }

  disablePendingFields(): void {
    const groupControl = this.profileForm.get('group');
    const designationControl = this.profileForm.get('designation');
    const transferOrgControl = this.profileForm.get('transferOrganization');
    // Check if ANY field has pending/rejected status
    const anyFieldPendingOrRejected = this.isOrganizationPending || 
                                      this.isGroupPending || 
                                      this.isDesignationPending;

    if (anyFieldPendingOrRejected) {
      // Disable all three fields if any one is pending/rejected
      if (groupControl) groupControl.disable({ emitEvent: false });
      if (designationControl) designationControl.disable({ emitEvent: false });
      if (transferOrgControl) transferOrgControl.disable({ emitEvent: false });
    } else {
      // Re-enable fields if no pending/rejected status
      if (groupControl && groupControl.disabled) groupControl.enable({ emitEvent: false });
      if (designationControl && designationControl.disabled) designationControl.enable({ emitEvent: false });
      if (transferOrgControl && transferOrgControl.disabled) transferOrgControl.enable({ emitEvent: false });
    }
  }

  get isOrganizationPending(): boolean {
    const unVerifiedObj = _.get(this.data, 'unVerifiedObj', {});
    // const rejectedFields = _.get(this.data, 'rejectedFields', {});
    
    // Check if organization field exists in pending or rejected
    return !!(unVerifiedObj.organization);
  }

  get isGroupPending(): boolean {
    return this.showGroupPending;
  }

  get isDesignationPending(): boolean {
    return this.showDesignationPending;
  }

  ngOnDestroy() {
    this.destroySubject$.unsubscribe()
  }

   //#region (primary details)
  private createMandatoryDetailsForm(): void {
    // Get values from primaryDetails or profileDetails
    const primaryDetails = _.get(this.data, 'primaryDetails', this.profileDetails);
    
    this.profileForm = this.fb.group({
      group: [_.get(primaryDetails, 'group', ''), Validators.required],
      designation: [_.get(primaryDetails, 'designation', ''), Validators.required],
      searchDesignation: [''],
      primaryEmail: [_.get(primaryDetails, 'primaryEmail', ''), [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      mobile: [_.get(primaryDetails, 'mobile', ''), [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(MOBILE_PATTERN)]],
      transferOrganization: [_.get(primaryDetails, 'departmentName', ''), [Validators.required]],
      searchTransferOrganization: [''],
    });
    this.checkCurrentDesignationPresent();

    this.loadTransferOrgAndSetValue();
    
    // Set up value change listeners for email and mobile
    this.setupMandatorySectionValueChanges();
    
    // Disable fields if they have pending/rejected status
    this.disablePendingFields();
    
    setTimeout(() => {
      this.initilisationInProgress = false;
    }, 10)
    
    // Search Designation Control
    const searchDesignationControl = this.profileForm.get('searchDesignation');
    if (searchDesignationControl) {
      let settingValueChange = true
      searchDesignationControl.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(searchText => {
          this.designationsOffset = 0
          if (searchText && searchText.length > 1) {
            this.designationSearchText = searchText // to avoid api call with single character
            this.getdesignationsMeta()
          } else if(!searchText) {
            if(!settingValueChange) {
              this.designationSearchText = searchText
              this.getdesignationsMeta() 
            }
            this.checkCurrentDesignationPresent()
          }
          settingValueChange = false
        })
        console.log(this.profileForm,'profileForm')
    }

    // Search Transfer Organization Control
    const searchTransferOrgControl = this.profileForm.get('searchTransferOrganization');
    if (searchTransferOrgControl) {
      searchTransferOrgControl.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
        )
        .subscribe(searchText => {
          // Call API with search instead of just filtering local data
          this.transferOrganizationData = []; // Clear existing data
          this.getAllTransferOrgData(true, 0, searchText);
        });
    }
  }

  setupMandatorySectionValueChanges(): void {
    const primaryEmailControl = this.profileForm.get('primaryEmail');
    const mobileControl = this.profileForm.get('mobile');
    const primaryDetails = _.get(this.data, 'primaryDetails', this.profileDetails);

    if (primaryEmailControl) {
      primaryEmailControl.valueChanges.subscribe((value: string) => {
        if (value && value !== _.get(primaryDetails, 'primaryEmail', '')) {
          if (primaryEmailControl.valid) {
            this.verifyEmail = true;
          } else {
            this.verifyEmail = false;
          }
        } else if (!value) {
          this.verifyEmail = false;
        } else if (value === _.get(primaryDetails, 'primaryEmail', '')) {
          this.verifyEmail = false;
        }
      })
    }

    if (mobileControl) {
      mobileControl.valueChanges.subscribe((value: string) => {
        if (value && value !== _.get(primaryDetails, 'mobile', '')) {
          if (mobileControl.valid) {
            this.verifyMobile = true;
          } else {
            this.verifyMobile = false;
          }
        } else if (!value || value === _.get(primaryDetails, 'mobile', '')) {
          this.verifyMobile = false;
        }
      })
    }
  }

}
