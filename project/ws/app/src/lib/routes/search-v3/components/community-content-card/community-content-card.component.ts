import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ws-app-community-content-card',
  templateUrl: './community-content-card.component.html',
  styleUrls: ['./community-content-card.component.scss'],
})
export class CommunityContentCardComponent {
  @Input() community: any;
  @Input() orgDetails: any;
  @Output() telemetry = new EventEmitter<any>();
  
  defaultThumbnail = '/assets/instances/eagle/app_logos/default.png';
  defaultSLogo = '/assets/instances/eagle/app_logos/igot-katmayogi-logo.svg';

  constructor(private router: Router) {}
  changeToDefaultImg($event: any) {
    $event.target.src = this.defaultSLogo;
  }

  changeToDefaultThumbnailImg($event: any) {
    $event.target.src = this.defaultThumbnail;
  }

  communityCardClick() {
    this.community.identifier = this.community?.communityId
    this.community.contentType = 'Community'
    this.telemetry.emit(this.community)
    this.router.navigate([
      '/app/discussion-forum-v2/community',
      this.community.communityId,
    ]);
  }
}
