import { Platform } from '@angular/cdk/platform'
import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
// import { MobileAppsService } from './mobile-apps.service'
import { NsContent } from '../_services/widget-content.model'

export interface IWidgetBtnDownload {
  identifier: string
  contentType: NsContent.EContentTypes
  primaryCategory: NsContent.EPrimaryCategory
  resourceType: string
  mimeType: NsContent.EMimeTypes
  downloadUrl: string
  isExternal: boolean
  artifactUrl: string
  status?: string
}

@Component({
  selector: 'ws-widget-btn-content-download',
  templateUrl: './btn-content-download.component.html',
  styleUrls: ['./btn-content-download.component.scss'],
})
export class BtnContentDownloadComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IWidgetBtnDownload> {
  @Input() widgetData!: IWidgetBtnDownload
  @Input() forPreview = false
  @HostBinding('id')
  public id = 'download-content'
  downloadable = false

  constructor(
    private platform: Platform,
    private events: EventService,
    // private mobAppSvc: MobileAppsService,
    private configSvc: ConfigurationsService,
  ) {
    super()
  }
  ngOnInit() {
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.isContentDownloadAvailable) {
      // this.downloadable = this.mobAppSvc.isMobile && this.isContentDownloadable
      this.downloadable = this.isContentDownloadable
    }
  }

  private get isContentDownloadable(): boolean {
    if (this.widgetData.identifier) {
      if (
        this.widgetData.primaryCategory === NsContent.EPrimaryCategory.PROGRAM ||
        this.widgetData.resourceType === 'Assessment' ||
        this.widgetData.resourceType === 'Competition' ||
        this.widgetData.resourceType === 'Classroom Training' ||
        (this.widgetData.mimeType !== NsContent.EMimeTypes.COLLECTION &&
          !this.widgetData.downloadUrl) ||
        this.widgetData.isExternal ||
        (this.widgetData.artifactUrl && this.widgetData.artifactUrl.startsWith('https://scorm.')
        )
      ) {
        return false
      }
      switch (this.widgetData.mimeType) {
        case NsContent.EMimeTypes.MP3:
        case NsContent.EMimeTypes.MP4:
        case NsContent.EMimeTypes.M3U8:
        case NsContent.EMimeTypes.QUIZ:
        case NsContent.EMimeTypes.PDF:
        case NsContent.EMimeTypes.WEB_MODULE:
        case NsContent.EMimeTypes.COLLECTION:
          return true
        default:
          return false
      }
    }
    return false
  }

  download(event: Event) {
    event.stopPropagation()
    if (!this.forPreview) {
      this.raiseTelemetry()
      // this.mobAppSvc.downloadResource(this.widgetData.identifier)
    }
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'download',
        subType: 'content',
        id: this.widgetData.identifier,
      },
      {
      platform: this.platform,
      // contentId: this.widgetData.identifier,
      // contentType: this.widgetData.contentType, // cccc
      id: this.widgetData.identifier,
      type: this.widgetData.primaryCategory,
      },
      {
        pageIdExt: 'download',
        module: WsEvents.EnumTelemetrymodules.CONTENT,
      }
    )
  }
}
