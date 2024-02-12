import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserProfileService } from '../../../../services/user-profile.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ws-app-ehrms',
  templateUrl: './ehrms.component.html',
  styleUrls: ['./ehrms.component.scss']
})
export class EhrmsComponent implements OnInit, OnChanges {
  @Input() ehrmsData: any
  // ehrmsTabclick
  ehrmsApiResponse:any
  loaderVisible = false
  initials: any
  name = 'Guest User'
  defaultMsg = 'No data found. Once you update e-HRMS, it will start reflecting.'
  isErrorMsg = false
  getEhrmsForm: FormGroup
  constructor(
    private userProfileSvc: UserProfileService
  ) { 
    this.getEhrmsForm = new FormGroup({
      ehrmsprofilePicture: new FormControl('', []),
      ehrmsSalutation: new FormControl('', []),
      ehrmsFirstname: new FormControl('', []),
      ehrmsMiddlename: new FormControl('', []),
      ehrmsLastname: new FormControl('', []),
      ehrmsDob: new FormControl('', []),
      ehrmsGender: new FormControl('', []),
      ehrmsCategory: new FormControl('', []),
      ehrmsDisabled: new FormControl('', []),
      ehrmsMarital: new FormControl('', []),
      ehrmsEmployeecode: new FormControl('', []),
      ehrmsService: new FormControl('', []),
      ehrmsDesignation: new FormControl('', []),
      ehrmsMdo: new FormControl('', []),
      ehrmsPosting: new FormControl('', []),
      ehrmsEmailid: new FormControl('', []),
      ehrmsMobile: new FormControl('', []),
      ehrmsPresentadd1: new FormControl('', []),
      ehrmsPresentadd2: new FormControl('', []),
      ehrmsPresentstate: new FormControl('', []),
      ehrmsPresentdistrict: new FormControl('', []),
      ehrmsPresentpincode: new FormControl('', []),
      ehrmsAddress1: new FormControl('', []),
      ehrmsAddress2: new FormControl('', []),
      ehrmsState: new FormControl('', []),
      ehrmsDistrict: new FormControl('', []),
      ehrmsPincode: new FormControl('', []),
    })
     
  }

  ngOnInit() {
    // debugger
    // console.log('ehrmsData', this.ehrmsData)
    // if(this.ehrmsData === 'ehrmsTabclick') {
    //   // this.getEhrmsData()
    // }
    // this.getEhrmsData()
    
  }
  ngOnChanges() {
    if(this.ehrmsData === 'e-HRMS details') {
      this.getEhrmsData()
      // we need to commentout this 
      this.createInititals()
    }
  }
  getEhrmsData () {
    this.loaderVisible = true
    this.userProfileSvc.fetchEhrmsDetails().subscribe(data => {
    this.ehrmsApiResponse = data.result.message[0]
    // this.name = this.ehrmsApiResponse.first_name + ' ' + this.ehrmsApiResponse.last_name
    this.name = this.ehrmsApiResponse.emp_name
    this.createInititals()
    this.patchEhrmsDetails()
    this.loaderVisible = false
    },
    (_err: any) => {
      this.isErrorMsg = true
      this.loaderVisible = false
      })
  }

  patchEhrmsDetails () {
    this.getEhrmsForm.patchValue({
      ehrmsSalutation : this.ehrmsApiResponse.emp_salutation,
      ehrmsFirstname : this.ehrmsApiResponse.emp_first_name,
      ehrmsMiddlename: this.ehrmsApiResponse.emp_middle_name,
      ehrmsLastname : this.ehrmsApiResponse.emp_last_name,
      ehrmsDob : this.ehrmsApiResponse.emp_dob,
      ehrmsGender : this.ehrmsApiResponse.gender,
      ehrmsCategory : this.ehrmsApiResponse.category,
      ehrmsDisabled : this.ehrmsApiResponse.differently_abled,
      ehrmsMarital : this.ehrmsApiResponse.marital_status,
      ehrmsEmployeecode : this.ehrmsApiResponse.employee_code,
      ehrmsService : this.ehrmsApiResponse.service_type,
      ehrmsDesignation : this.ehrmsApiResponse.designation,
      ehrmsMdo : this.ehrmsApiResponse.mdo,
      ehrmsPosting : this.ehrmsApiResponse.place_of_posting,
      ehrmsEmailid : this.ehrmsApiResponse.emp_email,
      ehrmsMobile : this.ehrmsApiResponse.emp_mobile,
      ehrmsPresentadd1 : this.ehrmsApiResponse.presetAdd1,
      ehrmsPresentadd2 : this.ehrmsApiResponse.ehrmsPresentadd2,
      ehrmsPresentstate : this.ehrmsApiResponse.ehrmsPresentstate,
      ehrmsPresentdistrict : this.ehrmsApiResponse.ehrmsPresentdistrict,
      ehrmsPresentpincode : this.ehrmsApiResponse.ehrmsPresentpincode,
      ehrmsAddress1 : this.ehrmsApiResponse.ehrmsAddress1,
      ehrmsAddress2 : this.ehrmsApiResponse.ehrmsAddress2,
      ehrmsState : this.ehrmsApiResponse.ehrmsState,
      ehrmsDistrict : this.ehrmsApiResponse.ehrmsDistrict,
      ehrmsPincode : this.ehrmsApiResponse.ehrmsPincode,
    })
  }
  get userInitials() {
    return this.initials
  }
  private createInititals(): void {
    let initials = ''
    const array = `${this.name} `.toString().split(' ')
    if (array[0] !== 'undefined' && typeof array[1] !== 'undefined') {
      initials += array[0].charAt(0)
      initials += array[1].charAt(0)
    } else {
      for (let i = 0; i < this.name.length; i += 1) {
        if (this.name.charAt(i) === ' ') {
          continue
        }

        if (this.name.charAt(i) === this.name.charAt(i)) {
          initials += this.name.charAt(i)

          if (initials.length === 2) {
            break
          }
        }
      }
    }
    this.initials = initials.toUpperCase()
  }

}
