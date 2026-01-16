import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule } from '@angular/material/legacy-select';



@NgModule({
  declarations: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatLegacySelectModule
  ],
  exports: [PaginationComponent]
})
export class PaginationModule { }
