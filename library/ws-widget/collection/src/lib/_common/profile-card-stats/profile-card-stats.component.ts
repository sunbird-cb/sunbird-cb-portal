import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils'
import { PipeDurationTransformPipe } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-widget-profile-card-stats',
  templateUrl: './profile-card-stats.component.html',
  styleUrls: ['./profile-card-stats.component.scss'],
  providers: [PipeDurationTransformPipe],
})
export class ProfileCardStatsComponent implements OnInit {
  @Input() isLoading = false
  @Input() displayStats = false
  @Input() insightsData: any
  @Input() nudgeData: any
  @Input() profileData: any
  @Input() isMobile: any = false

  @Output() expandCollapse = new EventEmitter<any>()
  @Output() activity = new EventEmitter<any>()
  collapsed = false
  userInfo: any
  countdata: any
  enrollInterval: any
  showrepublicBanner: any = false
  republicDayData: any = {}
  interval = 0
  profileDelay = 0
  userName = ''
  constructor(private configSvc: ConfigurationsService,
              private router: Router,
              private pipDuration: PipeDurationTransformPipe,
              private langtranslations: MultilingualTranslationsService) { }

  ngOnInit() {
    this.userInfo =  this.configSvc && this.configSvc.userProfile
    if (this.userInfo) {
      this.userName = this.userInfo.firstName
      if (this.userName.length > 18) {
        this.userName = `${this.userInfo.firstName.slice(0, 18)}...`
      }
    }
    this.enrollInterval = setInterval(() => {
      this.getCounts()
    },                                1000)
    // this.getCounts()
    const progress = (247 - ((247 * this.userInfo.profileUpdateCompletion) / 100))
    document.documentElement.style.setProperty('--i', String(progress))
    if (this.configSvc.profileTimelyNudges.enable) {
      this.profileDelay = this.configSvc.profileTimelyNudges.profileDelayInSec
    }
    this.showrepublicBanner = false
    this.getTimelyNudge()
    const pDelayTime = this.profileDelay * 1000
    setTimeout(() => {
      // this.getTimelyNudge()
      this.showrepublicBanner = true
    },         pDelayTime)
    const timeInterval = this.configSvc.profileTimelyNudges.nudgeDelayInSec
    setTimeout(() => {
        this.showrepublicBanner = false
      },       ((1000 * timeInterval) + pDelayTime))
  }

  getTimelyNudge() {
    if (this.configSvc.profileTimelyNudges.enable) {
      const rand = Math.round(Math.random() * 4)
      const currentDate = new Date()
      // const timeInterval = this.configSvc.profileTimelyNudges.nudgeDelayInSec
      const hours = currentDate.getHours()
      const defaultData = this.configSvc.profileTimelyNudges.data[this.configSvc.profileTimelyNudges.data.length - 1]
      if (defaultData) {
        this.republicDayData['backgroupImage'] = defaultData.backgroupImage
        this.republicDayData['info'] = defaultData['info'][rand]
        this.republicDayData['centerImage'] = defaultData['centerImage'][rand]
        this.republicDayData['textColor'] = defaultData['textColor']
        this.republicDayData['greet'] = defaultData['greet']
        // let userName = this.userInfo.firstName
        // if (userName.length > 18) {
        //   userName = `${this.userInfo.firstName.slice(0, 18)}...`
        // }
        // this.republicDayData['greet'] = defaultData['greet'].replace('<userName>', userName)
        // this.showrepublicBanner = true
        // setTimeout(() => {
        //   this.showrepublicBanner = false
        // },         (1000 * timeInterval))
      }
      this.configSvc.profileTimelyNudges.data.filter((data: any) => {
        if (hours >= data.startTime && hours < data.endTime) {
          this.republicDayData['backgroupImage'] = data.backgroupImage
          this.republicDayData['info'] = data['info'][rand]
          this.republicDayData['centerImage'] = data['centerImage'][rand]
          this.republicDayData['greet'] = data['greet']
          this.republicDayData['textColor'] = data['textColor']
          // let userName = this.userInfo.firstName
          // if (userName.length > 18) {
          //   userName = `${this.userInfo.firstName.slice(0, 18)}...`
          // }
          // this.republicDayData['greet'] = data['greet'].replace('<userName>', userName)
          // this.showrepublicBanner = true
        }
        // setTimeout(() => {
        //   this.showrepublicBanner = false
        // },         (1000 * timeInterval))
      })
    }
  }

  getCounts() {
    let enrollList: any
    if (localStorage.getItem('enrollmentData')) {
      enrollList = JSON.parse(localStorage.getItem('enrollmentData') || '')
      clearInterval(this.enrollInterval)
    }

    this.countdata = {
      certificate: 0,
      inProgress: 0,
      learningHours: 0,
    }
    if (enrollList && enrollList.userCourseEnrolmentInfo) {
      this.countdata = {
        certificate: enrollList.userCourseEnrolmentInfo.certificatesIssued,
        inProgress: enrollList.userCourseEnrolmentInfo.coursesInProgress,
        learningHours: this.pipDuration.transform(enrollList.userCourseEnrolmentInfo.timeSpentOnCompletedCourses, 'hms'),
      }
    }

  }
  gotoUserProfile() {
    this.router.navigate(['app/user-profile/details'])
  }
  toggle() {
    this.collapsed = !this.collapsed
    this.expandCollapse.emit(this.collapsed)
  }
  myActivity() {
    this.activity.emit(true)
  }
  translateLabels(label: string, type: any) {
    return this.langtranslations.translateActualLabel(label, type, '')
  }
}
