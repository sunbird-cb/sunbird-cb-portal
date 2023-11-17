import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module';
import { FeedListComponent } from './home/feed-list/feed-list.component';
import { SkeletonLoaderComponent } from '../component/skeleton-loader/skeleton-loader.component';
import { ProfileCardStatsModule } from '@sunbird-cb/collection/src/lib/_common/profile-card-stats/profile-card-stats.module'
import { ClientSliderComponent } from '../component/client-slider/client-slider.component';
import { HomeOtherPortalComponent } from '../component/home-other-portal/home-other-portal.component';
import { NoDataComponent } from '../component/no-data/no-data.component';
import { SharedModule } from '../shared/shared.module';
import { WeeklyClapsModule } from '@sunbird-cb/collection/src/lib/_common/weekly-claps/weekly-claps.module';
import { HomePageService } from '../services/home-page.service';
import { HomeContainerComponent } from '../component/home-container/home-container.component.ts';
import { DiscussHubComponent } from './home/discuss-hub/discuss-hub.component';
import { NetworkHubComponent } from './home/network-hub/network-hub.component';

@NgModule({
  declarations: [HomeComponent, FeedListComponent, InsightSideBarComponent, PageContainerComponent, DiscussionInfoComponent, SkeletonLoaderComponent, ClientSliderComponent, HomeOtherPortalComponent, NoDataComponent, HomeContainerComponent, DiscussHubComponent, NetworkHubComponent],
  imports: [
    CommonModule,
    RouterModule,
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
    WeeklyClapsModule,
    SkeletonLoaderModule
  ],
  exports: [
    HeaderModule,
    MatCardModule,
    SharedModule
  ],
  providers: [
    HomePageService
  ]
})
export class HomeModule { }
