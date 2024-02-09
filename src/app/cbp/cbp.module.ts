import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { CbpRoutingModule } from './cbp-routing.module'

import {
  MatIconModule,
  MatCardModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatTabsModule,
  MatBottomSheetModule,
  MatMenuModule,
  MatRadioModule,
} from '@angular/material'
import { HeaderModule } from '../header/header.module'
import {
  GridLayoutModule,  SlidersModule,  ContentStripWithTabsModule, AvatarPhotoModule,
} from '@sunbird-cb/collection'
import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module'
import { ProfileCardStatsModule } from '@sunbird-cb/collection/src/lib/_common/profile-card-stats/profile-card-stats.module'
import { PipeRelativeTimeModule } from '@sunbird-cb/utils'
import { SharedModule } from '../shared/shared.module'

import { CbpPlanComponent } from './cbp-plan/cbp-plan.component'
import { CbpSideBarComponent } from '../component/cbp-side-bar/cbp-side-bar.component'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'

import { CbpPlanStatsComponent } from '../component/cbp-plan-stats/cbp-plan-stats.component'
import { MyCompetencyPassbookComponent } from '../component/my-competency-passbook/my-competency-passbook.component'
import { UpcomingTimelineComponent } from '../component/upcoming-timeline/upcoming-timeline.component'
import { OverduePlanComponent } from '../component/overdue-plan/overdue-plan.component'
import { CbpPlanFeedComponent } from '../component/cbp-plan-feed/cbp-plan-feed.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FilterComponent } from '../component/filter/filter.component'
import { FilterSearchPipeModule } from '../pipes/filter-search/filter-search.module'
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [CbpPlanComponent, CbpPlanStatsComponent, MyCompetencyPassbookComponent,
    UpcomingTimelineComponent,
    OverduePlanComponent,
    CbpPlanFeedComponent,
    FilterComponent,
     CbpSideBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CbpRoutingModule,
    MatExpansionModule,
    GridLayoutModule,
    SlidersModule,
    ContentStripWithTabsModule,
    MatBottomSheetModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    SharedModule,
    MatTabsModule,
    ProfileCardStatsModule,
    MatIconModule,
    SkeletonLoaderModule,
    PipeRelativeTimeModule,
    AvatarPhotoModule,
    CardContentV2Module,
    FilterSearchPipeModule,
    MatMenuModule,
    MatRadioModule,
    TranslateModule,
  ],
  exports: [
    HeaderModule,
    MatCardModule,
    SharedModule,
  ],
  providers: [
  ],
  entryComponents: [
    FilterComponent,
  ],
})
export class CbpModule { }
