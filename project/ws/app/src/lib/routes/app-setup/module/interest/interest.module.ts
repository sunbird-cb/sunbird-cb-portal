import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InterestComponent } from './interest/interest.component'
import { HorizontalScrollerModule, PipePublicURLModule } from '@sunbird-cb/utils-v2'
import { MatCardModule, MatProgressSpinnerModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material'
import { BtnPageBackModule } from '@sunbird-cb/collection'
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
    PipePublicURLModule,
  ],
  exports: [InterestComponent],
  providers: [InterestService],
})
export class InterestModules { }
