import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils/src/public-api'
import { NSProfileDataV3 } from '../../models/profile-v3.models';
// tslint:disable
import _ from 'lodash'
//

@Component({
  selector: 'ws-app-profile-v3-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {
  @Input()
  tabsData!: NSProfileDataV3.IProfileTab

  constructor(
    private activatedRoute: ActivatedRoute,
    private events: EventService,
  ) { }

  ngOnInit() {
  }

  public isLinkActive(url: string): boolean {
    return (this.activatedRoute.snapshot.fragment === url)
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

