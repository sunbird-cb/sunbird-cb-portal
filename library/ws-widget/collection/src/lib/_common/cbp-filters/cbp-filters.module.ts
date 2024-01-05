import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatCardModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatTabsModule,
  MatBottomSheetModule,
  MatMenuModule,
  MatRadioModule
} from '@angular/material';

import { CbpFiltersComponent } from './cbp-filters.component';
import { FilterSearchPipeModule } from 'src/app/pipes/filter-search/filter-search.module';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatCardModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatTabsModule,
        MatBottomSheetModule,
        MatMenuModule,
        MatRadioModule,
        FilterSearchPipeModule
    ],
    exports: [
        CbpFiltersComponent
    ],
    declarations: [
        CbpFiltersComponent
    ],
    providers: [],
})

export class CbpFiltersModule { }
