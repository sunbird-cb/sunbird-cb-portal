import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { NetworkingService } from '../../services/networking.service';
import { connectionUpdates } from '../../models/network-v3.model';

@Component({
  selector: 'ws-app-network-home',
  templateUrl: './network-home.component.html',
  styleUrls: ['./network-home.component.scss']
})
export class NetworkHomeComponent implements OnInit{
  //#region (global variables)
  connectionRequestsList: any[] = [];
  connectionsLoading: boolean = false;
  connectionRequestsCount: number = 0;
  peopleYouMayKnowList: any[] = []
  peopleYouMayKnowCount: number = 0;
  suggestionsLoading: boolean = false;
  mentorSuggestionsList: any[] = []
  mentorsLoading: boolean = false;
  sliderConfig = {
    showNavs: true,
    showDots: true,
    cerificateCardMargin: false,
    showNavsSpacing: true,
    dotsAlign: true,
    responsive: {
      dotsAlign: true,
      showDots: true,
    }
  }

  //#endregion (global variables)

  constructor(
    private router: Router,
    private snackBar: MatLegacySnackBar,
    private networkingService: NetworkingService
    // private activatedRoute: ActivatedRoute
  ) { }

  //#region (initialization)

  ngOnInit() {
    this.initialization();
  }

  initialization() {
    this.getConnectionRequests();
    this.getPeopleYouMayKnow();
    this.getMentorSuggestions();
  }

  getConnectionRequests() {
    const pageNo = 0;
    const pageSize = 3; 
    this.connectionsLoading = true;
    this.networkingService.getConnectionRequests(pageNo, pageSize).subscribe({
      next: (response) => {
        this.connectionsLoading = false;
        this.connectionRequestsList = _.get(response, 'data', []);
        this.connectionRequestsCount = _.get(response, 'count', 0);
        const connectionsUpdate: connectionUpdates = {
          routeId: 'connections',
          showUpdate: this.connectionRequestsList.length > 0 ? true : false
        }
        this.networkingService.sendConnectionUpdates(connectionsUpdate);
      },
      error: (error: HttpErrorResponse) => {
        this.connectionsLoading = false;
        if(error) {
          this.openSnackbar(this.handleTranslateTo('NetworkLandingPage.failedToFetchConnectionRequests'), 3000);
        }
      }
    });
  }

  getPeopleYouMayKnow() {
    const formBody = {
      size: 6,
      offset: 0,
    }

    this.suggestionsLoading = true;
    this.networkingService.getRecommendedUsers(formBody).subscribe({
      next: (response) => {
        this.suggestionsLoading = false;
        this.peopleYouMayKnowList = _.get(response, 'result.response', []);
        this.peopleYouMayKnowCount = _.get(response, 'result.count', 0);
      },
      error: (error: HttpErrorResponse) => {
        this.suggestionsLoading = false;
        if(error) {
          this.openSnackbar(this.handleTranslateTo('NetworkLandingPage.failedToFetchPeopleYouMayKnow'), 3000);
        }
      }
    });
  }

  getMentorSuggestions() {
    const formBody = {
      size: 15,
      offset: 0,
    }
    this.mentorsLoading = true;
    this.networkingService.getRecommendedMentors(formBody).subscribe({
      next: (response) => {
        this.mentorsLoading = false;
        this.mentorSuggestionsList = _.get(response, 'result.response', []);
      },
      error: (error: HttpErrorResponse) => {
        this.mentorsLoading = false;
        if (error) {
          this.openSnackbar(this.handleTranslateTo('NetworkLandingPage.failedToFetchMentorSuggestions'), 3000); 
        }
      }
    });
  }
  //#endregion (initialization)

  showAll(type: string) {
    if (type) {
      switch (type) {
        case 'connectionRequests':
          this.router.navigate(['/app/network-v2/connections'], {queryParams: {tab: 'Received'}})
          break
        case 'peopleYouMayKnow':
          const queryParams = {
            type
          }
          this.router.navigate(['/app/network-v2/recommendations/all'], { queryParams })
          break
        case 'showAllMentors':
          this.router.navigate(['/app/network-v2/mentors'])
          break
      }
    }
  }

  get showEmptyData(): boolean {
    return (
      this.connectionRequestsList.length === 0 &&
      this.connectionsLoading === false &&
      this.peopleYouMayKnowList.length === 0 &&
      this.suggestionsLoading === false &&
      this.mentorSuggestionsList.length === 0 &&
      this.mentorsLoading === false
    )
  }

  handleTranslateTo(menuName: string): string {
    return this.networkingService.handleTranslateTo(menuName)
  }

  openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

}
