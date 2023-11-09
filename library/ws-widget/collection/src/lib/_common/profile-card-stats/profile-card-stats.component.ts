import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'

@Component({
  selector: 'ws-widget-profile-card-stats',
  templateUrl: './profile-card-stats.component.html',
  styleUrls: ['./profile-card-stats.component.scss']
})
export class ProfileCardStatsComponent implements OnInit {
  @Input() isLoading = false
  userInfo: any
  countdata: any
  statsData: any
  sliderData = {
    type:'data',
    iconsDisplay: false,
    cardClass:'slider-container',
    height:'auto',
    width:'',
    "dot-default":"dot-grey",
    "dot-active":"dot-active",
    sliderData: [
      {
        "banners": {
          "l": "assets/instances/eagle/banners/home/1/l.jpg",
          "m": "assets/instances/eagle/banners/home/1/m.jpg",
          "s": "assets/instances/eagle/banners/home/1/s.jpg",
          "xl": "assets/instances/eagle/banners/home/1/xl.jpg",
          "xs": "assets/instances/eagle/banners/home/1/xs.jpg",
          "xxl": "assets/instances/eagle/banners/home/1/xxl.jpg"
        },
        "redirectUrl": "/app/globalsearch",
        "queryParams": {
          "tab": "Learn",
          "q": "Salesforce",
          "lang": "en",
          "f": "{}"
        },
        "title": "100 Certificates acquired by leaners in the last 24 hours",
        "icon":"arrow_downward",
        "data":'-6.89%',
        "colorData":'color-red',
      },
      {
        "banners": {
          "l": "assets/instances/eagle/banners/orgs/l.png",
          "m": "assets/instances/eagle/banners/orgs/m.png",
          "s": "assets/instances/eagle/banners/orgs/s.png",
          "xl": "assets/instances/eagle/banners/orgs/xl.png",
          "xs": "assets/instances/eagle/banners/orgs/xs.png",
          "xxl": "assets/instances/eagle/banners/orgs/xxl.png"
        },
        "redirectUrl": "/app/organisation/dopt",
        "queryParams": {
          "tab": "Learn",
          "q": "Salesforce",
          "lang": "en",
          "f": "{}"
        },
        "title": "100 Certificates acquired by leaners in the last 24 hours",
        "icon":"arrow_upward",
        "data":'+6.09%',
        "colorData":'color-green'
      }
    ]
  }
  constructor(private configSvc:ConfigurationsService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if(this.activatedRoute.snapshot.data.pageData) {
      this.statsData = this.activatedRoute.snapshot.data.pageData.data && this.activatedRoute.snapshot.data.pageData.data.profileStats || []
      // console.log(this.activatedRoute.snapshot.data.pageData.data,'lllllllllllll')
    }
    this.userInfo =  this.configSvc && this.configSvc.userProfile
    this.getCounts();
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
}
