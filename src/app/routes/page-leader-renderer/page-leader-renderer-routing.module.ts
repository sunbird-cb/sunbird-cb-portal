import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LandingComponent } from './components/landing/landing.component'
import { PageResolve } from '@sunbird-cb/utils-v2'
const routes: Routes = [
  {
    path: ':leaderId',
    data: {
      pageType: 'page',
      pageKey: 'leaderId',
    },
    component: LandingComponent,
    resolve: {
      leaderData: PageResolve,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageLeaderRendererRoutingModule {}
