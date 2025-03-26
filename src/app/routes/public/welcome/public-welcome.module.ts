import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatListModule,
  MatSidenavModule,
  MatCardModule,
  MatExpansionModule,
  MatRadioModule,
  MatChipsModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatButtonToggleModule,
  MatTabsModule,
  MatAutocompleteModule,
} from '@angular/material'
import { PublicWelcomeComponent } from './public-welcome.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { WelcomeUsersService } from './public-welcome.service'
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha'
import { environment } from 'src/environments/environment'
import { PipeDurationTransformModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [PublicWelcomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
    MatExpansionModule,
    MatRadioModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    RecaptchaV3Module,
    PipeDurationTransformModule,
  ],
  exports: [PublicWelcomeComponent],
  providers: [
    WelcomeUsersService,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptchaKey,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PublicWelcomeModule { }
