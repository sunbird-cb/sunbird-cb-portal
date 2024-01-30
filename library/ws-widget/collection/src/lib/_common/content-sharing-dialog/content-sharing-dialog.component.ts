import { Component, OnInit, Inject } from '@angular/core'
//import { FormGroup, FormControl, Validators } from '@angular/forms'
import { EventService } from '@sunbird-cb/utils/src/public-api'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'ws-widget-content-sharing-dialog',
  templateUrl: './content-sharing-dialog.component.html',
  styleUrls: ['./content-sharing-dialog.component.scss'],
})
export class ContentSharingDialogComponent implements OnInit {
  shareForm: FormGroup
  constructor(
    public dialogRef: MatDialogRef<ContentSharingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private events: EventService,
  ) {
    this.shareForm = new FormGroup({
      review: new FormControl(null, [Validators.minLength(1), Validators.maxLength(2000)]),
    })
  }

  ngOnInit() {

  }

  submitRating() {

  }

  raiseFeedbackTelemetry(feedbackForm: any) {
      this.events.raiseFeedbackTelemetry(
        {
          type: this.data.content.primaryCategory,
          subType: 'rating',
          id: this.data.content.identifier || '',
        },
        {
        id: this.data.content.identifier || '',
        version: `${this.data.content.version}${''}`,
        // tslint:disable-next-line: no-non-null-assertion
        commenttxt: feedbackForm.value.review || '',
      })
  }



  closeDialog(val: boolean) {
    this.dialogRef.close(val)
  }


}
