import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatCardModule,
  MatTooltipModule,
  MatTabsModule,
  MatChipsModule,
  MatDividerModule,
  MatProgressBarModule,
  MatListModule,
  MatDialogModule,
  MatRadioModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
} from '@angular/material'
import { AttendanceCardComponent } from './attendance-card.component';



@NgModule({
  declarations: [AttendanceCardComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatTooltipModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [AttendanceCardComponent]
})
export class AttendanceCardModule { }
