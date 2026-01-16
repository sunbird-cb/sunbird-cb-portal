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
import { WelcomeOnboardComponent } from './routes/welcome-onboard/welcome-onboard.component'
import { BasicProfileResolver } from './services/basic-profile-resolver.service'

const routes: Routes = [
  {
    path: '',
    component: ProfileHomeComponent,
    data: {
      pageId: '',
      module: 'Profile',
    },
    resolve: {
      competencies: CompetencyResolverService,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'welcome',
      },
      {
        path: 'welcome',
        component: WelcomeOnboardComponent,
        data: {
          pageId: 'welcome',
          module: 'Profile',
        },
        resolve: {
          // basicProfile: BasicProfileResolver,
        },
      },
      {
        path: 'roles',
        component: RolesAndActivitiesComponent,
        data: {
          pageId: 'roles',
          module: 'Profile',
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
          module: 'Profile',
        },
      },
      {
        path: 'desired-competencies',
        component: DesiredCompetenciesComponent,
        data: {
          pageId: 'desired-competencies',
          module: 'Profile',
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
          module: 'Profile',
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
          module: 'Profile',
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
    BasicProfileResolver,
  ],
  // Don't forget to pass RouteResolver into the providers array
})

export class ProfileV3RoutingModule { }
