import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatButtonModule, MatDialogModule, MatDividerModule, MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule } from '@angular/material'
import { ContentFeedbackComponent } from './content-feedback.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [ContentFeedbackComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [ContentFeedbackComponent],
  entryComponents: [ContentFeedbackComponent],
})
export class ContentFeedbackDialogModule { }
