import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HtmlMobileComponent } from './html-mobile.component'
import { ViewerResolve } from '../../viewer.resolve'
const routes: Routes = [
  {
    path: ':resourceId',
    component: HtmlMobileComponent,
    resolve: {
      content: ViewerResolve,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ViewerResolve],
})
export class HtmlMobileRoutingModule { }
