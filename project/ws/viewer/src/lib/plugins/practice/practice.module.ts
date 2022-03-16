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
} from '@angular/material'

import {
  BtnFullscreenModule,
} from '@sunbird-cb/collection'
import { ResultComponent } from './components/result/result.component'

@NgModule({
  declarations: [PracticeComponent, OverviewComponent, QuestionComponent, ResultComponent, SubmitQuizDialogComponent],
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
    MatTableModule,
    MatButtonModule,
    BtnFullscreenModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    PracticeComponent,
  ],
})
export class PracticePlModule { }
