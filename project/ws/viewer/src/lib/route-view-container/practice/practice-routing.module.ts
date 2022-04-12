import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PracticeComponent } from './practice.component'
import { ViewerResolve } from '../../viewer.resolve'
const routes: Routes = [
  {
    path: ':resourceId',
    component: PracticeComponent,
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
export class PracticeRoutingModule { }
