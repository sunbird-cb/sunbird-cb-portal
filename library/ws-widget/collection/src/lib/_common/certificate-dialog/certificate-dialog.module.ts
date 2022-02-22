import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CertificateDialogComponent } from './certificate-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditorQuillModule } from '../../discussion-forum/editor-quill/editor-quill.module'
import { MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatCardModule } from '@angular/material'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils/src/public-api'

@NgModule({
  declarations: [CertificateDialogComponent],
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      EditorQuillModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      MatTooltipModule,
      MatDialogModule,
      MatProgressSpinnerModule,
      MatFormFieldModule,
      MatInputModule,
      MatSnackBarModule,
      PipeSafeSanitizerModule,
  ],
  exports: [
    CertificateDialogComponent,
  ],
  entryComponents: [CertificateDialogComponent],
})
export class CertificateDialogModule { }
