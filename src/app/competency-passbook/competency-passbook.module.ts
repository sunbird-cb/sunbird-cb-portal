import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatIconModule,
  MatCardModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatTabsModule,
  MatBottomSheetModule,
  MatMenuModule,
  MatRadioModule
} from '@angular/material'

import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module';
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils/src/public-api';
import { CompetencyPassbookRoutingModule } from './competency-passbook-routing.module';

import { CompetencyPassbookComponent } from './competency-passbook/competency-passbook.component';
import { CompetencyListComponent } from './competency-list/competency-list.component';
import { CompetencyCardDetailsComponent } from './competency-card-details/competency-card-details.component';
import { CompetencyPassbookSideBarComponent } from './../component/competency-passbook-side-bar/competency-passbook-side-bar.component';
import { CompetencySearchComponent } from './competency-search/competency-search.component';
// import { FilterComponent } from '../component/filter/filter.component';

@NgModule({
  declarations: [CompetencyPassbookComponent, CompetencyPassbookSideBarComponent, CompetencySearchComponent, CompetencyListComponent, CompetencyCardDetailsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatBottomSheetModule,
    MatRadioModule,
    CompetencyPassbookRoutingModule,
    SkeletonLoaderModule,
    PipeSafeSanitizerModule
  ]
})

export class CompetencyPassbookModule { }
