import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
@Component({
  selector: 'ws-widget-profile-v2-karmapoints',
  templateUrl: './profile-karmapoints.component.html',
  styleUrls: ['./profile-karmapoints.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})
export class ProfileKarmapointsComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: any
  @HostBinding('id')
  public id = 'profile-karmapoints'

  constructor(private router: Router) {
    super()
  }

  ngOnInit() {
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

  navigateTo() {
    this.router.navigateByUrl(`/app/person-profile/karma-points`)
  }

  getTitle(row: any) {
    if (row && row.operation_type === 'COURSE_COMPLETION') {
      return 'Course Completion'
    }  if (row && row.operation_type === 'RATING') {
      return 'Course Rating'
    }  if (row && row.operation_type === 'FIRST_LOGIN') {
      return 'First Login'
    } else if (row && row.operation_type === 'FIRST_ENROLMENT') {
      return 'First Enrollment'
    }
    return `${row ? row.operation_type.split('_').join(' ') : 'No Title'}`
  }

}
