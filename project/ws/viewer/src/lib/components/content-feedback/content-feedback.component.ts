import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'viewer-content-feedback',
  templateUrl: './content-feedback.component.html',
  styleUrls: ['./content-feedback.component.scss'],
})
export class ContentFeedbackComponent implements OnInit {
  contentFeedbackForm: FormGroup

  constructor (public dialogRef: MatDialogRef<ContentFeedbackComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) {
    this.contentFeedbackForm = new FormGroup({
      title: new FormControl(null, [Validators.minLength(4), Validators.maxLength(100)]),
      feedback: new FormControl(null, [Validators.minLength(4), Validators.maxLength(1000)]),
    })

  }

  ngOnInit() {
    const matDialogConfig = new MatDialogConfig()

    matDialogConfig.position = { right: `10px`, bottom: `0px` }
    this.dialogRef.updatePosition(matDialogConfig.position)
  }

  submitContentFeedback() {
    console.log('this.contentFeedbackForm', this.contentFeedbackForm.value)
  }

}
