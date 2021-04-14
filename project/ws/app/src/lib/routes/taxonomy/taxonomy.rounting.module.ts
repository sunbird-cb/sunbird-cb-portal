import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DiscussComponent } from './routes/discuss-home/discuss.component'
// import { DiscussCategoriesResolve } from './resolvers/discuss-category-resolve'

import { DiscussTopicsComponent } from './routes/discuss-topics/discuss-topics.component'

const routes: Routes = [
  {
    path: '',
    pathMatch:'full',
    redirectTo:'home'
  },
  {
    path: 'home',
    component: DiscussComponent,
    // resolve: {
    //   profile: ProfileResolve,
    // },
  },
  {
    path: ':topic',
    component: DiscussTopicsComponent,

  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxonomyRoutingModule { }
