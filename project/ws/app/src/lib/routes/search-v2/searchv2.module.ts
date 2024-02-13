import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
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
} from '@sunbird-cb/utils'
import { Searchv2RoutingModule } from './searchv2-routing.module'
import { GlobalSearchComponent } from './routes/global-search/global-search.component'
import { LearnSearchComponent } from './routes/learn-search/learn-search.component'
import { SearchFiltersComponent } from './components/search-filters/search-filters.component'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    GlobalSearchComponent,
    LearnSearchComponent,
    SearchFiltersComponent,
  ],
  imports: [
    CommonModule,
    Searchv2RoutingModule,
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
  ],
  exports: [],
  providers: [],
})
export class Searchv2Module { }
