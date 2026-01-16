import { Component, OnInit } from '@angular/core'
import { UntypedFormGroup } from '@angular/forms'

@Component({
  selector: 'ws-app-roles-activities',
  templateUrl: './roles-activities.component.html',
  styleUrls: ['./roles-activities.component.scss'],
})
export class RolesActivitiesComponent implements OnInit {
  data = ''
  role = ''
  activity = ''

  roleForm!: UntypedFormGroup
  constructor() { }

  ngOnInit() {
  }

  // onClickSubmit(data:any) {
  //   this.role = data.role
  //   this.activity = data.activity
  //   console.log("Entered data  is : " + JSON.stringify(this.role + this.activity)  )
  //       //  console.log("Entered data role is : " + JSON.stringify(data))
  //    }

  // this.roleForm = new FormGroup({
  //   role: new FormControl(''),
  //   activity: new FormControl('')
  // })
}
