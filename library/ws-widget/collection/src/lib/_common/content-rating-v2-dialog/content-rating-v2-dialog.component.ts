import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { EventService, WsEvents, LoggerService, NsContent } from '@sunbird-cb/utils/src/public-api'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { RatingService } from '@sunbird-cb/collection/src/lib/_services/rating.service'
import { switchMap, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { NsAppRating } from '@ws/app/src/lib/routes/app-toc/models/rating.model'

@Component({
  selector: 'ws-widget-content-rating-v2-dialog',
  templateUrl: './content-rating-v2-dialog.component.html',
  styleUrls: ['./content-rating-v2-dialog.component.scss'],
})
export class ContentRatingV2DialogComponent implements OnInit {
  content: NsContent.IContent | null = null
  userRating = 0
  feedbackForm: FormGroup
  showSuccessScreen = false
  formDisabled = true
  isEditMode = false
  isEdited = false
  private unsubscribe = new Subject<void>()

  constructor(
    public dialogRef: MatDialogRef<ContentRatingV2DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private events: EventService,
    private ratingSvc: RatingService,
    private loggerSvc: LoggerService,
  ) {
    this.feedbackForm = new FormGroup({
      review: new FormControl(null, [Validators.minLength(1), Validators.maxLength(2000)]),
      rating: new FormControl(0, []),
    })
  }

  ngOnInit() {
    if (this.data.userRating) {
      this.feedbackForm.patchValue({
        review: this.data.userRating.review,
        rating: this.data.userRating.rating,
      })
      this.userRating = this.data.userRating.rating
      if (this.userRating) {
        this.formDisabled = false
        this.isEditMode = true
      }
    }
    if (this.data.content) {
      this.content = this.data.content
    }

    this.feedbackForm.valueChanges
      .pipe(
        switchMap(async formValue => {
          // tslint:disable-next-line: no-console
          console.log('formValue.review :: ', formValue.review)
          if (this.data.userRating) {
            if (formValue.review !== this.data.userRating.review || formValue.rating !== this.data.userRating.rating) {
              this.isEdited = true
            } else {
              this.isEdited = false
            }
          }
        }),
        takeUntil(this.unsubscribe)
      ).subscribe()
  }

  submitRating(feedbackForm: any) {
    if (!this.formDisabled) {
      const req: NsAppRating.IRating = {
        activity_Id: this.data.content.identifier || '',
        userId: this.data.userId || '',
        activity_type: this.data.content.primaryCategory || '',
        rating: this.userRating || 0,
        review: feedbackForm.value.review || '',
      }
      this.ratingSvc.addOrUpdateRating(req).subscribe(
        (_res: any) =>  {
          this.raiseFeedbackTelemetry(feedbackForm)
          if (this.isEditMode) {
            this.dialogRef.close(true)
          } else {
            this.showSuccessScreen = true
          }
          // this.dialogRef.close(true)
        },
        (err: any) => {
          this.loggerSvc.error('ADD OR UPDATE USER RATING ERROR >', err)
          // this.dialogRef.close(false)
        }
      )
    }
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
        rating: this.userRating,
        version: `${this.data.content.version}${''}`,
        // tslint:disable-next-line: no-non-null-assertion
        commenttxt: feedbackForm.value.review || '',
      })
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

  closeDialog(val: boolean) {
    this.dialogRef.close(val)
  }

}
