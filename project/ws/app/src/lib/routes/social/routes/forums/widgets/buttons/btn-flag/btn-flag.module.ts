import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BtnFlagComponent } from './btn-flag.component'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'

@NgModule({
  declarations: [BtnFlagComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [BtnFlagComponent],
})
export class BtnFlagModule { }
