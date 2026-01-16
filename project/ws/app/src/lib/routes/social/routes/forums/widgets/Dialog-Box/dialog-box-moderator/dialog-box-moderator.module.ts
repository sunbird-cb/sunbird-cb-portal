import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogBoxModeratorComponent } from './dialog-box-moderator.component'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio'
import { FormsModule } from '@angular/forms'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
@NgModule({
  declarations: [DialogBoxModeratorComponent],
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatRadioModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [DialogBoxModeratorComponent],
})
export class DialogBoxModeratorModule { }
