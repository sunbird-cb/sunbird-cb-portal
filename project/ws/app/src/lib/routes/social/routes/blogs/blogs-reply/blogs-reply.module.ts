import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BlogReplyComponent } from './components/blog-reply.component'
import { UserImageModule, BtnSocialVoteModule, BtnSocialLikeModule, BtnPageBackModule, EditorQuillModule } from '@sunbird-cb/collection'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { BtnFlagModule } from '../../forums/widgets/buttons/btn-flag/btn-flag.module'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'

@NgModule({
  declarations: [BlogReplyComponent],
  imports: [
    CommonModule,
    MatCardModule,
    UserImageModule,
    MatMenuModule,
    MatIconModule,
    PipeSafeSanitizerModule,
    MatButtonModule,
    BtnFlagModule,

    BtnSocialVoteModule,
    BtnSocialLikeModule,
    BtnPageBackModule,
    EditorQuillModule,
  ],
  exports: [BlogReplyComponent],
})
export class BlogsReplyModule { }
