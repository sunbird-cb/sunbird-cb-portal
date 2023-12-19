import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CompetencyPassbookRoutingModule } from './competency-passbook-routing.module';
import { CompetencyPassbookComponent } from './competency-passbook/competency-passbook.component';
import { CompetencyPassbookSideBarComponent } from './../component/competency-passbook-side-bar/competency-passbook-side-bar.component';


@NgModule({
  declarations: [CompetencyPassbookComponent, CompetencyPassbookSideBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    CompetencyPassbookRoutingModule
  ]
})

export class CompetencyPassbookModule { }
