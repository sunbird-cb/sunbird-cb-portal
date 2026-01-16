import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BtnSocialVoteModule, BtnSocialLikeModule } from '@sunbird-cb/collection'
import { ForumCardComponent } from './forum-card.component'
import { BtnFlagModule } from '../widgets/buttons/btn-flag/btn-flag.module'
import { BtnFlagComponent } from '../widgets/buttons/btn-flag/btn-flag.component'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
  declarations: [ForumCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    BtnSocialVoteModule,
    BtnSocialLikeModule,
    MatDividerModule,
    BtnFlagModule,

  ],
  exports: [ForumCardComponent],
  providers: [BtnFlagComponent],
})
export class ForumCardModule { }
