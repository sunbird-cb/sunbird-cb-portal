import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService, EventService, UtilityService } from '@sunbird-cb/utils-v2'
import { NsCardContent } from '../card-content-v2/card-content-v2.model'

/* tslint:disable*/
import _ from 'lodash'
import moment from 'moment'

@Component({
  selector: 'ws-widget-card-event-hub',
  templateUrl: './card-event-hub.component.html',
  styleUrls: ['./card-event-hub.component.scss']
})
export class CardEventHubComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<NsCardContent.ICard> {
  @Input() widgetData!: NsCardContent.ICard
  @HostBinding('id')
  public id = `ws-card_${Math.random()}`
  originalEvents: any = []
  todaysEvents: any = []
  defaultThumbnail = ''
  showIsMode = false
  isEventLive = false
  isEventRecording = false

  isIntranetAllowedSettings = false

  constructor(
    private events: EventService,
    private configSvc: ConfigurationsService,
    private utilitySvc: UtilityService,
    private snackBar: MatSnackBar,
  ) {
    super()
  }

  ngOnInit() {
    // this.widgetInstanceId=his.id
    this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed

    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
    if (this.widgetData && this.widgetData.context && (this.widgetData.context.pageSection === 'todaysevents' 
      || this.widgetData.context.pageSection === 'liveEvents' || this.widgetData.context.pageSection === 'keySpeakersEvents') ) {
      if (this.widgetData.content) {
        const eventDate = this.events.customDateFormat(this.widgetData.content.event.startDate, this.widgetData.content.event.startTime)
        const eventendDate = this.events.customDateFormat(this.widgetData.content.event.endDate, this.widgetData.content.event.endTime)
        const now = new Date()
        const today = moment(now).format('YYYY-MM-DD HH:mm')
        if (moment(today).isBetween(eventDate, eventendDate)) {
          this.isEventRecording = false
          this.isEventLive = true
          if (today >= eventendDate) {
            if (this.widgetData.content.event.recordedLinks && this.widgetData.content.event.recordedLinks.length > 0) {
              this.isEventRecording = true
              this.isEventLive = false
            }
          }
        } else if (today >= eventendDate) {
          this.isEventRecording = true
          this.isEventLive = false
        }
      }
    }
  }

  ngOnDestroy() {
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: `${this.widgetType}-${this.widgetSubType}`,
        id: `${_.camelCase(this.widgetData.content.primaryCategory)}-card`,
      },
      {
        id: this.widgetData.content.identifier,
        type: this.widgetData.content.primaryCategory,
        //context: this.widgetData.context,
        rollup: {},
        ver: `${this.widgetData.content.version}${''}`,
      },
      {
        pageIdExt: `${_.camelCase(this.widgetData.content.primaryCategory)}-card`,
        module: _.camelCase(this.widgetData.content.primaryCategory),
      })
  }


  get showIntranetContent() {
    if (this.widgetData.content.isInIntranet && this.utilitySvc.isMobile) {
      return !this.isIntranetAllowedSettings
    }
    return false
  }

  showSnackbar() {
    if (this.showIntranetContent) {
      this.snackBar.open('Content is only available in intranet', 'X', { duration: 2000 })
    } else if (!this.isLiveOrMarkForDeletion) {
      this.snackBar.open('Content may be expired or deleted', 'X', { duration: 2000 })
    }
  }

  get isLiveOrMarkForDeletion() {
    if (
      !this.widgetData.content.status ||
      this.widgetData.content.status === 'Live' ||
      this.widgetData.content.status === 'MarkedForDeletion'
    ) {
      return true
    }
    return false
  }
}