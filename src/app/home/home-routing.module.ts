import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      pageId: '',
      module: '',
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
export class HomeRoutingModule { }
