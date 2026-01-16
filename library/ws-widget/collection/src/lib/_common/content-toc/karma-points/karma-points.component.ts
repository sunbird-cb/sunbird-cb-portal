import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

import { MultilingualTranslationsService, NsContent } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-widget-karma-points',
  templateUrl: './karma-points.component.html',
  styleUrls: ['./karma-points.component.scss'],
})

export class KarmaPointsComponent implements OnInit, OnChanges {
  kpArray: any[] = []
  constructor(
    private translate: TranslateService,
    private langTranslations: MultilingualTranslationsService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  @Input() content: NsContent.IContent | null = null
  @Input() data: any = []
  @Input() pCategory = ''
  @Input() condition: any
  @Output() clickClaimKarmaPoints = new EventEmitter<string>()
  kpData: any
  @Input() btnCategory = ''
  karmaPointsSlider: any
  btnKPData: any
  disableKarmaPoints = false

  ngOnInit() {
    this.constructNudgeData()

    if (this.content && this.content.courseCategory === NsContent.ECourseCategory.CASE_STUDY) {
      this.disableKarmaPoints = true
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.condition = changes.condition && changes.condition.currentValue || null

    if (!this.condition) { return }
    if (this.condition && !this.condition.event) {
      // For TOC karma points
      if (!this.condition.isPostAssessment && (this.condition.content && this.condition.content.hasOwnProperty('completionPercentage')
        && !this.condition.content.completionPercentage
        || (this.condition.content && this.condition.content.completionPercentage < 100))
         && !this.condition.certData) {
           if (this.condition.isAcbpClaim) {
             this.getKPData('ACBP')
           }

           if (this.condition.content.primaryCategory === this.condition.primaryCategory.COURSE) {
             if (!this.condition.isAcbpClaim && !this.condition.monthlyCapExceed) {
               this.getKPData('Resume')
             }
           }
       }

       if (this.condition && !this.condition.isPostAssessment
        && ((this.condition.content && this.condition.content.completionPercentage === 100)
        || this.condition.certData)) {
        if (this.condition.isAcbpCourse && this.condition.isAcbpClaim && !this.condition.isClaimed) {
          this.getKPData('ACBP CLAIM')
          this.btnCategory = 'claim'
        }

        if (this.condition.content.primaryCategory === this.condition.primaryCategory.COURSE) {
          if (this.condition && !this.condition.isAcbpCourse && !this.condition.monthlyCapExceed) {
            this.getKPData('Start again')
          }

          if (!this.condition.isAcbpCourse && this.condition.monthlyCapExceed && !this.condition.isCompletedThisMonth) {
            this.getKPData('Start again')
          }
        }
      }

      if (this.condition && this.condition.isPostAssessment
        && this.condition.showTakeAssessment
        && this.condition.showTakeAssessment.post_assessment) {
        this.getKPData('Take Assessment')
      }

      if (this.condition && (this.condition.content
        && this.condition.content.primaryCategory) !== this.condition.primaryCategory.RESOURCE
        && !this.condition.enrollBtnLoading) {
        if (this.condition.isAcbpCourse) {
          this.getKPData('ACBP')
        }

        if (!this.condition.isAcbpCourse && !this.condition.monthlyCapExceed &&
          this.condition.userEnrollmentList && !this.condition.userEnrollmentList.length) {
          this.getKPData('Enroll')
        }
      }

      if (this.condition && !this.condition.isPostAssessment
        && (this.condition.content && this.condition.content.hasOwnProperty('completionPercentage')
      && !this.condition.content.completionPercentage
      || (this.condition.content && this.condition.content.completionPercentage < 100))) {

          if (this.condition.isAcbpClaim) {
            this.getKPData('ACBP')
          }

          if (this.condition.content.primaryCategory === this.condition.primaryCategory.COURSE) {
            if (!this.condition.isAcbpClaim && !this.condition.monthlyCapExceed) {
              this.getKPData('Resume')
            }
          }
        }

        if (this.condition && !this.condition.isPostAssessment
          && (this.condition.content && this.condition.content.completionPercentage === 100)) {
          if (this.condition.isAcbpCourse && this.condition.isAcbpClaim && !this.condition.isClaimed) {
            this.getKPData('ACBP CLAIM')
            this.btnCategory = 'claim'
          }

          if (this.condition.content.primaryCategory === this.condition.primaryCategory.COURSE) {
            if (!this.condition.isAcbpCourse && !this.condition.monthlyCapExceed) {
              this.getKPData('Start again')
            }

            if (!this.condition.isAcbpCourse && this.condition.monthlyCapExceed && !this.condition.isCompletedThisMonth) {
              this.getKPData('Start again')
            }
          }
        }
        if (this.condition && this.condition.isPostAssessment && this.condition.showTakeAssessment
          && this.condition.showTakeAssessment.post_assessment) {
          this.getKPData('Take Assessment')
        }

        if (this.condition && this.condition.resumeData) {
          if (!this.condition.userRating) {
            this.getKPData('Rate this course')
          }

          if (this.condition.userRating) {
            this.getKPData('Edit rating')
          }
        }
    } else {
      // For event karma points
      if (this.condition && !this.condition.completedAfterExpiry) {
        if (this.condition && this.condition.isEnrolled) {
          if (this.condition.currentEvent) {
            this.getKPData('Complete')
          }

          if (this.condition.pastEvent && this.condition.enrolledEvent) {
            if (this.condition.enrolledEvent.status < 2) {
              this.getKPData('')
            }
            if (this.condition.enrolledEvent.status === 2) {
              this.getKPData('completed')
            }
          }
        }

        if (this.condition && !this.condition.isEnrolled) {
          if (this.condition.currentEvent) {
            this.getKPData('Complete')
          }
        }
      }
    }
  }

  getKPData(btnType: string): void {
    this.data.forEach((item: any) => {
      if (item.displayButton === btnType && item.displayButton !== 'ACBP CLAIM') {
        this.kpData = item
        if (this.kpArray.findIndex((_obj: any) => _obj.displayButton ===  item.displayButton) === -1) {
          this.kpArray.push(this.kpData)
        }
      }
      if (item.displayButton === 'ACBP CLAIM') {
        this.btnKPData = item
      }
    })
  }

  onClickOfClaim() {
    this.clickClaimKarmaPoints.emit('claim')
    this.btnCategory = ''
  }

  constructNudgeData() {
    const nudgeData: any = {
      type: 'karma-points',
      iconsDisplay: false,
      cardClass: 'slider-container',
      height: 'auto',
      width: '',
      sliderData: [],
      negativeDisplay: false,
      'dot-default': 'dot-grey',
      'dot-active': 'dot-active',
    }

    nudgeData.sliderData = []
    nudgeData.sliderData = this.kpArray
    this.karmaPointsSlider = nudgeData
  }

  getDynamicText(helText: string) {
    if (this.pCategory !== '') {
      return helText.replace('course', this.pCategory.toLowerCase())
    }
    return helText
  }

  translateLabels(label: string, type: any) {
    return this.langTranslations.translateLabelWithoutspace(label, type, '')
  }

}
