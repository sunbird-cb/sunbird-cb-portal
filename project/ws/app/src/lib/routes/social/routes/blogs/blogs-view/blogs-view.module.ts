import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BlogViewComponent } from './components/blog-view.component'
import {
  MatToolbarModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatChipsModule,
  MatExpansionModule,
  MatDividerModule,
  MatButtonModule,
} from '@angular/material'
import { RouterModule } from '@angular/router'
import {
  UserImageModule,
  BtnSocialLikeModule,
  BtnSocialVoteModule,
  EditorQuillModule,
  BtnPageBackModule,
} from '@sunbird-cb/collection'
import { PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { BlogsReplyModule } from '../blogs-reply/blogs-reply.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
@NgModule({
  declarations: [BlogViewComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    RouterModule,
    UserImageModule,
    MatChipsModule,
    MatExpansionModule,
    PipeSafeSanitizerModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,

    BlogsReplyModule,
    BtnSocialLikeModule,
    BtnSocialVoteModule,
    EditorQuillModule,
    BtnPageBackModule,
  ],

  exports: [BlogViewComponent],
})
export class BlogsViewModule { }
