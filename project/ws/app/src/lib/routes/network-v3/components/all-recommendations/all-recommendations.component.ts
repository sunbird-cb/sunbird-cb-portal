import { Component, OnInit } from '@angular/core';
import { PageChangeEmitter } from '../../models/network-v3.model';
import * as _ from 'lodash';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { NetworkingService } from '../../services/networking.service';

@Component({
  selector: 'ws-app-all-recommendations',
  templateUrl: './all-recommendations.component.html',
  styleUrls: ['./all-recommendations.component.scss']
})
export class AllRecommendationsComponent implements OnInit {

  // recommendationType = 'peopleNearYou'
  title = 'NetworkLandingPage.peopleYouMayKnow'
  recommendationList: any[] = []
  paginationSize = 12;
  paginationSizeOptions = [12, 24, 36, 48];
  paginationPage = 1;
  totalItemsCount = 0;
  recommendationListLoading = false;
  apiCallSubscription: any;
  defaultPaginationSize = 12


  constructor(
    private snackBar: MatLegacySnackBar,
    private networkingSvc: NetworkingService
  ) { }

  ngOnInit(): void {
    this.getRecommendationsList();
  }

  getRecommendationsList() {
    const formBody = {
      size: this.paginationSize,
      offset: this.paginationPage - 1,
    }
    if(this.apiCallSubscription) {
      this.apiCallSubscription.unsubscribe();
    }
    this.recommendationListLoading = true;
    this.apiCallSubscription = this.networkingSvc.getRecommendedUsers(formBody).subscribe({
      next: (response) => {
        this.recommendationListLoading = false;
        this.recommendationList = _.get(response, 'result.response', []);
        this.totalItemsCount = _.get(response, 'result.count', 0);
      },
      error: (error) => {
        this.recommendationListLoading = false;
        if(error) {
          this.openSnackbar(this.handleTranslateTo('NetworkLandingPage.errorWhileFetchingRecommendations'));
        }
      }
    });
  }

  async onPageChange(event: PageChangeEmitter) {
    this.scrollToTop();
    this.paginationPage = event.currentPage
    this.paginationSize = event.limit;
    this.getRecommendationsList();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleTranslateTo(menuName: string): string {
    return this.networkingSvc.handleTranslateTo(menuName)
  }

  openSnackbar(primaryMsg: string, duration: number = 5000) {
    this.snackBar.open(primaryMsg, 'X', {
      duration,
    })
  }

}
