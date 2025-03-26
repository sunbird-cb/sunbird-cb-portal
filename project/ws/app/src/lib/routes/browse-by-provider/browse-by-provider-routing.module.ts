import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AllProvidersComponent } from './routes/all-providers/all-providers.component'
import { ProviderDetailsComponent } from './routes/provider-details/provider-details.component'
// import { ProviderOverviewComponent } from './routes/provider-overview/provider-overview.component'
import { ProviderAllCbpComponent } from './routes/provider-all-cbp/provider-all-cbp.component'
// import { InsightsComponent } from './routes/insights/insights.component'
// import { ProviderPageComponent } from './routes/provider-page/provider-page.component'
import { ProviderFormResolverService } from './services/provider-form-resolver.service'
import { ProviderCalendarComponent } from './routes/provider-calendar/provider-calendar.component'
import { ProviderContentAllComponent } from './routes/provider-content-all/provider-content-all.component'
import { ContentReadResolverService } from './services/content-read-resolver.service'
import { ProviderPageV2Component } from './routes/provider-page-v2/provider-page-v2.component'

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
    resolve: {
      contentData: ContentReadResolverService,
    },
  },
  {
    path: ':provider/:orgId',
    // pathMatch: 'full',
    component: ProviderDetailsComponent,
    // redirectTo: 'overview',
    data: {
      pageId: ':provider-name',
      module: 'Learn',
    },
    children: [
      // {
      //   path: '',
      //   redirectTo: 'all-CBP',
      // },
      // {
      //   path: 'overview',
      //   component: ProviderOverviewComponent,
      //   data: {
      //     pageId: 'overview',
      //     module: 'explore',
      //   },
      // },
      {
        path: 'all-CBP',
        component: ProviderAllCbpComponent,
        data: {
          pageId: 'all-CBP',
          module: 'explore',
        },
      },
      // {
      //   path: 'insights',
      //   component: InsightsComponent,
      //   data: {
      //     pageId: 'insights',
      //     module: 'explore',
      //   },
      // },
    ],
  },
  {
    path: ':provider/:orgId/all-content',
    component: ProviderContentAllComponent,
    data: {
      pageId: 'all-content',
      module: 'explore',
    },
  },
  // {
  //   path: ':provider/:orgId/micro-sites',
  //   component: ProviderPageComponent,
  //   data: {
  //     pageId: ':provider/:orgId/micro-sites',
  //     module: 'explore',
  //   },
  //   resolve: {
  //     formData: ProviderFormResolverService,
  //   },
  // },
  {
    path: ':provider/:orgId/micro-sites',
    component: ProviderPageV2Component,
    data: {
      pageId: ':provider/:orgId/v2/micro-sites',
      module: 'explore',
    },
    resolve: {
      formData: ProviderFormResolverService,
    },
  },
  {
    path: ':provider/:orgId/training-calendar',
    component: ProviderCalendarComponent,
    data: {
      pageId: ':provider/:orgId/training-calendar',
      module: 'explore',
    },
    resolve: {
      formData: ProviderFormResolverService,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowseByProviderRoutingModule { }
