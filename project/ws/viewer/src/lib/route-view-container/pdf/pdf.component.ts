import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { NsContent, NsDiscussionForum } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { PdfScormDataService } from '../../pdf-scorm-data-service'
@Component({
  selector: 'viewer-pdf-container',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
})
export class PdfComponent implements OnInit, OnDestroy {
  @Input() isFetchingDataComplete = false
  @Input() pdfData: NsContent.IContent | null = null
  @Input() forPreview = false
  @Input() widgetResolverPdfData: any = {
    widgetType: 'player',
    widgetSubType: 'playerPDF',
    widgetData: {
      pdfUrl: '',
      identifier: '',
      disableTelemetry: false,
      hideControls: true,
    },
  }
  @Input() isPreviewMode = false
  @Input() discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  isTypeOfCollection = false
  isRestricted = false
  playPdfContentFlag = true
  isMobile = false
  pdfContentProgressData: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private configSvc: ConfigurationsService,
    private pdfScormDataService: PdfScormDataService
  ) { }

  ngOnInit() {
    if (window.innerWidth <= 1200) {
      this.playPdfContentFlag = false
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    if (this.configSvc.restrictedFeatures) {
      this.isRestricted =
        !this.configSvc.restrictedFeatures.has('disscussionForum')
    }
    this.pdfScormDataService.handlePdfMarkComplete.subscribe((contentData: any) => {
      this.pdfContentProgressData = contentData
      if (contentData && contentData.status === 2) {
        this.playPdfContentFlag = true
      }
    })
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
  }

  openPdf() {
    this.playPdfContentFlag = true
    this.pdfScormDataService.handleBackFromPdfScormFullScreen.next(true)
  }

  ngOnDestroy() {
    this.pdfScormDataService.handleBackFromPdfScormFullScreen.next(false)
  }
}
