import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HorizontalScrollerV2Component } from './horizontal-scroller-v2.component'
import { MatButtonModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material'

@NgModule({
  declarations: [HorizontalScrollerV2Component],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  exports: [HorizontalScrollerV2Component],
})
export class HorizontalScrollerV2Module { }
