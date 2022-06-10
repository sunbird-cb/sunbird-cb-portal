import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TopicResolverService } from './resolvers/topic.resolver'
import { CurrentCompetenciesComponent } from './routes/current-competencies/current-competencies.component'
import { DesiredCompetenciesComponent } from './routes/desired-competencies/desired-competencies.component'
import { PlatformWalkthroughComponent } from './routes/platform-walkthrough/platform-walkthrough.component'
import { ProfileHomeComponent } from './routes/profile-home/profile-home.component'
import { TopicComponent } from './routes/topics/topic.component'
import { RolesAndActivitiesComponent } from './routes/roles-and-activities/roles-and-activities.component'
import { CompetencyResolverService } from './resolvers/competency.resolver'

const routes: Routes = [
  {
    path: '',
    component: ProfileHomeComponent,
    data: {
      pageId: '',
      module: 'profile-v3',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'roles',
      },
      {
        path: 'roles',
        component: RolesAndActivitiesComponent,
        data: {
          pageId: 'roles',
          module: 'profile-v3',
        },
        resolve: {
          // topics: RolesResolverService,
        },
      },
      {
        path: 'current-competencies',
        component: CurrentCompetenciesComponent,
        data: {
          pageId: 'current-competencies',
          module: 'profile-v3',
        },
        resolve: {
          topics: CompetencyResolverService,
        },
      },
      {
        path: 'desired-competencies',
        component: DesiredCompetenciesComponent,
        data: {
          pageId: 'desired-competencies',
          module: 'profile-v3',
        },
        // resolve: {
        //   allResources : AllResourceResolveService,
        // },
      },
      {
        path: 'topics',
        component: TopicComponent,
        data: {
          pageId: 'topics',
          module: 'profile-v3',
        },
        resolve: {
          topics: TopicResolverService,
        },
      },
      {
        path: 'platform-walkthrough',
        component: PlatformWalkthroughComponent,
        data: {
          pageId: 'platform-walkthrough',
          module: 'profile-v3',
        },
        // resolve: {
        //   topics: TopicResolverService,
        // },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    TopicResolverService,
    CompetencyResolverService,
  ],
  // Don't forget to pass RouteResolver into the providers array
})

export class ProfileV3RoutingModule { }
