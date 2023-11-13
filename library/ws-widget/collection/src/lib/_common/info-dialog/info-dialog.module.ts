import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InfoDialogComponent } from './info-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule, MatIconModule } from '@angular/material'
@NgModule({
  declarations: [InfoDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [
    InfoDialogComponent,
  ],
  entryComponents: [InfoDialogComponent],
})
export class InfoDialogModule { }
