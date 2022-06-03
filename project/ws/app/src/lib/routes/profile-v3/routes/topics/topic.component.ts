import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
// tslint:disable-next-line
import _ from 'lodash'
import { Subscription } from 'rxjs'
import { AddTopicDialogComponent } from '../../components/add-topic/add-topic.component'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { TopicService } from '../../services/topics.service'

@Component({
  selector: 'ws-app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
})
export class TopicComponent implements OnInit, OnDestroy {

  topics!: NSProfileDataV3.ITopic[]
  addedByYou!: NSProfileDataV3.ITopic
  private topicUpdateSubscription: Subscription | null = null
  constructor(
    private aRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private topicService: TopicService,
    private configSvc: ConfigurationsService

  ) {
    this.loadTopics()
    if (this.topicUpdateSubscription) {
      this.topicUpdateSubscription.unsubscribe()
    }
    this.topicUpdateSubscription = this.topicService.selectedTopics
      .subscribe(data => {
        if (this.topicService.autoSave.value) {
          let desiredTopic: NSProfileDataV3.ITopic[] = []
          const systemTopic: NSProfileDataV3.ITopic[] = []
          _.each(data, topic => {
            if (topic.identifier) {
              systemTopic.push(topic)
            } else {
              desiredTopic = topic.children
            }
          })

          if (desiredTopic.length > 0) {
            this.saveDesiredTopic(_.compact(desiredTopic) || [])
          }
          if (systemTopic.length > 0) {
            this.saveSystemTopic(_.compact(systemTopic) || [])
          }
        }
      })
  }
  ngOnDestroy(): void {
    if (this.topicUpdateSubscription) {
      this.topicUpdateSubscription.unsubscribe()
    }
  }

  ngOnInit() {
    // console.log(this.configSvc.unMappedUser.profileDetails.desiredTopics)
    // console.log(this.configSvc.unMappedUser.profileDetails.systemTopics)
    const desiredTopics = _.get(this.configSvc.unMappedUser, 'profileDetails.desiredTopics')
    const systemTopics = _.get(this.configSvc.unMappedUser, 'profileDetails.systemTopics')
    this.topicService.autoSave.next(false)
    this.addedByYou = {
      children: desiredTopics || [],
      code: '',
      description: '',
      identifier: '',
      index: 0,
      name: 'Added by you',
      noOfHoursConsumed: 0,
      status: '',
    }
    if (systemTopics) {
      this.topicService.addInitTopics([...systemTopics, this.addedByYou])
    }
  }
  loadTopics() {
    if (
      this.aRoute.snapshot.data
      && this.aRoute.snapshot.data.topics
      && this.aRoute.snapshot.data.topics.data
    ) {
      this.topics = this.aRoute.snapshot.data.topics.data
    }
  }
  showPoup() {
    const dialogRef = this.dialog.open(AddTopicDialogComponent, {
      autoFocus: false,
      data: {},
    })
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        if (response) {
          // this.addedByYou.children.push(response)
          this.topicService.autoSave.next(true)
          this.topicService.addTopicsAddedByYou(response)
        }
      }
    })
  }

  saveDesiredTopic(desiredTopic: any[]) {
    if (this.configSvc.userProfile && this.configSvc.userProfile.userId) {
      const reqObj = {
        request: {
          userId: this.configSvc.userProfile.userId,
          profileDetails: {
            desiredTopics: desiredTopic,
          },
        },
      }
      this.topicService.saveDesiredTopic(reqObj).subscribe(res => {
        if (res) {
          this.snackBar.open('Updated!')
        }
      })
    }
  }

  saveSystemTopic(systemTopic: NSProfileDataV3.ITopic[]) {
    if (this.configSvc.userProfile && this.configSvc.userProfile.userId) {
      const reqObj: NSProfileDataV3.ISystemTopic = {
        request: {
          userId: this.configSvc.userProfile.userId,
          profileDetails: {
            systemTopics: _.map(systemTopic, st => {
              return {
                children: st.children,
                identifier: st.identifier,
                name: st.name,
              } as NSProfileDataV3.ISystemTopicChield
            }),
          },
        },
      }
      this.topicService.saveSystemTopic(reqObj).subscribe(res => {
        if (res) {
          this.snackBar.open('Updated!')
        }
      })
    }
  }
}
