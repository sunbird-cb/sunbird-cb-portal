import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ConfigResolverService } from './resolvers/config-resolver.service'
import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
  {
    path: 'leaderboard',
    loadChildren: () => import('./routes/leaderboard/leaderboard.module').then(u => u.LeaderboardModule),
    resolve: {
      configData: ConfigResolverService,
      profileData: ProfileResolverService,
    },
  },
  {
    path: 'badges',
    loadChildren: () => import('./routes/badges/badges.module').then(u => u.BadgesModule),
    resolve: {
      configData: ConfigResolverService,
      profileData: ProfileResolverService,
    },
  },
  {
    path: 'admin',
    loadChildren: () => import('./routes/admin/admin.module').then(u => u.AdminModule),
    resolve: {
      configData: ConfigResolverService,
      profileData: ProfileResolverService,
    },
  },
  {
    path: 'rewards',
    loadChildren: () => import('./routes/rewards/rewards.module').then(u => u.RewardsModule),
    resolve: {
      configData: ConfigResolverService,
      profileData: ProfileResolverService,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ConfigResolverService, ProfileResolverService],
})
export class GamificationRoutingModule { }
