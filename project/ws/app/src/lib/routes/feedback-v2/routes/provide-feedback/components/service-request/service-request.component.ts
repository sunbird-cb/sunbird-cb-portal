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
  selector: 'ws-app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss'],
})
export class ServiceRequestComponent implements OnDestroy {
  sendStatus: TSendStatus
  serviceRequestForm: UntypedFormGroup
  private _submitSub?: Subscription

  constructor(private feedbackSvc: FeedbackService, private snackbar: MatSnackBar) {
    this.sendStatus = 'none'

    this.serviceRequestForm = new UntypedFormGroup({
      serviceRequest: new UntypedFormControl(null, [Validators.minLength(1), Validators.maxLength(2000)]),
    })
  }

  ngOnDestroy() {
    if (this._submitSub) {
      this._submitSub.unsubscribe()
    }
  }

  submitServiceRequest() {
    if (this.serviceRequestForm.invalid) {
      return
    }

    this.sendStatus = 'sending'
    this._submitSub = this.feedbackSvc
      .submitServiceRequest({
        text: this.serviceRequestForm.value['serviceRequest'],
        type: EFeedbackType.ServiceRequest,
        role: EFeedbackRole.User,
      })
      .subscribe(
        () => {
          this.sendStatus = 'done'
          this.serviceRequestForm.patchValue({ serviceRequest: null })
          this.snackbar.openFromComponent(FeedbackSnackbarComponent, {
            data: { action: 'service_request_submit', code: 'success' },
          })
        },
        () => {
          this.sendStatus = 'error'
          this.snackbar.openFromComponent(FeedbackSnackbarComponent, {
            data: { action: 'service_request_submit', code: 'failure' },
          })
        },
      )
  }
}
