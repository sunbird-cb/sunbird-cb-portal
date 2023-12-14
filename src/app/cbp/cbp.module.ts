import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CbpRoutingModule } from './cbp-routing.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { HeaderModule } from '../header/header.module';
import {
  GridLayoutModule,  SlidersModule,  ContentStripWithTabsModule, AvatarPhotoModule
} from '@sunbird-cb/collection';
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module';
import { ProfileCardStatsModule } from '@sunbird-cb/collection/src/lib/_common/profile-card-stats/profile-card-stats.module';
import { PipeRelativeTimeModule } from '@sunbird-cb/utils';
import { SharedModule } from '../shared/shared.module';

import { CbpPlanComponent } from './cbp-plan/cbp-plan.component';
import { NoDataComponent } from '../component/no-data/no-data.component';
import { CbpSideBarComponent } from '../component/cbp-side-bar/cbp-side-bar.component';

import { CbpPlanStatsComponent } from '../component/cbp-plan-stats/cbp-plan-stats.component';
import { MyCompetencyPassbookComponent } from '../component/my-competency-passbook/my-competency-passbook.component';
import { UpcomingTimelineComponent } from '../component/upcoming-timeline/upcoming-timeline.component';
import { OverduePlanComponent } from '../component/overdue-plan/overdue-plan.component';
import { CbpPlanFeedComponent } from '../component/cbp-plan-feed/cbp-plan-feed.component';
@NgModule({
  declarations: [CbpPlanComponent, CbpPlanStatsComponent, MyCompetencyPassbookComponent,
    UpcomingTimelineComponent,
    OverduePlanComponent,
    CbpPlanFeedComponent,
    NoDataComponent, CbpSideBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    CbpRoutingModule,
    GridLayoutModule,
    SlidersModule,
    ContentStripWithTabsModule,
    MatCardModule,
    MatIconModule,
    SharedModule,
    ProfileCardStatsModule,
    MatIconModule,
    SkeletonLoaderModule,
    PipeRelativeTimeModule,
    AvatarPhotoModule
  ],
  exports: [
    HeaderModule,
    MatCardModule,
    SharedModule
  ],
  providers: [
  ]
})
export class CbpModule { }
