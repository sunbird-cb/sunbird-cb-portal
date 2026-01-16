import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { CbpFiltersModule } from '@sunbird-cb/collection/src/lib/_common/cbp-filters/cbp-filters.module'

import { SkeletonLoaderModule } from '@sunbird-cb/collection/src/lib/_common/skeleton-loader/skeleton-loader.module'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { CompetencyPassbookRoutingModule } from './competency-passbook-routing.module'

import { CompetencyPassbookComponent } from './competency-passbook/competency-passbook.component'
import { CompetencyListComponent } from './competency-list/competency-list.component'
import { CompetencyCardDetailsComponent } from './competency-card-details/competency-card-details.component'
// tslint:disable-next-line: max-line-length
import { CompetencyPassbookSideBarComponent } from './../component/competency-passbook-side-bar/competency-passbook-side-bar.component'
import { CompetencySearchComponent } from './competency-search/competency-search.component'
import { TranslateModule } from '@ngx-translate/core'
import { DialogComponentsModule } from '@sunbird-cb/consumption'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'

@NgModule({
  declarations: [
    CompetencyPassbookComponent,
    CompetencyPassbookSideBarComponent,
    CompetencySearchComponent,
    CompetencyListComponent,
    CompetencyCardDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    CompetencyPassbookRoutingModule,
    SkeletonLoaderModule,
    PipeSafeSanitizerModule,
    CbpFiltersModule,
    TranslateModule,
    DialogComponentsModule,
  ],
  exports: [
    TranslateModule,
  ],
})

export class CompetencyPassbookModule { }
