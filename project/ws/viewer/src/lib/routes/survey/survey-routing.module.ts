import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ViewerResolve } from '../../viewer.resolve'
import { SurveyComponent } from './survey.component'
const routes: Routes = [
  {
    path: ':resourceId',
    component: SurveyComponent,
    resolve: {
      content: ViewerResolve,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ViewerResolve],
})
export class SurveyRoutingModule { }
