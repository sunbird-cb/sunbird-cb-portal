import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CbpPlanComponent } from './cbp-plan/cbp-plan.component'

const routes: Routes = [
  {
    path: '',
    component: CbpPlanComponent
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class CbpRoutingModule { }
