import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationsService } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-widget-profile-card-stats',
  templateUrl: './profile-card-stats.component.html',
  styleUrls: ['./profile-card-stats.component.scss']
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
  constructor(private configSvc:ConfigurationsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.data.pageData) {
      this.statsData = this.activatedRoute.snapshot.data.pageData.data && this.activatedRoute.snapshot.data.pageData.data.profileStats || []
      // console.log(this.activatedRoute.snapshot.data.pageData.data,'lllllllllllll')
    }
    this.userInfo =  this.configSvc && this.configSvc.userProfile
    this.getCounts();
    document.documentElement.style.setProperty('--i', this.profileProgress);
  }
  getCounts() {
    let enrollList
    if (localStorage.getItem('enrollList')) {
      enrollList = JSON.parse(localStorage.getItem('enrollList')|| '')
    }
    this.countdata = {
      certificate: 0,
      inProgress: 0,
      learningHours: 0
    }
    if(enrollList){
      enrollList.forEach((ele:any)=> {
        if(ele.issuedCertificates.length > 0){
          this.countdata.certificate = this.countdata.certificate + 1
        }
        if(ele.completionPercentage < 100){
          this.countdata.inProgress = this.countdata.inProgress + 1
        }
      })
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
