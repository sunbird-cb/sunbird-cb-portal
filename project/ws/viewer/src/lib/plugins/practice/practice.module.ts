import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { PracticeComponent } from './practice.component'
import { OverviewComponent } from './components/overview/overview.component'
import { QuestionComponent } from './components/question/question.component'
import { SubmitQuizDialogComponent } from './components/submit-quiz-dialog/submit-quiz-dialog.component'

import { PipeDurationTransformModule, PipeLimitToModule } from '@sunbird-cb/utils'

import {
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatListModule,
  MatRadioModule,
  MatSidenavModule,
  MatTableModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatTooltipModule,
} from '@angular/material'

import {
  BtnFullscreenModule,
} from '@sunbird-cb/collection'
import { ResultComponent } from './components/result/result.component'
import { FillInTheBlankComponent } from './components/question/fitb/fitb.component'
import { MultipleChoiseQuesComponent } from './components/question/mcq-mca/mcq-mca.component'
import { SingleChoiseQuesComponent } from './components/question/mcq-sca/mcq-sca.component'
import { MatchTheFollowingQuesComponent } from './components/question/mtf/mtf.component'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    FillInTheBlankComponent,
    MatchTheFollowingQuesComponent,
    MultipleChoiseQuesComponent,
    OverviewComponent,
    PracticeComponent,
    QuestionComponent,
    ResultComponent,
    SingleChoiseQuesComponent,
    SubmitQuizDialogComponent,
  ],
  entryComponents: [SubmitQuizDialogComponent],
  imports: [
    CommonModule,
    PipeDurationTransformModule,
    PipeLimitToModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSidenavModule,
    MatExpansionModule,
    MatTableModule,
    MatButtonModule,
    BtnFullscreenModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
  ],
  exports: [
    PracticeComponent,
  ],
})
export class PracticePlModule { }
