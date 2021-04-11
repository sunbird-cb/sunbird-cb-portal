import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { ConfigResolverService } from './resolvers/config-resolver.service'
import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
  {
    path: 'my-feedback',
    loadChildren: () =>
      import('./routes/my-feedback/my-feedback.module').then(u => u.MyFeedbackModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./routes/provide-feedback/provide-feedback.module').then(u => u.ProvideFeedbackModule),
  },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        children: routes,
        resolve: {
          configData: ConfigResolverService,
          profileData: ProfileResolverService,
        }
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [ ConfigResolverService, ProfileResolverService],
})
export class FeedbackV2RoutingModule {}
