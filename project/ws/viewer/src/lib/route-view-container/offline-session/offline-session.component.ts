import { Component, Input, OnInit } from '@angular/core'
import { NsContent, NsDiscussionForum } from '@sunbird-cb/collection'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'viewer-offline-session-container',
  templateUrl: './offline-session.component.html',
  styleUrls: ['./offline-session.component.scss'],
})
export class OfflineSessionComponent implements OnInit {
  @Input() isFetchingDataComplete = false
  @Input() offlineSessionData: NsContent.IContent | null = null
  @Input() forPreview = false
  @Input() widgetResolverOfflineSessionData: any = {
    widgetType: 'player',
    widgetSubType: 'playerOfflineSession',
    widgetData: {
      content: '',
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
  constructor(
    private activatedRoute: ActivatedRoute,
    private configSvc: ConfigurationsService
  ) { }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isRestricted =
        !this.configSvc.restrictedFeatures.has('disscussionForum')
    }
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
  }

}
