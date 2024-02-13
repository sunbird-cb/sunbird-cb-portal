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
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { PipeOrderByModule } from '@sunbird-cb/utils/src/lib/pipes/pipe-order-by/pipe-order-by.module'
import { PipeDurationTransformModule } from '@sunbird-cb/utils/src/public-api'
import { PublicRequestComponent } from './public-request.component'
import { RequestService } from './request.service'
import { RequestSuccessDialogComponent } from './request-success-dialog/request-success-dialog.component'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [PublicRequestComponent, RequestSuccessDialogComponent],
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
    PipeOrderByModule,
    PipeDurationTransformModule,
    TranslateModule,
  ],
  exports: [PublicRequestComponent],
  providers: [RequestService],
  entryComponents: [RequestSuccessDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PublicRequestModule { }
