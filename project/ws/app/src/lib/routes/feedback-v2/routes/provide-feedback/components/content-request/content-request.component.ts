import { Component, OnDestroy } from '@angular/core'
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Subscription } from 'rxjs'
import { TSendStatus } from '@sunbird-cb/utils-v2'
import {
  FeedbackService,
  FeedbackSnackbarComponent,
  EFeedbackRole,
  EFeedbackType,
} from '@sunbird-cb/collection'

@Component({
  selector: 'ws-app-content-request',
  templateUrl: './content-request.component.html',
  styleUrls: ['./content-request.component.scss'],
})
export class ContentRequestComponent implements OnDestroy {
  sendStatus: TSendStatus
  contentRequestForm: UntypedFormGroup
  private _submitSub?: Subscription

  constructor(private feedbackSvc: FeedbackService, private snackbar: MatSnackBar) {
    this.sendStatus = 'none'

    this.contentRequestForm = new UntypedFormGroup({
      contentRequest: new UntypedFormControl(null, [Validators.minLength(1), Validators.maxLength(2000)]),
    })
  }

  ngOnDestroy() {
    if (this._submitSub) {
      this._submitSub.unsubscribe()
    }
  }

  submitContentRequest() {
    if (this.contentRequestForm.invalid) {
      return
    }

    this.sendStatus = 'sending'
    this._submitSub = this.feedbackSvc
      .submitContentRequest({
        text: this.contentRequestForm.value['contentRequest'],
        type: EFeedbackType.ContentRequest,
        role: EFeedbackRole.User,
      })
      .subscribe(
        () => {
          this.sendStatus = 'done'
          this.contentRequestForm.patchValue({ contentRequest: null })
          this.snackbar.openFromComponent(FeedbackSnackbarComponent, {
            data: { action: 'content_request_submit', code: 'success' },
          })
        },
        () => {
          this.sendStatus = 'error'
          this.snackbar.openFromComponent(FeedbackSnackbarComponent, {
            data: { action: 'content_request_submit', code: 'failure' },
          })
        },
      )
  }
}
