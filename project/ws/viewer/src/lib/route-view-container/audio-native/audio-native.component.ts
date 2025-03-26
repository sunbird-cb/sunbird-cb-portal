import { Component, Input, OnInit } from '@angular/core'
import { NsContent, NsDiscussionForum } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'viewer-audio-native-container',
  templateUrl: './audio-native.component.html',
  styleUrls: ['./audio-native.component.scss'],
})
export class AudioNativeComponent implements OnInit {
  @Input() isScreenSizeSmall = false
  @Input() forPreview = false
  @Input() isFetchingDataComplete = false
  @Input() audioData: NsContent.IContent | null = null
  @Input() discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null
  @Input() defaultThumbnail = ''
  @Input() isPreviewMode = false
  isTypeOfCollection = false
  isRestricted = false

  constructor(private activatedRoute: ActivatedRoute, private configSvc: ConfigurationsService) { }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isRestricted =
        !this.configSvc.restrictedFeatures.has('disscussionForum')
    }
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
  }
}
