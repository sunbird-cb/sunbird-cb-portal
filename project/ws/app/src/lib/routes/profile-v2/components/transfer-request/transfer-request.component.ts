import { Component, OnInit, Inject, OnDestroy, Output, EventEmitter } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'

// import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators'

import { UserProfileService } from '../../../user-profile/services/user-profile.service'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { Subject } from 'rxjs'
import { ProfileV2RevampService } from '../../services/profile-v2-revamp.service'
import * as _ from 'lodash'

@Component({
  selector: 'ws-transfer-request',
  templateUrl: './transfer-request.component.html',
  styleUrls: ['./transfer-request.component.scss'],
})

export class TransferRequestComponent implements OnInit, OnDestroy {

  @Output() enableWithdraw = new EventEmitter<boolean>()
  transferRequestForm = new UntypedFormGroup({
    organization: new UntypedFormControl('', [Validators.required]),
    searchOrganization: new UntypedFormControl(''),
    group: new UntypedFormControl('', [Validators.required]),
    designation: new UntypedFormControl('', [Validators.required]),
    searchDesignation: new UntypedFormControl(''),
  })
  organizationData: any[] = []
  otherDetails = false
  deptFilterData: any[] = []
  // deptFilterData  : Observable<string[]>
  designationData: any[] = []
  designationsTotalCount = 0
  designationSearchText = ''
  designationsOffset = 0
  private destroySubject$ = new Subject()
  isInValidOrgSelection = false
  onLoad = true
  designationListLoadCount = 50
  designationDefaultLoadCount =  50
  isLoadingMoreDesignations = false;
  desigantionFilterEnable = false
  selectedOrgHasDesignations = false;
  currentOrg: any = ''

  // deptFilterData: any[] = []
  organizationListLoadCount = 20
  organizationDefaultLoadCount =  20
  isLoadingMoreOrganization = false
  organizationDataTotalCount = 0
  selectedOrgId: string = ''

  constructor(
    public dialogRef: MatDialogRef<TransferRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userProfileService: UserProfileService,
    private matSnackBar: MatSnackBar,
    private configService: ConfigurationsService,
    private profileV2RevampService: ProfileV2RevampService
  ) {
    if (this.data.portalProfile.professionalDetails && this.data.portalProfile.professionalDetails.length) {
      this.transferRequestForm.controls.group.setValue(this.data.portalProfile.professionalDetails[0].group)
      this.transferRequestForm.controls.designation.setValue(this.data.portalProfile.professionalDetails[0].designation || '')
    }
    
    if (this.data.portalProfile.employmentDetails) {
      // this.transferRequestForm.controls.organization.setValue(this.data.portalProfile.employmentDetails.departmentName)
      this.currentOrg = this.data.portalProfile.employmentDetails?.departmentName || ''
    }

    this.transferRequestForm.get('organization')!.valueChanges
      .subscribe((value: string) => {
        if (value !== this.data && this.data.portalProfile &&  this.data.portalProfile.employmentDetails
           && this.data.portalProfile.employmentDetails.departmentName) {
          this.otherDetails = true
        } else {
          this.otherDetails = false
        }
      })

    if (this.transferRequestForm.get('searchOrganization')) {
     
      this.transferRequestForm.get('searchOrganization')!.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
      )
      .subscribe(searchText => {
        // this.organizationFilterEnable = !!searchText;
        
          // Call API with search instead of just filtering local data
          this.organizationData = []; // Clear existing data
          this.getAllDeptData(true, 0, searchText);
        
      });
    }
    if (this.transferRequestForm.get('searchDesignation')) {
      let settingValueChange = true
      this.transferRequestForm.get('searchDesignation')!.valueChanges
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          startWith(''),
        )
        .subscribe(res => {
          this.designationsOffset = 0
          if (res && res.length > 1) {
          this.designationSearchText = res
            this.getdesignationsMeta()
            // const designonData = this.data && this.data.designationsMeta
            // this.designationData = designonData.filter((val: any) =>
            //   val && val.name.trim().toLowerCase().includes(res && res.toLowerCase())
            // )
            // const designationSearchVal = this.transferRequestForm.controls['designation']
            // if (this.designationData && this.designationData.length && this.designationData.length > 0) {
            //   designationSearchVal.setErrors(null)
            //  } else {
            // designationSearchVal.setErrors({ invalidSelection: true })
            //  }
          } else if (!res) {
          this.designationSearchText = res
            if(!settingValueChange) {
              this.getdesignationsMeta() 
            }
            this.checkCurrentDesignationPresent()
          }
          settingValueChange = false
        })
    }
  }

  checkOrgHasDesignations(): void {
    if (this.selectedOrgId) {
      const igotDesignationBody: any = {
        request: {
          filters: {
            status: 'Live',
            category: 'designation',
            categories: [
              this.selectedOrgId + '_odcs_designation'
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

  getIgotDesignations() {
      const igotDesignationBody: any = {
        request: {
          filters: {
            status: 'Live',
            category: 'designation',
            categories: [
              this.selectedOrgId + '_odcs_designation'
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
          this.matSnackBar.open('Something went wrong. Please refresh or try again later.');
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
    if(this.designationSearchText){
      requestBody['searchString'] = this.designationSearchText
    }
    this.isLoadingMoreDesignations = true
    this.profileV2RevampService.searchDesignation(requestBody).subscribe({
      next: (res: any) => {
        this.isLoadingMoreDesignations = false
        let data = _.get(res, 'result.result.data', [])
        let totalCount = _.get(res, 'result.result.totalCount', 0)
        this.setDesignationResults(data, totalCount)
      }, error: (error: HttpErrorResponse) => {
        if(error) {
          this.matSnackBar.open('Something went wrong. Please try again later.')
        }
      }
    })
  }

  setDesignationResults(data: any[], totalCount: number) {
    if(this.designationsOffset === 0) {
      this.designationData = data
    } else {
      this.designationData = [...this.designationData, ...data]
    }
    this.designationsTotalCount = totalCount
    this.checkCurrentDesignationPresent()
  }

  ngOnInit() {

  }

  handleCloseModal(): void {
    this.dialogRef.close()
  }


  handleSubmitRequest(): void {
    if (this.transferRequestForm.valid) {
    const data: any = {
      'name': this.transferRequestForm.value['organization'],
      'designation': this.transferRequestForm.value['designation'],
      'group': this.transferRequestForm.value['group'],
    }
    const postData: any = {
      'request': {
        'userId': this.configService.unMappedUser.id,
        'employmentDetails': {
          'departmentName': this.transferRequestForm.value['organization'],
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
        this.matSnackBar.open('Your transfer request has been sent for approval')
        // this.matSnackBar.open(this.handleTranslateTo('transferRequestSent'))
        this.enableWithdraw.emit(true)
        this.handleCloseModal()
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('transferRequestFailed'))
        }
      })
    }
  }

  getOrgRequest(_newCall:boolean , offsetValue: number, searchText:string): any {
    const request: any = {
      "request": {
          "filters": {
              "isTenant": true,
              "status": 1,
              "isMdo": true,
              "isCbp": true
          },
          "fields":[ "channel", "rootOrgId"],
          "limit": this.organizationDefaultLoadCount,
          "offset": offsetValue
      }
    }

    if (searchText && searchText.trim() !== '') {
      request.request.query = searchText;
    }
    return request
  }

  getAllDeptData(onLoad:boolean, offsetValue: number,searchText:string): void {
    this.userProfileService.getOrganizationData(this.getOrgRequest(onLoad, offsetValue, searchText))
      .pipe(takeUntil(this.destroySubject$))
      .subscribe((res: any) => {
        // Check if we have valid response data
      if (res && res.result && res.result.response && res.result.response.content && res.result.response.content.length) {
        // If onLoad is true, replace the existing data
        if (onLoad) {
          this.organizationData = [...res.result.response.content];
          this.organizationDataTotalCount =res.result.response.count
        } else {
          // Otherwise append the new data
          this.organizationData = [...this.organizationData, ...res.result.response.content];
        }
        
        // Update the filtered data for display
        this.deptFilterData = this.organizationData;
        
      } else {
        if(onLoad) {
          this.organizationData = []
          this.deptFilterData = []
        }
      }
        this.isLoadingMoreOrganization = false
      },         (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.matSnackBar.open(this.handleTranslateTo('orgFetchDataFailed'))
        }
      })
  }

  handleTranslateTo(menuName: string): string {
    return this.userProfileService.handleTranslateTo(menuName)
  }

  ngOnDestroy(): void {
    this.destroySubject$.unsubscribe()
  }

  assignValue(): void {
    if (this.onLoad) {
      this.deptFilterData = this.organizationData
      this.onLoad = false
    }
  }


  checkCurrentDesignationPresent() {
       
    // Get the current designation value
    const currentDesignation = this.transferRequestForm.get('designation')!.value;
    // Check if current designation exists in the list
    if (currentDesignation) {
      const designationExists = this.designationData.some(
        (designation: any) => designation.designation.toLowerCase() === currentDesignation.toLowerCase()
      );
      
      // If designation doesn't exist in the list, add it
      if (!designationExists) {
        // Create a new designation object to match the structure of other items
        const newDesignation = { 
          designation: currentDesignation,
          // Add any other required properties matching your data structure
          id: 'custom-' + Date.now(),
          status: 'Active'
        };
        // Make sure the custom designation appears in the filtered list
        // if (this.designationData.length >= this.designationListLoadCount) {
        //   // Replace the last item with the new one to maintain the same number of items
        //   this.designationData.pop();
        // }
        this.designationData.unshift(newDesignation);
      }
    }
  }


  setupScrollListener(opened: boolean): void {
    if (opened) {
      if (this.transferRequestForm.get('searchDesignation')) {
        this.transferRequestForm.get('searchDesignation')!.setValue('');
      }
      this.designationsOffset = 0
      this.getdesignationsMeta()
      // this.desigantionFilterEnable = false
      // this.designationListLoadCount = this.designationDefaultLoadCount; // Reset the load count
      // this.designationData = this.data.designationsMeta.slice(0, this.designationDefaultLoadCount);

      this.checkCurrentDesignationPresent()
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
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
    
    // if(!this.desigantionFilterEnable){
      // Check if user has scrolled to the bottom (with a small threshold)
      if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5) {
        // Only load more if not already loading and if there are potentially more items
        if (!this.isLoadingMoreDesignations && this.designationData.length < this.designationsTotalCount) {
          this.isLoadingMoreDesignations = true;
          this.designationsOffset += 1;
          this.getdesignationsMeta()
          
          // // Increase the load count by designationDefaultLoadCount
          // this.designationListLoadCount += this.designationDefaultLoadCount;
          
          // // Update the filtered list with more items
          // setTimeout(() => {
          //   this.designationData = this.data.designationsMeta.slice(0, this.designationListLoadCount);
          //   this.checkCurrentDesignationPresent()
          //   this.isLoadingMoreDesignations = false;
          // }, 500); // Small timeout to simulate loading and prevent multiple triggers
        }
      }
    // }
  }



  onDesignationDropdownClosed(): void {
    const searchDesignationControl = this.transferRequestForm.get('searchDesignation');
    if (searchDesignationControl) {
      searchDesignationControl.setValue('')
      this.designationSearchText = ''
    }
    this.checkCurrentDesignationPresent()
    // Keep the designation value but clear the search input
    // const currentDesignation = this.transferRequestForm.get('designation')!.value;
    // setTimeout(() => {
    //   if (this.transferRequestForm.get('searchDesignation')) {
    //     this.transferRequestForm.get('searchDesignation')!.setValue('');
    //   }
    //   // Ensure the designation value remains selected
    //   if (currentDesignation) {
    //     const designationControl = this.transferRequestForm.get('designation');
    //     if (designationControl) {
    //       designationControl.setValue(currentDesignation);
    //     }
    //   }
    // }, 100);
  }

  onOrgSelectionChange(org: any) {
    if (org && org.channel) {
      this.selectedOrgId = org.rootOrgId
      this.checkOrgHasDesignations()
      this.transferRequestForm.controls.organization.setValue(org.channel)
    }
  }
  setupOrgScrollListener(opened: boolean): void {
    if (opened) {
      if (this.transferRequestForm.get('searchOrganization')?.value) {
        this.transferRequestForm.get('searchOrganization')!.setValue('');
      } else {
        this.getAllDeptData(true, 0, '');
      }
      // this.organizationFilterEnable = false
      this.organizationListLoadCount = this.organizationDefaultLoadCount; 

      setTimeout(() => {
        const searchInput = document.querySelector('.search-org-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
      // Wait for the panel to be rendered in the DOM
      setTimeout(() => {
        // Find the panel element
          const panel = document.querySelector('.mat-select-panel');
          if (panel) {
            // Add scroll event listener to the panel
            panel.addEventListener('scroll', this.onOrgSelectScroll.bind(this));
          }
        
      }, 100);
    }
  }

  onOrgSelectScroll(event: any): void { 
    const element = event.target;
    
    // Check if user has scrolled to the bottom (with a small threshold)
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5) {
      // Only load more if:
      // 1. Not already loading
      // 2. We haven't reached the total available count yet
      if (!this.isLoadingMoreOrganization && this.organizationData.length < this.organizationDataTotalCount) {
        this.isLoadingMoreOrganization = true;
        
        // Calculate the next offset
        const nextOffset = this.organizationData.length;
        
        // Call API to get more data
        this.getAllDeptData(false, nextOffset, this.transferRequestForm.get('searchOrganization')?.value || '');
        
        // Increase the load count
        this.organizationListLoadCount += this.organizationDefaultLoadCount;
      }
    }
  }
  trackByFn(_index: number, item: any): number {
    return item.channel
  }
}
