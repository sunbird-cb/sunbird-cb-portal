import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'viewer-course-completion-dialog',
  templateUrl: './course-completion-dialog.component.html',
  styleUrls: ['./course-completion-dialog.component.scss'],
})
export class CourseCompletionDialogComponent implements OnInit {

  courseName = ''
  constructor(
    public dialogRef: MatDialogRef<CourseCompletionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.courseName = this.data.courseName
  }

}
