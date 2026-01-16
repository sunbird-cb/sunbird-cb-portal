import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnFollowComponent } from './btn-follow.component'
import { MatBadgeModule } from '@angular/material/badge'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [BtnFollowComponent],
    imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatBadgeModule],
    exports: [BtnFollowComponent]
})
export class BtnFollowModule { }
