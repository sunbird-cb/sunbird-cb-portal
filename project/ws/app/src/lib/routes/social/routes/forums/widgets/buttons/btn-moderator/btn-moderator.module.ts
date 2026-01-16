import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { DialogBoxModeratorModule } from '../../Dialog-Box/dialog-box-moderator/dialog-box-moderator.module'
import { BtnModeratorComponent } from './btn-moderator.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [BtnModeratorComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        DialogBoxModeratorModule,
    ],
    exports: [BtnModeratorComponent]
})
export class BtnModeratorModule { }
