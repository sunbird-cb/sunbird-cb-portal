import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChallengeComponent } from './challenge.component'
import { ActivityCardModule } from '../activity-card/activity-card.module'
import { HorizontalScrollerModule } from '@sunbird-cb/utils-v2'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner'

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
