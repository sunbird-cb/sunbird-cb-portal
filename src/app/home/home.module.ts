import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { HeaderModule } from '../header/header.module';
import { HomeComponent } from './home/home.component';
import { InsightSideBarComponent } from '../component/in-sight-side-bar/in-sight-side-bar.component';
import { DiscussionInfoComponent } from '../component/discussion-info/discussion-info.component';
import { PageContainerComponent } from '../component/page-container/page-container.component';
import {
  GridLayoutModule,  SlidersModule, DiscussStripMultipleModule, NetworkStripMultipleModule, ContentStripWithTabsModule
} from '@sunbird-cb/collection';
import { FeedListComponent } from './home/feed-list/feed-list.component';
import { SkeletonLoaderComponent } from '../component/skeleton-loader/skeleton-loader.component';
import { ProfileCardStatsModule } from '@sunbird-cb/collection/src/lib/_common/profile-card-stats/profile-card-stats.module'
import { SharedModule } from '../shared/shared.module';
import { WeeklyClapsModule } from '@sunbird-cb/collection/src/lib/_common/weekly-claps/weekly-claps.module';
import { ClientSliderComponent } from '../component/client-slider/client-slider.component';
import { NoDataComponent } from '../component/no-data/no-data.component';
import { HomeOtherPortalComponent } from '../component/home-other-portal/home-other-portal.component';
@NgModule({
  declarations: [HomeComponent, FeedListComponent, NoDataComponent, InsightSideBarComponent, HomeOtherPortalComponent, ClientSliderComponent,  PageContainerComponent, DiscussionInfoComponent, SkeletonLoaderComponent],
  imports: [
    CommonModule,    
    HomeRoutingModule,
    GridLayoutModule,
    SlidersModule,
    DiscussStripMultipleModule, 
    NetworkStripMultipleModule,
    ContentStripWithTabsModule,
    MatCardModule,
    MatIconModule,
    SharedModule,
    ProfileCardStatsModule,
    MatIconModule,
    WeeklyClapsModule
  ],
  exports: [
    HeaderModule,
    MatCardModule,
    SharedModule
  ]
})
export class HomeModule { }
