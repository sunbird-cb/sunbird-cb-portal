import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ConfirmDialogComponent } from './confirm-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule, MatIconModule } from '@angular/material'
import { TranslateModule } from '@ngx-translate/core'
@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    TranslateModule
  ],
  exports: [
    ConfirmDialogComponent,
  ],
  entryComponents: [ConfirmDialogComponent],
})
export class ConfirmDialogModule { }
