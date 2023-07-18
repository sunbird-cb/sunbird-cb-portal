import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { OfflineResourceComponent } from './offline-resource.component'
import { RouterModule, Routes } from '@angular/router'
import { ViewerResolve } from '../../viewer.resolve'

const routes: Routes = [
  {
    path: ':resourceId',
    component: OfflineResourceComponent,
    resolve: {
      content: ViewerResolve,
    },
  },
]

@NgModule({
  declarations: [OfflineResourceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [ViewerResolve],
})
export class OfflineResourceModule { }
