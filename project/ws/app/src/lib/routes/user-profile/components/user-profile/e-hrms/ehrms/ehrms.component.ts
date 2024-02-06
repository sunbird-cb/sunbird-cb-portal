import { Component, OnInit, Input } from '@angular/core';
import { UserProfileService } from '../../../../services/user-profile.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ws-app-ehrms',
  templateUrl: './ehrms.component.html',
  styleUrls: ['./ehrms.component.scss']
})
export class EhrmsComponent implements OnInit {
  @Input() ehrmsData: any
  ehrmsApiResponse:any
  getEhrmsForm: FormGroup
  constructor(
    private userProfileSvc: UserProfileService
  ) { 
    this.getEhrmsForm = new FormGroup({
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
    console.log('ehrmsData', this.ehrmsData)
    this.getEhrmsData()
    
  }
  getEhrmsData () {
    this.userProfileSvc.fetchEhrmsDetails().subscribe(data => {
    this.ehrmsApiResponse = data.result.message[0]
    this.patchEhrmsDetails()
    },
    (_err: any) => {
      })
  }

  patchEhrmsDetails () {
    this.getEhrmsForm.patchValue({
      ehrmsSalutation : this.ehrmsApiResponse,
      ehrmsFirstname : this.ehrmsApiResponse,
      ehrmsMiddlename: this.ehrmsApiResponse,
      ehrmsLastname : this.ehrmsApiResponse,
      ehrmsDob : this.ehrmsApiResponse.emp_dob.emp_dob,
      ehrmsGender : this.ehrmsApiResponse.gender,
      ehrmsCategory : this.ehrmsApiResponse.category,
      ehrmsDisabled : this.ehrmsApiResponse.differently_abled,
      ehrmsMarital : this.ehrmsApiResponse.marital_status,
      ehrmsEmployeecode : this.ehrmsApiResponse,
      ehrmsService : this.ehrmsApiResponse,
      ehrmsDesignation : this.ehrmsApiResponse.designation,
      ehrmsMdo : this.ehrmsApiResponse.mdo,
      ehrmsPosting : this.ehrmsApiResponse.place_of_posting,
      ehrmsEmailid : this.ehrmsApiResponse.emp_email,
      ehrmsMobile : this.ehrmsApiResponse.emp_mobile,
      ehrmsPresentadd1 : this.ehrmsApiResponse,
      ehrmsPresentadd2 : this.ehrmsApiResponse,
      ehrmsPresentstate : this.ehrmsApiResponse,
      ehrmsPresentdistrict : this.ehrmsApiResponse,
      ehrmsPresentpincode : this.ehrmsApiResponse,
      ehrmsAddress1 : this.ehrmsApiResponse,
      ehrmsAddress2 : this.ehrmsApiResponse,
      ehrmsState : this.ehrmsApiResponse,
      ehrmsDistrict : this.ehrmsApiResponse,
      ehrmsPincode : this.ehrmsApiResponse,
    })
  }

}
