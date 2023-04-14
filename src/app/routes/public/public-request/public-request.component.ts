import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
// import { MatSnackBar, MatDialog } from '@angular/material'

@Component({
  selector: 'ws-public-request',
  templateUrl: './public-request.component.html',
  styleUrls: ['./public-request.component.scss'],
})
export class PublicRequestComponent implements OnInit {
  requestForm!: FormGroup
  namePatern = `[a-zA-Z\\s\\']{1,32}$`
  emailWhitelistPattern = `^[a-zA-Z0-9._-]{3,}\\b@\\b[a-zA-Z0-9]*|\\b(.gov|.nic)\b\\.\\b(in)\\b$`
  phoneNumberPattern = '^((\\+91-?)|0)?[0-9]{10}$'

  constructor() {
    this.requestForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.pattern(this.namePatern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailWhitelistPattern)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
      position: new FormControl('', [Validators.required]),
      addDetails: new FormControl('', [Validators.required]),
      confirmBox: new FormControl(false, [Validators.required]),
    })
   }

  ngOnInit() {
  }

}
