import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule, MatCardModule, MatIconModule, MatToolbarModule } from '@angular/material'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { MyDashboardHomeComponent } from './components/my-dashboard-home/my-dashboard-home.component'
import { MyDashboardRoutingModule } from './my-dashboard-routing.module'

@NgModule({
  declarations: [MyDashboardHomeComponent],
  imports: [
    CommonModule,
    MyDashboardRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    BtnPageBackModule,
  ], exports: [MyDashboardHomeComponent],
})
export class MyDashboardModule { }
