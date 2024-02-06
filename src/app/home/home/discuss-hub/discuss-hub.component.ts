
import { Component, OnInit, Input } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { HomePageService } from 'src/app/services/home-page.service'
import { DiscussUtilsService } from '@ws/app/src/lib/routes/discuss/services/discuss-utils.service'
import { Router } from '@angular/router'
@Component({
  selector: 'ws-discuss-hub',
  templateUrl: './discuss-hub.component.html',
  styleUrls: ['./discuss-hub.component.scss'],
})

export class DiscussHubComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('discussConfig') discussConfig: any
  userData: any
  discussion = {
    data: undefined,
    error: false,
    loadSkeleton: false,
  }

  updatesPosts = {
    data: undefined,
    error: false,
    loadSkeleton: false,
  }

  constructor(
    private homePageService: HomePageService,
    private configService: ConfigurationsService,
    private discussUtilitySvc: DiscussUtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    // tslint:disable-next-line: whitespace
    this.userData = this.configService && this.configService.userProfile
    if (this.discussConfig.trendingDiscussions.active) { this.fetchTrendingDiscussions() }
    if (this.discussConfig.updatePosts.active) { this.fetchUpdatesOnPosts() }
  }

  fetchTrendingDiscussions(): void {
    this.discussion.loadSkeleton = true
    this.homePageService.getTrendingDiscussions().subscribe(
      (res: any) => {
        this.discussion.loadSkeleton = false
        if (res.topics && res.topics.length) {
          this.discussion.data = res.topics.sort((x: any, y: any) => {
            return y.timestamp - x.timestamp
          })
        }
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.discussion.loadSkeleton = false
          this.discussion.error = true
        }
      }
    )
  }

  fetchUpdatesOnPosts(): void {
    this.updatesPosts.loadSkeleton = true
    this.homePageService.getDiscussionsData(this.userData.userName).subscribe(
      (res: any) => {
        this.updatesPosts.loadSkeleton = false
        this.updatesPosts.data = res && res.latestPosts && res.latestPosts.sort((x: any, y: any) => {
          return y.timestamp - x.timestamp
        })
        this.updatesPosts.data = res && res.latestPosts && res.latestPosts.filter((x: any) => {
          if (x.upvotes > 0 || x.downvotes > 0) {
            return x
          }
        })
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.updatesPosts.loadSkeleton = false
          this.updatesPosts.error = true
        }
    })
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
      userName: (this.configService.nodebbUserProfile && this.configService.nodebbUserProfile.username) || '',
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
