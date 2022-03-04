import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { PracticeTestComponent } from './practice-test.component'
import { ViewerResolve } from '../../viewer.resolve'
const routes: Routes = [
  {
    path: ':resourceId',
    component: PracticeTestComponent,
    data: {
      module: 'Practice',
      pageId: ':resourceId',
    },
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
