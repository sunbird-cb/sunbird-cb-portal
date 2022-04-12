import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RatingSummaryComponent } from './rating-summary.component'
import { PipeCountTransformModule } from '@sunbird-cb/utils/src/public-api'
import { MatProgressBarModule, MatIconModule, MatTooltipModule } from '@angular/material'

@NgModule({
  declarations: [RatingSummaryComponent],
  imports: [
    CommonModule,
    PipeCountTransformModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [
    RatingSummaryComponent,
  ],
})
export class RatingSummaryModule { }
