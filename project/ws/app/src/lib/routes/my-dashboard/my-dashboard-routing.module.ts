import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { MyDashboardHomeComponent } from './components/my-dashboard-home/my-dashboard-home.component'
import { QumlComponent } from './components/quml/quml.component'

const routes: Routes = []

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MyDashboardHomeComponent,
        children: routes,
      },
      {
        path: '/quml',
        component: QumlComponent,
        children: routes,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class MyDashboardRoutingModule { }
