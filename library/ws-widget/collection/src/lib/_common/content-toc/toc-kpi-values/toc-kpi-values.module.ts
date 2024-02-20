import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material'
import { PipeDurationTransformModule } from '@sunbird-cb/utils/src/public-api'

import { TocKpiValuesComponent } from './toc-kpi-values.component'

@NgModule({
  declarations: [TocKpiValuesComponent],
  imports: [
    CommonModule,
    MatIconModule,
    PipeDurationTransformModule,
  ],
  exports: [
    TocKpiValuesComponent,
  ],
})
export class TocKpiValuesModule { }
