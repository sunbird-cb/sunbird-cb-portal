import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicSignupComponent } from './public-signup.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SignupService } from './signup.service'
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha'
import { SignupSuccessDialogueComponent } from './signup-success-dialogue/signup-success-dialogue/signup-success-dialogue.component'
import { environment } from 'src/environments/environment'
import { PipeOrderByModule, PipeDurationTransformModule } from '@sunbird-cb/utils-v2'
import { AppPublicPositionResolverService } from './position-resolver.service'
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component'
import { AppPublicGroupResolverService } from './group-resolver.service'
import { TranslateModule } from '@ngx-translate/core'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table'
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { PublicCrpComponent } from '../public-crp/public-crp.component'
import { AppPublicOrganizationResolver } from './organization.resolver'
import { AppOtpReaderComponent } from 'src/app/component/app-otp-reader/app-otp-reader.component'
import { MatStepperModule } from '@angular/material/stepper';
@NgModule({
    declarations: [PublicSignupComponent, SignupSuccessDialogueComponent, TermsAndConditionComponent, PublicCrpComponent, AppOtpReaderComponent],
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
        MatStepperModule
    ],
    exports: [PublicSignupComponent, PublicCrpComponent],
    providers: [
        SignupService,
        AppPublicPositionResolverService,
        AppPublicGroupResolverService,
        AppPublicOrganizationResolver,
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: environment.recaptchaKey,
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicSignupModule { }
