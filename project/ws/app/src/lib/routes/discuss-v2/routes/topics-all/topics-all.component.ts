import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ws-app-topics-all',
  templateUrl: './topics-all.component.html',
  styleUrls: ['./topics-all.component.scss']
})
export class TopicsAllComponent {

  constructor(private router: Router){
    
  }



  topicCardrClick(topicData: any){
    this.router.navigate([`/app/discussion-forum-v2/communities/${topicData.value}`])
  }

  communityCardrClick(communityData: any) {
    
    this.router.navigate(['/app/discussion-forum-v2/community', communityData.communityId])
  }

  goBackMethod(_event: any) {
    this.router.navigate(['/app/discussion-forum-v2'])
  }
}
