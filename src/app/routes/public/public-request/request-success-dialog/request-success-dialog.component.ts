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
  constructor(
    public dialogRef: MatDialogRef<RequestSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) { }

  ngOnInit() {
    // console.log('data', this.data)
    this.reqType = this.data.requestType.toLowerCase()
  }

  closeDialog() {
    this.dialogRef.close()
    this.router.navigate(['/public/signup'])
  }
}
