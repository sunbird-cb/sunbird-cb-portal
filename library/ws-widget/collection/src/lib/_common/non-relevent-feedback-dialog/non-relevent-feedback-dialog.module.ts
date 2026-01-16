import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonReleventFeedbackDialogComponent } from './non-relevent-feedback-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [NonReleventFeedbackDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  exports: [NonReleventFeedbackDialogComponent],
})
export class NonReleventFeedbackDialogModule {}
