import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Data } from '@angular/router'
import { NsWidgetResolver } from '@sunbird-cb/resolver/src/public-api'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { NsContent } from '@sunbird-cb/utils/src/public-api'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { Subscription } from 'rxjs'
import { NsAppToc } from '../models/app-toc.model'

@Component({
  selector: 'ws-widget-app-toc-content',
  templateUrl: './app-toc-content.component.html',
  styleUrls: ['./app-toc-content.component.scss'],
})
export class AppTocContentComponent implements OnInit {
  @Input() batchId!: string
  @Input() content: NsContent.IContent | null = null
  @Input() forPreview = false
  isPlayable = false
  contentPlayWidgetConfig: NsWidgetResolver.IRenderConfigWithTypedData<any> | null = null
  defaultThumbnail = ''
  errorCode: NsAppToc.EWsTocErrorCode | null = null
  private routeSubscription: Subscription | null = null
  private routeQuerySubscription: Subscription | null = null
  contentParents: NsContent.IContentMinimal[] = []
  expandAll = false
  expandPartOf = false
  contextId!: string
  contextPath!: string

  constructor(
    private route: ActivatedRoute,
    private tocSvc: AppTocService,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    // this.forPreview = window.location.href.includes('/author/')
    this.routeQuerySubscription = this.route.queryParamMap.subscribe(qParamsMap => {
      const contextId = qParamsMap.get('contextId')
      const contextPath = qParamsMap.get('contextPath')
      const batchId = qParamsMap.get('batchId')
      if (contextId && contextPath) {
        this.contextId = contextId
        this.contextPath = contextPath
      }
      if (batchId) {
        this.batchId = batchId
      }
    })
    if (this.route && this.route.parent) {
      this.routeSubscription = this.route.parent.data.subscribe((data: Data) => {
        this.initData(data)
      })
    }
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
  }

  private initData(data: Data) {
    const initData = this.tocSvc.initData(data, true)
    // this.content = initData.content
    this.errorCode = initData.errorCode
    if (this.content) {
      if (!this.contextId || !this.contextPath) {
        this.contextId = this.content.identifier
        this.contextPath = this.content.primaryCategory
      }
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.routeQuerySubscription) {
      this.routeQuerySubscription.unsubscribe()
    }
  }
}
