import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-widget-pending-request',
  templateUrl: './pending-request.component.html',
  styleUrls: ['./pending-request.component.scss'],
})
export class PendingRequestComponent implements OnInit {
  @Input() pendingRequestData: any
  @Input() isLoading = true
  constructor() { }

  ngOnInit() {
  }

}
