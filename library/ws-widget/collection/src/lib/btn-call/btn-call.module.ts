import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnCallComponent } from './btn-call.component'
import { BtnCallDialogComponent } from './btn-call-dialog/btn-call-dialog.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [BtnCallComponent, BtnCallDialogComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
    ],
    exports: [BtnCallComponent]
})
export class BtnCallModule { }
