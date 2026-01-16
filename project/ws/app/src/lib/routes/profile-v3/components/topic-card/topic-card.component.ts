import { Component, Input, OnInit } from '@angular/core'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
// tslint:disable-next-line
import _ from 'lodash'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { TopicService } from '../../services/topics.service'
import { TranslateService } from '@ngx-translate/core'

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
  constructor(private topicService: TopicService, private snackBar: MatSnackBar,
              private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
   }

  ngOnInit() {

  }
  clicked(top: NSProfileDataV3.ITopic | string) {
    this.topicService.autoSave.next(true)
    if (typeof (top) === 'object') {
      const index = _.findIndex(this.topicService.getCurrentSelectedSysTopics, { identifier: top.identifier })
      if (index !== -1) {
        /// remove from store
        this.topicService.removeSystemTopics(top)
        this.snackBar.open('Removed successfully!')
      } else {
        /// add to store
        this.topicService.addSystemTopics(top)
        this.snackBar.open('Added successfully!')
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
