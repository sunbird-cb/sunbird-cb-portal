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
    data: {
      pageId: 'all-providers',
      module: 'Learn',
    },
  },
  {
    path: ':provider',
    // pathMatch: 'full',
    component: ProviderDetailsComponent,
    // redirectTo: 'overview',
    data: {
      pageId: ':provider-name',
      module: 'Learn',
    },
    children: [
      {
        path: '',
        redirectTo: 'all-CBP',
      },
      {
        path: 'overview',
        component: ProviderOverviewComponent,
        data: {
          pageId: 'overview',
          module: 'explore',
        },
      },
      {
        path: 'all-CBP',
        component: ProviderAllCbpComponent,
        data: {
          pageId: 'all-CBP',
          module: 'explore',
        },
      },
      {
        path: 'insights',
        component: InsightsComponent,
        data: {
          pageId: 'insights',
          module: 'explore',
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowseByProviderRoutingModule { }
