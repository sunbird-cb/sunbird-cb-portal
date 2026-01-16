import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CbpFiltersComponent } from './cbp-filters.component'
import { FilterSearchPipeModule } from 'src/app/pipes/filter-search/filter-search.module'
import { TranslateModule } from '@ngx-translate/core'
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'

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
