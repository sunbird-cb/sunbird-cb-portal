import { Component, Input, OnInit } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material'
import { NsContent } from '@sunbird-cb/utils/src/public-api'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ws-widget-content-toc',
  templateUrl: './content-toc.component.html',
  styleUrls: ['./content-toc.component.scss'],
})

export class ContentTocComponent implements OnInit {

  tabChangeValue: any = ''
  @Input() content: NsContent.IContent | null = null
  @Input() initialrouteData: any
  routeSubscription: Subscription | null = null
  @Input() forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')

  @Input() resumeData: NsContent.IContinueLearningData | null = null
  @Input() batchData: /**NsContent.IBatchListResponse */ any | null = null
  constructor() { }

  ngOnInit() {
  }

  handleTabChange(event: MatTabChangeEvent): void {
    this.tabChangeValue = event.tab
  }

}
