import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module';
import { CompetencyPassbookRoutingModule } from './competency-passbook-routing.module';

import { CompetencyPassbookComponent } from './competency-passbook/competency-passbook.component';
import { CompetencyListComponent } from './competency-list/competency-list.component';
import { CompetencyCardDetailsComponent } from './competency-card-details/competency-card-details.component';
import { CompetencyPassbookSideBarComponent } from './../component/competency-passbook-side-bar/competency-passbook-side-bar.component';
import { CompetencySearchComponent } from './competency-search/competency-search.component';

@NgModule({
  declarations: [CompetencyPassbookComponent, CompetencyPassbookSideBarComponent, CompetencySearchComponent, CompetencyListComponent, CompetencyCardDetailsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    CompetencyPassbookRoutingModule,
    SkeletonLoaderModule
  ]
})

export class CompetencyPassbookModule { }
