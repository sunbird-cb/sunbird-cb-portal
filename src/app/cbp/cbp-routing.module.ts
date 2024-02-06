import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CbpPlanComponent } from './cbp-plan/cbp-plan.component'
import { CbpResolverService } from './cbpresolver.resolver'

const routes: Routes = [
  {
    path: '',
    component: CbpPlanComponent,
    data: {
      pageType: 'feature',
      pageKey: 'taxonomy',
      pageId: 'app/taxonomy',
      module: 'explore',
    },
    resolve: {
      pageData: CbpResolverService,
    },
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
