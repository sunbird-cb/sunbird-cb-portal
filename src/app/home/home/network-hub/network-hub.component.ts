import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationsService } from '@sunbird-cb/utils'
import { MatSnackBar } from '@angular/material';

import { HomePageService } from 'src/app/services/home-page.service';

@Component({
  selector: 'ws-network-hub',
  templateUrl: './network-hub.component.html',
  styleUrls: ['./network-hub.component.scss']
})

export class NetworkHubComponent implements OnInit {

  networkRecommended: any[] = [];
  userInfo: any;
  suggestionsLoader: any;

  constructor(
    private configService: ConfigurationsService,
    private homePageService: HomePageService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userInfo =  this.configService && this.configService.userProfile;
    this.fetchNetworkRecommendations();
    this.fetchRecentRequests();
  }

  handleButtonClick(): void {
    
  }

  fetchNetworkRecommendations(): void {
    const payload = {
      "size" : 2,
      "offset": 0,
      "search":[
        {
          "field": "employmentDetails.departmentName",
          "values": ["Karmayogi Bharat"]
        }
      ]
    };

    this.suggestionsLoader = true;
    this.homePageService.getNetworkRecommendations(payload).subscribe(
      (res: any) => {
        this.suggestionsLoader = false;
        this.networkRecommended = res.result.data[0].results;
        if (this.networkRecommended.length) {
          this.networkRecommended = this.networkRecommended.map((obj: any) => {
            return { ...obj, connecting: false}
          });
        }
      }
    );
  }

  fetchRecentRequests(): void {
    this.homePageService.getRecentRequests().subscribe(
      (res: any) => {
        console.log("res - ", res);
      }
    );
  }

  handleConnect(obj: any): void {
    const payload = {
      "connectionId": obj.userId,
      "userIdFrom": this.userInfo.userId,
      "userNameFrom": this.userInfo.userId,
      "userDepartmentFrom": obj.employmentDetails.departmentName,
      "userIdTo": obj.userId,
      "userNameTo": obj.userId,
      "userDepartmentTo": obj.employmentDetails.departmentName
    };

    console.log("payload - ", payload);
    obj.connecting = true;
    this.homePageService.connectToNetwork(payload).subscribe(
      (res: any) => {
        console.log(res)
        this.fetchNetworkRecommendations();
        obj.connecting = false;
        this.matSnackBar.open("Connection request sent successfully!");
      },
      (error: HttpErrorResponse) => {
        console.log(error)
        obj.connecting = true;
        this.matSnackBar.open("Unable to connect due to some error!");
      }
    );
  }

}
