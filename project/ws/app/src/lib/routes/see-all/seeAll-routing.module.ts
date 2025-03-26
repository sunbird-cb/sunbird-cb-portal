import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
// import { PageResolve } from '@sunbird-cb/utils-v2'
import { SeeAllHomeComponent } from './components/see-all-home/see-all-home.component'
import { SeeAllWithPillsComponent } from './components/see-all-with-pills/see-all-with-pills.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SeeAllHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'seeAll',
      pageId: '',
    },
    // resolve: {
    //   searchPageData: PageResolve,
    // },
  },
  {
    path: 'new',
    pathMatch: 'full',
    component: SeeAllWithPillsComponent,
    data: {
      pageType: 'feature',
      pageKey: 'seeAll',
      pageId: '',
    },
    // resolve: {
    //   searchPageData: PageResolve,
    // },
  },
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class SeeAllRoutingModule { }
