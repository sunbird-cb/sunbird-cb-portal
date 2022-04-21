import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CourseCompletionDialogComponent } from './course-completion-dialog.component'
import { MatButtonModule, MatDialogModule, MatDividerModule, MatCardModule } from '@angular/material'

@NgModule({
  declarations: [CourseCompletionDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,

  ],
  exports: [CourseCompletionDialogComponent],
  entryComponents: [CourseCompletionDialogComponent],
})
export class CourseCompletionDialogModule { }
