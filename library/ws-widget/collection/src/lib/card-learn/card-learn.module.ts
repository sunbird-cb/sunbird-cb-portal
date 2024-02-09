import { CommonModule } from '@angular/common'
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule, MatExpansionModule, MatIconModule } from '@angular/material'
import { HorizontalScrollerModule } from '@sunbird-cb/utils'
// import { ActivitiesService } from '../../../../../../project/ws/app/src/lib/routes/activities/services/activities.service'
import { ActivityCardModule } from '../activity-card/activity-card.module'
import { TourModule } from '../_common/tour-guide/tour-guide.module'
import { UserImageModule } from '../_common/user-image/user-image.module'
import { CardLearnComponent } from '././card-learn.component'
import { ChallengeModule } from '../challenge/challenge.module'
import { RouterModule } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'

@NgModule({
  declarations: [CardLearnComponent],
  imports: [
    CommonModule,
    UserImageModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    HorizontalScrollerModule,
    ActivityCardModule,
    TourModule,
    ChallengeModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [CardLearnComponent],
  schemas: [NO_ERRORS_SCHEMA],
  // providers: [ActivitiesService],
})
export class CardLearnModule { }
