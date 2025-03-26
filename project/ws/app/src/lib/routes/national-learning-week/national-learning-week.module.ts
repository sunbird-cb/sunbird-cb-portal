import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  PipeOrderByModule,
  PipeFilterV2Module,
} from '@sunbird-cb/utils-v2'
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatListModule,
  MatSidenavModule,
  MatCardModule,
  MatExpansionModule,
  MatRadioModule,
  MatChipsModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatButtonToggleModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatMenuModule,
} from '@angular/material'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'
import {
  CommonMethodsService,
  CommonStripModule,
  ContentStripWithTabsLibModule,
  NationalLearningModule,
  SlidersLibModule} from '@sunbird-cb/consumption'
import { BtnPageBackModule } from '@sunbird-cb/collection/src/public-api'
import { MdoChannelFormService } from '../mdo-channels/service/mdo-channel-form.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MdoChannelDataService } from '../mdo-channels/service/mdo-channel-data.service'
import { AllContentService } from '../mdo-channels/service/all-content.service'
import { NationalLearningWeekRoutingModule } from './national-learning-week-routing.module'
import { NationalLearningWeekMicrositeComponent } from './national-learning-week-microsite/national-learning-week-microsite.component'

@NgModule({
  declarations: [NationalLearningWeekMicrositeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NationalLearningWeekRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
    MatExpansionModule,
    MatRadioModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    PipeOrderByModule,
    PipeFilterV2Module,
    BtnPageBackModule,
    CardContentV2Module,
    ContentStripWithTabsLibModule,
    SlidersLibModule,
    CommonStripModule,
    MatMenuModule,
    NationalLearningModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [MdoChannelFormService, AllContentService, CommonMethodsService, MdoChannelDataService],
})
export class NationalLearningWeekModule { }
