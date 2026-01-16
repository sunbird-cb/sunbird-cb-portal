import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ws-app-community-search',
  templateUrl: './community-search.component.html',
  styleUrls: ['./community-search.component.scss']
})
export class CommunitySearchComponent {


  constructor(private router: Router) { }

  searchTextMethod(searchTxt: any) {
    this.router.navigate(['/app/discussion-forum-v2/search'], {
      queryParams: { c: searchTxt.trim() },
      queryParamsHandling: 'merge',
    })
  }
  cardClick(cardData: any) {
    this.router.navigate(['/app/discussion-forum-v2/community', cardData.communityId])
  }
  goBackMethod(_event: any) {
    this.router.navigate(['/app/discussion-forum-v2'])
  }
}
