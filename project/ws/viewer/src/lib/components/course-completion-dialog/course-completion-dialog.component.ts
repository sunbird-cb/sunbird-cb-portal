import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { RatingService } from '@sunbird-cb/collection/src/lib/_services/rating.service'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { LoggerService, MultilingualTranslationsService } from '@sunbird-cb/utils'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'viewer-course-completion-dialog',
  templateUrl: './course-completion-dialog.component.html',
  styleUrls: ['./course-completion-dialog.component.scss'],
})
export class CourseCompletionDialogComponent implements OnInit {
  courseName = ''
  userRating: any
  showRating = false
  constructor(
    private ratingSvc: RatingService,
    private tocSvc: AppTocService,
    private loggerSvc: LoggerService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<CourseCompletionDialogComponent>,
    private langtranslations: MultilingualTranslationsService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        let lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    }

  ngOnInit() {
    if (typeof(this.data.courseName) !== 'undefined') {
      this.courseName = this.data.courseName
    } else {
      this.courseName = 'course'
    }
  }

  openRatingDialog() {
    this.getUserRating()
  }

  getUserRating() {
    if (this.data && this.data.identifier && this.data.primaryCategory) {
      this.ratingSvc.getRating(this.data.identifier, this.data.primaryCategory, this.data.userId).subscribe(
        (res: any) => {
          if (res && res.result && res.result.response) {
            this.userRating = res.result.response
            this.tocSvc.changeUpdateReviews(true)
            this.showRating = true
          } else {
            this.userRating = 0
            this.showRating = true
          }
        },
        (err: any) => {
          this.loggerSvc.error('USER RATING FETCH ERROR >', err)
        }
      )
    }
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabelWithoutspace(label, type, '')
  }
}
