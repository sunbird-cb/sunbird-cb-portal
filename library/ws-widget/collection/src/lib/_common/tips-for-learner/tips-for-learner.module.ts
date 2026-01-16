import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TipsForLearnerCardComponent } from './tips-for-learner-card/tips-for-learner-card.component'
import { MatIconModule } from '@angular/material/icon'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [TipsForLearnerCardComponent],
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
  ],
  exports: [
    TipsForLearnerCardComponent,
  ],
})
export class TipsForLearnerModule { }
