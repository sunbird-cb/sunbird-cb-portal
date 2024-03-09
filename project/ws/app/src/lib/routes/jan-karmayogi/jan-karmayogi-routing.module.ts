import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { JanKarmayogiHomeComponent } from './components/jan-karmayogi-home/jan-karmayogi-home.component'

const routes: Routes = [
  { path: '',
   component: JanKarmayogiHomeComponent,
   data: {
    pageId: '',
    module: 'Jan Karmayogi',
  },
},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JanKarmayogiRoutingModule { }
