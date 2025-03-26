import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChallengeComponent } from './challenge.component'
import { ActivityCardModule } from '../activity-card/activity-card.module'
import { HorizontalScrollerModule } from '@sunbird-cb/utils-v2'
import { MatCardModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material'

@NgModule({
  declarations: [ChallengeComponent],
  imports: [
    CommonModule,
    ActivityCardModule,
    HorizontalScrollerModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  exports: [ChallengeComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ChallengeModule { }
