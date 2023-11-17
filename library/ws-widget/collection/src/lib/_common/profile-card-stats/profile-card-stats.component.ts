import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationsService } from '@sunbird-cb/utils'
import { PipeDurationTransformPipe } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-widget-profile-card-stats',
  templateUrl: './profile-card-stats.component.html',
  styleUrls: ['./profile-card-stats.component.scss'],
  providers: [ PipeDurationTransformPipe ]
})
export class ProfileCardStatsComponent implements OnInit {
  @Input() isLoading = false
  @Input() insightsData : any
  @Input() nudgeData: any

  @Output() expandCollapse = new EventEmitter<any>()
  profileProgress : any = 50;
  collapsed = false;
  userInfo: any
  countdata: any
  statsData: any
  constructor(private configSvc:ConfigurationsService,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private pipDuration: PipeDurationTransformPipe) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.data.pageData) {
      this.statsData = this.activatedRoute.snapshot.data.pageData.data && this.activatedRoute.snapshot.data.pageData.data.profileStats || []
    }
    this.userInfo =  this.configSvc && this.configSvc.userProfile
    this.getCounts();
    document.documentElement.style.setProperty('--i', this.profileProgress);
  }
  getCounts() {
    let enrollList
    if (localStorage.getItem('enrollmentData')) {
      enrollList = JSON.parse(localStorage.getItem('enrollmentData')|| '')
    }
    this.countdata = {
      certificate: 0,
      inProgress: 0,
      learningHours: 0
    }
    if(enrollList && enrollList.userCourseEnrolmentInfo){
      this.countdata = {
        certificate: enrollList.userCourseEnrolmentInfo.certificatesIssued,
        inProgress: enrollList.userCourseEnrolmentInfo.coursesInProgress,
        learningHours: this.pipDuration.transform(enrollList.userCourseEnrolmentInfo.timeSpentOnCompletedCourses,'hms')
      }
    }
  }
  gotoUserProfile(){
    this.router.navigate(['app/user-profile/details'])
  }
  toggle() {
    this.collapsed = !this.collapsed;
    this.expandCollapse.emit(this.collapsed)
  }
}
