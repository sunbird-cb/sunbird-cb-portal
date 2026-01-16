import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NsDiscussionV2 } from '@sunbird-cb/discussion-v2';

@Component({
  selector: 'ws-app-community-details-home',
  templateUrl: './community-details-home.component.html',
  styleUrls: ['./community-details-home.component.scss']
})
export class CommunityDetailsHomeComponent {
  communityId: string = ''
  discussionId:string = ''
  feedsWidgetData!: NsDiscussionV2.IDiscussV2WidgetDataV2 | null
  communityWidgetData: any = {}
  constructor(private router: Router,private activatedRoute: ActivatedRoute) {
    
    this.getConfigurationData()
    this.activatedRoute.params.subscribe(params => {
      this.discussionId = params.discussionId || ''
      this.communityId = params.communityId
    })
   }
   getConfigurationData() {
    if(this.activatedRoute.snapshot.data.pageData &&
      this.activatedRoute.snapshot.data.pageData.data
    ) {
      this.feedsWidgetData = this.activatedRoute.snapshot.data.pageData.data.feedsWidgetData
      this.communityWidgetData = this.activatedRoute.snapshot.data.pageData.data.communityWidgetData
    }
   }

   communityChange(communityData: any) {
    this.router.navigate(['/app/discussion-forum-v2/community', communityData.communityId])
   }
}
