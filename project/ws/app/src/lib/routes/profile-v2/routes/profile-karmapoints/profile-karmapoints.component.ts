import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import moment from 'moment'

@Component({
  selector: 'app-profile-karmapoints',
  templateUrl: './profile-karmapoints.component.html',
  styleUrls: ['./profile-karmapoints.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 margin-top-l' },
  /* tslint:enable */
})
export class ProfileKarmapointsComponent implements OnInit {
  currentUser: any
  karmaPointsHistory: any = []
  total = 0
  count = 0
  lastDate: any = moment(new Date()).valueOf()
  showLoader = false
  showMoreBtn = false

  constructor(
    private configSvc: ConfigurationsService,
    public router: Router,
    private contentSvc: WidgetContentService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService
  ) {
    this.currentUser = this.configSvc && this.configSvc.userProfile
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  ngOnInit() {
    this.getKarmaPoints()
  }

  getKarmaPoints() {
    this.showLoader = true
    this.contentSvc.getKarmaPoitns(10, this.lastDate).subscribe((res: any) => {
      if (res && res.kpList && res.kpList.length > 0) {
        this.karmaPointsHistory = [...this.karmaPointsHistory, ...res.kpList]
        this.total = res.count
        this.count = this.count + res.kpList.length
        const lastRecord = res.kpList[res.kpList.length - 1]
        this.lastDate = lastRecord.credit_date
        if (this.total > this.count) {
          this.showMoreBtn = true
        } else {
          this.showMoreBtn = false
        }
        this.showLoader = false
      } else {
        this.showLoader = false
        this.showMoreBtn = false
      }
    })
  }

  loadMore() {
    this.getKarmaPoints()
  }

  getName(row: any) {
    if (row && row.addinfo && row.context_type === 'Course') {
      const info = JSON.parse(row.addinfo)
      return info.COURSENAME ? info.COURSENAME : 'No course'
    }  if (row && row.addinfo && row.context_type.toLowerCase() === 'event') {
      const info = JSON.parse(row.addinfo)
      return info.EVENTNAME ? info.EVENTNAME : 'No event'
    }
    return 'No course'
  }

  getAdditonInfo(row: any) {
    if (row && row.addinfo) {
      const info = JSON.parse(row.addinfo)
    return info.ACBP
    }
    return false
  }

  getTitle(row: any) {
    if (row && row.operation_type === 'COURSE_COMPLETION') {
      return this.translateLabels('Course Completion', 'profileKarmapoints', '')
    }
    if (row && row.operation_type === 'RATING') {
      return this.translateLabels('Course Rating', 'profileKarmapoints', '')
    }
    if (row && row.operation_type === 'FIRST_LOGIN') {
      return this.translateLabels('First Login', 'profileKarmapoints', '')
    }
    if (row && row.operation_type === 'FIRST_ENROLMENT') {
      // return 'First Enrollment'
      return this.translateLabels('First Enrollment', 'profileKarmapoints', '')
    }
    return `${row ? row.operation_type.split('_').join(' ') : 'No Title'}`
  }

  translateLabels(label: string, type: any, subtype: any) {
    return this.langtranslations.translateLabel(label, type, subtype)
  }

}
