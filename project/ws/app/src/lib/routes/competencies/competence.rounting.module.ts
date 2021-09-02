import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CompetenceComponent } from './routes/competence-home/competence.component'
import { CompetenceAllComponent } from './routes/competence-all/competence-all.component'
import { CompetenceSysComponent } from './routes/competence-sys/competence-sys.component'
import { InitResolver } from './resolvers/init-resolve.service'
import { ProfileResolve } from './resolvers/profile-fetch'
// import { ProfileResolverService } from './resolvers/profile-resolver.service'
// import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
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
          // configData: ConfigurationsService,
          // profileData: ProfileResolverService,
        },
      },
      {
        path: 'home',
        component: CompetenceAllComponent,
        resolve: {
          profile: ProfileResolve,
          // configData: ConfigurationsService,
          // profileData: ProfileResolverService,
        },
      },
      {
        path: 'all',
        component: CompetenceSysComponent,
        resolve: {
          profile: ProfileResolve,
          // configData: ConfigurationsService,
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
    InitResolver,
    ProfileResolve,
    // ConfigurationsService,
    // ProfileResolverService,
  ],
})
export class CompetencieRoutingModule { }
