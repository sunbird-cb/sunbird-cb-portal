import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'

import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { EventsRoutingModule } from './events-routing.module'
import { EventsHomeComponent } from './routes/events-home/events-home.component'
import { EventsComponent } from './routes/events/events.component'
import { LoaderService } from '@ws/author/src/public-api'
import { InitResolver } from '@ws/author/src/lib/services/init-resolve.service'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { BtnPageBackModule, BtnPageBackNavModule, ContentProgressModule, ContentStripWithTabsModule, HttpLoaderFactory } from '@sunbird-cb/collection/src/public-api'
import { AvatarPhotoModule } from '@sunbird-cb/collection/src/lib/_common/avatar-photo/avatar-photo.module'
import {
  PipeHtmlTagRemovalModule, PipeFilterV2Module, PipePublicURLModule, HorizontalScrollerV2Module,
  PipeFilterModule,
  PipeRelativeTimeModule,
  PipeFilterSearchModule,
  PipeOrderByModule,
} from '@sunbird-cb/utils-v2'
import { EventsCardComponent } from './components/events-card/events-card.component'
import { TodayEventCardComponent } from './components/today-event-card/today-event-card.component'
import { EventDetailComponent } from './routes/event-detail/event-detail.component'
import { RelatedPostsComponent } from './components/related-posts/related-posts.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { RightMenuCardComponent } from './components/right-menu-card/right-menu-card.component'
import { PresenterCardComponent } from './components/presenter-card/presenter-card.component'
import { EventService } from './services/events.service'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
// import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { KarmaPointsModule } from '@sunbird-cb/collection/src/lib/_common/content-toc/karma-points/karma-points.module'
import { EventPlayerComponent } from './routes/event-player/event-player.component'
import { EventPdfPlayerComponent } from './components/event-pdf-player/event-pdf-player.component'
import { ViewerResolve } from '@ws/viewer/src/lib/viewer.resolve'
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module'
import { EventYouTubeComponent } from './components/event-you-tube/event-you-tube.component'
import { EventResolve } from './services/event-resolver.resolve'
import { WidgetCommentModule } from '@sunbird-cb/discussion-v2'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { HttpClient } from '@angular/common/http';
import { EventsHomeV2Component } from './routes/events-home-v2/events-home-v2.component';
import { EventsCalendarModule } from './routes/events-calendar/events-calendar.module';
import { EventsEngagementComponent } from './routes/events-engagement/events-engagement.component'
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar'
import { ContentStripWithTabsPillsModule, ContentStripWithTabsLibModule } from '@sunbird-cb/consumption'
import { MatDialogModule } from '@angular/material/dialog'

import { ViewAllComponent } from './routes/view-all/view-all.component'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { EventCardV2Module } from '@sunbird-cb/collection/src/lib/event-card-v2/event-card-v2.module'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatBottomSheetModule, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MobileFiltersComponent } from './routes/events/mobile-filters/mobile-filters.component'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SeeAllComponent } from './routes/events/see-all/see-all.component';
import { EventVideoPlayerComponent } from './components/event-video-player/event-video-player.component';
import { EventsV2Component } from './routes/events-v2/events-v2.component';
import { MyAllEventsComponent } from './routes/events/my-all-events/my-all-events.component'
import { ShareDiscussionModule } from '@sunbird-cb/discussion-v2'
import { MatRadioModule } from '@angular/material/radio'
@NgModule({
  declarations: [
    EventsComponent,
    EventsHomeComponent,
    EventsCardComponent,
    TodayEventCardComponent,
    EventDetailComponent,
    RelatedPostsComponent,
    RightMenuCardComponent,
    PresenterCardComponent,
    EventPlayerComponent,
    EventPdfPlayerComponent,
    EventYouTubeComponent,
    EventsHomeV2Component,
    EventsEngagementComponent,
    ViewAllComponent,
    MobileFiltersComponent,
    SeeAllComponent,
    EventVideoPlayerComponent,
    EventsV2Component,
    MyAllEventsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EventsRoutingModule,
    MatGridListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSidenavModule,
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    PipeFilterModule,
    PipeHtmlTagRemovalModule,
    PipeRelativeTimeModule,
    AvatarPhotoModule,
    PipeOrderByModule,
    PipeFilterV2Module,
    PipeFilterSearchModule,
    PipePublicURLModule,
    BtnPageBackModule,
    WidgetResolverModule,
    MatTabsModule,
    HorizontalScrollerV2Module,
    ContentStripWithTabsModule,
    KarmaPointsModule,
    BtnPageBackNavModule,
    SkeletonLoaderModule,
    ContentProgressModule,
    WidgetCommentModule,
    InfiniteScrollModule,
    MatLegacySnackBarModule,
    ContentStripWithTabsPillsModule,
    ContentStripWithTabsLibModule,
    MatDatepickerModule,
    EventCardV2Module,
    MatSnackBarModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatTooltipModule,
    ShareDiscussionModule,
    EventsCalendarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
    { provide: MatBottomSheetRef, useValue: {} },
    LoaderService,
    InitResolver,
    EventService,
    ViewerResolve,
    EventResolve,
    DatePipe,
    EventsEngagementComponent
  ],
})
export class EventsModule { }
