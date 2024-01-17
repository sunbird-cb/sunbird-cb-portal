import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { NSNetworkDataV2 } from '../../models/network-v2.model'
import { EventService, WsEvents } from '@sunbird-cb/utils/src/public-api'
/* tslint:disable*/
import _ from 'lodash'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit, OnDestroy {

  @Input()
  tabsData!: NSNetworkDataV2.IProfileTab
  constructor(
    private events: EventService,
    private translate: TranslateService,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
   }

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

  translateLabels(label: string, type: any) {
    label = label.replace(/\s/g, "")
    const translationKey = type + '.' +  label;
    return this.translate.instant(translationKey);
  }



}
