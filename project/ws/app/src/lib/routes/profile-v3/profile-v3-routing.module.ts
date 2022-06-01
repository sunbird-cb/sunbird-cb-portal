import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CurrentCompetenciesComponent } from './routes/current-competencies/current-competencies.component'
import { ProfileHomeComponent } from './routes/profile-home/profile-home.component'


const routes: Routes = [
    { path: '',
      component: ProfileHomeComponent,
      data: {
      pageId: '',
      module: 'profile-v3',
   },

  children: [
    // {
    //   path: '',
    //   pathMatch: 'full',
    //   redirectTo: 'all',
    // },
    {
      path: 'current-competencies',
      component: CurrentCompetenciesComponent,
      data: {
        pageId: 'current-competencies',
        module: 'profile-v3',
      },
      // resolve: {
      //   allResources : AllResourceResolveService,
      // },
    }



  ],
  }
  ]

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    // providers: [,

    // ],
    // Don't forget to pass RouteResolver into the providers array
  })

  export class ProfileV3RoutingModule { }
