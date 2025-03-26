import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material'
import { RouterModule } from '@angular/router'
import { HorizontalScrollerModule } from '@sunbird-cb/utils-v2'
import { ActivitiesRoutingModule } from './activities-routing.module'
import { ActivitiesComponent } from './components/activities/activities.component'
import { ChallengeStripComponent } from './components/challenge-strip/challenge-strip.component'
import { ActivityCardModule } from '@sunbird-cb/collection'

@NgModule({
  declarations: [ActivitiesComponent, ChallengeStripComponent],
  imports: [
    CommonModule,
    ActivitiesRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    HorizontalScrollerModule,
    ActivityCardModule,
  ],
})
export class ActivitiesModule { }
