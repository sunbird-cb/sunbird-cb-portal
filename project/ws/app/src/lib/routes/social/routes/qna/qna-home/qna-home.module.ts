import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import {
  MatButtonToggleModule,
  MatButtonModule,
  MatDividerModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatChipsModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
} from '@angular/material'
import { QnaHomeComponent } from './components/qna-home/qna-home.component'
import { PipeLimitToModule, PipeCountTransformModule } from '@sunbird-cb/utils-v2'
import { BtnPageBackModule, ErrorResolverModule, DialogSocialDeletePostModule } from '@sunbird-cb/collection'
import { QnaItemComponent } from './components/qna-item/qna-item.component'

@NgModule({
  declarations: [QnaHomeComponent, QnaItemComponent],
  imports: [
    CommonModule,
    RouterModule,
    WidgetResolverModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    BtnPageBackModule,
    ErrorResolverModule,
    PipeLimitToModule,
    PipeCountTransformModule,
    DialogSocialDeletePostModule,
  ],
})
export class QnaHomeModule { }
