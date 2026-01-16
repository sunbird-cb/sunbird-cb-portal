import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { WsEvents, EventService } from '@sunbird-cb/utils-v2'
/* tslint:disable*/
import _ from 'lodash'

@Component({
  selector: 'ws-app-curated-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {
  @Input() unseen = 0
  @Input() tabsData: any = []
  @Output() currentTab = new EventEmitter<any>()

  constructor(
    private events: EventService,
  ) { }

  ngOnInit(): void {
  }

  onChangeTab(tab: any) {
    this.currentTab.emit(tab)
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
        id: tab.identifier || '',
      },
      { },
    )
  }
}
