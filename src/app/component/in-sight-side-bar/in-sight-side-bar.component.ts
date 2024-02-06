import { AUTO_STYLE, animate, state, transition, trigger, style } from '@angular/animations'
import { Component, OnInit } from '@angular/core'
import { HomePageService } from 'src/app/services/home-page.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { HttpErrorResponse } from '@angular/common/http'
import { ActivatedRoute, Router } from '@angular/router'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'

const DEFAULT_WEEKLY_DURATION = 300
const DEFAULT_DISCUSS_DURATION = 600
const DEFAULT_DURATION = 100

const noData = {
  desc: 'Do you have any questions, suggestions or, ideas in your mind? Post it.',
  linkUrl: 'https://portal.karmayogibm.nic.in/page/learn',
  linkText: 'Start discussion',
  iconImg: '/assets/icons/edit.svg',
}

@Component({
  selector: 'ws-in-sight-side-bar',
  templateUrl: './in-sight-side-bar.component.html',
  styleUrls: ['./in-sight-side-bar.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({  height: '0', visibility: 'hidden'  })),
      // tslint:disable-next-line
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      // tslint:disable-next-line
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out')),
    ]),
    trigger('collapseWeekly', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({  height: '0', visibility: 'hidden'  })),
      // state('true', style({  position: 'absolute', width: '90%',marginRight: '16px', marginLeft:'16px',top: '-118%', zIndex: '9' })),
      // tslint:disable-next-line: prefer-template
      transition('false => true', animate(DEFAULT_WEEKLY_DURATION + 'ms ease-in')),
      // tslint:disable-next-line: prefer-template
      transition('true => false', animate(DEFAULT_WEEKLY_DURATION + 'ms ease-out')),
    ]),

    trigger('collapsDiscuss', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({  height: '0', visibility: 'hidden'  })),
      // tslint:disable-next-line:max-line-length
      // state('true', style({  position: 'absolute', width: '80%', transform: 'scaleY(0.7)',marginRight: '32px', marginLeft:'32px',top: '-300%', zIndex: '6' })),
      // tslint:disable-next-line: prefer-template
      transition('false => true', animate(DEFAULT_DISCUSS_DURATION + 'ms ease-in')),
      // tslint:disable-next-line: prefer-template
      transition('true => false', animate(DEFAULT_DISCUSS_DURATION + 'ms ease-out')),
    ]),
  ],
})

export class InsightSideBarComponent implements OnInit {
  profileDataLoading = true
  homePageData: any
  noDataValue: {} | undefined
  clapsDataLoading = true
  collapsed = false
  userData: any
  insightsData: any
  discussion = {
    loadSkeleton: false,
    data: [],
    error: false,
  }
  pendingRequestData: any = []
  pendingRequestSkeleton = true
  constructor(
    private homePageSvc: HomePageService,
    private configSvc: ConfigurationsService,
    private activatedRoute: ActivatedRoute,
    private discussUtilitySvc: DiscussUtilsService,
    private router: Router) { }

  ngOnInit() {
    this.userData = this.configSvc && this.configSvc.userProfile
    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.homePageData = this.activatedRoute.snapshot.data.pageData.data
    }
    this.getInsights()
    this.getPendingRequestData()
    this.noDataValue = noData
    this.getDiscussionsData()
  }

  getInsights() {
    this.profileDataLoading = true
    const request = {
      request: {
          filters: {
            primaryCategory: 'programs',
              organisations: [
                  'across',
                  this.userData.rootOrgId,
              ],
          },
      },
    }

    this.homePageSvc.getInsightsData(request).subscribe((res: any) => {
      if (res && res.result && res.result.response) {
        this.insightsData = res.result.response
        this.constructNudgeData()
        this.constructWeeklyData()
        this.profileDataLoading = false
      }
      // tslint:disable-next-line: align
    }, (_error: any) => {
      // tslint:disable-next-line: align
      this.insightsData = ''
      this.profileDataLoading = false
      this.clapsDataLoading = false
    })
  }

  constructNudgeData() {
    const nudgeData: any = {
      type: 'data',
      iconsDisplay: false,
      cardClass: 'slider-container',
      height: 'auto',
      width: '',
      sliderData: [],
      negativeDisplay: false,
      'dot-default': 'dot-grey',
      'dot-active': 'dot-active',
    }
    const sliderData: { title: any; icon: string; data: string; colorData: string; }[] = []
    this.insightsData.nudges.forEach((ele: any) => {
      if (ele) {
        const data = {
          title: ele.label,
          icon: ele.growth === 'positive' ?  'arrow_upward' : 'arrow_downward',
          // tslint:disable-next-line: prefer-template
          data: `${ele.growth === 'positive' && ele.progress > 1 ?  '+' + Math.round(ele.progress) + '%' : ''}`,
          colorData: ele.growth === 'positive' ? 'color-green' : 'color-red',
        }
        sliderData.push(data)
      }
    })
    nudgeData.sliderData = sliderData
    this.insightsData['sliderData'] = nudgeData
    this.profileDataLoading = false
  }

  constructWeeklyData() {
    if (this.insightsData && this.insightsData['weekly-claps']) {
      this.insightsData['weeklyClaps'] = this.insightsData['weekly-claps']
    }
    this.clapsDataLoading = false
  }

  getDiscussionsData(): void {
    this.discussion.loadSkeleton = true
    this.homePageSvc.getDiscussionsData(this.userData.userName).subscribe(
      (res: any) => {
        this.discussion.loadSkeleton = false
        this.discussion.data = res && res.latestPosts
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.discussion.loadSkeleton = false
          this.discussion.error = true
        }
      }
    )
  }

  getPendingRequestData() {
    this.homePageSvc.getRecentRequests().subscribe(
      (res: any) => {
        this.pendingRequestSkeleton = false
        this.pendingRequestData = res.result.data && res.result.data.map((elem: any) => {
          elem.fullName = elem.fullName.charAt(0).toUpperCase() + elem.fullName.slice(1)
          return elem
        })
        // tslint:disable-next-line: align
      }, (error: HttpErrorResponse) => {
        // tslint:disable-next-line: align
        if (!error.ok) {
          // tslint:disable-next-line: align
          this.pendingRequestSkeleton = false
        }
      }
    )
  }

  navigateTo() {
    this.router.navigateByUrl('app/network-v2/connection-requests')
  }

  moveToUserProile(id: string) {
    // tslint:disable-next-line: prefer-template
    this.router.navigateByUrl('app/person-profile/' + id + '#profileInfo')
  }

  expandCollapse(event: any) {
    this.collapsed = event
    // tslint:disable-next-line: whitespace
  }
  // tslint:disable-next-line: whitespace  
  goToActivity(_e: any) {
    this.router.navigateByUrl(`app/person-profile/me?tab=1`)
  }

  navigate() {
    const config = {
      menuOptions: [
        {
          route: 'all-discussions',
          label: 'All discussions',
          enable: true,
        },
        {
          route: 'categories',
          label: 'Categories',
          enable: true,
        },
        {
          route: 'tags',
          label: 'Tags',
          enable: true,
        },
        {
          route: 'my-discussion',
          label: 'Your discussion',
          enable: true,
        },
        // {
        //   route: 'leaderboard',
        //   label: 'Leader Board',
        //   enable: true,
        // },

      ],
      userName: (this.configSvc.nodebbUserProfile && this.configSvc.nodebbUserProfile.username) || '',
      context: {
        id: 1,
      },
      categories: { result: [] },
      routerSlug: '/app',
      headerOptions: false,
      bannerOption: true,
    }
    this.discussUtilitySvc.setDiscussionConfig(config)
    localStorage.setItem('home', JSON.stringify(config))
    this.router.navigate(['/app/discussion-forum'], { queryParams: { page: 'home' }, queryParamsHandling: 'merge' })
  }
}
