import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BrowseByProviderRoutingModule } from './browse-by-provider-routing.module'
import { BtnPageBackModule, CardContentModule } from '@sunbird-cb/collection'
import {
  PipeFilterModule,
  PipeHtmlTagRemovalModule,
  PipeOrderByModule,
  PipeRelativeTimeModule,
  PipeFilterSearchModule,
  PipeFilterV2Module,
} from '@sunbird-cb/utils'
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
  ],
  imports: [
    CommonModule,
    BrowseByProviderRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatGridListModule,
    MatExpansionModule,
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [BrowseProviderService],
})
export class BrowseByProviderModule { }
