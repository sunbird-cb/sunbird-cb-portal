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
  show = 6
  // selectedTopics: Subscription | null = null
  constructor(private topicService: TopicService) { }

  ngOnInit() {

  }
  clicked(top: NSProfileDataV3.ITopic | string) {
    this.topicService.autoSave.next(true)
    if (typeof (top) === 'object') {
      const index = _.findIndex(this.topicService.getCurrentSelectedTopics, { identifier: top.identifier })
      if (index !== -1) {
        /// remove from store
        this.topicService.removeTopics(top)
      } else {
        /// add to store
        this.topicService.addTopics(top)
      }
    } else {
      const index = _.findIndex(this.topicService.getCurrentSelectedTopics, { name: 'Added by you' })
      const cIndex = _.indexOf(this.topicService.getCurrentSelectedTopics[index].children, top)
      if (cIndex !== -1) {
        /// remove from store
        this.topicService.removeTopicsAddedByYou(top)
      } else {
        /// add to store
        this.topicService.addTopicsAddedByYou(top)
      }
    }

  }
  isSelected(top: NSProfileDataV3.ITopic): boolean {
    if (top) {
      if (!top.identifier) {
        const index = _.indexOf(this.topicService.getCurrentSelectedTopics, top)
        if (index === -1) {
          return false
        }
        return true
      } else {
        const index = _.findIndex(this.topicService.getCurrentSelectedTopics, { identifier: top.identifier })
        if (index === -1) {
          return false
        }
        return true
      }
    }
    return false
  }
  showMore() {
    this.show += 10
  }
}
