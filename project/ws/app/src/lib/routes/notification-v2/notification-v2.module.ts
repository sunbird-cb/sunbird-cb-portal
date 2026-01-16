import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { BtnPageBackModule } from '@sunbird-cb/collection'

import { NotificationV2RoutingModule } from './notification-v2-routing.module'
import { HomeComponent } from './components/home/home.component'
import { NotificationService } from './services/notification.service'
import { NotificationApiService } from './services/notification-api.service'
import { NotificationEventComponent } from './components/notification-event/notification-event.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatRippleModule } from '@angular/material/core'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MyNotificationsComponent } from './components/my-notifications/my-notifications.component'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { AllNotificationsModule, LibNotificationsService } from '@sunbird-cb/notification'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { NotificationsService } from '../../../../../../../src/app/services/notifications.service'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { ConfirmDialogModule } from '@sunbird-cb/collection/src/lib/_common/confirm-dialog/confirm-dialog.module'

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}
@NgModule({
  declarations: [HomeComponent, NotificationEventComponent, MyNotificationsComponent],
  imports: [
    CommonModule,
    NotificationV2RoutingModule,
    MatToolbarModule,
    MatDividerModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    BtnPageBackModule,
    MatTabsModule,
    MatSnackBarModule,
    AllNotificationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ConfirmDialogModule
  ],
  providers: [NotificationApiService, NotificationService, NotificationsService, LibNotificationsService],
})
export class NotificationV2Module { }
