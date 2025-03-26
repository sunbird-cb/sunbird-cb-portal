import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatCardModule,
  MatDividerModule,
  MatProgressSpinnerModule,
} from '@angular/material'
import { NotificationRoutingModule } from './notification-routing.module'
import { NotificationComponent } from './components/notification/notification.component'
import { BtnPageBackModule } from '@sunbird-cb/collection'
import { PipeLimitToModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,

    BtnPageBackModule,
    PipeLimitToModule,
    MatProgressSpinnerModule,
  ],
})
export class NotificationModule { }
