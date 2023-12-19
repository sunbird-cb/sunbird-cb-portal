import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { ActivatedRoute, Data } from '@angular/router'
import { Subscription } from 'rxjs'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { NsContent, viewerRouteGenerator, ROOT_WIDGET_CONFIG } from '@sunbird-cb/collection'
import { NsAppToc } from '../../models/app-toc.model'
import { AppTocService } from '../../services/app-toc.service'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ViewerUtilService } from '@ws/viewer/src/lib/viewer-util.service'

@Component({
  selector: 'ws-app-app-toc-contents',
  templateUrl: './app-toc-contents.component.html',
  styleUrls: ['./app-toc-contents.component.scss'],
})
export class AppTocContentsComponent implements OnInit, OnDestroy {
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
    private sanitizer: DomSanitizer,
    private tocSvc: AppTocService,
    private configSvc: ConfigurationsService,
    private viewerSVC: ViewerUtilService
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
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.routeQuerySubscription) {
      this.routeQuerySubscription.unsubscribe()
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
      this.fetchContentParents(this.content.identifier)
      this.populateContentPlayWidget(this.content)
    }
  }
  private fetchContentParents(contentId: string) {
    this.tocSvc.fetchContentParents(contentId).subscribe(contents => {
      this.contentParents = contents || []
    })
  }
  private populateContentPlayWidget(content: NsContent.IContent) {
    if (
      content.primaryCategory === NsContent.EPrimaryCategory.RESOURCE ||
      // content.primaryCategory === NsContent.EPrimaryCategory.KNOWLEDGE_ARTIFACT
      content.primaryCategory === NsContent.EPrimaryCategory.PRACTICE_RESOURCE ||
      content.primaryCategory === NsContent.EPrimaryCategory.FINAL_ASSESSMENT ||
      content.primaryCategory === NsContent.EPrimaryCategory.COMP_ASSESSMENT ||
      content.primaryCategory === NsContent.EPrimaryCategory.OFFLINE_SESSION
    ) {
      switch (content.mimeType) {
        case NsContent.EMimeTypes.M3U8:
        case NsContent.EMimeTypes.MP4:
          this.assignWidgetData(ROOT_WIDGET_CONFIG.player.video, {
            url: content.artifactUrl,
            autoplay: true,
            posterImage: this.viewerSVC.getPublicUrl(content.appIcon || ''),
          })
          break
        case NsContent.EMimeTypes.MP3:
        case NsContent.EMimeTypes.M4A:
          this.assignWidgetData(ROOT_WIDGET_CONFIG.player.audio, {
            url: content.artifactUrl,
            autoplay: true,
            posterImage: this.viewerSVC.getPublicUrl(content.appIcon || ''),
          })
          break
        case NsContent.EMimeTypes.PDF:
          this.assignWidgetData(ROOT_WIDGET_CONFIG.player.pdf, {
            pdfUrl: content.artifactUrl,
          })
          break
        case NsContent.EMimeTypes.OFFLINE_SESSION:
          this.assignWidgetData(ROOT_WIDGET_CONFIG.player.offlineSession, {
            autoplay: true,
            posterImage: this.viewerSVC.getPublicUrl(content.appIcon || ''),
          })
          break
        case NsContent.EMimeTypes.YOUTUBE:
          this.assignWidgetData(ROOT_WIDGET_CONFIG.player.youtube, {
            url: content.artifactUrl,
            autoplay: true,
            posterImage: this.viewerSVC.getPublicUrl(content.appIcon || ''),
          })
          break
      }
    }
  }
  private assignWidgetData(widgetSubType: string, widgetData: any) {
    this.contentPlayWidgetConfig = {
      widgetSubType,
      widgetData,
      widgetType: ROOT_WIDGET_CONFIG.player._type,
      widgetHostClass: 'video-full block',
      widgetHostStyle: {
        height: '375px',
      },
    }
    this.isPlayable = true
  }
  sanitizedBackgroundImage(url: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`)
  }
  resourceLink(resource: NsContent.IContent): { url: string; queryParams: { [key: string]: any } } {
    let url = viewerRouteGenerator(resource.identifier, resource.mimeType)
    /* tslint:disable-next-line */
    console.log(url,'=====> toc content resource url link <========')
    return url
  }

  public contentTrackBy(_index: number, content: NsContent.IContent) {
    if (!content) {
      return null
    }
    return content.identifier
  }

  get showYouMayAlsoLikeTab(): boolean {
    switch (this.configSvc.rootOrg) {
      default:
        return true
    }
  }
}
