import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatMenuModule, MatOptionModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDividerModule,
  MatListModule,
  MatSelectModule,
} from '@angular/material'
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
import { CardsModule } from '@sunbird-cb/consumption'

@NgModule({
  declarations: [
    SeeAllHomeComponent,
    SeeAllWithPillsComponent,
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
  ],
  exports: [SeeAllHomeComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [SeeAllHomeComponent],
})
export class SeeAllModule { }
