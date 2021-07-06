import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { GlobalSearchComponent } from './routes/global-search/global-search.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: GlobalSearchComponent,
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
export class Searchv2RoutingModule { }
