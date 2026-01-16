import { Component, OnInit } from '@angular/core';
import { connectionUpdates, routesData } from '../../models/network-v3.model';
import * as _ from 'lodash';
import { NetworkingService } from '../../services/networking.service';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { ConfigurationsService, MultilingualTranslationsService } from '@sunbird-cb/utils-v2';
import { TranslateService } from '@ngx-translate/core';
import { MobileAppsService } from 'src/app/services/mobile-apps.service';
import { Router } from '@angular/router';


@Component({
  selector: 'ws-app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})
export class NetworkComponent implements OnInit {

  //#region (global variables)
  communitySuggestionsList: any[] = [];
  communitiesLoading = false;
  navigationItems: routesData[] = [
    {
      name: 'NetworkLandingPage.exploreNetwork',
      navigationUrl: '/app/network-v2/home',
      routeId: 'home',
      imageUrl: './assets/icons/person_search.svg'
    },
    // {
    //   name: 'Updates',
    //   navigationUrl: '/app/network-v2/updates',
    //   routeId: 'updates',
    //   imageUrl: './assets/icons/update.svg'
    // },
    {
      name: 'NetworkLandingPage.connections',
      navigationUrl: '/app/network-v2/connections',
      routeId: 'connections',
      imageUrl: './assets/icons/group.svg'
    },
    // {
    //   name: 'Recommendations',
    //   navigationUrl: '/app/network-v2/recommendations',
    //   routeId: 'recommendations',
    //   icon: 'groups',
    //   queryParams: { pageSize: 20 }
    //   // imageUrl: './assets/icons/.svg'
    // },
    {

      name: 'NetworkLandingPage.recommendations',
      navigationUrl: '/app/network-v2/recommendations/all',
      routeId: 'recommendations',
      imageUrl: './assets/icons/connection.svg',
      queryParams: { type: 'peopleYouMayKnow' }
    },
    {
      name: 'NetworkLandingPage.mentors',
      navigationUrl: 'mentors',
      routeId: 'mentors',
      imageUrl: './assets/icons/book_read.svg'
    }
  ]
  userDetails: any = {};
  profileDetailsLoading = false;
  //#endregion (global variables)

  constructor(
    private networkingSvc: NetworkingService,
    private snackBar: MatLegacySnackBar,
    private configSvc: ConfigurationsService,
    private translateService: TranslateService,
    private mobileAppsSvc: MobileAppsService,
    private router: Router,
    private langtranslations: MultilingualTranslationsService,
  ) { 
    this.mobileAppsSvc.mobileTopHeaderVisibilityStatus.next(false)
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      this.translateService.setDefaultLang('hi')
      if (localStorage.getItem('websiteLanguage')) {
        this.translateService.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translateService.use(lang)
      }
    })
  }


  //#region (initialization)
  ngOnInit() {
    if (localStorage.getItem('websiteLanguage')) {
      this.translateService.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translateService.use(lang)
    }
    this.initialization();
  }
  
  initialization() {
    this.subscribeToUpdates();
    this.getCommunitesList();
    this.getProfileDetails();
  }

  getCommunitesList() {
    const formBody = {
      field: "countOfPeopleJoined",
      limit: 3
    }
    this.communitiesLoading = true;
    this.networkingSvc.getCommunities(formBody).subscribe({
      next: (responce: any) => {
        this.communitiesLoading = false;
        this.communitySuggestionsList = _.get(responce, 'result.data')
      },
      error: () => {
        this.communitiesLoading = false;
        this.openSnackBar(this.handleTranslateTo('errorFetchingCommunities'))
      }
    })
  }

  getProfileDetails() {
    const userId = _.get(this.configSvc, 'userProfile.userId')
    if(_.get(this.configSvc, 'userProfileV2.profileBannerUrl') || _.get(this.configSvc, 'userProfileV2.profileBannerUrl') === '') {
      this.userDetails = this.configSvc.userProfileV2
    } else {
      this.profileDetailsLoading = true;
      this.networkingSvc.fetchProfile(userId).subscribe({
        next: (responce: any) => {
          this.profileDetailsLoading = false;
          this.userDetails = _.get(responce, 'result.response')
        },
        error: () => {
          this.profileDetailsLoading = false;
          this.openSnackBar(this.handleTranslateTo('errorFetchingProfileDetails'))
        }
      })
    }
  }

  subscribeToUpdates() { 
    this.networkingSvc.connectionsUpdates$.subscribe((update: connectionUpdates | null) => {
      if(update && this.navigationItems) {
        this.navigationItems.forEach(item => {
          if(item.routeId === update.routeId) {
            item['showUpdate'] = update.showUpdate
          }
        })
      }
    })
  }

  navigateHome() {
    this.router.navigate(['/page/home']);
  }

  handleTranslateTo(menuName: string): string {
    return this.networkingSvc.handleTranslateTo(menuName)
  }

  openSnackBar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }
    
  //#endregion (initialization)


}
