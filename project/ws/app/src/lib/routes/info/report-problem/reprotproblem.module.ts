import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import {
  MatToolbarModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatSidenavModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material'

import { BtnPageBackNavModule, BtnPageBackModule } from '@sunbird-cb/collection'
import { HorizontalScrollerModule, PipeSafeSanitizerModule } from '@sunbird-cb/utils-v2'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { ReportproblemComponent } from './components/reportproblem.component'

import { MicroSurveyModule } from '@sunbird-cb/micro-surveys'

@NgModule({
  declarations: [ReportproblemComponent],
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
    MatMenuModule,
    MatSidenavModule,

    MatFormFieldModule,
    MatInputModule,
    MicroSurveyModule,
    BtnPageBackModule,
  ],
  exports: [ReportproblemComponent],
})
export class ReportproblemModule { }
