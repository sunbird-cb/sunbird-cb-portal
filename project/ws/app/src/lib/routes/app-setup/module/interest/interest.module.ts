import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InterestComponent } from './interest/interest.component'
import { HorizontalScrollerModule } from '@ws-widget/utils'
import { MatCardModule, MatProgressSpinnerModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material'
import { BtnPageBackModule } from '@ws-widget/collection'
import { InterestService } from '../../../profile/routes/interest/services/interest.service'

@NgModule({
  declarations: [InterestComponent],
  imports: [
    CommonModule,
    HorizontalScrollerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    BtnPageBackModule,

  ],
  exports: [InterestComponent],
  providers: [InterestService],
})
export class InterestModules { }
