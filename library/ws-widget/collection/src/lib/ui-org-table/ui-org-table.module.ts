import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatTableModule } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSortModule } from '@angular/material/sort'
import { MatIconModule } from '@angular/material/icon'
import { AppButtonModule } from '../app-button/app-button.module'
import { MatMenuModule } from '@angular/material/menu'
import { DefaultThumbnailModule, PipeCountTransformModule, PipeDurationTransformModule, PipeHtmlTagRemovalModule, PipePartialContentModule } from '@sunbird-cb/utils-v2'
import { BtnChannelAnalyticsModule } from '../btn-channel-analytics/btn-channel-analytics.module'
import { BtnContentFeedbackV2Module } from '../btn-content-feedback-v2/btn-content-feedback-v2.module'
import { BtnContentLikeModule } from '../btn-content-like/btn-content-like.module'
import { BtnContentMailMeModule } from '../btn-content-mail-me/btn-content-mail-me.module'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material'
import { OrgUserTableComponent } from './user-list/org-user-table.component'
@NgModule({
  declarations: [OrgUserTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    DefaultThumbnailModule, PipeCountTransformModule,
    PipeDurationTransformModule, PipeHtmlTagRemovalModule,
    PipePartialContentModule,
    BtnChannelAnalyticsModule,
    BtnContentFeedbackV2Module,
    BtnContentMailMeModule,
    BtnContentLikeModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    AppButtonModule,
  ],

  exports: [OrgUserTableComponent],
})
export class UIORGTableModule { }
