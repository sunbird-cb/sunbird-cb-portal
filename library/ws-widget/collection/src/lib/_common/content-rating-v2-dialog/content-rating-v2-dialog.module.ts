import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContentRatingV2DialogComponent } from './content-rating-v2-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EditorQuillModule } from '../../discussion-forum/editor-quill/editor-quill.module'
import { MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatCheckboxModule } from '@angular/material'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'

@NgModule({
  declarations: [ContentRatingV2DialogComponent],
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
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
  ],
  exports: [
    ContentRatingV2DialogComponent,
  ],
  entryComponents: [ContentRatingV2DialogComponent],
})
export class ContentRatingV2DialogModule { }
