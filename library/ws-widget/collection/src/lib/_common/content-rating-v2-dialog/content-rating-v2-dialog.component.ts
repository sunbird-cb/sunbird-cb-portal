import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { EventService, WsEvents } from '@sunbird-cb/utils/src/public-api'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'ws-widget-content-rating-v2-dialog',
  templateUrl: './content-rating-v2-dialog.component.html',
  styleUrls: ['./content-rating-v2-dialog.component.scss'],
})
export class ContentRatingV2DialogComponent implements OnInit {
  userRating = 0
  feedbackForm: FormGroup
  showSuccessScreen = false
  formDisabled = true

  constructor(
    public dialogRef: MatDialogRef<ContentRatingV2DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private events: EventService,
  ) {
    this.feedbackForm = new FormGroup({
      review: new FormControl(null, [Validators.minLength(1), Validators.maxLength(2000)]),
      rating: new FormControl(0, []),
    })
  }

  ngOnInit() {
  }

  submitRating(feedbackForm: any) {
    if (!this.formDisabled) {
      this.events.raiseFeedbackTelemetry(
        {
         type: this.data.content.primaryCategory,
         subType: 'rating',
         id: this.data.content.identifier || '',
        },
        {
        id: this.data.content.identifier || '',
        rating: this.userRating,
        version: `${this.data.content.version}${''}`,
        // tslint:disable-next-line: no-non-null-assertion
        commenttxt: feedbackForm.value.review || '',
      })
      this.showSuccessScreen = true
    }
  }

  addRating(index: number) {
    this.userRating = index + 1
    if (this.userRating) {
      this.formDisabled = false
    }
    this.events.raiseInteractTelemetry(
      {
        type: 'rating',
        subType: 'content',
        id: this.data.content.identifier || '',
      },
      {
        id: this.data.content.identifier || '',
        rating: this.userRating,
      },
      {
      pageIdExt: 'rating-popup',
      module: WsEvents.EnumTelemetrymodules.FEEDBACK,
    })
    // tslint:disable-next-line: no-non-null-assertion
    this.feedbackForm.get('rating')!.setValue(this.userRating)
  }

}
