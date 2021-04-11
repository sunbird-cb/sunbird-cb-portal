import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ContentAssignmentGuard } from './guards/content-assignment.guard'
import { AssignmentDetailsComponent } from './routes/assignment-details/assignment-details.component'
import { ContentAssignmentComponent } from './routes/content-assignment/content-assignment.component'

import { ConfigResolverService } from './resolvers/config-resolver.service'
import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'view',
      },
      {
        path: 'assign',
        canActivate: [ContentAssignmentGuard],
        data: { mode: 'assign' },
        component: ContentAssignmentComponent,
        resolve: {
          configData: ConfigResolverService,
          profileData: ProfileResolverService,
        },
      },
      {
        path: 'view',
        canActivate: [ContentAssignmentGuard],
        data: { mode: 'view' },
        component: AssignmentDetailsComponent,
        resolve: {
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
  providers: [ConfigResolverService, ProfileResolverService]
})
export class ContentAssignmentRoutingModule { }
