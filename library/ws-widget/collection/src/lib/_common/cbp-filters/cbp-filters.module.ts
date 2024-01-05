import { NgModule } from '@angular/core';

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
import { CbpFiltersComponent } from './cbp-filters.component';

@NgModule({
    imports: [
        MatIconModule,
        MatCardModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatTabsModule,
        MatBottomSheetModule,
        MatMenuModule,
        MatRadioModule
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
