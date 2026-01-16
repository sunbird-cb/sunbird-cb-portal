import { Component, OnInit } from '@angular/core';
import { connectionUpdates, PageChangeEmitter, tabDetails } from '../../models/network-v3.model';
import * as _ from 'lodash';
import { MatLegacySnackBar } from '@angular/material/legacy-snack-bar';
import { NetworkingService } from '../../services/networking.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ws-app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss']
})
export class ConnectionsComponent implements OnInit {

  // selectedTabKey = 'connections';
  selectedTabIndex = 0;
  tabDetailsList: tabDetails[] = [
    { lable: 'NetworkLandingPage.myConnections', key: 'Approved', recordsCount: 0 },
    { lable: 'NetworkLandingPage.requests', key: 'Received', recordsCount: 0 },
    { lable: 'NetworkLandingPage.sent', key: 'Pending', recordsCount: 0 },
    { lable: 'NetworkLandingPage.blocked', key: 'Blocked', recordsCount: 0 }
  ]
  connectionsList: any = [];
  connectionsLoading = false;
  apiSubscription: any;
  paginationSize = 10;
  paginationSizeOptions = [10, 20, 30, 40];
  paginationPage = 1;
  totalItemsCount = 0;
  defaultPaginationSize = 10;
  noDataMessage = 'NetworkLandingPage.youDoNotHaveAnyConnectionsSendConnectionRequestsFromTheHomeTab';
  allStatesList = ['Approved', 'Pending', 'Blocked'];
  satesListToGetCount: string[] = [];

  constructor(
    private networkingSvc: NetworkingService,
    private snackBar: MatLegacySnackBar,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getParamsData();
  }

  getParamsData() {
    const tab = _.get(this.activatedRoute, 'snapshot.queryParams.tab', 'Approved');
    this.selectedTabIndex = this.tabDetailsList.findIndex(tabDetail => tabDetail.key === tab);
    this.initialization();
  }

  initialization() {
    this.getTabData();
    this.getConnectionsCount();
  }

  getConnectionsCount() {
    const formBody = {
      request: {
        filter: {
          status: this.satesListToGetCount && this.satesListToGetCount.length ? this.satesListToGetCount : this.allStatesList
        },
        facets: [
          "status"
        ]
      }
    }

    this.networkingSvc.getConnectionsCount(formBody).subscribe({
      next: (response) => {
        if(response) {
          const facets = _.get(response, 'result.facets[0].values', []);
          const responseMap = new Map(facets.map((item: any) => [item.name.toLowerCase(), item.count]));
          this.tabDetailsList.forEach((tab) => {
            let keyToSet = tab.key;
            if(tab.key === 'Pending') {
              keyToSet = 'Requested'
            } else if(tab.key === 'Blocked') {
              keyToSet = 'Blocked Outgoing'
            }
            let statusList = _.get(formBody, 'request.filter.status', []);
            if (statusList.includes('Pending')) {
              statusList = statusList.filter((s: string) => s !== 'Pending').concat(['Requested', 'Received']);
            }
            const count = responseMap.get(keyToSet.toLowerCase()) as number;
            const tabKey = tab.key === 'Pending' ? 'Requested' : tab.key;
            if (count !== undefined && count !== null) {
              tab.recordsCount = count as number;
            } else if (statusList.indexOf(tabKey) > -1) {
              tab.recordsCount = 0;
            }

            //#region (emit count for left navigation to show red dot)
            if(tab.key === 'Received') {
              const connectionsUpdate: connectionUpdates = {
                routeId: 'connections',
                showUpdate: count > 0 ? true : false
              }
              this.networkingSvc.sendConnectionUpdates(connectionsUpdate);
            }
            //#endregion
          });
          this.satesListToGetCount = [];
        }
      }
    })
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
    this.resetPagination();
    if(this.satesListToGetCount && this.satesListToGetCount.length) {
      this.getConnectionsCount();
    }
  }

  resetPagination() {
    this.paginationPage = 1;
    this.paginationSize = this.defaultPaginationSize;
    this.totalItemsCount = 0;
    this.getTabData();
  }

  getTabData() {
    const key = _.get(this.tabDetailsList, `[${this.selectedTabIndex}].key`, '');
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
    switch (key) { // key is based on the tab selected
      case 'Approved':
        this.getConnectionsList();
        this.noDataMessage = 'NetworkLandingPage.youDoNotHaveAnyConnectionsSendConnectionRequestsFromTheHomeTab';
        break;
      case 'Received':
        this.getRequestsList();
        this.noDataMessage = 'NetworkLandingPage.noRequestsFound';
        break;
      case 'Pending':
        this.getSentRequsetsList();
        this.noDataMessage = 'NetworkLandingPage.noRequestsSent';
        break;
      case 'Blocked':
        this.getBlockedList();
        this.noDataMessage = 'NetworkLandingPage.noConnectionsFound';
        break;
    }
  }

  getConnectionsList() {
    const pageNo = this.paginationPage - 1;
    const pageSize = this.paginationSize;
    this.connectionsLoading = true;
    this.apiSubscription = this.networkingSvc.getConnections(pageNo, pageSize).subscribe({
      next: (response) => {
        this.connectionsLoading = false;
        this.totalItemsCount = _.get(response, 'result.count', 0);
        this.connectionsList = _.get(response, 'result.data', []);
      },
      error: () => {
        this.connectionsLoading = false;
        this.connectionsList = [];
        this.openSnackBar(this.handleTranslateTo('NetworkLandingPage.errorWhileFetchingConnections'), 'X');
      }
    });
  }

  getRequestsList() {
    const pageNo = this.paginationPage - 1;
    const pageSize = this.paginationSize;
    this.connectionsLoading = true;
    this.apiSubscription = this.networkingSvc.getConnectionRequests(pageNo, pageSize).subscribe({
      next: (response) => {
          this.connectionsLoading = false;
          this.totalItemsCount = _.get(response, 'result.count', 0);
          this.connectionsList = _.get(response, 'data', []);
      },
      error: () => {
        this.connectionsLoading = false;
        this.connectionsList = [];
        this.openSnackBar(this.handleTranslateTo('NetworkLandingPage.errorWhileFetchingConnectionRequests'), 'X');
      }
    });
  }

  getSentRequsetsList() {
    const pageNo = this.paginationPage - 1;
    const pageSize = this.paginationSize;
    this.connectionsLoading = true;
    this.apiSubscription = this.networkingSvc.getRequestSent(pageNo, pageSize).subscribe({
      next: (response) => {
          this.connectionsLoading = false;
          this.totalItemsCount = _.get(response, 'result.count', 0);
          this.connectionsList = _.get(response, 'result.data', []);
      },
      error: () => {
        this.connectionsLoading = false;
        this.connectionsList = [];
        this.openSnackBar(this.handleTranslateTo('NetworkLandingPage.errorWhileFetchingSentRequests'), 'X');
      }
    });
  }

  getBlockedList() {
    const formBody = {
      offset: this.paginationPage - 1,
      size: this.paginationSize
    };
    this.connectionsLoading = true;
    this.apiSubscription = this.networkingSvc.getBlockedUsers(formBody).subscribe({
      next: (response) => {
        this.connectionsLoading = false;
        this.totalItemsCount = _.get(response, 'result.count', 0);
        this.connectionsList = _.get(response, 'result.response', []);
      },
      error: () => {
        this.connectionsLoading = false;
        this.connectionsList = [];
        this.openSnackBar(this.handleTranslateTo('NetworkLandingPage.errorWhileFetchingBlockedUsers'), 'X');
      }
    });
  }

  setSatesListGet(stateList: string[]) {
    const set = new Set(this.satesListToGetCount);
    stateList.forEach(state => set.add(state));
    this.satesListToGetCount = Array.from(set);
  }

  onPageChange(event: PageChangeEmitter) {
    this.paginationPage = event.currentPage;
    this.paginationSize = event.limit;
    this.getTabData();
  }

  handleTranslateTo(menuName: string): string {
    return this.networkingSvc.handleTranslateTo(menuName)
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
