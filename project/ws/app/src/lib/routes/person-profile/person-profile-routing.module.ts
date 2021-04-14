import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PersonProfileComponent } from './components/person-profile/person-profile.component'
import { ProfileSettingsComponent } from './module/profile-settings/profile-settings.component'
// import { ConfigurationsService } from './resolvers/config-resolver.service'
import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = []

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PersonProfileComponent,
        children: routes,
        resolve: {
          profileData: ProfileResolverService,
        },
      },
      {
        path: 'profile-settings',
        component: ProfileSettingsComponent,
        children: routes,
        resolve: {
          profileData: ProfileResolverService,
        },
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [ ProfileResolverService],
})
export class PersonProfileRoutingModule { }
