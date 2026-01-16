import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatLegacyDialogRef, MAT_LEGACY_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash';
import { ProfileV2RevampService } from '../../services/profile-v2-revamp.service';
import { designation, generateYears, organisation, state, URL_PATRON } from '../../models/profile-revamp.model';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { PipeCertificateImageURL } from '@sunbird-cb/utils-v2';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

export function endDateValidator(startDateControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control?.parent?.get(startDateControlName)?.value;
    const endDate = control?.value;

    if (!endDate) {
      return null; // Skip validation if endDate is not set
    }

    if (startDate && new Date(endDate) < new Date(startDate)) {
      return { endDateLessThanStartDate: true };
    }

    return null; // Valid
  };
}

@Component({
  selector: 'ws-app-profile-entry-edit',
  templateUrl: './profile-entry-edit.component.html',
  styleUrls: ['./profile-entry-edit.component.scss'],
  providers: [PipeCertificateImageURL]
})
export class ProfileEntryEditComponent implements OnInit {
  //#region (global variables)
  header: string = '';
  entryDetails: any;
  entryForm!: FormGroup;
  apiSubscriptions: any

  //#region (service history variables)
  isCurrentOrgDetails = false
  selctedOrgDetails: any = {};
  selectedOrgLogo: string = '';
  selectedOrgId: string = '';
  orgList: organisation[] = [];
  orgOffset = 0;
  orgLimit = 50;
  organisationFilterEnable = false
  isLoadingMoreOrganisations = false
  organisationsCount = 50

  designationsMeta: designation[] = [];
  designationsTotalCount = 0
  designationSearchText = ''
  designationsOffset = 0
  isLoadingMoreDesignations = false;
  designationListLoadCount = 50
  selectedOrgHasDesignations = false;

  statesList: state[] = [];
  districtsList: string[] = [];
  todayDate: Date = new Date();
  startDate: Date = new Date();
  isCurrentlyWorking = false;
  //#endregion (service history variables)

  //#region (educational qualifications variables)
  degreesMeta: any[] = [];
  filterDegreesMeta: any[] = []
  isLoadingMoredegrees = false;
  degreesFilterEnable = false
  degreeListLoadCount = 50
  degreeDefaultLoadCount = 50
  degreePageNumber = 1
  degreeTotalCount = 0
  degreeSearchText = ''

  yearsList: string[] = [];
  institutionsList: any[] = []
  filterInstitutionsList: any[] = []
  isLoadingMoreInstitutions = false
  inistitutionFilterEnable = false
  institutionListLoadCount = 50
  institutionDefaultLoadCount = 50
  institutePageNumber = 1
  instituteTotalCount = 0
  instituteSearchText = ''
  yeasersList: string[] = [];
  //#endregion (educational qualifications variables)

  disableUpload = false;
  disableUrl = false;
  //#endregion (global variables)
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatLegacyDialogRef<ProfileEntryEditComponent>,
    @Inject(MAT_LEGACY_DIALOG_DATA) private data: any,
    private ProfileV2RevampService: ProfileV2RevampService,
    private snackBar: MatLegacySnackBar,
    private pipeImgUrl: PipeCertificateImageURL
  ) {
    this.header = _.get(this.data, 'header', '');
    this.entryDetails = _.get(this.data, 'entryDetails', '');
  }
  ngOnInit(): void {
    this.initForm();
  }

  //#region (intialization)
  initForm(): void {
    switch (this.header) {
      case 'Service History':
        this.createServiceHistoryForm();
        break;
      case 'Educational qualifications':
        this.generateYearsList();
        this.createEducationalQualificationsForm();
        break;
      case 'Achievements':
        this.createAchievementsForm();
        break;
    }
  }
  //#endregion (intialization)

  //#region (service history)
  private createServiceHistoryForm(): void {
    this.entryForm = this.fb.group({
      orgName: [_.get(this.entryDetails, 'orgName', ''), [Validators.required]],
      searchOrgName: [''],
      designation: [_.get(this.entryDetails, 'designation', ''), [Validators.required]],
      searchDesignation: [''],
      orgState: [_.get(this.entryDetails, 'orgState', '')],
      orgDistrict: [_.get(this.entryDetails, 'orgDistrict', '')],
      startDate: [_.get(this.entryDetails, 'startDate', '')],
      endDate: [_.get(this.entryDetails, 'endDate', ''), [endDateValidator('startDate')]],
      currentlyWorking: [_.get(this.entryDetails, 'currentlyWorking', 'false')],
      description: [_.get(this.entryDetails, 'description', ''), [Validators.maxLength(1000)]]
    });
    this.isCurrentOrgDetails = _.get(this.entryDetails, 'isCurrentOrgDetails', false);
    const orgDistrictControl = this.entryForm.get('orgDistrict');
    if (orgDistrictControl && _.get(this.entryDetails, 'orgState', '') === '') {
      orgDistrictControl.disable();
    }
    if(_.get(this.entryDetails, 'orgName', '')) {
      this.selctedOrgDetails['orgName'] = _.get(this.entryDetails, 'orgName', '');
      this.selctedOrgDetails['orgId'] = _.get(this.entryDetails, 'orgId', '');
      this.selctedOrgDetails['orgLogo'] = _.get(this.entryDetails, 'orgLogo', '');
      this.selctedOrgDetails['rootOrgId'] = _.get(this.entryDetails, 'rootOrgId', '');
    }
    this.isCurrentlyWorking = _.get(this.entryDetails, 'currentlyWorking', '') === 'true' ? true : false;
    if (this.isCurrentlyWorking) {
      const endDateControl = this.entryForm.get('endDate');
      if (endDateControl) {
        endDateControl.disable();
        endDateControl.clearValidators();
        endDateControl.updateValueAndValidity();
      }
    }
    this.getOrgList('');
    this.checkSelectedOrgHasDesignations();
    this.getStatesList()
    if (_.get(this.entryDetails, 'startDate', '')) {
      this.startDate = new Date(_.get(this.entryDetails, 'startDate', ''));
    }
    this.serviceHistoryValueChangeFunctions();
  }

  serviceHistoryValueChangeFunctions(): void {
    const searchDesignationControl = this.entryForm.get('searchDesignation');
    const designationControl = this.entryForm.get('designation');
    const searchOrgNameControl = this.entryForm.get('searchOrgName')
    const orgNameControl = this.entryForm.get('orgName')
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

    if( searchOrgNameControl) {
      let settingValueChange = true
      searchOrgNameControl.valueChanges.pipe(
          debounceTime(250),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(searchText => {
          this.orgOffset = 0
          if (searchText) {
            this.organisationFilterEnable = true
            this.getOrgList(searchText)
          } else {
            if(!settingValueChange) {
              this.getOrgList()
            }
            this.organisationFilterEnable = false
            this.checkCurrentOrganisationPresent()
          }
          settingValueChange = false
        })

    }

    if(orgNameControl) {
      orgNameControl.valueChanges.subscribe((value: string) => {
        if(value) {
          const selectedOrgDetails: any = this.orgList.find((org: any) => org.orgName === value)
          if(selectedOrgDetails) {
            this.selctedOrgDetails['orgId'] = selectedOrgDetails.identifier
            this.selctedOrgDetails['rootOrgId'] = selectedOrgDetails.rootOrgId
            this.selctedOrgDetails['orgLogo'] = selectedOrgDetails.imgUrl
            this.selctedOrgDetails['orgName'] = selectedOrgDetails.orgName
            this.designationsOffset = 0
            this.designationsMeta = [];
            if( searchDesignationControl) {
              searchDesignationControl.patchValue('');
            }
            if( designationControl) {
              designationControl.reset();
            }
            this.checkSelectedOrgHasDesignations()
          }
        }
      })
    }
  }

  //#region (organisation)
  getOrgList(query?: string) {
    const formBody: any = {
      request:
      {
        filters: {
          isTenant: true,
          status: 1,
          isMdo: true,
          isCbp: true
        },
        fields: [
          'orgName',
          'imgUrl',
          'identifier',
          'rootOrgId'
        ],
        limit: this.orgLimit,
        offset: this.orgOffset
      }
    }
    if(query) {
      formBody.request['query'] = query
    }
    this.isLoadingMoreOrganisations = true;
    if(this.apiSubscriptions) {
      this.apiSubscriptions.unsubscribe()
    }
    this.apiSubscriptions = this.ProfileV2RevampService.getOrgSearch(formBody).subscribe({
      next: (res: any) => {
        this.organisationsCount = _.get(res, 'result.response.count', 50);
        if(this.orgOffset === 0) {
          this.orgList = _.get(res, 'result.response.content', []) as organisation[]
          this.checkCurrentOrganisationPresent()
        } else {
          this.orgList = [...this.orgList, ..._.get(res, 'result.response.content', []) as organisation[]]
        }
        this.isLoadingMoreOrganisations = false;
      }, error: (error: HttpErrorResponse) => {
        if (error) {
          this.openSnackbar('Something went wrong. Please refresh or try again later.')
        }
      }
    })
  }

  checkCurrentOrganisationPresent() {
    if(this.selctedOrgDetails['orgName'] && this.orgList) {
      const selectedOrgIsPresent = this.orgList.filter((org: any) => org.orgName === this.selctedOrgDetails['orgName']).length > 0
      if(!selectedOrgIsPresent) {
        const orgDetails: organisation = {
          identifier: this.selctedOrgDetails['orgId'],
          orgName: this.selctedOrgDetails['orgName'],
          imgUrl: this.selctedOrgDetails['orgLogo'],
          rootOrgId: this.selctedOrgDetails['rootOrgId']
        }
        this.orgList.unshift(orgDetails)
      }
    }
  }

  setupScrollListenerForOrg(opened: boolean): void {
    const searchOrgNameControl = this.entryForm.get('searchOrgName');
    if(opened && searchOrgNameControl) {
      searchOrgNameControl.setValue('')
      this.organisationFilterEnable = false
      this.orgOffset = 0
      this.getOrgList()
      const searchInput = document.querySelector('.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
      const panel = document.querySelector('.mat-select-panel');
      if (panel) {
        panel.addEventListener('scroll', this.onOrganisationSelectScroll.bind(this));
      }
    }
  }

  onOrganisationSelectScroll(event: any): void {
    const element = event.target;
    // if (!this.organisationFilterEnable) {
      if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5) {
        if (!this.isLoadingMoreOrganisations && this.organisationsCount > this.orgList.length) {
          this.orgOffset = this.orgOffset + 1;
          const searchOrgNameControl = this.entryForm.get('searchOrgName');
          let query = searchOrgNameControl ? searchOrgNameControl.value : ''
          this.getOrgList( query);
        }
      }
    // }
  }

  onOrganisationDropdownClosed(): void {
    const searchOrgNameControl = this.entryForm.get('searchOrgName');
    if (searchOrgNameControl) {
      searchOrgNameControl.setValue('')
    }
    this.checkCurrentOrganisationPresent()
  }
  //#endregion (organisation)

  //#region (designations)

  checkSelectedOrgHasDesignations(): void {
    if(this.selctedOrgDetails && this.selctedOrgDetails['rootOrgId']) {
      const igotDesignationBody: any = {
        request: {
          filters: {
            status: 'Live',
            category: 'designation',
            categories: [
              this.selctedOrgDetails['rootOrgId'] + '_odcs_designation',
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
      this.ProfileV2RevampService.searchIgotDesignation(igotDesignationBody).subscribe({
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
    if (!(this.selctedOrgDetails && this.selctedOrgDetails['rootOrgId'])) {
      return;
    }
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
            this.selctedOrgDetails['rootOrgId'] + '_odcs_designation',
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
    this.ProfileV2RevampService.searchIgotDesignation(requestBody).subscribe({
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
    this.ProfileV2RevampService.searchDesignation(requestBody).subscribe({
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

  setupScrollListener(opened: boolean): void {
    const searchDesignationControl = this.entryForm.get('searchDesignation');
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
  checkCurrentDesignationPresent() {
    // Get the current designation value
    const searchDesignationControl = this.entryForm.get('designation');
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

  onDesignationDropdownClosed(): void {
    const searchDesignationControl = this.entryForm.get('searchDesignation');
    if (searchDesignationControl) {
      searchDesignationControl.setValue('')
      this.designationSearchText = ''
    }
    this.checkCurrentDesignationPresent()
  }
  //#endregion (Designations)

  getStatesList() {
    this.ProfileV2RevampService.getStatesList().subscribe({
      next: (res: any) => {
        this.statesList = _.get(res, 'result.statesList', []) as state[]
        if (this.entryForm) {
          const stateControl = this.entryForm.get('orgState');
          if (stateControl) {
            stateControl.patchValue(_.get(this.entryDetails, 'orgState', ''));
          }
          if (_.get(this.entryDetails, 'orgState', '')) {
            this.getDistrictsList(_.get(this.entryDetails, 'orgState', ''), true);
          }
        }
      }, error: (error: HttpErrorResponse) => {
        if (error) {
          this.openSnackbar('Something went wrong. Please refresh or try again later.')
        }
      }
    })
  }

  getDistrictsList(state: string, isFirstTime: boolean = false) {
    const orgDistrictControl = this.entryForm.get('orgDistrict');
    if (state) {
      if (orgDistrictControl) {
        orgDistrictControl.enable();
      }
      this.ProfileV2RevampService.getDistrictsList(state).subscribe({
        next: (res: any) => {
          this.districtsList = _.get(res, 'result.districtsList[0].districts', []) as string[];
          const districtControl = this.entryForm ? this.entryForm.get('orgDistrict') : null;
          if (districtControl) {
            if (isFirstTime) {
              districtControl.patchValue(_.get(this.entryDetails, 'orgDistrict', ''));
            } else {
              districtControl.patchValue('');
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          this.districtsList = [];
          if (err) {
            this.openSnackbar('Something went wrong. Please refresh or try again later.');
          }
        }
      })
    } else {
      if (orgDistrictControl) {
        orgDistrictControl.disable();
      }
    }
  }

  onCurrentlyWorkingChange(event: boolean): void {
    this.isCurrentlyWorking = event;
    const currentlyWorkingControl = this.entryForm.get('currentlyWorking');
    if (currentlyWorkingControl) {
      currentlyWorkingControl.patchValue(event.toString());
    }
    if (event) {
      const endDateControl = this.entryForm.get('endDate');
      if (endDateControl) {
        endDateControl.setValue(null);
        endDateControl.disable();
        endDateControl.clearValidators();
        endDateControl.updateValueAndValidity();
      }
    } else {
      const endDateControl = this.entryForm.get('endDate');
      if (endDateControl) {
        endDateControl.enable();
        endDateControl.setValidators([Validators.required]);
        endDateControl.updateValueAndValidity();
      }
    }
  }

  onStartDateChange(selectedStartDate: Date): void {
    this.startDate = selectedStartDate;
    const endDateControl = this.entryForm.get('endDate');
    if (endDateControl) {
      const currentEndDate = endDateControl.value;

      // Reset end date if it is less than the selected start date
      if (currentEndDate && new Date(currentEndDate) < selectedStartDate) {
        endDateControl.setValue(null);
      }
    }
  }

  //#endregion (Service History)

  //#region (educational qualifications)
  private createEducationalQualificationsForm(): void {
    this.entryForm = this.fb.group({
      degree: [_.get(this.entryDetails, 'degree', ''), [Validators.required]],
      searchDegrees: [''],
      otherDegree: [''],
      fieldOfStudy: [_.get(this.entryDetails, 'fieldOfStudy', ''),
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s.,'-]*$/), Validators.maxLength(250)]],
      institutionName: [_.get(this.entryDetails, 'institutionName', ''), [Validators.required]],
      searchInstitute: [''],
      otherInstituteName: [''],
      startYear: [_.get(this.entryDetails, 'startYear', ''), [Validators.required]],
      endYear: [_.get(this.entryDetails, 'endYear', ''), [Validators.required]],
    });
    this.generateYearsList()
    this.educationFormValuChange()
  }

  educationFormValuChange(): void {
    const searchInstituteControl = this.entryForm.get('searchInstitute');
    const institutionNameControl = this.entryForm.get('institutionName');
    const searchDegreeControl = this.entryForm.get('searchDegrees');
    let isInitializingDegree = true
    let isInitializingInstitute = true;

    if (searchDegreeControl) {
      searchDegreeControl.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(searchText => {
          if (isInitializingDegree) {
            isInitializingDegree = false
            return
          }
          if (searchText || this.filterDegreesMeta?.length === 0) {
            this.degreePageNumber = 1
            this.degreeSearchText = searchText
            this.getEducationalQualifications('degree', this.degreePageNumber, searchText)
          }
        })

      if (_.get(this.entryDetails, 'degree', '')) {
        searchDegreeControl.setValue(_.get(this.entryDetails, 'degree', ''));
      }
      setTimeout(() => {
        const degreeControl = this.entryForm.get('degree');
        if (degreeControl) {
          degreeControl.setValue(_.get(this.entryDetails, 'degree', ''));
        }
      }, 10);
    }

    if (searchInstituteControl && institutionNameControl) {
      searchInstituteControl.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(searchText => {
          if (isInitializingInstitute) {
            isInitializingInstitute = false
            return
          }
          if (searchText || this.filterInstitutionsList?.length === 0) {
            this.institutePageNumber = 1
            this.instituteSearchText = searchText
            this.getEducationalQualifications('institute', this.institutePageNumber, searchText)
          }
        })

      if (_.get(this.entryDetails, 'institutionName', '')) {
        searchInstituteControl.setValue(_.get(this.entryDetails, 'institutionName', ''));
      }
      setTimeout(() => {
        institutionNameControl.setValue(_.get(this.entryDetails, 'institutionName', ''));
        this.onInstituteChange(_.get(this.entryDetails, 'institutionName', ''));
        institutionNameControl.valueChanges.subscribe((name: string) => {
          this.onInstituteChange(name)
        })
      }, 10);
    }
  }

  setupScrollListenerForDegrees(opened: boolean): void {
    const searchDegreeControl = this.entryForm.get('searchDegrees');
    if(opened && searchDegreeControl) {
      searchDegreeControl.setValue('')
      this.degreesFilterEnable = false
      this.degreePageNumber = 1
      this.degreeSearchText = ''
      const searchInput = document.querySelector('.search-input') as HTMLInputElement
      if (searchInput) {
        searchInput.focus();
      }
      this.checkCurrentDegreePresent()
      setTimeout(() => {
        const panel = document.querySelector('.mat-select-panel')
        if (panel) {
          panel.addEventListener('scroll', this.onDegreesSelectScroll.bind(this))
        }
      }, 100);
    }
  }

  onDegreesSelectScroll(event: any): void {
    const element = event.target;

    if (!this.degreesFilterEnable) {
      // Check if user has scrolled to the bottom
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        // Only load more if not already loading and if there are potentially more items
        const loadedCount = this.filterDegreesMeta.filter(item => item.name !== 'Other').length
        if (!this.isLoadingMoredegrees && loadedCount < this.degreeTotalCount) {
          this.isLoadingMoredegrees = true;
          this.degreePageNumber += 1
          this.getEducationalQualifications('degree', this.degreePageNumber, this.degreeSearchText);
        }
      }
    }
  }

  onDegreesDropdownClosed(): void {
    setTimeout(() => {
      const degreeControlControl = this.entryForm.get('degree');
      const searchDegreeControl = this.entryForm.get('searchDegrees');
      if (searchDegreeControl) {
        searchDegreeControl.setValue('');
      }
      if (degreeControlControl && degreeControlControl.value) {
        this.checkCurrentDegreePresent()
        // degreeControlControl.setValue(degreeControlControl.value);
      }
    }, 100);
  }

  generateYearsList(): void {
    this.yeasersList = generateYears(1900);
  }

  // getDegreesList() {
  //   this.ProfileV2RevampService.getDegreesList().subscribe({
  //     next: (res: any) => {
  //       this.degreesMeta = _.get(res, 'result.degreesList.degrees', []) as string[];
  //       this.degreesMeta.push('Other');
  //       this.checkCurrentDegreePresent()
  //     }, error: (error: HttpErrorResponse) => {
  //       if (error) {
  //         this.openSnackbar('Something went wrong. Please refresh or try again later.')
  //       }
  //     }
  //   })
  // }

  getEducationalQualifications(type: 'degree' | 'institute', pageNumber: number = 1, searchQuery: string = '') {
    this.isLoadingMoredegrees = type === 'degree' ? true : this.isLoadingMoredegrees
    this.isLoadingMoreInstitutions = type === 'institute' ? true : this.isLoadingMoreInstitutions

    const payload: any = {
      "type": type,
      "request": {
        "pageNumber": pageNumber,
        "pageSize": type === 'degree' ? this.degreeListLoadCount : this.institutionListLoadCount,
        "filters": {
          "status": 1
        },
        "sortBy":"name",
        "orderBy" :"ASC"
      }
    }

    if (searchQuery && searchQuery.trim()) {
      payload['request']['searchString'] = searchQuery
      delete payload['request']['sortBy']
      delete payload['request']['orderBy']
    }
    this.ProfileV2RevampService.getEducationsQualificationsSearch(payload).subscribe({
      next: (response: any) => {
        if (type === 'degree') {
          const content = _.get(response, 'result.result', []) as any[]
          const totalCount = _.get(response, 'result.count', 0)
          this.degreeTotalCount = totalCount

          if (pageNumber === 1) {
            this.filterDegreesMeta = [...content, { name: 'Other' }]
          } else {
            this.filterDegreesMeta = [...this.filterDegreesMeta, ...content]
          }
          this.degreesMeta = this.filterDegreesMeta
          this.isLoadingMoredegrees = false
          this.checkCurrentDegreePresent()
        } else if (type === 'institute') {
          const content = _.get(response, 'result.result', []) as any[]
          const totalCount = _.get(response, 'result.count', 0)
          this.instituteTotalCount = totalCount

          if (pageNumber === 1) {
            this.filterInstitutionsList = [...content, { name: 'Other' }]
          } else {
            this.filterInstitutionsList = [...this.filterInstitutionsList, ...content]
          }
          this.institutionsList = this.filterInstitutionsList
          this.isLoadingMoreInstitutions = false
          this.checkCurrentInstitutePresent()
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoadingMoredegrees = false
        this.isLoadingMoreInstitutions = false;
        if (error) {
          this.openSnackbar('Something went wrong. Please refresh or try again later.');
        }
      }
    })
  }

  checkCurrentDegreePresent() {
    const degreeControl = this.entryForm.get('degree');
    const currentDegree = degreeControl ? degreeControl.value : '';
    if (currentDegree) {
      const degreeExists = this.filterDegreesMeta.some(
        (degree: any) => degree?.name.toLowerCase() === currentDegree.toLowerCase()
      );

      if (!degreeExists) {
        const newDegree = { name: currentDegree };
        if (this.filterDegreesMeta?.length >= this.degreeListLoadCount) {
          // Replace the last item with the new one to maintain the same number of items
          this.filterDegreesMeta.pop();
        }
        this.filterDegreesMeta.unshift(newDegree);
      }
    }
  }

  // getInstitutionsList() {
  //   this.ProfileV2RevampService.getInstitutionsList().subscribe({
  //     next: (res: any) => {
  //       this.institutionsList = _.get(res, 'result.institutionList.institutions', []) as string[];
  //       this.institutionsList.push('Other')
  //       this.checkCurrentInstitutePresent()
  //     }, error: (error: HttpErrorResponse) => {
  //       if (error) {
  //         this.openSnackbar('Something went wrong. Please refresh or try again later.')
  //       }
  //     }
  //   })
  // }


  setupInstituteScrollListener(opened: boolean): void {
    const searchInstituteControl = this.entryForm.get('searchInstitute');
    if (opened && searchInstituteControl) {
      searchInstituteControl.setValue('')
      this.inistitutionFilterEnable = false
      this.institutePageNumber = 1
      this.instituteSearchText = ''
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }, 100)
      this.checkCurrentInstitutePresent()
      setTimeout(() => {
        const panel = document.querySelector('.mat-select-panel');
        if (panel) {
          panel.addEventListener('scroll', this.onInstituteSelectScroll.bind(this));
        }
      }, 100);
    }
  }
  checkCurrentInstitutePresent() {
    const institutionNameControl = this.entryForm.get('institutionName');
    const currentInstitute = institutionNameControl ? institutionNameControl.value : '';
    if (currentInstitute) {
      const instituteExists = this.filterInstitutionsList.some(
        (institute: any) => institute?.name.toLowerCase() === currentInstitute.toLowerCase()
      );

      if (!instituteExists) {
        const newInstitute = { name: currentInstitute };
        if (this.filterInstitutionsList?.length >= this.institutionListLoadCount) {
          // Replace the last item with the new one to maintain the same number of items
          this.filterInstitutionsList.pop();
        }
        this.filterInstitutionsList.unshift(newInstitute);
      }
    }
  }

  onInstituteSelectScroll(event: any): void {
    const element = event.target;

    if (!this.inistitutionFilterEnable) {
      // Check if user has scrolled to the bottom
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        // Only load more if not already loading and if there are potentially more items
        const loadedCount = this.filterInstitutionsList.filter(item => item.name !== 'Other').length
        if (!this.isLoadingMoreInstitutions && loadedCount < this.instituteTotalCount) {
          this.isLoadingMoreInstitutions = true;
          this.institutePageNumber += 1
          this.getEducationalQualifications('institute', this.institutePageNumber, this.instituteSearchText);
        }
      }
    }
  }

  onInstituteDropdownClosed(): void {
    setTimeout(() => {
      const institutionNameControl = this.entryForm.get('institutionName');
      const searchInstituteControl = this.entryForm.get('searchInstitute');
      if (searchInstituteControl) {
        searchInstituteControl.setValue('');
      }
      if (institutionNameControl && institutionNameControl.value) {
        if (institutionNameControl) {
          institutionNameControl.setValue(institutionNameControl.value);
        }
      }
    }, 100);
  }

  onDegreeChange(selectedDegree: string): void {
    const otherDegreeControl = this.entryForm.get('otherDegree');
    if (otherDegreeControl) {
      if (selectedDegree && selectedDegree.toLocaleLowerCase() === 'other') {
        otherDegreeControl.setValidators([Validators.required, Validators.maxLength(80), Validators.pattern(/^[a-zA-Z0-9\s(),.&\/]*$/)]);
      } else {
        otherDegreeControl.clearValidators();
      }
      otherDegreeControl.setValue('');
      otherDegreeControl.updateValueAndValidity();
    }
  }

  onInstituteChange(selectedInstitute: string, isPatching = false): void {
    const otherInstituteControl = this.entryForm.get('otherInstituteName');
    if (otherInstituteControl) {
      if (selectedInstitute === 'Other') {
        otherInstituteControl.setValidators([Validators.required, Validators.maxLength(125), Validators.pattern(/^[a-zA-Z0-9\s(),.&\/]*$/)]);
      } else {
        otherInstituteControl.clearValidators();
      }
      if (!isPatching) {
        otherInstituteControl.setValue('');
      }
      otherInstituteControl.updateValueAndValidity();
    }
  }

  isEndYearDisabled(year: number): boolean {
    const startYear = this.entryForm.get('startYear')?.value as number;
    return startYear ? year < startYear : false;
  }

  onStartYearChange(value: number): void {
    const endYear = this.entryForm.get('endYear')?.value;
    if (endYear && endYear < value) {
      this.entryForm.patchValue({
        endYear: null
      });
    }
  }


  //#endregion (educational qualifications)

  //#region (achievements)
  private createAchievementsForm(): void {
    this.entryForm = this.fb.group({
      title: [_.get(this.entryDetails, 'title', ''), [Validators.required, Validators.maxLength(250), Validators.pattern(/^[a-zA-Z0-9\s.,'()&\-\/]*$/)]],
      issuedOrganisation: [_.get(this.entryDetails, 'issuedOrganisation', ''), [Validators.maxLength(250), Validators.pattern(/^[a-zA-Z0-9\s.,'()&]*$/)]],
      issuedDate: [_.get(this.entryDetails, 'issuedDate', '')],
      uploadedDocumentUrl: [_.get(this.entryDetails, 'documentUrl', '')],
      fileName: [_.get(this.entryDetails, 'fileName', '')],
      url: [_.get(this.entryDetails, 'url', ''), [Validators.pattern(URL_PATRON)]],
      description: [_.get(this.entryDetails, 'description', ''), [Validators.maxLength(500)]],
    });
    if (_.get(this.entryDetails, 'fileName', '')) {
      const urlControl = this.entryForm.controls.url;
      urlControl.patchValue('')
      urlControl.disable()
      urlControl.updateValueAndValidity()
      this.disableUpload = false;
      this.disableUrl = true;
    } else if (_.get(this.entryDetails, 'url', '')) {
      this.disableUpload = true;
      this.disableUrl = false;
    }
    this.valueChanges();
  }

  valueChanges(): void {
    const urlControl = this.entryForm.get('url');
    if (urlControl) {
      urlControl.valueChanges.subscribe((value: string) => {
        if (value && value.trim() !== '') {
          const documentUrlControl = this.entryForm.get('uploadedDocumentUrl');
          if (documentUrlControl) {
            documentUrlControl.patchValue('');
            documentUrlControl.updateValueAndValidity();
          }
          const fileNameControl = this.entryForm.get('fileName');
          if (fileNameControl) {
            fileNameControl.patchValue('');
            fileNameControl.updateValueAndValidity();
          }
          this.disableUpload = true;
          this.disableUrl = false;
        } else {
          this.disableUpload = false;
          this.disableUrl = false;
        }
      });
    }
  }

  removeFile(): void {
    const documentUrlControl = this.entryForm.get('uploadedDocumentUrl');
    if (documentUrlControl) {
      documentUrlControl.patchValue('');
      documentUrlControl.updateValueAndValidity();
    }
    const urlControl = this.entryForm.get('url');
    if (urlControl) {
      urlControl.patchValue('');
      urlControl.enable();
      urlControl.updateValueAndValidity();
    }
    const fileNameControl = this.entryForm.get('fileName');
    if (fileNameControl) {
      fileNameControl.patchValue('');
      fileNameControl.updateValueAndValidity();
    }
    this.disableUpload = false;
    this.disableUrl = false;
  }

  preventDefaultCDK(event: DragEvent, isEneter = ''): void {
    event.preventDefault()
    event.stopPropagation()
    if (isEneter) {
      const dropArea = event.target as HTMLElement
      dropArea.style.opacity = isEneter === 'enter' ? '0.5' : '1'
    }
  }

  onDrop(event: DragEvent): void {
    this.preventDefaultCDK(event, 'leave')

    const files = event.dataTransfer?.files
    if (files) {
      this.onFileSelected(files)
    }
  }

  onFileSelected(files: any) {
    let imagePath: any = ''
    if (files.length === 0) {
      return
    }
    const mimeType = files[0].type
    if (!mimeType.startsWith('image/')) {
      this.openSnackbar('Only images are supported')
      return
    }
    const reader = new FileReader()
    imagePath = files[0]
    if (imagePath && imagePath.size > (500 * 1024)) {
      this.openSnackbar('Selected image size is more than 500KB.')
      imagePath = ''
      return
    }
    reader.readAsDataURL(files[0])
    this.saveImage(imagePath)
  }

  saveImage(imagePath: any) {
    if (imagePath) {
      const fileName = imagePath.name.replace(/[^A-Za-z0-9.]/g, '')
      const formdata = new FormData()
      formdata.append('data', imagePath, fileName)
      this.ProfileV2RevampService.updateAchievementPic(formdata).subscribe({
        next: (res: any) => {
          if (res) {
            const createdUrl = _.get(res, 'result.url', '')
            const folderNameToSplit = '/userAchievements/'
            const urlSplice = createdUrl.split(folderNameToSplit)[1]
            const uploadedFile = this.pipeImgUrl.transform(`${folderNameToSplit}${urlSplice}`)
            const documentUrlControl = this.entryForm.get('uploadedDocumentUrl');
            if (documentUrlControl) {
              documentUrlControl.patchValue(uploadedFile)
              documentUrlControl.updateValueAndValidity()
            }
            const urlControl = this.entryForm.get('url');
            if (urlControl) {
              urlControl.patchValue('')
              urlControl.disable()
              urlControl.updateValueAndValidity()
            }
            const fileNameControl = this.entryForm.get('fileName');
            if (fileNameControl) {
              fileNameControl.patchValue(fileName);
              fileNameControl.updateValueAndValidity();
            }
            this.disableUrl = true
            this.disableUpload = false
          }
        }, error: (error: HttpErrorResponse) => {
          if (error) {
            const errorMessage = _.get(error, 'error.message', 'Something went wrong please try again')
            this.openSnackbar(errorMessage)
          }
        }
      })
    }
  }

  //#endregion (achievements)

  handleSubmit(): void {
    if (this.entryForm) {
      if (this.entryForm.valid) {
        const formValue = this.entryForm.value;
        if (this.header === 'Service History') {
          if(formValue.orgName === this.selctedOrgDetails['orgName']) {
            formValue['orgLogo'] = this.selctedOrgDetails['orgLogo']
            formValue['orgId'] = this.selctedOrgDetails['orgId']
            formValue['rootOrgId'] = this.selctedOrgDetails['rootOrgId']
          }
        }
        this.dialogRef.close(formValue);
      } else {
        this.markFormGroupTouched(this.entryForm);
      }
    }
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
    const control = this.entryForm.get(controlName);
    if (control && control.touched && control.hasError(errorName)) {
      return true;
    }
    return false;
  }

  handleCancel(): void {
    this.dialogRef.close();
  }

  private openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
}
