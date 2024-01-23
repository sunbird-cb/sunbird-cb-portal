import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
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
  republicDayData: any
  interval = 0
  constructor(private configSvc: ConfigurationsService,
              private router: Router,
              private pipDuration: PipeDurationTransformPipe) { }

  ngOnInit() {
    this.userInfo =  this.configSvc && this.configSvc.userProfile
    this.enrollInterval = setInterval(() => {
      this.getCounts()
    },                                1000)
    // this.getCounts()
    const progress = (247 - ((247 * this.userInfo.profileUpdateCompletion) / 100))
    document.documentElement.style.setProperty('--i', String(progress))
    const rand = Math.round(Math.random() * 5)
    this.configSvc.republicDay2024.filter((data: any) => {
      if (data.id === rand) {
        this.republicDayData = data
        this.showrepublicBanner = true
        setTimeout(() => {
          this.showrepublicBanner = false
        },         15000)
      }
     })
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
}
