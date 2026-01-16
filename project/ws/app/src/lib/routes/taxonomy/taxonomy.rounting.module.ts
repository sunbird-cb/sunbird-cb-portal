import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { TaxonomyHomeComponent } from './routes/taxonomy-home/taxonomy.component'
// import { DiscussCategoriesResolve } from './resolvers/discuss-category-resolve'

import { TaxonomyExplorerComponent } from './routes/taxonomy-explorer/explorer.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: TaxonomyHomeComponent,
    data: {
      pageId: 'home',
      module: 'Explore',
    },
  },
  {
    path: ':topic',
    component: TaxonomyExplorerComponent,
    data: {
      pageId: ':topic',
      module: 'explore',
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxonomyRoutingModule { }
