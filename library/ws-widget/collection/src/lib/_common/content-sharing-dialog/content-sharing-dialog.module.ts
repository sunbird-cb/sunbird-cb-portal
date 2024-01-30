import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContentSharingDialogComponent } from './content-sharing-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditorQuillModule } from '../../discussion-forum/editor-quill/editor-quill.module'
import { MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatCheckboxModule } from '@angular/material'

@NgModule({
  declarations: [ContentSharingDialogComponent],
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      EditorQuillModule,
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
      MatDialogModule,
      MatProgressSpinnerModule,
      MatFormFieldModule,
      MatInputModule,
      MatSnackBarModule,
      MatCheckboxModule,
  ],
  exports: [
    ContentSharingDialogComponent,
  ],
  entryComponents: [ContentSharingDialogComponent],
})
export class ContentSharingDialogModule { }
