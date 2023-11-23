import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-recent-requests',
  templateUrl: './recent-requests.component.html',
  styleUrls: ['./recent-requests.component.scss']
})
export class RecentRequestsComponent implements OnInit {

  @Input("recentRequests") recentRequests: any
  constructor() { }

  ngOnInit() {
  }

}
