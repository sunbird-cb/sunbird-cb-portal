import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { WidgetContentService } from '@sunbird-cb/collection/src/lib/_services/widget-content.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
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
  kpTooltiptext = 'Karma Points are a reward for high learning engagement at iGOT. For more information, visit Karma Points FAQs.'
  total = 0
  count = 0
  lastDate: any = moment(new Date()).valueOf()
  showLoader = false
  showMoreBtn = false

  constructor(
    private configSvc: ConfigurationsService,
    public router: Router,
    private contentSvc: WidgetContentService,
  ) {
    this.currentUser = this.configSvc && this.configSvc.userProfile
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
    if (row && row.addinfo) {
      const info = JSON.parse(row.addinfo)
      return info.COURSENAME ? info.COURSENAME : 'No course'
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
      return 'Course Completion'
    }
    if (row && row.operation_type === 'RATING') {
      return 'Course Rating'
    }
    if (row && row.operation_type === 'FIRST_LOGIN') {
      return 'First Login'
    }
    if (row && row.operation_type === 'FIRST_ENROLMENT') {
      return 'First Enrollment'
    }
    return `${row ? row.operation_type.split('_').join(' ') : 'No Title'}`
  }

}
