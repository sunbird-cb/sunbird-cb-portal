import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { WebComponent } from './web/web.component'

const routes: Routes = [
  {
    path: '',
    component: WebComponent
  }
]
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class WebRoutingModule { }
