import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { NgCircleProgressModule } from 'ng-circle-progress'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'
import { WidgetResolverModule } from '@sunbird-cb/resolver/src/public-api'
import {
  PipeDurationTransformModule, HorizontalScrollerV2Module,
  PipeRelativeTimeModule, PipeSafeSanitizerModule
} from '@sunbird-cb/utils-v2'
import { WidgetCommentModule } from '@sunbird-cb/discussion-v2'
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
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatRadioModule } from '@angular/material/radio'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTabsModule } from '@angular/material/tabs'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { AppTocTeachersNotesComponent } from './app-toc-teachers-notes/app-toc-teachers-notes.component'
import { AppTocReferenceNotesComponent } from './app-toc-reference-notes/app-toc-reference-notes.component'
import { AiTutorConfirmPopupComponent } from './ai-tutor-confirm-popup/ai-tutor-confirm-popup.component'
import { HighlightPipe } from '../../_pipes/highlight.pipe'
import { MatSelectModule } from '@angular/material/select'
import { AiTutorComponent } from '@ws/viewer/src/lib/components/ai-tutor/ai-tutor.component'
import { MarkdownModule } from 'ngx-markdown'
import { AppTocBatchAssignmentsComponent } from './app-toc-batch-assignments/app-toc-batch-assignments.component'
import { AssignmentViewerComponent } from './app-toc-assignment-viewer/app-toc-assignment-viewer.component'
import { ContentStripWithTabsLibModule, ContentStripWithTabsPillsModule, DialogComponentsModule } from '@sunbird-cb/consumption'
import { AssignmentViewerV2Component } from './app-toc-assignment-viewerV2/app-toc-assignment-viewerV2.component'
import { SamuhikCharchaContentComponent } from './samuhik-charcha-content/samuhik-charcha-content/samuhik-charcha-content.component'

@NgModule({
  declarations: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    AppTocTeachersNotesComponent,
    AppTocReferenceNotesComponent,
    AppTocContentCardV2Component,
    ReviewsContentComponent,
    AppTocSessionCardNewComponent,
    AppTocSessionsNewComponent,
    AppTocContentCardV2SkeletonComponent,
    TruncatePipe,
    ReplaceNbspPipe,
    AiTutorConfirmPopupComponent,
    HighlightPipe,
    AiTutorComponent,
    AppTocBatchAssignmentsComponent,
    AssignmentViewerComponent,
    AssignmentViewerV2Component,
    SamuhikCharchaContentComponent,
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
    DialogComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    PipeSafeSanitizerModule,
    WidgetCommentModule,
    MatSelectModule,
    MarkdownModule.forRoot(),
    ContentStripWithTabsPillsModule,
    ContentStripWithTabsLibModule,
  ],
  exports: [
    ContentTocComponent,
    AppTocAboutComponent,
    AppTocContentComponent,
    AppTocTeachersNotesComponent,
    ReviewsContentComponent,
    AiTutorComponent,
    AppTocBatchAssignmentsComponent
  ]
})
export class ContentTocModule { }