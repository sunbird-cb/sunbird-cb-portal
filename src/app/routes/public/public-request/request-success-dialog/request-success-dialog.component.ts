import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-request-success-dialog',
  templateUrl: './request-success-dialog.component.html',
  styleUrls: ['./request-success-dialog.component.scss'],
})
export class RequestSuccessDialogComponent implements OnInit {
  reqType: any
  headerMessage: string = ''
  body: string = ''
  constructor(
    public dialogRef: MatDialogRef<RequestSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) { this.dialogRef.disableClose = true }

  ngOnInit() {
    // console.log('data', this.data)
    this.reqType = this.data.requestType.toLowerCase()
    this.headerMessage = `Your ${this.reqType} request has been successfully submitted`
    this.body = "We will reach out to you in the next 48 hours to help you."
    this.body =  this.body + "Resume self-registration process to see if you have all the other required details for the registration process."
    if (this.data.apiResponse && this.data.apiResponse.result && !this.data.apiResponse.result.data) {
      this.headerMessage = `This domain is already approved`
      this.body = "The domain you are requesting approval for, is already approve. Please Resume Registration."
    }
  }

  closeDialog() {
    this.dialogRef.close()
    this.router.navigate(['/public/signup'])
  }
}
