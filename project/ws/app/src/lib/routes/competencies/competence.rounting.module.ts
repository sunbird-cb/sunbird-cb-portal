import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CompetenceComponent } from './routes/competence-home/competence.component'
import { CompetenceAllComponent } from './routes/competence-all/competence-all.component'
import { InitResolver } from './resolvers/init-resolve.service'
import { ProfileResolve } from './resolvers/profile-fetch'
import { ConfigResolverService } from './resolvers/config-resolver.service'
import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
  {
    path: '',
    component: CompetenceComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
        resolve: {
          configData: ConfigResolverService,
          profileData: ProfileResolverService,
        },
      },
      {
        path: 'home',
        component: CompetenceAllComponent,
        resolve: {
          profile: ProfileResolve,
          configData: ConfigResolverService,
          profileData: ProfileResolverService,
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    InitResolver,
    ProfileResolve,
    ConfigResolverService,
    ProfileResolverService,
  ],
})
export class CompetencieRoutingModule { }
