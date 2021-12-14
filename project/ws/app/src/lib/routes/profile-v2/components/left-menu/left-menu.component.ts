import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NSProfileDataV2 } from '../../models/profile-v2.model'
import { WsEvents, EventService } from '@sunbird-cb/utils/src/public-api'
/* tslint:disable*/
import _ from 'lodash'

@Component({
  selector: 'app-profile-v2-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit, OnDestroy {

  @Input()
  tabsData!: NSProfileDataV2.IProfileTab
  constructor(
    private activatedRoute: ActivatedRoute,
    private events: EventService,
  ) { }

  ngOnInit(): void {

  }
  public isLinkActive(url: string): boolean {
    return (this.activatedRoute.snapshot.fragment === url)
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
