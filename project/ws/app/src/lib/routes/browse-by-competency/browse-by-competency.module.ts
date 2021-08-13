import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PipeFilterModule, PipeHtmlTagRemovalModule, PipeOrderByModule, PipeRelativeTimeModule, PipeListFilterModule } from '@sunbird-cb/utils'
import { MatGridListModule } from '@angular/material/grid-list'

import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { AvatarPhotoModule, BtnPageBackModule } from '@sunbird-cb/collection'
import {
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatMenuModule,
  MatOptionModule,
  MatRippleModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDividerModule,

} from '@angular/material'
import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { BrowseByCompetencyRoutingModule } from './browse-by-competency-routing.module'
import { AllCompetenciesComponent } from './routes/all-competencies/all-competencies.component'
import { CompetencyDetailsComponent } from './routes/competency-details/competency-details.component'

@NgModule({
  declarations: [AllCompetenciesComponent, CompetencyDetailsComponent],
  imports: [
    CommonModule,
    BrowseByCompetencyRoutingModule,
    MatGridListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatMenuModule,
    MatOptionModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    PipeFilterModule,
    PipeHtmlTagRemovalModule,
    PipeRelativeTimeModule,
    AvatarPhotoModule,
    PipeOrderByModule,
    PipeListFilterModule,
    BtnPageBackModule,
    WidgetResolverModule,

  ],
  providers: [
    LoaderService,
  ],
})
export class BrowseByCompetencyModule { }
