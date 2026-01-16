import { Component, OnDestroy, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core'
import moment from 'moment'
import { ConfigurationsService, EventService as EventServiceGlobal, WsEvents } from '@sunbird-cb/utils-v2'
import { environment } from 'src/environments/environment'
import { TranslateService } from '@ngx-translate/core'
import { ActivatedRoute, Router } from '@angular/router'
import { EventService } from '../../services/events.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { DialogConfirmComponent } from '../../../../../../../../../src/app/component/dialog-confirm/dialog-confirm.component'
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
export class RightMenuCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() eventData: any
  @Input() isenrollFlow: any
  @Input() enrollFlowItems: any
  @Input() enrolledEvent: any
  @Input() courseProgress: any
  @Input() userAbleToEnroll: any = false
  @Output() enrollEvent: any = new EventEmitter()

  startTime: any
  endTime: any
  lastUpdate: any
  pastEvent = false
  futureEvent = false
  currentEvent = false
  isSpvEvent = false
  youTubeLinkFlag = false
  kparray: any = []
  enrollBtnLoading = false
  videoId = ''
  eventEnrollmentList: any
  isEnrolled = false
  batchId = ''
  pageConfig: any = {}
  enableShare = false
  rootOrgId: any
  showEnrolledCount: boolean = true
  totalUsersEnrolled: any = 0
  // completedPercent!: number
  // badgesSubscription: any
  // portalProfile!: NSProfileDataV2.IProfile
  // badges!: NSProfileDataV2.IBadgeResponse
  // currentEvent!: any
  constructor(
    private matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private configSvc: ConfigurationsService,
    private events: EventServiceGlobal,
    private translate: TranslateService,
    private router: Router,
    private eventSvc: EventService,
    private dialog: MatDialog
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    if (this.configSvc.userProfile) {
      this.rootOrgId = this.configSvc.userProfile.rootOrgId
    }
  }
  ngOnInit(): void {
    this.loadEnrolledEventData()

    this.kparray = (this.route.parent && this.route.parent.snapshot.data.pageData.data.karmaPoints) || []
    this.pageConfig = this.route.parent && this.route.parent.snapshot.data.pageData.data
    if (this.eventData) {

      this.startTime = this.eventData.startTime.split('+')[0].replace(/(.*)\D\d+/, '$1')
      this.endTime = this.eventData.endTime.split('+')[0].replace(/(.*)\D\d+/, '$1')
      this.lastUpdate = this.eventData.lastUpdatedOn.split('T')[0]

      const eventDate = this.customDateFormat(this.eventData.startDate, this.eventData.startTime)
      const eventendDate = this.customDateFormat(this.eventData.endDate, this.eventData.endTime)

      const now = new Date()
      const today = moment(now).format('YYYY-MM-DD HH:mm')

      const spvOrgId = environment.spvorgID
      if (this.eventData.createdFor && this.eventData.createdFor[0] === spvOrgId) {
        this.isSpvEvent = true
      }

      // Check if current date/time is between start and end date/time
      if (today >= eventDate && today <= eventendDate) {
        this.currentEvent = true
        this.futureEvent = false
        this.pastEvent = false
      } else if (today < eventDate) {
        // Event hasn't started yet
        this.currentEvent = false
        this.futureEvent = true
        this.pastEvent = false
      } else if (today > eventendDate) {
        // Event has ended
        this.currentEvent = false
        this.futureEvent = false
        this.pastEvent = true
      }

      if (this.eventData && this.eventData.registrationLink) {
        if (this.eventData && this.eventData.registrationLink && this.pageConfig.enrollFlowItems.includes(this.eventData.resourceType)) {
          const videoId = this.eventData.registrationLink.split('?')[0].split('/').pop()
          if (videoId) {
            this.videoId = videoId
            this.youTubeLinkFlag = true
          } else {
            this.youTubeLinkFlag = false
          }
        }

      }
      if (this.eventData?.typeofEvent === 'live') {
        this.getEnrolledUserCount()
      }
    }
  }

  getEnrolledUserCount() {
    const requestBody = {
      request: {
        filters: {
          active: true,
          batchId: this.batchId,
          limit: 1,
          currentOffSet: 0
        }
      }
    }
    this.eventSvc.getUserEnrollCount(requestBody).subscribe((response) => {
      this.totalUsersEnrolled = response?.totalCount || 0
    })
  }

  get progressVal() {
    return this.enrolledEvent && this.enrolledEvent.status === 2 ? 100 : this.enrolledEvent.completionPercentage
  }

  get isEnrollmentAllowed(): boolean {
    if (!this.eventData || !this.eventData.endDate || !this.eventData.endTime) {
      return true
    }
    const eventEndDateTime = this.customDateFormat(this.eventData.endDate, this.eventData.endTime)
    const now = new Date()
    const currentDateTime = moment(now).format('YYYY-MM-DD HH:mm')
    return currentDateTime < eventEndDateTime
  }

  ngOnChanges() {
    this.loadEnrolledEventData()
    // console.log(this.enrolledEvent)
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
    if (eventData.startDate === todaysdate && (minustime > 0 && minustime < 16) && (selectedStartDate > today || selectedEndDate < today)) {
      return true
    }
    if (eventData.startDate === todaysdate && (today >= selectedStartDate && today <= selectedEndDate)) {
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
        subType: `${name}`,
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
    return false
  }

  navigateToPLayer() {
    if (this.isenrollFlow) {
      const url = this.findUrl()
      if (url.includes('youtube.com')) {
        const videoId = url.split('/').pop()
        const youtubeId = videoId?.split('?')[0] || videoId
        this.router.navigate([`app/event-hub/player/${this.eventData.identifier}/youtube/${youtubeId}`])
      } else if (this.eventData?.typeofEvent?.toLowerCase() === 'live') {
        window.open(url, "_blank")
      } else {
        this.router.navigate([`app/event-hub/player/${this.eventData.identifier}/video/${this.videoId.split("_").pop()}`])
      }
    } else {
      window.open(this.getLink(), "_blank")
    }
  }

  findUrl() {
    if (this.eventData && this.eventData.recordedLinks && this.eventData.recordedLinks.length > 0) {
      return this.eventData.recordedLinks[0]
    }
    return this.eventData.registrationLink
  }

  navigateToSamePagewithBatchId(batchId: string) {
    if (batchId) {
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { batchId },
          queryParamsHandling: 'merge',
        })
    }
  }

  enrolltoEvent() {
    if (this.eventData.identifier && this.configSvc && this.configSvc.userProfile && this.batchId) {
      this.enrollBtnLoading = true
      // const batchData = this.contentReadData && this.contentReadData.batches && this.contentReadData.batches[0]
      const req = {
        request: {
          userId: this.configSvc.userProfile.userId || '',
          eventId: this.eventData.identifier || '',
          batchId: this.batchId,
        },
      }
      // console.log('req ::', req)
      /* tslint:disable */
      this.eventSvc.enrollEvent(req).subscribe(res => {
        if (res.responseCode === 'OK' || res.result.response === 'SUCCESS') {
          this.openSnackBar('Enrolled Successfully')
          this.raiseTelemetry('enroll-now')
          this.enrollEvent.emit(true)
          if (this.eventData?.typeofEvent === 'live') {
            this.getEnrolledUserCount()
          }
        }
        if (this.batchId) {
          // this.navigateToPlayerPage(batchId)
          this.isEnrolled = true
          this.navigateToSamePagewithBatchId(this.batchId)
        }
        this.enrollBtnLoading = false

      },
        (err: any) => {
          this.enrollBtnLoading = false
          this.openSnackBar(err.error.params.errmsg || 'Something went wrong! please try again later.')
        }
      )
    }
  }

  showYoutubeVideo() {
    this.events.raiseInteractTelemetry({
      type: WsEvents.EnumInteractTypes.CLICK,
      id: 'event-enroll',
    },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      })
    this.eventSvc.eventEnrollEvent.next(true)
  }

  loadEnrolledEventData() {
    this.isEnrolled = this.enrolledEvent ? true : false
    if (this.enrolledEvent && this.enrolledEvent.batchDetails) {
      if (Array.isArray(this.enrolledEvent.batchDetails) && this.enrolledEvent.batchDetails.length > 0) {
        this.batchId = this.enrolledEvent.batchDetails[0].batchId || ''
        this.navigateToSamePagewithBatchId(this.batchId)
      }
    } else {
      if (this.eventData && typeof this.eventData.batches === 'string') {
        this.eventData.batches = JSON.parse(this.eventData.batches)
      }
      if (Array.isArray(this.eventData.batches) && this.eventData.batches.length > 0) {
        this.batchId = this.eventData.batches[0].batchId || ''
        this.navigateToSamePagewithBatchId(this.batchId)
      }
    }
  }

  get completedAfterExpiry() {
    if (this.eventData && this.enrolledEvent) {
      // console.log('completedAfterExpiry :: ')
      const eventEndTimestamp = new Date(this.eventData.endDate).getTime()
      const completedTimestamp = new Date(this.enrolledEvent.completedOn).getTime()
      if (eventEndTimestamp < completedTimestamp) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  onClickOfShare() {
    this.enableShare = true
  }

  resetEnableShare(_eventData: any) {
    this.enableShare = false
  }

  public openSnackBar(message: string) {
    this.matSnackBar.open(message)
  }

  completeCourse() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '600px',
      data: {
        title: 'Course Completion Required',
        body: 'Complete the linked course atleast 30% to enroll to this event.',
        button: [{ type: 'primary', text: 'goToCourse' }, { type: 'secondary', text: 'cancel' }],
      },
      position: { top: '100px' },
      autoFocus: false,
    })
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.router.navigate([`/app/toc/${this.eventData.courseLinked}`])
      }
    })
  }

  public handleParseJsonData(s: any) {
    try {
      const parsedString = JSON.parse(s)
      return parsedString
    } catch {
      return []
    }
  }

  handleCapitalize(str: string, type?: string): string {
    let returnValue = ''
    if (str) {
      if (type === 'name') {
        returnValue = str.split(' ').map(_str => {
          return _str.charAt(0).toUpperCase() + _str.slice(1)
        }).join(' ')
      } else {

        returnValue = str && (str.charAt(0).toUpperCase() + str.slice(1))
      }
    }
    return returnValue
  }
}