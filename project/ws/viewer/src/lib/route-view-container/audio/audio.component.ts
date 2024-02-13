import { Component, Input, OnInit } from '@angular/core'
import { NsContent, IWidgetsPlayerMediaData, NsDiscussionForum } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils'
@Component({
  selector: 'viewer-audio-container',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit {
  @Input() isScreenSizeSmall = false
  @Input() isFetchingDataComplete = false
  @Input() isNotEmbed = true
  @Input() audioData: NsContent.IContent | null = null
  @Input() widgetResolverAudioData: NsWidgetResolver.IRenderConfigWithTypedData<
    IWidgetsPlayerMediaData
  > | null = null
  @Input() discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  @Input() isPreviewMode = false
  @Input() forPreview = false
  isTypeOfCollection = false
  isRestricted = false
  isMobile = false;
  constructor(private activatedRoute: ActivatedRoute, private configSvc: ConfigurationsService) { }

  ngOnInit() {
    if(window.innerWidth <= 1200) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    if (this.configSvc.restrictedFeatures) {
      this.isRestricted =
        !this.configSvc.restrictedFeatures.has('disscussionForum')
    }
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
  }
}
