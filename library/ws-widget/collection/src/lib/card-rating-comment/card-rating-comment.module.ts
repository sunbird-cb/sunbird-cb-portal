import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardRatingCommentComponent } from './card-rating-comment.component'
import { PipeCountTransformModule, PipeRelativeTimeModule } from '@sunbird-cb/utils/src/public-api'
import { MatProgressBarModule, MatIconModule, MatTooltipModule, MatCardModule } from '@angular/material'
import { AvatarPhotoModule } from '../_common/avatar-photo/avatar-photo.module'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'

@NgModule({
  declarations: [CardRatingCommentComponent],
  imports: [
    CommonModule,
    PipeCountTransformModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    AvatarPhotoModule,
    PipeRelativeTimeModule,
    MatCardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

  ],
  exports: [
    CardRatingCommentComponent,
  ],
})
export class CardRatingCommentModule { }
