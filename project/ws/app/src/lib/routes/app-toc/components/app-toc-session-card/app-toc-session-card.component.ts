import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'

@Component({
  selector: 'ws-app-toc-session-card',
  templateUrl: './app-toc-session-card.component.html',
  styleUrls: ['./app-toc-session-card.component.scss'],
})
export class AppTocSessionCardComponent implements OnInit {
  @Input() content: NsContent.IContent | null = null
  @Input() expandAll = false
  @Input() rootId!: string
  @Input() rootContentType!: string
  @Input() forPreview = false
  @Input() batchData!: string
  isEnabled = true
  isAllowed = true
  viewChildren = true
  resourceLink: any

  constructor() { }

  ngOnInit() {
  }
  raiseTelemetry() { }

}
