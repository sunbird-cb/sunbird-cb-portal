import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AllCompetenciesComponent } from './routes/all-competencies/all-competencies.component'
import { CompetencyDetailsComponent } from './routes/competency-details/competency-details.component'
import { PageResolve } from '@sunbird-cb/utils-v2'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all-competencies',
  },
  {
    path: 'all-competencies',
    component: AllCompetenciesComponent,
    data: {
      pageId: 'all-competencies',
      module: 'Competency',
    },
  },
  {
    path: ':competency',
    component: CompetencyDetailsComponent,
    data: {
      pageType: 'feature',
      pageKey: 'browse-competency',
      pageId: ':competency-name',
      module: 'Competency',
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
export class BrowseByCompetencyRoutingModuleV2 { }
