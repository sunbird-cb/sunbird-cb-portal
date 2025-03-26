import { AccountPasswordSettingsComponent } from './routes/settings/components/account-password-settings/account-password-settings.component'
import { PrivacySettingsComponent } from './routes/settings/components/privacy-settings/privacy-settings.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageResolve } from '@sunbird-cb/utils-v2'
import { ProfileComponent } from './profile.component'
import { LearningComponent } from './routes/analytics/routes/learning/learning.component'
import { PlansComponent } from './routes/analytics/routes/plans/plans.component'
import { AchievementsComponent } from './routes/competency/components/achievements/achievements.component'
import { BadgesResolver2 } from './routes/badges/badges.resolver2'
import { CardDetailComponent } from './routes/competency/components/card-detail/card-detail.component'
import { CompetencyHomeComponent } from './routes/competency/components/competency-home/competency-home.component'
import { CompetencyResolverService } from './routes/competency/resolver/assessment.resolver'
import { DashboardComponent } from './routes/dashboard/components/dashboard/dashboard.component'
import { InterestComponent } from './routes/interest/components/interest/interest.component'
import { InterestUserResolve } from './routes/interest/resolvers/interest-user.resolve'
import { LearningHistoryComponent } from './routes/learning/components/learning-history/learning-history.component'
import { LearningHomeComponent } from './routes/learning/components/learning-home/learning-home.component'
import { LearningTimeComponent } from './routes/learning/components/learning-time/learning-time.component'
import { LearningHistoryResolver } from './routes/learning/resolvers/learning-history.resolver'
import { LearningTimeResolver } from './routes/learning/resolvers/learning-time.resolver'
import { SettingsComponent } from './routes/settings/settings.component'
// import { BadgeComponent } from '../gamification/routes/badges/components/badge/badge.component'
import { BadgesComponent } from './routes/badges/badges.component'
import { GeneralGuard } from '../../../../../../../src/app/guards/general.guard'
import { ProfileResolverService } from './resolvers/profile-resolver.service'
import { NotificationSettingsComponent } from './routes/settings/components/notification-settings/notification-settings.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      pageType: 'feature',
      pageKey: 'profile',
      pageId: 'dashboard',
      module: 'Profile',
    },
    resolve: {
      pageData: PageResolve,
      profileData: ProfileResolverService,
    },
  },
  {
    path: 'competency',
    component: CompetencyHomeComponent,
    canActivate: [GeneralGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'assessment',
      },
      {
        path: 'badges',
        component: BadgesComponent,
        data: {
          pageId: 'badges',
          module: 'Profile',
        },
        resolve: {
          badges: BadgesResolver2,
          profileData: ProfileResolverService,
        },
        canActivate: [GeneralGuard],
      },
      {
        path: ':type',
        component: AchievementsComponent,
        data: {
          pageId: ':type',
          module: 'Profile',
        },
        resolve: {
          competencyData: CompetencyResolverService,
          profileData: ProfileResolverService,
        },
      },
      {
        path: ':type/details',
        component: CardDetailComponent,
        data: {
          pageId: ':type/details',
          module: 'Profile',
        },
      },
    ],
    data: {
      pageType: 'feature',
      pageKey: 'profile',
      pageId: 'competency',
      module: 'Profile',
    },
    resolve: {
      pageData: PageResolve,
      profileData: ProfileResolverService,
    },
  },
  {
    path: 'learning',
    component: LearningHomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'time',
      },
      {
        path: 'time',
        component: LearningTimeComponent,
        resolve: {
          timeSpentData: LearningTimeResolver,
          pageData: PageResolve,
          profileData: ProfileResolverService,
        },
        data: {
          pageType: 'feature',
          pageKey: 'profile',
          pageId: 'time',
          module: 'profile',
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
      {
        path: 'history',
        component: LearningHistoryComponent,
        data: {
          pageType: 'feature',
          pageKey: 'profile',
          pageId: 'history',
          module: 'profile',
        },
        resolve: {
          learningHistory: LearningHistoryResolver,
          pageData: PageResolve,
          profileData: ProfileResolverService,
        },
      },
    ],
    data: {
      pageType: 'feature',
      pageKey: 'profile',
      pageId: 'learning',
      module: 'profile',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'interest',
    component: InterestComponent,
    data: {
      pageId: 'interest',
      module: 'Profile',
    },
    resolve: {
      interests: InterestUserResolve,
      profileData: ProfileResolverService,
    },
  },
  {
    path: 'plans',
    component: PlansComponent,
    data: {
      pageId: 'plans',
      module: 'Profile',
    },
  },
  {
    path: 'collaborators',
    component: LearningComponent,
    data: {
      pageId: 'collaborators',
      module: 'profile',
    },
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      pageType: 'feature',
      pageKey: 'profile',
      pageId: 'settings',
      module: 'Profile',
    },
  },
  {
    path: 'notification',
    component: NotificationSettingsComponent,
    data: {
      pageId: 'notification',
      module: 'Profile',
    },
  },
  {
    path: 'privacy',
    component: PrivacySettingsComponent,
    data: {
      pageId: 'privacy',
      module: 'Profile',
    },
  },
  {
    path: 'accountandpassword',
    component: AccountPasswordSettingsComponent,
    data: {
      pageId: 'accountandpassword',
      module: 'Profile',
    },
  },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
        children: routes,
        data: {
          pageType: 'feature',
          pageKey: 'profile',
          pageId: 'app/profile',
        },
        resolve: {
          pageData: PageResolve,
        },
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [ProfileResolverService],
})
export class ProfileRoutingModule { }
