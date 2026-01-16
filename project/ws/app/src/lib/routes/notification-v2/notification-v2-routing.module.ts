import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
//import { HomeComponent } from './components/home/home.component'
import { MyNotificationsComponent } from './components/my-notifications/my-notifications.component'

const routes: Routes = [
  {
    path: '',
    component: MyNotificationsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationV2RoutingModule { }
