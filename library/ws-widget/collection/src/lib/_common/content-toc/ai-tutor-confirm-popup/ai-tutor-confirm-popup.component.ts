import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'

@Component({
  selector: 'ws-widget-ai-tutor-confirm-popup',
  templateUrl: './ai-tutor-confirm-popup.component.html',
  styleUrls: ['./ai-tutor-confirm-popup.component.scss']
})
export class AiTutorConfirmPopupComponent {
  constructor(public dialogRef: MatDialogRef<AiTutorConfirmPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  close(): void {
    this.dialogRef.close()
  }

  enrollNow() {
    if(this.data.enroll) {
      this.dialogRef.close('enroll')
    } else {
      this.dialogRef.close('needToEnroll')
    }
    
  }
}
