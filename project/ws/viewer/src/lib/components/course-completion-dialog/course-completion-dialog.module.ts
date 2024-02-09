import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CourseCompletionDialogComponent } from './course-completion-dialog.component'
import { MatButtonModule, MatIconModule, MatDialogModule, MatDividerModule, MatCardModule } from '@angular/material'
import { ContentRatingV2DialogModule } from '@sunbird-cb/collection/src/lib/_common/content-rating-v2-dialog/content-rating-v2-dialog.module'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'

@NgModule({
  declarations: [CourseCompletionDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    ContentRatingV2DialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatIconModule,
  ],
  exports: [CourseCompletionDialogComponent],
  entryComponents: [CourseCompletionDialogComponent],
})
export class CourseCompletionDialogModule { }
