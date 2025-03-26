import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IapComponent } from './iap.component'
import { IapRoutingModule } from './iap-routing.module'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { IapModule as IapPluginModule } from '../../plugins/iap/iap.module'

import {
  MatCardModule,
  MatDividerModule,
  MatButtonModule,
  MatSnackBarModule,
  MatChipsModule,
  MatIconModule,
} from '@angular/material'

import {
  BtnContentDownloadModule,
  BtnContentFeedbackModule,
  BtnContentLikeModule,
  BtnContentShareModule,
  BtnGoalsModule,
  BtnPlaylistModule,
  DisplayContentTypeModule,
  UserImageModule,
  UserContentRatingModule,
  BtnContentFeedbackV2Module,
  PlayerBriefModule,
} from '@sunbird-cb/collection'

import {
  PipeDurationTransformModule,
  PipeLimitToModule,
  PipePartialContentModule,
} from '@sunbird-cb/utils-v2'
@NgModule({
  declarations: [IapComponent],
  imports: [
    CommonModule,
    IapPluginModule,
    IapRoutingModule,
    WidgetResolverModule,
    PipeDurationTransformModule,
    PipeLimitToModule,
    PipePartialContentModule,
    BtnContentDownloadModule,
    BtnContentFeedbackModule,
    BtnContentLikeModule,
    BtnContentShareModule,
    BtnGoalsModule,
    BtnPlaylistModule,
    DisplayContentTypeModule,
    UserImageModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatChipsModule,
    UserContentRatingModule,
    BtnContentFeedbackV2Module,
    PlayerBriefModule,
  ],
  exports: [IapComponent],
})
export class IapModule { }
