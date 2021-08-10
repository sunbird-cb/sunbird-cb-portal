import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AllCompetenciesComponent } from './routes/all-competencies/all-competencies.component'
import { CompetencyDetailsComponent } from './routes/competency-details/competency-details.component'

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

  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowseByCompetencyRoutingModule { }
