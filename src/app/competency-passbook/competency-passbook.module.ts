import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

import { CompetencyPassbookRoutingModule } from './competency-passbook-routing.module';
import { CompetencyPassbookComponent } from './competency-passbook/competency-passbook.component';
import { CompetencyPassbookSideBarComponent } from './../component/competency-passbook-side-bar/competency-passbook-side-bar.component';
import { CompetencySearchComponent } from './competency-search/competency-search.component';

@NgModule({
  declarations: [CompetencyPassbookComponent, CompetencyPassbookSideBarComponent, CompetencySearchComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    CompetencyPassbookRoutingModule
  ]
})

export class CompetencyPassbookModule { }
