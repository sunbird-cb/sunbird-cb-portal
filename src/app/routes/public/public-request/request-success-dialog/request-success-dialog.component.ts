import { Component, OnInit, Inject } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-request-success-dialog',
  templateUrl: './request-success-dialog.component.html',
  styleUrls: ['./request-success-dialog.component.scss'],
})
export class RequestSuccessDialogComponent implements OnInit {
  reqType: any
  headerMessage = ''
  body = ''
  constructor(
    public dialogRef: MatDialogRef<RequestSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) { this.dialogRef.disableClose = true }

  ngOnInit() {
    this.reqType = this.data.requestType.toLowerCase()
    // this.headerMessage = `Your ${this.reqType} request has been successfully submitted`
    // this.body = "We will reach out to you in the next 48 hours to help you."
    // this.body =  this.body + "Resume self-registration process to see if you have all the other
    // required details for the registration process."
    // if (this.data.apiResponse && this.data.apiResponse.result && !this.data.apiResponse.result.data) {
    //   this.headerMessage = `This domain is already approved`
    //   this.body = "The domain you are requesting approval for, is already approved. Please Resume Registration."
    // }

    if (this.reqType === 'domain') {
      if (this.data.apiResponse && this.data.apiResponse.result && this.data.apiResponse.result.msgCode) {
        if (this.data.apiResponse.result.msgCode === 'DOMAIN_REQUEST_CREATED') {
          this.headerMessage = `Your domain request has been successfully submitted`
          // tslint:disable-next-line: max-line-length
          this.body = `We will reach out to you in the next 48 hours to help you. Resume self-registration process to see if you have all the other required details for the registration process.`
        }
        if (this.data.apiResponse.result.msgCode === 'DOMAIN_APPROVED') {
          this.headerMessage = `This domain is already approved`
          // tslint:disable-next-line: max-line-length
          this.body = `The domain you are requesting approval for, is already approved. Resume self-registration process to see if you have all the other required details for the registration process.`
        }
        if (this.data.apiResponse.result.msgCode === 'DOMAIN_REQUEST_ALREADY_PRESENT') {
          this.headerMessage = `This domain is pending for approval`
          // tslint:disable-next-line: max-line-length
          this.body = `Once the domain is approved, please resume self-registration process to see if you have all the other required details for the registration process.`
        }
        if (this.data.apiResponse.result.msgCode === 'DOMAIN_REQUEST_ALREADY_RAISED') {
          this.headerMessage = `This domain is already requested`
          // tslint:disable-next-line: max-line-length
          this.body = `The domain you are requesting approval for, is already pending for approval. Once the domain is approved, please resume self-registration process to see if you have all the other required details for the registration process.`
        }
        if (this.data.apiResponse.result.msgCode === 'DOMAIN_REQUEST_REJECTED') {
          this.headerMessage = `This domain is rejected`
          this.body = `The domain you are requesting approval for, is rejected.`
        }
      }
    } else {
      this.headerMessage = `Your ${this.reqType} request has been successfully submitted`
      // tslint:disable-next-line: max-line-length
      this.body = 'We will reach out to you in the next 48 hours to help you. Resume self-registration process to see if you have all the other required details for the registration process.'
    }
  }

  closeDialog() {
    this.dialogRef.close()
    this.router.navigate(['/public/signup'])
  }
}
