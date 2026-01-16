import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  BtnChannelAnalyticsModule,
  BtnContentDownloadModule,
  BtnContentLikeModule,
  BtnContentMailMeModule,
  BtnContentShareModule,
  BtnGoalsModule,
  BtnKbModule,
  BtnPageBackModule,
  BtnPlaylistModule,
  DisplayContentTypeModule,
  PipeContentRouteModule,
  BtnKbAnalyticsModule,
  UserAutocompleteModule,
  AvatarPhotoModule
} from '@sunbird-cb/collection';
import { WidgetResolverModule } from '@sunbird-cb/resolver';
import {
  DefaultThumbnailModule,
  HorizontalScrollerModule,
  PipeDurationTransformModule,
  PipeLimitToModule,
  PipePartialContentModule,
  PipePublicURLModule,
} from '@sunbird-cb/utils-v2';
import { GlobalSearchComponent } from './routes/global-search/global-search.component';
import { LearnSearchComponent } from './routes/learn-search/learn-search.component';
import { SearchFiltersComponent } from './components/search-filters/search-filters.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SearchV3RoutingModule } from './search-v3-routing.module';
import { SearchInputHomeComponent } from './components/search-input-home/search-input-home.component';
import { CourseContentCardComponent } from './components/course-content-card/course-content-card.component';
import { SearchEventCardComponent } from './components/search-event-card/search-event-card.component';
import { PeopleConnectionCardComponent } from './components/people-connection-card/people-connection-card.component';
import { CommunityContentCardComponent } from './components/community-content-card/community-content-card.component';
import {NumberShortenerPipe} from './pipes/number-shortener.pipe'
import {PluralPipe} from './pipes/plural.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchSortInputComponent } from './components/search-sort-input/search-sort-input.component'
import { CardsModule, DialogComponentsModule } from '@sunbird-cb/consumption';
import { SkeletonLoaderModule } from '../../../../../../../library/ws-widget/collection/src/lib/_common/skeleton-loader/skeleton-loader.module';
import { SkeletonLoaderContentComponent } from './components/skeleton-loader-content/skeleton-loader-content.component';
import { SkeletonLoaderPeoplesComponent } from './components/skeleton-loader-peoples/skeleton-loader-peoples.component';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { ShowAllComponent } from './routes/show-all/show-all.component';
@NgModule({
  declarations: [
    GlobalSearchComponent,
    LearnSearchComponent,
    SearchFiltersComponent,
    SearchInputHomeComponent,
    CourseContentCardComponent,
    SearchEventCardComponent,
    PeopleConnectionCardComponent,
    CommunityContentCardComponent,
    NumberShortenerPipe,
    PluralPipe,
    PaginationComponent,
    SearchSortInputComponent,
    SkeletonLoaderContentComponent,
    SkeletonLoaderPeoplesComponent,
    ShowAllComponent
  ],
  imports: [
    CommonModule,
    SearchV3RoutingModule,
    BtnPageBackModule,
    MatToolbarModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
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
    AvatarPhotoModule,
    DialogComponentsModule,
    SkeletonLoaderModule,
    MatRadioModule,
    CardsModule
  ],
  exports: [SearchInputHomeComponent, NumberShortenerPipe, PluralPipe],
  providers: [],
})
export class SearchV3Module {}
