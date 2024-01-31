import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import {
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatTabsModule,
} from '@angular/material'
import { MatCardModule } from '@angular/material/card'
import { EventsRoutingModule } from './events-routing.module'
import { EventsHomeComponent } from './routes/events-home/events-home.component'
import { EventsComponent } from './routes/events/events.component'
import { LoaderService } from '@ws/author/src/public-api'
import { InitResolver } from '@ws/author/src/lib/services/init-resolve.service'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { BtnPageBackModule, ContentStripWithTabsModule } from '@sunbird-cb/collection/src/public-api'
import { PipeOrderByModule } from '@sunbird-cb/utils/src/lib/pipes/pipe-order-by/pipe-order-by.module'
import { AvatarPhotoModule } from '@sunbird-cb/collection/src/lib/_common/avatar-photo/avatar-photo.module'
import { PipeHtmlTagRemovalModule, PipeFilterV2Module, PipePublicURLModule, HorizontalScrollerV2Module } from '@sunbird-cb/utils'
import { PipeRelativeTimeModule } from '@sunbird-cb/utils/src/lib/pipes/pipe-relative-time/pipe-relative-time.module'
import { PipeFilterSearchModule } from '@sunbird-cb/utils/src/lib/pipes/pipe-filter-search/pipe-filter-search.module'
import { PipeFilterModule } from '@sunbird-cb/utils/src/lib/pipes/pipe-filter/pipe-filter.module'
import { EventsCardComponent } from './components/events-card/events-card.component'
import { TodayEventCardComponent } from './components/today-event-card/today-event-card.component'
import { EventDetailComponent } from './routes/event-detail/event-detail.component'
import { RelatedPostsComponent } from './components/related-posts/related-posts.component'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { RightMenuCardComponent } from './components/right-menu-card/right-menu-card.component'
import { PresenterCardComponent } from './components/presenter-card/presenter-card.component'
import { EventService } from './services/events.service'
import { TranslateModule } from '@ngx-translate/core'

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
    TranslateModule.forChild({}),
    HorizontalScrollerV2Module,
    ContentStripWithTabsModule,
  ],
  providers: [
    LoaderService,
    InitResolver,
    EventService,
  ],
})
export class EventsModule { }
