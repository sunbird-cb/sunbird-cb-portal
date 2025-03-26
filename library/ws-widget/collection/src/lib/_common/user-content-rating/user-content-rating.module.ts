import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserContentRatingComponent } from './user-content-rating.component'
import { MatCardModule, MatIconModule, MatButtonModule } from '@angular/material'
import { InViewPortModule } from '@sunbird-cb/utils-v2'

@NgModule({
  declarations: [UserContentRatingComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    InViewPortModule,
  ],
  exports: [UserContentRatingComponent],
})
export class UserContentRatingModule { }
