import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompetencyPassbookComponent } from './competency-passbook/competency-passbook.component';
import { CompetencyPassbookSideBarComponent } from './../component/competency-passbook-side-bar/competency-passbook-side-bar.component';


@NgModule({
  declarations: [CompetencyPassbookComponent, CompetencyPassbookSideBarComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CompetencyPassbookModule { }
