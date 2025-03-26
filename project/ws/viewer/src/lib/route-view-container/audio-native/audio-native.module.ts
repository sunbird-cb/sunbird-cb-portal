import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import {
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatSnackBarModule,
  MatButtonModule,
  MatChipsModule,
} from '@angular/material'

import { WidgetResolverModule } from '@sunbird-cb/resolver'

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
  DefaultThumbnailModule,
  PipePartialContentModule,
  PipeSafeSanitizerModule,
} from '@sunbird-cb/utils-v2'

import { AudioNativeModule as AudioNativePluginModule } from '../../plugins/audio-native/audio-native.module'

import { AudioNativeComponent } from './audio-native.component'

@NgModule({
  declarations: [AudioNativeComponent],
  imports: [
    AudioNativePluginModule,
    BtnContentDownloadModule,
    BtnContentFeedbackModule,
    BtnContentFeedbackV2Module,
    BtnContentLikeModule,
    BtnContentShareModule,
    BtnGoalsModule,
    BtnPlaylistModule,
    CommonModule,
    DefaultThumbnailModule,
    DisplayContentTypeModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatSnackBarModule,
    PipeDurationTransformModule,
    PipeLimitToModule,
    PipePartialContentModule,
    RouterModule,
    UserContentRatingModule,
    UserImageModule,
    WidgetResolverModule,
    PipeSafeSanitizerModule,
    PlayerBriefModule,
  ],
  exports: [AudioNativeComponent],
})
export class AudioNativeModule { }
