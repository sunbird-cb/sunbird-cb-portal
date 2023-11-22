import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'ws-app-toc-session-card',
  templateUrl: './app-toc-session-card.component.html',
  styleUrls: ['./app-toc-session-card.component.scss'],
})
export class AppTocSessionCardComponent implements OnInit {
  @Input() session: any = null
  @Input() expandAll = false
  @Input() rootId!: string
  @Input() rootContentType!: string
  @Input() forPreview = false
  @Input() batchData!: any
  @Input() config!: string
  isEnabled = true
  isAllowed = true
  viewChildren = true
  resourceLink: any

  constructor() { }

  ngOnInit() {
  }
  raiseTelemetry() { }
  public progressColor(): string {
    return '#1D8923'
  }
  public progressColor2(): string {
    return '#f27d00'
  }
}
