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
    this.patchEhrmsDetails()
    
  }
  getEhrmsData () {
    // this.userProfileSvc.fetchEhrmsDetails().subscribe(data => {
    this.userProfileSvc.fetchEhrmsDetails('connect.sid=s%3A7_84xcLeHOYC_JUCUM2LXecpNNm1VwAc.4aJ5W7noXPxlPk%2Bk97TugCqNa9l%2BOhIB9jWHku5c4vQ').subscribe(data => {
    // this.userProfileSvc.fetchEhrmsDetails('e8f78f02-729c-4f84-86e4-9d6136b3e38c').subscribe(data => {
      const res = data.result.response
      console.log(res)
    },
    (_err: any) => {
      })
  }

  patchEhrmsDetails () {
    this.getEhrmsForm.patchValue({
      // firstname: data.personalDetails.firstname,
      // middlename: data.personalDetails.middlename,
      // surname: data.personalDetails.surname,
      ehrmsSalutation: new FormControl('', []),
      ehrmsFirstname:new FormControl('', []),
      ehrmsMiddlename: 'Datatata',
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

}
