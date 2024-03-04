import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-app-karmapoints-panel',
  templateUrl: './karmapoints-panel.component.html',
  styleUrls: ['./karmapoints-panel.component.scss'],
})

export class KarmaPointsPanelComponent implements OnInit, OnChanges {
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
  @Input() btntype: any
  @Input() data: any = []
  @Input() btnCategory = ''
  @Input() pCategory = ''
  @Input() condition: any
  @Output() clickClaimKarmaPoints = new EventEmitter<string>()
  kpData: any

  karmaPointsSlider: any

  ngOnInit() {
    this.constructNudgeData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.condition = changes.condition.currentValue

    if (!this.condition.isPostAssessment &&
      (!this.condition.content.completionPercentage || this.condition.content.completionPercentage < 100)
      && !this.condition.certData) {
        if (this.condition.isAcbpCourse && this.condition.isAcbpClaim) {
          this.getKPData('ACBP')
        }
        if (!this.condition.isAcbpCourse && !this.condition.isAcbpClaim && !this.condition.monthlyCapExceed) {
          this.getKPData('Resume')
        }
    }

    if (!this.condition.isPostAssessment && (this.condition.content.completionPercentage === 100 || this.condition.certData)) {
      if (this.condition.isAcbpCourse && this.condition.isAcbpClaim && !this.condition.isClaimed) {
        this.getKPData('ACBP CLAIM')
        this.btnCategory = 'claim'
      }

      if (this.condition.isAcbpCourse && this.condition.isAcbpClaim && this.condition.isClaimed) {
        this.getKPData('ACBP COMPLETED')
      }

      if (!this.condition.isAcbpCourse && !this.condition.monthlyCapExceed) {
        this.getKPData('Start again')
      }

      if (!this.condition.isAcbpCourse && this.condition.monthlyCapExceed && !this.condition.isCompletedThisMonth) {
        this.getKPData('Start again')
      }
    }

    if (this.condition.isPostAssessment && this.condition.showTakeAssessment && this.condition.showTakeAssessment.post_assessment) {
      this.getKPData('Take Assessment')
    }

    if (this.condition.content && this.condition.content.primaryCategory !== this.condition.primaryCategory.RESOURCE
      && !this.condition.enrollBtnLoading) {
      if (this.condition.isAcbpCourse) {
        this.getKPData('ACBP')
      }

      if (!this.condition.isAcbpCourse && !this.condition.monthlyCapExceed &&
        this.condition.userEnrollmentList && !this.condition.userEnrollmentList.length) {
        this.getKPData('Enroll')
      }
    }

    if ((this.condition.content && this.condition.content.primaryCategory !== this.condition.primaryCategory.RESOURCE)
    && !this.condition.enrollBtnLoading) {
      if (this.condition.isAcbpCourse) {
        this.getKPData('ACBP')
      }

      if (!this.condition.isAcbpCourse && !this.condition.monthlyCapExceed
        && this.condition.userEnrollmentList && !this.condition.userEnrollmentList.length) {
        this.getKPData('Enroll')
      }
    }

    if (!this.condition.isPostAssessment &&
      (!this.condition.content.completionPercentage || this.condition.content.completionPercentage < 100)) {
        if (this.condition.isAcbpCourse && this.condition.isAcbpClaim) {
          this.getKPData('ACBP')
        }

        if (!this.condition.isAcbpCourse && !this.condition.isAcbpClaim && !this.condition.monthlyCapExceed) {
          this.getKPData('Resume')
        }
      }

    if (!this.condition.isPostAssessment && (this.condition.content.completionPercentage === 100)) {
      if (this.condition.isAcbpCourse && this.condition.isAcbpClaim && !this.condition.isClaimed) {
        this.getKPData('ACBP CLAIM')
        this.btnCategory = 'claim'
      }

      if (this.condition.isAcbpCourse && this.condition.isAcbpClaim && this.condition.isClaimed) {
        this.getKPData('ACBP COMPLETED')
      }

      if (!this.condition.isAcbpCourse && !this.condition.monthlyCapExceed) {
        this.getKPData('Start again')
      }

      if (!this.condition.isAcbpCourse && this.condition.monthlyCapExceed && !this.condition.isCompletedThisMonth) {
        this.getKPData('Start again')
      }
    }

    if (this.condition.isPostAssessment && this.condition.showTakeAssessment && this.condition.showTakeAssessment.post_assessment) {
      this.getKPData('Take Assessment')
    }

    if (this.condition.resumeData) {
      if (!this.condition.userRating) {
        this.getKPData('Rate this course')
      }

      if (this.condition.userRating) {
        this.getKPData('Edit rating')
      }
    }

    // if (this.condition.isPostAssessment &&
    //   (!this.condition.content.completionPercentage || this.condition.content.completionPercentage < 100)
    //   && !this.condition.certData) {
    //   if (this.condition.isAcbpClaim) {
    //     this.getKPData('ACBP')
    //   }
    //   if (!this.condition.isAcbpClaim && !this.condition.monthlyCapExceed) {
    //     this.getKPData('Resume')
    //   }
    // }

    // if (!this.condition.isPostAssessment && (this.condition.content.completionPercentage === 100 || this.condition.certData)) {
    //   if (this.condition.isAcbpCourse && this.condition.isAcbpClaim && !this.condition.isClaimed) {
    //     this.getKPData('ACBP CLAIM')
    //   }
    //   if (!this.condition.isAcbpCourse) {
    //     if (!this.condition.monthlyCapExceed || (this.condition.monthlyCapExceed && !this.condition.isCompletedThisMonth)) {
    //       this.getKPData('Start again')
    //     }
    //   }
    // }

    // if (this.condition.isPostAssessment && this.condition.showTakeAssessment && this.condition.showTakeAssessment.post_assessment) {
    //   this.getKPData('Take Assessment')
    // }

    // if (this.condition.isAcbpCourse) {
    //   this.getKPData('ACBP')
    // }

    // if (!this.condition.isAcbpCourse
    //   && !this.condition.monthlyCapExceed && this.condition.userEnrollmentList && !this.condition.userEnrollmentList.length) {
    //   this.getKPData('Enroll')
    // }

    // if (!this.condition.isPostAssessment &&
    //   (!this.condition.content.completionPercentage || this.condition.content.completionPercentage < 100)) {
    //   if (this.condition.isAcbpClaim) {
    //     this.getKPData('ACBP')
    //   }
    //   if (!this.condition.isAcbpClaim && !this.condition.monthlyCapExceed) {
    //     this.getKPData('Resume')
    //   }
    // }

    // if (!this.condition.isPostAssessment && (this.condition.content.completionPercentage === 100)) {
    //   if (this.condition.isAcbpCourse && this.condition.isAcbpClaim && !this.condition.isClaimed) {
    //     this.getKPData('ACBP CLAIM')
    //   }
    //   if (!this.condition.isAcbpCourse) {
    //     if (!this.condition.monthlyCapExceed || (this.condition.monthlyCapExceed && !this.condition.isCompletedThisMonth)) {
    //       this.getKPData('Start again')
    //     }
    //   }
    // }

    // if (this.condition.resumeData) {
    //   if (!this.condition.userRating) {
    //     this.getKPData('Rate this course')
    //   } else {
    //     this.getKPData('Edit rating')
    //   }
    // }

    // if (!this.condition.isPostAssessment && (this.condition.content.completionPercentage === 100 || this.condition.certData)) {
    //   this.btnCategory = 'claim'
    // }
  }

  getKPData(btnType: string): void {
    this.data.forEach((item: any) => {
      if (item.displayButton === btnType) {
        this.kpData = item
        if (this.kpArray.findIndex((_obj: any) => _obj.displayButton ===  item.displayButton) === -1) {
          this.kpArray.push(this.kpData)
        }
      }
    })
  }

  onClickOfClaim() {
    this.clickClaimKarmaPoints.emit('claim')
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

    // nudgeData.sliderData = [{
    //   textBeforeIcon: 'Earn',
    //   points: '10',
    //   textAfterIcon: 'by completing this course',
    // }, {
    //   textBeforeIcon: 'Earn',
    //   points: '15',
    //   textAfterIcon: 'by completing this course',
    // }, {
    //   textBeforeIcon: 'Earn',
    //   points: '20',
    //   textAfterIcon: 'by completing this course',
    // }]
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
