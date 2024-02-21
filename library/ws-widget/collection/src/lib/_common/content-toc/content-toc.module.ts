import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
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

import { PipeRelativeTimeModule } from '@sunbird-cb/utils'
import { WidgetResolverModule } from '@sunbird-cb/resolver/src/public-api'
import { PipeDurationTransformModule, HorizontalScrollerV2Module } from '@sunbird-cb/utils/src/public-api'
import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { SkeletonLoaderModule } from '../skeleton-loader/skeleton-loader.module'
import { RatingSummaryModule } from '../rating-summary/rating-summary.module'
import { ContentProgressModule } from '../content-progress/content-progress.module'
import { CardCompetencyModule } from '../../card-competency/card-competency.module'
import { TocKpiValuesModule } from './toc-kpi-values/toc-kpi-values.module'

import { ContentTocComponent } from './content-toc.component'
import { AppTocAboutComponent } from './app-toc-about/app-toc-about.component'
import { AppTocContentComponent } from './app-toc-content/app-toc-content.component'
import { ReviewsContentComponent } from './reviews-content/reviews-content.component'
import { AppTocContentCardV2Component } from './app-toc-content-card-v2/app-toc-content-card-v2.component'
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component'
import { EnrollModalComponent } from './enroll-modal/enroll-modal.component'
import { AppTocSessionCardNewComponent } from './app-toc-session-card-new/app-toc-session-card-new.component'
import { AppTocSessionsNewComponent } from './app-toc-sessions-new/app-toc-sessions-new.component'
import { AttendanceCardModule } from '../attendance-card/attendance-card.module'
import { AppTocContentCardV2SkeletonComponent } from './app-toc-content-card-v2-skeleton/app-toc-content-card-v2-skeleton.component'
@NgModule({
  declarations: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    AppTocContentCardV2Component,
    ReviewsContentComponent,
    ConfirmationModalComponent,
    EnrollModalComponent,
    AppTocSessionCardNewComponent,
    AppTocSessionsNewComponent,
    AppTocContentCardV2SkeletonComponent,
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
  ],
  exports: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    ReviewsContentComponent,
    ConfirmationModalComponent,
    EnrollModalComponent,
  ],
  entryComponents: [
    ReviewsContentComponent,
    ConfirmationModalComponent,
    EnrollModalComponent,
  ],
})

export class ContentTocModule { }
