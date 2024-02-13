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
import { PublicSignupComponent } from './public-signup.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SignupService } from './signup.service'
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha'
import { SignupSuccessDialogueComponent } from './signup-success-dialogue/signup-success-dialogue/signup-success-dialogue.component'
import { environment } from 'src/environments/environment'
import { PipeOrderByModule } from '@sunbird-cb/utils/src/lib/pipes/pipe-order-by/pipe-order-by.module'
import { AppPublicPositionResolverService } from './position-resolver.service'
import { PipeDurationTransformModule } from '@sunbird-cb/utils/src/public-api'
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component'
import { AppPublicGroupResolverService } from './group-resolver.service'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [PublicSignupComponent, SignupSuccessDialogueComponent, TermsAndConditionComponent],
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
    PipeOrderByModule,
    PipeDurationTransformModule,
    TranslateModule,
  ],
  exports: [PublicSignupComponent],
  providers: [
    SignupService,
    AppPublicPositionResolverService,
    AppPublicGroupResolverService,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptchaKey,
    },
  ],
  entryComponents: [SignupSuccessDialogueComponent, TermsAndConditionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PublicSignupModule { }
