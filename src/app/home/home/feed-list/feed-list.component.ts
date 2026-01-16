import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UtilityService, EventService, WsEvents  } from '@sunbird-cb/utils-v2'

/* tslint:disable */
import _ from 'lodash'
/* tslint:enable */
@Component({
  selector: 'ws-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
})
export class FeedListComponent implements OnInit {
  contentStripData = {}
  isMobile = false
  @Input() widgetData: any
  @Input() providerId: string = ''
  
  @Output() telemetryRaisedLibrary = new EventEmitter()
  isTelemetryRaised = false
  constructor(private activatedRoute: ActivatedRoute,
              private events: EventService, private utilitySvc: UtilityService) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.data.pageData && this.activatedRoute.snapshot.data.pageData.data) {
      this.contentStripData = this.activatedRoute.snapshot.data.pageData.data || []
    }
    this.isMobile = this.utilitySvc.isMobile
  }

  raiseTelemetryInteratEvent(event: any) {
    this.telemetryRaisedLibrary.emit(event)
  }

  raiseTelemetry(name: string, subtype: string) {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: subtype,
        id: `${_.kebabCase(name).toLocaleLowerCase()}`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
  }

}
