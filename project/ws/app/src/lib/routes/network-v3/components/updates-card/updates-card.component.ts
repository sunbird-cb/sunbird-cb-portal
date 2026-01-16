import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'ws-app-updates-card',
  templateUrl: './updates-card.component.html',
  styleUrls: ['./updates-card.component.scss']
})
export class UpdatesCardComponent implements OnInit, OnChanges {

  @Input() profileUpdates: any

  nameInitials: string = ''

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.getInitials()
  }

  getInitials(): void {
    const userName = _.get(this.profileUpdates, 'firstName', '');
    if (userName) {
      if (userName.split(' ').length > 1) {
        const nameArr = userName.split(' ')
        this.nameInitials = nameArr[0].charAt(0) + nameArr[1].charAt(0)
      } else {
        this.nameInitials = userName.charAt(0)
      }
    }
  }

  openProfileLink(): void {
    const profileLink = _.get(this.profileUpdates, 'profileLink', '');
    if (profileLink) {
      window.open(profileLink, '_blank');
    }
  }

}
