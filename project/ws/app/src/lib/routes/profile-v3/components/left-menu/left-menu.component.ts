import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { EventService, WsEvents } from '@sunbird-cb/utils/src/public-api'
/* tslint:disable*/
import _ from 'lodash'
import { NSProfileDataV3 } from '../../models/profile-v3.models'

@Component({
  selector: 'ws-app-l-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class SetupLeftMenuComponent implements OnInit, OnDestroy {
  @Input()
  tabsData!: NSProfileDataV3.IProfileTab[]
  constructor(
    private events: EventService,
  ) { }

  ngOnInit(): void {

  }
  ngOnDestroy() {

  }

  public menuClick(tab: any) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
        id: `${_.camelCase(tab.name)}-menu`,
      },
      { },
    )
  }

}
