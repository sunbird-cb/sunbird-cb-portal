import { Component, Input, OnInit } from '@angular/core'
import { NsContent, IWidgetsPlayerMediaData, NsDiscussionForum } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'

@Component({
  selector: 'viewer-video-container',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  @Input() isScreenSizeSmall = false
  @Input() isNotEmbed = true
  @Input() isFetchingDataComplete = false
  @Input() forPreview = false
  @Input() videoData: NsContent.IContent | null = null
  @Input() widgetResolverVideoData: NsWidgetResolver.IRenderConfigWithTypedData<
    IWidgetsPlayerMediaData
  > | null = null
  @Input() discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  @Input() isPreviewMode = false
  isTypeOfCollection = false
  isRestricted = false
  isMobile = false
  constructor(private activatedRoute: ActivatedRoute, private configSvc: ConfigurationsService) { }

  ngOnInit() {
    if (window.innerWidth <= 1200) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }
    if (this.configSvc.restrictedFeatures) {
      this.isRestricted =
        !this.configSvc.restrictedFeatures.has('disscussionForum')
    }
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
  }
}
