import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'ws-app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit, OnChanges {
  //#region (global variables)
  @Input() userDetails: any;
  @Input() profileDetailsLoading: boolean = false;
  bannerImageUrl = '';
  profileImageUrl = '';
  userName = 'Astha Sharma'
  userId= ''
  nameInitials: string = '';
  //#endregion (global variables)

  constructor(
    private router: Router,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('websiteLanguage')) {
      this.translateService.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translateService.use(lang)
    }
    this.getInitials()
  }

  ngOnChanges(): void {
    const userDetails = _.get(this.userDetails, 'profileDetails', this.userDetails);
    this.userName = _.get(userDetails, 'firstName', _.get(userDetails, 'personalDetails.firstname', ''));
    this.userId = _.get(this.userDetails, 'id', _.get(this.userDetails, 'userId', ''));
    this.bannerImageUrl = _.get(userDetails, 'profileBannerUrl', '');
    this.profileImageUrl = _.get(userDetails, 'profileImageUrl', _.get(userDetails, 'profileImage', ''));
    this.getInitials()
  }

  getInitials(): void {
    const userName = this.userName;
    if (userName) {
      if (userName.split(' ').length > 1) {
        const nameArr = userName.split(' ')
        this.nameInitials = nameArr[0].charAt(0) + nameArr[1].charAt(0)
      } else {
        this.nameInitials = userName.charAt(0)
      }
    }
  }

  viewProfile() { 
    this.router.navigate(['/app/person-profile/me'], { fragment: 'profileInfo' })
  }

}
