import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ProfileComponent } from './routes/profile/profile.component'
// import { InitResolver } from './resol./routes/profile-v2/discuss-all.component'
import { Profilev2Resolve } from './resolvers/profile-v2-resolve'
import { ProfileViewComponent } from './routes/profile-view/profile-view.component'
import { Profilev2BadgesResolve } from './resolvers/badges-resolve'
// import { ConfigurationsService } from './resolvers/config-resolver.service'
// import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'me',
        component: ProfileViewComponent,
        resolve: {
          profile: Profilev2Resolve,
          badges: Profilev2BadgesResolve,
          // profileData: ProfileResolverService,
        },
      },
      {
        path: ':userId',
        component: ProfileViewComponent,
        resolve: {
          profile: Profilev2Resolve,
          badges: Profilev2BadgesResolve,
          // profileData: ProfileResolverService,
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    Profilev2Resolve,
    Profilev2BadgesResolve,
    // ConfigurationsService,
    // ProfileResolverService,
  ],
})
export class ProfileV2RoutingModule { }
