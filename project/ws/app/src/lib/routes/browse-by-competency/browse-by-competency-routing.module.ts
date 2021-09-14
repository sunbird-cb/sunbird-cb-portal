import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AllCompetenciesComponent } from './routes/all-competencies/all-competencies.component'
import { CompetencyDetailsComponent } from './routes/competency-details/competency-details.component'
import { PageResolve } from '@sunbird-cb/utils/src/public-api'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all-competencies',
  },
  {
    path: 'all-competencies',
    component: AllCompetenciesComponent,
  },
  {
    path: ':competency',
    component: CompetencyDetailsComponent,
    data: {
      pageType: 'feature',
      pageKey: 'browse-competency',
    },
    resolve: {
      searchPageData: PageResolve,
    },

  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowseByCompetencyRoutingModule { }
