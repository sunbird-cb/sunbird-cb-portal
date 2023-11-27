import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils/src/public-api'
// tslint:disable
import _ from 'lodash'
// tslint:enable

import { NSKnowledgeResource } from '../../models/knowledge-resource.models'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-knowledge-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {
  @Input()
  tabsData!: NSKnowledgeResource.IKnowledgeResourceTab
  constructor(
    private activatedRoute: ActivatedRoute,
    private events: EventService,
    private translate: TranslateService,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!

      this.translate.use(lang)
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        console.log('onLangChange', event);
      });
    }
  }

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

  translateLetMenuName(menuName: string): string {
    const translationKey = 'knowledgeleftmenu.' + menuName.replace(/\s/g, "")
    return this.translate.instant(translationKey);
  }

}
