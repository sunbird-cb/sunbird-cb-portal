import { EventResolverService } from './services/event-resolver.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AppEventComponent } from './components/app-event/app-event.component'
import { AppEventRoutingModule } from './app-event-routing.module'

import { MatDividerModule } from '@angular/material/divider'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { ProfileDetailModule } from './components/profile-detail/profile-detail.module'
import { HorizontalScrollerModule } from '@sunbird-cb/utils-v2'
import { EventOverviewComponent } from './components/event-overview/event-overview.component'
import { EventSessionsComponent } from './components/event-sessions/event-sessions.component'
import { EventBannerComponent } from './components/event-banner/event-banner.component'
import { AppGalleryComponent } from './components/app-gallery/app-gallery.component'
import { EventService } from './services/event.service'
import { IframeLoaderComponent } from './components/iframe-loader/iframe-loader.component'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BtnPageBackModule, BtnFullscreenModule } from '@sunbird-cb/collection'
import { CardDetailsModule } from './components/card-details/card-details.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'

@NgModule({
  declarations: [AppEventComponent,
    EventOverviewComponent,
    EventSessionsComponent,
    EventBannerComponent,
    IframeLoaderComponent,
    AppGalleryComponent,
  ],
  imports: [
    CommonModule,
    CardDetailsModule,
    AppEventRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    HorizontalScrollerModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    BtnPageBackModule,
    ProfileDetailModule,
    MatSelectModule,
    MatTabsModule,
    BtnFullscreenModule,
  ],
  providers: [
    EventResolverService,
    EventService,
  ],
})
export class AppEventModule { }
