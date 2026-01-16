import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnContentDownloadComponent } from './btn-content-download.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
    declarations: [BtnContentDownloadComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
    exports: [BtnContentDownloadComponent]
})
export class BtnContentDownloadModule { }
