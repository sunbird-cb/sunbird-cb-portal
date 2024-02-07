import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@sunbird-cb/utils/src/public-api'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ws-widget-app-toc-content',
  templateUrl: './app-toc-content.component.html',
  styleUrls: ['./app-toc-content.component.scss'],
})
export class AppTocContentComponent implements OnInit {
  @Input() content: NsContent.IContent | null = null
  @Input() initialRouteData: any
  routeSubscription: Subscription | null = null
  @Input() forPreview = window.location.href.includes('/public/') || window.location.href.includes('&preview=true')

  @Input() resumeData: NsContent.IContinueLearningData | null = null
  @Input() batchData: /**NsContent.IBatchListResponse */ any | null = null
  @Input() skeletonLoader = false

  constructor() { }

  ngOnInit() {
  }

}
