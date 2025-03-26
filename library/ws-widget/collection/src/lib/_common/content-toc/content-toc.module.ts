import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import {
  MatIconModule,
  MatTabsModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatRadioModule ,
  MatTooltipModule,
} from '@angular/material'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { NgCircleProgressModule } from 'ng-circle-progress'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'
import { WidgetResolverModule } from '@sunbird-cb/resolver/src/public-api'
import { PipeDurationTransformModule, HorizontalScrollerV2Module,
  PipeRelativeTimeModule, PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { RatingSummaryModule } from '../rating-summary/rating-summary.module'
import { ContentProgressModule } from '../content-progress/content-progress.module'
import { CardCompetencyModule } from '../../card-competency/card-competency.module'
import { TocKpiValuesModule } from './toc-kpi-values/toc-kpi-values.module'
import { KarmaPointsModule } from './karma-points/karma-points.module'
import { AttendanceCardModule } from '../attendance-card/attendance-card.module'

import { ContentTocComponent } from './content-toc.component'
import { AppTocAboutComponent } from './app-toc-about/app-toc-about.component'
import { AppTocContentComponent } from './app-toc-content/app-toc-content.component'
import { ReviewsContentComponent } from './reviews-content/reviews-content.component'
import { AppTocContentCardV2Component } from './app-toc-content-card-v2/app-toc-content-card-v2.component'
import { AppTocSessionCardNewComponent } from './app-toc-session-card-new/app-toc-session-card-new.component'
import { AppTocSessionsNewComponent } from './app-toc-sessions-new/app-toc-sessions-new.component'
import { AppTocContentCardV2SkeletonComponent } from './app-toc-content-card-v2-skeleton/app-toc-content-card-v2-skeleton.component'
import { TruncatePipe } from './pipes/truncate.pipe'
import { ReplaceNbspPipe } from './pipes/replace-nbsp.pipe'

@NgModule({
  declarations: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    AppTocContentCardV2Component,
    ReviewsContentComponent,
    AppTocSessionCardNewComponent,
    AppTocSessionsNewComponent,
    AppTocContentCardV2SkeletonComponent,
    TruncatePipe,
    ReplaceNbspPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatTabsModule,
    MatRadioModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SkeletonLoaderModule,
    AvatarPhotoModule,
    RatingSummaryModule,
    PipeDurationTransformModule,
    ContentProgressModule,
    NgCircleProgressModule.forRoot({}),
    PipeRelativeTimeModule,
    InfiniteScrollModule,
    CardCompetencyModule,
    HorizontalScrollerV2Module,
    WidgetResolverModule,
    AttendanceCardModule,
    MatTooltipModule,
    TocKpiValuesModule,
    KarmaPointsModule,
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    PipeSafeSanitizerModule,
  ],
  exports: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    ReviewsContentComponent,
  ],
  entryComponents: [
    ReviewsContentComponent,
  ],
})

export class ContentTocModule { }
