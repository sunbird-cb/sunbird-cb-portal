import { Component, OnInit, Input } from '@angular/core'
import { TFetchStatus } from '@sunbird-cb/utils-v2'
import { IWsDiscussionForumInput, IWsLeader } from '../../model/leadership.model'
import { NsWidgetResolver } from '@sunbird-cb/resolver'
import { NsDiscussionForum } from '@sunbird-cb/collection'

@Component({
  selector: 'ws-discuss',
  templateUrl: './discuss.component.html',
  styleUrls: ['./discuss.component.scss'],
})
export class DiscussComponent implements OnInit {
  @Input() pageId = ''
  @Input() leaderProfile: IWsLeader | null = null

  isDiscussionsDoneByLeader = false
  discussionFetchStatus: TFetchStatus = 'none'
  discussionForumInput: IWsDiscussionForumInput | null = null
  userId = ''
  appName = ''

  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null

  constructor() { }

  ngOnInit() {
    if (this.leaderProfile) {
      this.discussionForumWidget = {
        widgetData: {
          id: this.pageId,
          title: '',
          name: NsDiscussionForum.EDiscussionType.LEARNING,
          initialPostCount: 2,
        },
        widgetSubType: 'discussionForum',
        widgetType: 'discussionForum',
      }
      this.discussionForumWidget = { ...this.discussionForumWidget }
      this.discussionFetchStatus = 'done'
    }
  }
}
