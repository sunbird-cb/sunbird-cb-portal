import { AUTO_STYLE, animate, state, transition, trigger,style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { HomePageService } from 'src/app/services/home-page.service';
import { ConfigurationsService } from '@sunbird-cb/utils'

const DEFAULT_DURATION = 500;

const noData = {
  "desc" : "Do you have any questions, suggestions or, ideas in your mind? Post it.",
  "linkUrl" : "https://portal.karmayogibm.nic.in/page/learn",
  "linkText" : "Start discussion",
  "iconImg" : "/assets/icons/edit.svg",
}

@Component({
  selector: 'ws-in-sight-side-bar',
  templateUrl: './in-sight-side-bar.component.html',
  styleUrls: ['./in-sight-side-bar.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class InsightSideBarComponent implements OnInit {
  profileDataLoading: boolean = true
  enableDiscussion: boolean = false
  loadSkeleton: boolean = false
  noDataValue : {} | undefined
  clapsDataLoading: boolean = true
  collapsed = false
  userData: any
  insightsData: any
  constructor(private homePageSvc:HomePageService, private configSvc:ConfigurationsService) { }

  ngOnInit() {
    this.userData = this.configSvc && this.configSvc.userProfile
    this.getInsights()
    this.noDataValue = noData
    this.getDiscussionsData();
  }

  getInsights() {
    this.profileDataLoading = true
    // const organisation = this.userData.
    const request = {
      "request": {
          "filters": {
              "primaryCategory": "programs",
              "organisations": [
                  "across",
                  this.userData.rootOrgId
              ]
          }
      }
    }

    this.homePageSvc.getInsightsData(request).subscribe((res: any) => {
      if(res && res.result && res.result.response) {
        this.insightsData = res.result.response
        this.constructNudgeData()
        this.constructWeeklyData()
        this.profileDataLoading = false
      }
    }, (error: any) => {
      // tslint:disable:no-console
      console.log(error)
      this.insightsData = []
      this.profileDataLoading = false
      this.clapsDataLoading = false
    })
  }

  constructNudgeData() {
    let nudgeData: any = {
      type:'data',
      iconsDisplay: false,
      cardClass:'slider-container',
      height:'auto',
      width:'',
      sliderData: [],
      "dot-default":"dot-grey",
      "dot-active":"dot-active"
    }
    let sliderData: { title: any; icon: string; data: string; colorData: string; }[] = []
    this.insightsData.nudges.forEach((ele: any)=>{
      if(ele) {
        let data = {
          "title": ele.label,
          "icon": ele.growth === 'positive' ?  "arrow_upward" :"arrow_downward",
          "data": `${ele.growth === 'positive' ?  "+" : "-"}${Math.round(ele.progress)}%`,
          "colorData": ele.growth === 'positive' ? 'color-green' : 'color-red',
        }
        sliderData.push(data)
      }
    })
    nudgeData.sliderData = sliderData
    this.insightsData['sliderData']= nudgeData
    this.profileDataLoading = false
  }

  constructWeeklyData() {
    if(this.insightsData && this.insightsData['weekly-claps']) {
      let weeklyCount = 0
      this.insightsData['weekly-claps'].forEach((ele: any) => {
        if(ele.achieved === 1) {
          weeklyCount = weeklyCount + 1
        }
      })
      this.insightsData['weeklyClaps'] = {
        weeklyCount: weeklyCount,
        weekData: this.insightsData['weekly-claps']
      }
    }

    this.clapsDataLoading = false
  }

  handleButtonClick(): void {
    this.loadSkeleton = true;
    setTimeout(() => {
      this.loadSkeleton = false
      this.enableDiscussion = true
    }, 1500)  
  }

  getDiscussionsData(): void {
    this.loadSkeleton = true;
    this.homePageSvc.getDiscussionsData().subscribe((res: any) => {
      this.loadSkeleton = false;
      this.enableDiscussion = true;
      console.log("discussion res - ", res);
    });
  }

  expandCollapse(event:any) {
    this.collapsed = event
  }
}
