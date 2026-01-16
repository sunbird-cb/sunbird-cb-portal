import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CompetenceComponent } from './routes/competence-home/competence.component'
import { CompetenceAllComponent } from './routes/competence-all/competence-all.component'
import { CompetenceSysComponent } from './routes/competence-sys/competence-sys.component'
import { CompetencyDetailedViewComponent } from './routes/competency-detailed-view/competency-detailed-view.component'
import { CompetencyAllWrapperComponent } from './routes/competency-all-wrapper/competency-all-wrapper.component'
import { InitResolver } from './resolvers/init-resolve.service'
import { ProfileResolve } from './resolvers/profile-fetch'
import { CompetencyTestComponent } from './routes/competence-test/competence-test.component'
import { AssessmentResolverService } from './resolvers/assessment-resolver.service'
// import { ProfileResolverService } from './resolvers/profile-resolver.service'
// import { ConfigurationsService } from '@sunbird-cb/utils-v2'
const routes: Routes = [
  {
    path: '',
    component: CompetenceComponent,
    data: {
      pageId: '',
      module: 'Competency',
    },
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
        data: {
          pageId: 'home',
          module: 'Competency',
        },
        resolve: {
          profile: ProfileResolve,
          // configData: ConfigurationsService,
          // profileData: ProfileResolverService,
        },
      },
      {
        path: 'all',
        component: CompetencyAllWrapperComponent,
        data: {
          pageId: 'all',
          module: 'Competency',
        },
        resolve: {
          profile: ProfileResolve,
          // configData: ConfigurationsService,
          // profileData: ProfileResolverService,
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
            resolve: {
              // configData: ConfigurationsService,
              // profileData: ProfileResolverService,
            },
          },
          {
            path: 'list',
            component: CompetenceSysComponent,
            data: {
              pageId: 'list',
              module: 'Competency',
            },
            resolve: {
              profile: ProfileResolve,
              // configData: ConfigurationsService,
              // profileData: ProfileResolverService,
            },
          },
          {
            path: ':competencyId/:competencyName/:routeType',
            component: CompetencyDetailedViewComponent,
            data: {
              pageId: ':competencyId/:competencyName/:routeType',
              module: 'Competency',
            },
          },
          {
            path: 'assessment/:assessmentId',
            component: CompetencyTestComponent,
            data: {
              pageId: 'assessment/:assessmentId',
              module: 'competency Assessment',
            },
            resolve: {
              compAssData: AssessmentResolverService,
            },
          },
        ],
      },
      {
        path: 'desired',
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
    AssessmentResolverService,
    // ConfigurationsService,
    // ProfileResolverService,
  ],
})
export class CompetencieRoutingModule { }
