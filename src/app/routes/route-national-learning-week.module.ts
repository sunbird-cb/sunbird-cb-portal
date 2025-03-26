import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NationalLearningWeekModule } from '@ws/app/src/lib/routes/national-learning-week/national-learning-week.module'

@NgModule({
  imports: [CommonModule, NationalLearningWeekModule],
  exports: [NationalLearningWeekModule],
})
export class RouteNationalLearningWeekModule { }
