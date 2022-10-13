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
  desiredTopics!: string[]
  addedByYou!: NSProfileDataV3.ITopic
  private desTopicUpdateSubscription: Subscription | null = null
  private sysTopicUpdateSubscription: Subscription | null = null
  constructor(
    private aRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private topicService: TopicService,
    private configSvc: ConfigurationsService,

  ) {
    this.loadTopics()
    this.updateInitValues()
    if (this.desTopicUpdateSubscription) {
      this.desTopicUpdateSubscription.unsubscribe()
    }
    if (this.sysTopicUpdateSubscription) {
      this.sysTopicUpdateSubscription.unsubscribe()
    }
  }
  ngOnDestroy(): void {
    if (this.desTopicUpdateSubscription) {
      this.desTopicUpdateSubscription.unsubscribe()
    }
    if (this.sysTopicUpdateSubscription) {
      this.sysTopicUpdateSubscription.unsubscribe()
    }
  }

  ngOnInit() {
    this.sysTopicUpdateSubscription = this.topicService.systemTopics
      .subscribe(data => {
        if (this.topicService.autoSave.value) {
          const systemTopic: NSProfileDataV3.ITopic[] = []
          _.each(data, topic => {
            systemTopic.push(topic)
          })
          if (systemTopic.length >= 0) {
            this.saveSystemTopic(_.compact(systemTopic) || [])
          }
        }
      })
    this.desTopicUpdateSubscription = this.topicService.desiredTopics
      .subscribe(data => {
        if (this.topicService.autoSave.value) {
          const desiredTopic: string[] = []
          _.each(data, topic => {
            desiredTopic.push(topic)
          })
          if (desiredTopic.length >= 0) {
            this.saveDesiredTopic(_.compact(desiredTopic) || [])
            this.desiredTopics = (_.compact(desiredTopic) || [])
          }
        }
      })

  }
  get desiredTopicsTemplate() {
    this.addedByYou = {
      children: this.desiredTopics || [],
      code: '',
      description: '',
      identifier: '',
      index: 0,
      name: 'Added by you',
      noOfHoursConsumed: 0,
      status: '',
    }
    return this.addedByYou
  }
  updateInitValues() {
    // console.log(this.configSvc.unMappedUser.profileDetails.desiredTopics)
    // console.log(this.configSvc.unMappedUser.profileDetails.systemTopics)
    const desiredTopics = _.get(this.configSvc.unMappedUser, 'profileDetails.desiredTopics') || []
    const systemTopics = _.get(this.configSvc.unMappedUser, 'profileDetails.systemTopics') || []
    this.topicService.autoSave.next(false)
    if (systemTopics) {
      this.topicService.addInitSystemTopics([...systemTopics])
    }
    if (desiredTopics) {
      this.topicService.addInitDesiredTopics([...desiredTopics])
      this.desiredTopics = [...desiredTopics]
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
          this.topicService.addDesiredTopics(response)
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
          this.configSvc.updateGlobalProfile(true)
          if (this.topicService.isAdded.value) {
            this.snackBar.open('Added successfully!')
          } else {
            this.snackBar.open('Removed successfully!')
          }
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
          this.configSvc.updateGlobalProfile(true)
          if (this.topicService.isSystemAdded.value) {
            this.snackBar.open('Added successfully!')
          } else {
            this.snackBar.open('Removed successfully!')
          }
        }
      })
    }
  }
}
