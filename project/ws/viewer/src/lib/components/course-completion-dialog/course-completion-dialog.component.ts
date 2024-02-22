import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { LoggerService, MultilingualTranslationsService } from '@sunbird-cb/utils'
import { TranslateService } from '@ngx-translate/core'

import { RatingService } from '@sunbird-cb/collection/src/public-api'
import { EventService, WsEvents } from '@sunbird-cb/utils/src/public-api'
@Component({
  selector: 'viewer-course-completion-dialog',
  templateUrl: './course-completion-dialog.component.html',
  styleUrls: ['./course-completion-dialog.component.scss'],
})
export class CourseCompletionDialogComponent implements OnInit {
  courseName = ''
  userRating: any = {}
  showRating = false
  isEditMode = false
  constructor(
    private ratingSvc: RatingService,
    private tocSvc: AppTocService,
    private loggerSvc: LoggerService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<CourseCompletionDialogComponent>,
    private langtranslations: MultilingualTranslationsService,
    public events: EventService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    }

  ngOnInit() {
    let app:any = document.getElementById('viewer-conatiner-backdrop');
    app.style.filter = 'blur(5px)';
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
            this.isEditMode = true
          } else {
            this.userRating = {
              rating: 0,
              comment: null,
          }
          this.isEditMode = false
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
    this.showRating = true
    this.userRating = {
      rating: index + 1 ,
      comment: null,
    }
    if(this.data && this.data.content) {
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

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, '')
  }
}
