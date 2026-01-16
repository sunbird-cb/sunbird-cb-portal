import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { RecommendeLearningsResolverService } from './recommende-learnings-resolver.resolver'
import { RecommendeLearningsComponent } from './recommende-learnings/recommende-learnings.component'

const routes: Routes = [
  {
    path: '',
    component: RecommendeLearningsComponent,
    data: {
      pageType: 'feature',
      pageKey: 'taxonomy',
      pageId: 'app/taxonomy',
      module: 'explore',
    },
    resolve: {
      pageData: RecommendeLearningsResolverService,
    },
  },
]
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class RecommendeLearningsRoutingModule { }
