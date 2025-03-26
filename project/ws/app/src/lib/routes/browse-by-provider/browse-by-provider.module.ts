import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { BrowseByProviderRoutingModule } from './browse-by-provider-routing.module'
import { AvatarPhotoModule, BtnPageBackModule, CardContentModule, ContentStripWithTabsModule, SlidersModule } from '@sunbird-cb/collection'
import {
  PipeFilterModule,
  PipeHtmlTagRemovalModule,
  PipeOrderByModule,
  PipeRelativeTimeModule,
  PipeFilterSearchModule,
  PipeFilterV2Module,
} from '@sunbird-cb/utils-v2'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDividerModule } from '@angular/material/divider'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
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
  MatCheckboxModule,
  MatTooltipModule,
  MatMenuModule,
} from '@angular/material'
import { MatCardModule } from '@angular/material/card'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { AllProvidersComponent } from './routes/all-providers/all-providers.component'
import { ProviderDetailsComponent } from './routes/provider-details/provider-details.component'
import { ProviderOverviewComponent } from './routes/provider-overview/provider-overview.component'
import { ProviderAllCbpComponent } from './routes/provider-all-cbp/provider-all-cbp.component'
import { InsightsComponent } from './routes/insights/insights.component'
import { ProviderLeftMenuComponent } from './components/left-menu/left-menu.component'
import { BrowseProviderService } from './services/browse-provider.service'
import { PopularProviderCardComponent } from './components/popular-provider-card/popular-provider-card.component'
import { ProviderCardComponent } from './components/provider-card/provider-card.component'
import { CardContentV2Module } from '@sunbird-cb/collection/src/lib/card-content-v2/card-content-v2.module'
import { HttpClient } from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { HttpLoaderFactory } from 'src/app/app.module'
import { ProviderPageComponent } from './routes/provider-page/provider-page.component'
import { CalenderModule, CardsModule, CommonStripModule, CompetencyPassbookModule, ContentStripWithTabsLibModule, DataPointsModule, SlidersLibModule, UserContentRatingLibModule, ProvidersModule } from '@sunbird-cb/consumption'
import { ProviderFormResolverService } from './services/provider-form-resolver.service'
import { FormExtService } from 'src/app/services/form-ext.service'
import { ProviderCalendarComponent } from './routes/provider-calendar/provider-calendar.component'
import { ProviderContentAllComponent } from './routes/provider-content-all/provider-content-all.component'
import { ProviderPageV2Component } from './routes/provider-page-v2/provider-page-v2.component'

@NgModule({
  declarations: [
    AllProvidersComponent,
    ProviderDetailsComponent,
    ProviderOverviewComponent,
    ProviderAllCbpComponent,
    InsightsComponent,
    ProviderLeftMenuComponent,
    PopularProviderCardComponent,
    ProviderCardComponent,
    ProviderPageComponent,
    ProviderCalendarComponent,
    ProviderContentAllComponent,
    ProviderPageV2Component,
  ],
  imports: [
    CommonModule,
    BrowseByProviderRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatGridListModule,
    MatExpansionModule, ProvidersModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    PipeFilterModule,
    PipeHtmlTagRemovalModule,
    PipeRelativeTimeModule,
    PipeFilterSearchModule,
    PipeOrderByModule,
    PipeFilterV2Module,
    BtnPageBackModule,
    WidgetResolverModule,
    CardContentModule,
    CardContentV2Module,
    SlidersModule,
    ContentStripWithTabsModule,
    ContentStripWithTabsLibModule,
    CompetencyPassbookModule,
    DataPointsModule,
    SlidersLibModule,
    CommonStripModule,
    UserContentRatingLibModule,
    CalenderModule,
    CardsModule,
    MatCheckboxModule,
    MatTooltipModule,
    AvatarPhotoModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [BrowseProviderService, DatePipe, ProviderFormResolverService, FormExtService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BrowseByProviderModule { }
