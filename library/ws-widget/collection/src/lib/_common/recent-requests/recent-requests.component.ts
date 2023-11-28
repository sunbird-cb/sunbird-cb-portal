import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'ws-widget-recent-requests',
  templateUrl: './recent-requests.component.html',
  styleUrls: ['./recent-requests.component.scss'],
})
export class RecentRequestsComponent implements OnInit {

  @Input() recentRequests: any;
  @Output() updateRequest: EventEmitter<any> = new EventEmitter(); 
  userInfo: any;

  constructor(
    private matSnackBar: MatSnackBar,
    private configService: ConfigurationsService
  ) { }

  ngOnInit() {
    this.userInfo =  this.configService && this.configService.userProfile;
  }

  handleRequest(reqObject: any, action: string): void {
    const payload = {
      "userIdFrom": this.userInfo.userId,
      "userNameFrom": this.userInfo.userId,
      "userDepartmentFrom": this.userInfo.departmentName,
      "userIdTo": reqObject.id,
      "userNameTo": reqObject.id,
      "userDepartmentTo": reqObject.departmentName,
      "status": action
    };

    reqObject.connecting = true;
    this.updateRequest.emit({payload, action, reqObject});
  }

}
