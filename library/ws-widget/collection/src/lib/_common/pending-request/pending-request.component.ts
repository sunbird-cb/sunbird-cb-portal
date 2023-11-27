import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'ws-widget-pending-request',
  templateUrl: './pending-request.component.html',
  styleUrls: ['./pending-request.component.scss'],
})

export class PendingRequestComponent implements OnInit {
  @Input() pendingRequestData: any
  @Input() isLoading = true
  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigateTo() {
    this.router.navigateByUrl('app/network-v2/connection-requests');
  }

}
