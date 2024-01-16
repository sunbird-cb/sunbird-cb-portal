import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import moment from 'moment'
import { EventService, WsEvents } from '@sunbird-cb/utils'
import { environment } from 'src/environments/environment'
import { TranslateService } from '@ngx-translate/core'
// import { ActivatedRoute } from '@angular/router'
// import { ConfigurationsService } from '@ws-widget/utils'
// import { NSProfileDataV2 } from '../../models/profile-v2.model'

@Component({
  selector: 'app-right-menu-card',
  templateUrl: './right-menu-card.component.html',
  styleUrls: ['./right-menu-card.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})
export class RightMenuCardComponent implements OnInit, OnDestroy {
  @Input() eventData: any
  startTime: any
  endTime: any
  lastUpdate: any
  pastEvent = false
  futureEvent = false
  currentEvent = false
  isSpvEvent = false
  // completedPercent!: number
  // badgesSubscription: any
  // portalProfile!: NSProfileDataV2.IProfile
  // badges!: NSProfileDataV2.IBadgeResponse
  // currentEvent!: any
  constructor(
    // private route: ActivatedRoute,
    // configSvc: ConfigurationsService,
    private events: EventService,
    private translate: TranslateService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }
  ngOnInit(): void {
    // this.completedPercent = 86
    if (this.eventData) {
      this.startTime = this.eventData.startTime.split('+')[0].replace(/(.*)\D\d+/, '$1')
      this.endTime = this.eventData.endTime.split('+')[0].replace(/(.*)\D\d+/, '$1')
      this.lastUpdate = this.eventData.lastUpdatedOn.split('T')[0]

      const eventDate = this.customDateFormat(this.eventData.startDate, this.eventData.startTime)
      const eventendDate = this.customDateFormat(this.eventData.endDate, this.eventData.endTime)

      const now = new Date()
      const today = moment(now).format('YYYY-MM-DD HH:mm')

      const isToday = this.compareDate(eventDate, eventendDate, this.eventData)

      const spvOrgId = environment.spvorgID
      if (this.eventData.createdFor && this.eventData.createdFor[0] === spvOrgId) {
        this.isSpvEvent =  true
      }

      if (isToday) {
        this.currentEvent = true
        this.futureEvent = false
        this.pastEvent = false
      } else {
        this.currentEvent = false
        if (eventDate < today && eventendDate < today) {
          this.pastEvent = true
          this.futureEvent = false
        }
        if (eventDate > today && eventendDate > today) {
          this.futureEvent = true
          this.pastEvent = false
        }
      }
    }
  }

  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }

  compareDate(selectedStartDate: any, selectedEndDate: any, eventData: any) {
    const now = new Date()
    const today = moment(now).format('YYYY-MM-DD HH:mm')
    const todaysdate = moment(now).format('YYYY-MM-DD')
    // const day = new Date().getDate()
    // const year = new Date().getFullYear()
    // // tslint:disable-next-line:prefer-template
    // const month = ('0' + (now.getMonth() + 1)).slice(-2)
    // const todaysdate = `${year}-${month}-${day}`
    const stime = eventData.startTime.split('+')[0]
    const shour = stime.substr(0, 2) * 60
    const smin = stime.substr(3, 2) * 1
    const starttime = shour + smin

    const currentTime = new Date().getHours() * 60 + new Date().getMinutes()
    const minustime = starttime - currentTime
    // tslint:disable-next-line:max-line-length
    if (eventData.startDate === todaysdate && (minustime > 0 && minustime < 16) && (selectedStartDate > today || selectedEndDate < today))  {
      return true
    }
    if (eventData.startDate === todaysdate && (today >= selectedStartDate && today <= selectedEndDate))  {
      return true
    }
    return false
  }
  // calculatePercent(profile: NSProfileDataV2.IProfile | null): number {
  //   let count = 30
  //   if (!profile) {
  //     return count
  //   }
  //   if (profile.academics && profile.academics[0] && (profile.academics[0].nameOfInstitute ||
  //  profile.academics[0].nameOfQualification)) {
  //     count += 23
  //   }
  //   // if (profile.employmentDetails && profile.employmentDetails.departmentName) {
  //   //   count += 11.43
  //   // }
  //   if (profile.personalDetails && profile.personalDetails.nationality) {
  //     count += 11.43
  //   }
  //   if (profile.photo) {
  //     count += 11.43
  //   }
  //   if (profile.professionalDetails && profile.professionalDetails[0] && profile.professionalDetails[0].designation) {
  //     count += 11.43
  //   }
  //   if (profile.skills && profile.skills.additionalSkills) {
  //     count += 11.43
  //   }
  //   if (profile.interests && profile.interests.hobbies && profile.interests.hobbies.length > 0) {
  //     count += 11.43
  //   }
  //   if (count > 100) {
  //     count = 100
  //   }
  //   return Math.round(count || 0)
  // }

  ngOnDestroy() {
    // if (this.badgesSubscription) {
    //   this.badgesSubscription.unsubscribe()
    // }
  }

  raiseTelemetry(name: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: `btn-${name}`,
        id: this.eventData.identifier,
      },
      {
        id: this.eventData.identifier,
        type: 'event',
      },
      {
        pageIdExt: 'event',
        module: WsEvents.EnumTelemetrymodules.EVENTS,
    })
  }

  getLink() {
    if (this.eventData && this.eventData.recordedLinks && this.eventData.recordedLinks.length > 0) {
      return this.eventData.recordedLinks[0]
    }
      return this.eventData.registrationLink

  }
}
