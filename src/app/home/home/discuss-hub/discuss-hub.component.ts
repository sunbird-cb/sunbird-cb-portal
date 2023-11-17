import { Component, OnInit } from '@angular/core';
import { HomePageService } from 'src/app/services/home-page.service';

@Component({
  selector: 'ws-discuss-hub',
  templateUrl: './discuss-hub.component.html',
  styleUrls: ['./discuss-hub.component.scss']
})

export class DiscussHubComponent implements OnInit {

  discussion = {
    enableDiscussion: false,
    discussionData: undefined,
    loadSkeleton: false,
    error: false
  };

  constructor(
    private homePageService: HomePageService,
  ) { }

  ngOnInit() {
    this.fetchDiscussions();
  }

  fetchDiscussions(): void {
    this.discussion.loadSkeleton = true;
    this.homePageService.getDiscussionsData().subscribe(
      (res: any) => {
        this.discussion.loadSkeleton = false;
        this.discussion.enableDiscussion = true;
        console.log("discussion res - ", res);
      },
      (error: HttpErrorResponse) => {
        if (!error.ok) {
          this.discussion.loadSkeleton = false;
          this.discussion.error = true;
        }
      }
    );
  }

}
