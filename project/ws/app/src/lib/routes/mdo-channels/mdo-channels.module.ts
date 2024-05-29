import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  PipeOrderByModule,
  PipeFilterV2Module,
} from '@sunbird-cb/utils'
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
} from '@angular/material'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'
import {
  AnnouncementsModule,
  CardsModule,
  CommonStripModule,
  CompetencyPassbookModule,
  ContentStripWithTabsLibModule,
  DataPointsModule,
  SlidersLibModule,
} from '@sunbird-cb/consumption'
import { MdoChannelsComponent } from './mdo-channels/mdo-channels.component'
import { MdoChannelsMicrositeComponent } from './mdo-channels-microsite/mdo-channels-microsite.component'
import { MdoChannelsRoutingModule } from './mdo-channels-routing.module'
import { BtnPageBackModule } from '@sunbird-cb/collection/src/public-api'
import { MdoChannelFormService } from './service/mdo-channel-form.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [MdoChannelsComponent, MdoChannelsMicrositeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdoChannelsRoutingModule,
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
    CompetencyPassbookModule,
    DataPointsModule,
    SlidersLibModule,
    CommonStripModule,
    CardsModule,
    AnnouncementsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [MdoChannelFormService],
})
export class MDOChannelsModule { }
