import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { SamuhikCharchaService } from './../../../../_services/samuhik-charcha.service'
import { ConfigurationsService, WsEvents, EventService as libEventService } from '@sunbird-cb/utils-v2'
import * as _ from 'lodash'

@Component({
  selector: 'ws-widget-samuhik-charcha-content',
  templateUrl: './samuhik-charcha-content.component.html',
  styleUrls: ['./samuhik-charcha-content.component.scss']
})
export class SamuhikCharchaContentComponent implements OnInit {
  @Input() content: any
  @Input() conditionData: any
  @Input() locked = false
  @Output() resumeContent = new EventEmitter<void>()
  samuhikConfig: any
  samuhikConfigLoaded: boolean = false

  constructor(
    private samuhikCharchaSvc: SamuhikCharchaService,
    private events: libEventService,
    private configService: ConfigurationsService
  ) { }

  get getCurrentTimeInUTC(): string {
    const currentDate = new Date()
    const isoString = currentDate.toISOString()
    return isoString.replace('Z', '+0000')
  }

  async ngOnInit() {
    const orgId = _.get(this.configService, 'userProfile.userRootOrg.id', '')
    await this.getSamuhikConfig()
    if (!this.conditionData?.userEnrollmentList?.length || this.conditionData?.userEnrollmentList[0]?.completionPercentage < 30) {
      this.locked = true
    }
    if (this.content) {
      const eventsLinked = this.content.eventLinked || []
      this.samuhikConfig.strips[0].tabs.forEach((ele: any) => {
        ele.request.searchV6.request.filters.identifier = eventsLinked
        ele.request.searchV6.request.filters.createdFor = [orgId]
        if (ele.request.searchV6.request.filters.endDateTime.hasOwnProperty('>=')) {
          ele.request.searchV6.request.filters.endDateTime['>='] = this.getCurrentTimeInUTC
        }
        if (ele.request.searchV6.request.filters.endDateTime.hasOwnProperty('<')) {
          ele.request.searchV6.request.filters.endDateTime['<'] = this.getCurrentTimeInUTC
        }
      })
      this.samuhikConfigLoaded = true
    }
    if (this.samuhikConfig && this.samuhikConfig.strips && this.samuhikConfig.strips.length) {
      if (this.samuhikConfig.strips[0] && this.samuhikConfig.strips[0]['viewMoreUrl'] && this.samuhikConfig.strips[0]['viewMoreUrl']['path']) {
        this.samuhikConfig.strips[0]['viewMoreUrl']['path'] = this.samuhikConfig.strips[0]['viewMoreUrl']['path'].split('?')[0]
        this.samuhikConfig.strips[0]['viewMoreUrl']['viewMoreText'] = "Show all"
      }

      if (_.get(this.samuhikConfig, 'strips[0].viewMoreUrl.queryParams')) {
        this.samuhikConfig.strips[0].viewMoreUrl.queryParams['courseId'] = this.content.identifier
      }

    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions if needed
  }

  private async getSamuhikConfig() {
    try {
      this.samuhikConfig = await this.samuhikCharchaSvc.fetchConfigFile().toPromise()
    } catch (error) {
      console.error('Error fetching Samuhik config:', error)
    }
  }

  raiseTelemetryInteratEvent(event: any) {
    let subType = 'my-events'
    switch (_.get(event, 'context.pageSection')) {
      case 'myEvents':
        subType = 'my-events'
        break
      case 'recommendedEvents':
        subType = 'recommended-events'
        break
      case 'trendingEvents':
        subType = 'trending-events'
        break
      case 'featuredEvents':
        subType = 'featured-events'
        break
    }
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: subType,
        id: "card-content",
      },
      {
        id: _.get(event, 'content.contentId'),
        type: "event"
      },
      {
        module: WsEvents.EnumTelemetrymodules.EVENTS,
      }
    )
  }

  resumeContentData() {
    this.resumeContent.emit()
  }

}
