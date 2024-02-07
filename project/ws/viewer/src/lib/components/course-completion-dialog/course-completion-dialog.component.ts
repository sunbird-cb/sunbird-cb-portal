import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { RatingService } from '@sunbird-cb/collection/src/public-api'
import { EventService, WsEvents, LoggerService } from '@sunbird-cb/utils/src/public-api'
@Component({
  selector: 'viewer-course-completion-dialog',
  templateUrl: './course-completion-dialog.component.html',
  styleUrls: ['./course-completion-dialog.component.scss'],
})
export class CourseCompletionDialogComponent implements OnInit {
  courseName = ''
  userRating: any= {}
  showRating = false
  isEditMode = false;
  constructor(
    private ratingSvc: RatingService,
    private tocSvc: AppTocService,
    private loggerSvc: LoggerService,
    public dialogRef: MatDialogRef<CourseCompletionDialogComponent>,
    public events: EventService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (typeof(this.data.courseName) !== 'undefined') {
      this.courseName = this.data.courseName
    } else {
      this.courseName = 'course'
    }
    this.getUserRating()
  }

  // openRatingDialog() {
  //   this.getUserRating()
  // }

  getUserRating() {
    if (this.data && this.data.identifier && this.data.primaryCategory) {
      this.ratingSvc.getRating(this.data.identifier, this.data.primaryCategory, this.data.userId).subscribe(
        (res: any) => {
          if (res && res.result && res.result.response) {
            this.userRating = res.result.response
            this.tocSvc.changeUpdateReviews(true)
            // this.showRating = true
            this.isEditMode = true;
          } else {
            this.userRating = {
              "rating": 0,
              "comment": null
          }
          this.isEditMode = false;
          // this.showRating = true
          }
        },
        (err: any) => {
          this.loggerSvc.error('USER RATING FETCH ERROR >', err)
        }
      )
    }
  }

  addRating(index: number) {  
    this.showRating = true;
    this.userRating = {
      "rating": index + 1 ,
      "comment": null
    }
    this.events.raiseInteractTelemetry(
      {
        type: 'rating',
        subType: 'content',
        id: this.data.content.identifier || '',
      },
      {
        id: this.data.content.identifier || '',
        rating: this.userRating.rating,
      },
      {
      pageIdExt: 'rating-popup',
      module: WsEvents.EnumTelemetrymodules.FEEDBACK,
    })
  }
}
