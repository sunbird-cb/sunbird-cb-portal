import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import {
  BtnChannelAnalyticsModule,
  BtnContentDownloadModule,
  BtnContentLikeModule,
  BtnContentMailMeModule,
  BtnContentShareModule,
  BtnGoalsModule, BtnKbModule,
  BtnPageBackModule,
  BtnPlaylistModule,
  DisplayContentTypeModule,
  PipeContentRouteModule,
  BtnKbAnalyticsModule,
  UserAutocompleteModule,
} from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  DefaultThumbnailModule,
  HorizontalScrollerModule, PipeDurationTransformModule, PipeLimitToModule, PipePartialContentModule, PipePublicURLModule,
} from '@sunbird-cb/utils-v2'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { SeeAllRoutingModule } from './seeAll-routing.module'
import { SeeAllHomeComponent } from './components/see-all-home/see-all-home.component'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
import { TranslateModule } from '@ngx-translate/core'
import { SeeAllWithPillsComponent } from './components/see-all-with-pills/see-all-with-pills.component'
import { CardsModule, PaginationModule } from '@sunbird-cb/consumption'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatRippleModule } from '@angular/material/core'
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core'
import { MatDividerModule } from '@angular/material/divider'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SeeAllDynamicComponent } from './components/see-all-dynamic/see-all-dynamic.component'

@NgModule({
    declarations: [
        SeeAllHomeComponent,
        SeeAllWithPillsComponent,
        SeeAllDynamicComponent,
    ],
    imports: [
        CommonModule,
        SeeAllRoutingModule,
        CardContentV2Module,
        BtnPageBackModule,
        MatToolbarModule,
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatIconModule,
        MatMenuModule,
        MatChipsModule,
        MatListModule,
        MatSelectModule,
        MatCardModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatSidenavModule,
        MatRippleModule,
        DefaultThumbnailModule,
        MatTooltipModule,
        PipeContentRouteModule,
        PipeLimitToModule,
        PipeDurationTransformModule,
        BtnContentDownloadModule,
        BtnContentLikeModule,
        BtnContentShareModule,
        BtnPlaylistModule,
        BtnGoalsModule,
        BtnContentMailMeModule,
        BtnKbAnalyticsModule,
        PipePartialContentModule,
        PipePublicURLModule,
        HorizontalScrollerModule,
        MatProgressSpinnerModule,
        DisplayContentTypeModule,
        WidgetResolverModule,
        BtnKbModule,
        BtnChannelAnalyticsModule,
        MatDividerModule,
        UserAutocompleteModule,
        InfiniteScrollModule,
        TranslateModule,
        CardsModule,
        PaginationModule
    ],
    exports: [SeeAllHomeComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SeeAllModule { }
