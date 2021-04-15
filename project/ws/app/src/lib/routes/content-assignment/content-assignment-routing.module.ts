import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ContentAssignmentGuard } from './guards/content-assignment.guard'
import { AssignmentDetailsComponent } from './routes/assignment-details/assignment-details.component'
import { ContentAssignmentComponent } from './routes/content-assignment/content-assignment.component'
// import { ProfileResolverService } from './resolvers/profile-resolver.service'

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
          // configData: ConfigurationsService,
          // profileData: ProfileResolverService,
        },
      },
      {
        path: 'view',
        canActivate: [ContentAssignmentGuard],
        data: { mode: 'view' },
        component: AssignmentDetailsComponent,
        resolve: {
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
})
export class ContentAssignmentRoutingModule { }
