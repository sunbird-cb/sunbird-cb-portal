import { Component, Input, OnInit } from '@angular/core'
// tslint:disable-next-line
import _ from 'lodash'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { TopicService } from '../../services/topics.service'

@Component({
  selector: 'ws-app-topic-card',
  templateUrl: './topic-card.component.html',
  styleUrls: ['./topic-card.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1 top_main flex-col' },
  /* tslint:enable */
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
      const index = _.findIndex(this.topicService.getCurrentSelectedSysTopics, { identifier: top.identifier })
      if (index !== -1) {
        /// remove from store
        this.topicService.removeSystemTopics(top)
      } else {
        /// add to store
        this.topicService.addSystemTopics(top)
      }
    } else {
      const index = _.indexOf(this.topicService.getCurrentSelectedDesTopics, top)
      // const cIndex = _.indexOf(this.topicService.getCurrentSelectedTopics[index].children, top)
      if (index !== -1) {
        /// remove from store
        this.topicService.removeDesiredTopics(top)
      } else {
        /// add to store
        this.topicService.addDesiredTopics(top)
      }
    }

  }
  isSelected(top: NSProfileDataV3.ITopic | string): boolean {
    if (top) {
      if (typeof (top) !== 'object') {
        const index = _.indexOf(this.topicService.getCurrentSelectedDesTopics, top)

        if (index === -1) {
          return false
        }
        return true
      }
      const index1 = _.findIndex(this.topicService.getCurrentSelectedSysTopics, { identifier: top.identifier })
     
      if (index1 === -1) {
        return false
      }
      return true

    }
    return false
  }
  showMore() {
    this.show += 10
  }

  showLess() {
    this.show = 6
  }
}
