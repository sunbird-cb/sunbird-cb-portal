import { Component, Input, OnInit } from '@angular/core';
import _ from 'lodash';
import { NSProfileDataV3 } from '../../models/profile-v3.models';
import { TopicService } from '../../services/topics.service';

@Component({
  selector: 'ws-app-topic-card',
  templateUrl: './topic-card.component.html',
  styleUrls: ['./topic-card.component.scss']
})
export class TopicCardComponent implements OnInit {
  @Input() topic!: NSProfileDataV3.ITopic
  // selectedTopics: Subscription | null = null
  constructor(private topicService: TopicService) { }

  ngOnInit() {

  }
  clicked(top: NSProfileDataV3.ITopic) {
    const index = _.findIndex(this.topicService.getCurrentSelectedTopics, { identifier: top.identifier })
    if (index !== -1) {
      /// remove from store
      this.topicService.removeTopics(top)
    } else {
      /// add to store
      this.topicService.addTopics(top)
    }
  }
  isSelected(top: NSProfileDataV3.ITopic): boolean {
    const index = _.findIndex(this.topicService.getCurrentSelectedTopics, { identifier: top.identifier })
    if (index === -1) {
      return false
    }
    return true
  }
}
