
import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationsService } from '@sunbird-cb/utils';
import { HomePageService } from 'src/app/services/home-page.service';
@Component({
  selector: 'ws-discuss-hub',
  templateUrl: './discuss-hub.component.html',
  styleUrls: ['./discuss-hub.component.scss']
})

export class DiscussHubComponent implements OnInit {

  @Input("discussConfig") discussConfig: any;
  userData: any;
  discussion = {
    data: undefined,
    error: false,
    loadSkeleton: false,
  };

  updatesPosts = {
    data: undefined,
    error: false,
    loadSkeleton: false,
  }

  constructor(
    private homePageService: HomePageService,
    private configService: ConfigurationsService
  ) { }

  ngOnInit() {
    this.userData = this.configService && this.configService.userProfile 
    if (this.discussConfig.trendingDiscussions.active) {
      this.fetchTrendingDiscussions();
    }

    if (this.discussConfig.updatePosts.active) {
      this.fetchUpdatesOnPosts();
    }
  }

  fetchTrendingDiscussions(): void {
    this.discussion.loadSkeleton = true;
    this.homePageService.getTrendingDiscussions().subscribe(
      (res: any) => {
        this.discussion.loadSkeleton = false;
        if (res.topics && res.topics.length) {
          this.discussion.data = res.topics.sort((x: any, y: any) => {
            return y.timestamp - x.timestamp;
          });
        }
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.discussion.loadSkeleton = false;
          this.discussion.error = true;
        }
      }
    );
  }

  fetchUpdatesOnPosts(): void {
    this.updatesPosts.loadSkeleton = true;
    this.homePageService.getDiscussionsData(this.userData.userName).subscribe(
      (res: any) => {
        this.updatesPosts.loadSkeleton = false;
        this.updatesPosts.data = res && res.latestPosts && res.latestPosts.sort((x: any, y: any) => {
          return y.timestamp - x.timestamp;
        });
      }
    ), (error: HttpErrorResponse) => {
      if(!error.ok) {
        this.updatesPosts.loadSkeleton = false;
        this.updatesPosts.error = true;
      }
    }
  }

}
