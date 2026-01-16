import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'

import { CtrlFileUploadModule } from '@sunbird-cb/collection'
import { PipeDateConcatModule } from '@sunbird-cb/utils-v2'

import { WINDOW_PROVIDERS } from './services/window.service'
import { FileDownloadService } from './services/file-download.service'
import { CertificationService } from './services/certification.service'
import { CertificationApiService } from './apis/certification-api.service'

import { AppTocCertificationComponent } from './components/app-toc-certification/app-toc-certification.component'
import { AccSlotBookingComponent } from './components/acc-slot-booking/acc-slot-booking.component'
import { AtDeskSlotBookingComponent } from './components/at-desk-slot-booking/at-desk-slot-booking.component'
import { ResultUploadComponent } from './components/result-upload/result-upload.component'
import { BudgetApprovalComponent } from './components/budget-approval/budget-approval.component'
import { BookingCardComponent } from './components/booking-card/booking-card.component'
import { RequestCancelDialogComponent } from './components/request-cancel-dialog/request-cancel-dialog.component'
import { CertificationEligibilityComponent } from './components/certification-eligibility/certification-eligibility.component'
import { AccCardComponent } from './components/acc-card/acc-card.component'
import { AtDeskCardComponent } from './components/at-desk-card/at-desk-card.component'
import { IapCardComponent } from './components/iap-card/iap-card.component'
import { BudgetCardComponent } from './components/budget-card/budget-card.component'
import { ResultVerificationCardComponent } from './components/result-verification-card/result-verification-card.component'
import { HomeComponent } from './components/home/home.component'
import { AppTocCertificationRoutingModule } from './app-toc-certification-routing.module'
import { SnackbarComponent } from './components/snackbar/snackbar.component'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [
        AccCardComponent,
        AccSlotBookingComponent,
        AppTocCertificationComponent,
        AtDeskCardComponent,
        AtDeskSlotBookingComponent,
        BookingCardComponent,
        BudgetApprovalComponent,
        BudgetCardComponent,
        CertificationEligibilityComponent,
        HomeComponent,
        IapCardComponent,
        RequestCancelDialogComponent,
        ResultUploadComponent,
        ResultVerificationCardComponent,
        SnackbarComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatChipsModule,
        MatIconModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        PipeDateConcatModule,
        CtrlFileUploadModule,
        AppTocCertificationRoutingModule,
    ],
    exports: [HomeComponent, SnackbarComponent],
    providers: [CertificationApiService, WINDOW_PROVIDERS, FileDownloadService, CertificationService]
})
export class AppTocCertificationModule {}
