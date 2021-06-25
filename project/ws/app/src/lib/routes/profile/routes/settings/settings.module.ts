import { LeftMenuComponent } from '../settings/components/left-menu/left-menu.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatToolbarModule,
  MatIconModule,
  MatTabsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatRadioModule,
  MatSnackBarModule,
  MatDividerModule,
  MatButtonModule,
  MatMenuModule,
  MatListModule,
  MatSlideToggleModule,
  MatChipsModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatTooltipModule,
} from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SettingsComponent } from './settings.component'
import { NotificationSettingsComponent } from './components/notification-settings/notification-settings.component'
import { SettingsService } from './settings.service'
import { RouterModule } from '@angular/router'
import { PrivacySettingsComponent } from './components/privacy-settings/privacy-settings.component'
import { AccountPasswordSettingsComponent } from './components/account-password-settings/account-password-settings.component'
// import { ProfileSettingsComponent } from '../../../person-profile/module/profile-settings/profile-settings.component'

@NgModule({
  declarations: [SettingsComponent, NotificationSettingsComponent, LeftMenuComponent,
    PrivacySettingsComponent,
    AccountPasswordSettingsComponent,
    // ProfileSettingsComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDividerModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatTooltipModule,
    RouterModule,
  ],
  exports: [SettingsComponent, LeftMenuComponent],
  providers: [SettingsService],
})
export class SettingsModule { }
