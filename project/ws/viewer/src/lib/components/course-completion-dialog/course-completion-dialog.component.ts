import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material'
import { ContentRatingV2DialogComponent } from '@sunbird-cb/collection/src/lib/_common/content-rating-v2-dialog/content-rating-v2-dialog.component';
import { RatingService } from '@sunbird-cb/collection/src/lib/_services/rating.service'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { LoggerService } from '@sunbird-cb/utils'

@Component({
  selector: 'viewer-course-completion-dialog',
  templateUrl: './course-completion-dialog.component.html',
  styleUrls: ['./course-completion-dialog.component.scss'],
})
export class CourseCompletionDialogComponent implements OnInit {
  courseName = ''
  userRating: any

  constructor(
    private ratingSvc: RatingService,
    private tocSvc: AppTocService,
    private loggerSvc: LoggerService,
    public dialogRef: MatDialogRef<CourseCompletionDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.getUserRating()
    if (typeof(this.data.courseName) !== 'undefined') {
      this.courseName = this.data.courseName
    } else {
      this.courseName = 'course'
    }
  }

  openFeedbackDialog() {
    const obj = {
      identifier: this.data.identifier,
      primaryCategory: this.data.primaryCategory,
    }
    const dialogRef = this.dialog.open(ContentRatingV2DialogComponent, {
      // height: '400px',
      width: '770px',
      data: { content: obj, userId: this.data.userId, userRating: this.userRating },
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUserRating()
      }
    })
  }

  getUserRating() {
    if (this.data && this.data.identifier && this.data.primaryCategory) {
      this.ratingSvc.getRating(this.data.identifier, this.data.primaryCategory, this.data.userId).subscribe(
        (res: any) => {
          if (res && res.result && res.result.response) {
            this.userRating = res.result.response
            this.tocSvc.changeUpdateReviews(true)
          }
        },
        (err: any) => {
          this.loggerSvc.error('USER RATING FETCH ERROR >', err)
        }
      )
    }
  }
}
