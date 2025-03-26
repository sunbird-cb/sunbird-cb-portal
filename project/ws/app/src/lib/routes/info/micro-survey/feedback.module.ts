import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MicroSurveyModule } from '@sunbird-cb/micro-surveys'
import { FeedbackComponent } from './components/feedback.component'
import {
  MatToolbarModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
} from '@angular/material'
import { BtnPageBackModule, BtnPageBackNavModule } from '@sunbird-cb/collection'
import { HorizontalScrollerModule, PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { WidgetResolverModule } from '@sunbird-cb/resolver'

@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,

    BtnPageBackNavModule,
    HorizontalScrollerModule,
    WidgetResolverModule,
    PipeSafeSanitizerModule,
    MicroSurveyModule,
    BtnPageBackModule,

  ],
  exports: [FeedbackComponent],
})
export class FeedBackModule { }
