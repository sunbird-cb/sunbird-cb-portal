import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
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

import { CbpFiltersComponent } from './cbp-filters.component'
import { FilterSearchPipeModule } from 'src/app/pipes/filter-search/filter-search.module'
import { TranslateModule } from '@ngx-translate/core'

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
        FilterSearchPipeModule,
        TranslateModule,
    ],
    exports: [
        CbpFiltersComponent,
    ],
    declarations: [
        CbpFiltersComponent,
    ],
    providers: [],
})

export class CbpFiltersModule { }
