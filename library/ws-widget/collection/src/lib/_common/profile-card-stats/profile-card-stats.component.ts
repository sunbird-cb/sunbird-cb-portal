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
  republicDayData: any = {}
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
    let rand = Math.round(Math.random() * 4)    
    if(this.configSvc.republicDay2024.enable) {
      let cdate = new Date();
      let hours =  cdate.getHours(), minute = cdate.getMinutes();
      let currentDate:any = new Date().toJSON().slice(0, 10);
      this.configSvc.republicDay2024.data.filter((data: any )=> {          
          let currentTimeTemp:any = (hours > 12) ? (hours-12 + ':' + minute +' PM') : (hours + ':' + minute +' AM');   
          let currentTime:any = currentDate+" "+currentTimeTemp;       
          let startTime:any = currentDate+" "+data.startTime;          
          let endTime:any = currentDate+" "+data.endTime;
          if(data.addDay) {
            endTime = new Date(endTime);            
            endTime = endTime.setDate(endTime.getDate() + 1);
          } else {
            endTime = new Date(Date.parse(endTime))
          }
          startTime = new Date(Date.parse(startTime))         
          currentTime = new Date(Date.parse(currentTime))
          if (currentTime > startTime && currentTime < endTime ){
            this.republicDayData['backgroupImage']  = data.backgroupImage;
            this.republicDayData['info']  = data['info'][rand];
            this.republicDayData['centerImage']  = data['centerImage'][rand];
            this.showrepublicBanner = true
          }       
          setTimeout(() => {
            this.showrepublicBanner = false
          }, 180000);
        
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
}
