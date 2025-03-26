import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import { EventService, MultilingualTranslationsService, WsEvents } from '@sunbird-cb/utils-v2'
/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
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

  constructor(private router: Router, private events: EventService,
              private langtranslations: MultilingualTranslationsService,
              private translate: TranslateService) {
    super()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
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

  navigateTo() {
    this.raiseTelemetry()
    this.router.navigateByUrl(`/app/person-profile/karma-points`)
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'show-all-karmapoints',
        id: 'show-all-karmapoints',
      },
      {},
      {
        pageIdExt: 'profileInfo',
        module: WsEvents.EnumTelemetrymodules.KARMAPOINTS,
    })
  }

  getTitle(row: any) {
    if (row && row.operation_type === 'COURSE_COMPLETION') {
      return this.translateLabels('Course Completion', 'profileKarmapoints')
    }
    if (row && row.operation_type === 'RATING') {
      return this.translateLabels('Course Rating', 'profileKarmapoints')
    }
    if (row && row.operation_type === 'FIRST_LOGIN') {
      return this.translateLabels('First Login', 'profileKarmapoints')
    }
    if (row && row.operation_type === 'FIRST_ENROLMENT') {
      return this.translateLabels('First Enrollment', 'profileKarmapoints')
    }
    return `${row ? row.operation_type.split('_').join(' ') : 'No Title'}`
  }

  translateName(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'profileKarmapoints.' + _.camelCase(menuName.replace(/\s/g, ''))
    return this.translate.instant(translationKey)
  }

  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }
}
