import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AllProvidersComponent } from './routes/all-providers/all-providers.component'
import { ProviderDetailsComponent } from './routes/provider-details/provider-details.component'
import { ProviderOverviewComponent } from './routes/provider-overview/provider-overview.component'
import { ProviderAllCbpComponent } from './routes/provider-all-cbp/provider-all-cbp.component'
import { InsightsComponent } from './routes/insights/insights.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all-providers',
  },
  {
    path: 'all-providers',
    component: AllProvidersComponent,
  },
  {
    path: ':provider',
    // pathMatch: 'full',
    component: ProviderDetailsComponent,
    // redirectTo: 'overview',
    children: [
      {
        path: '',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        component: ProviderOverviewComponent,
      },
      {
        path: 'all-CBP',
        component: ProviderAllCbpComponent,
      },
      {
        path: 'insights',
        component: InsightsComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowseByProviderRoutingModule { }
