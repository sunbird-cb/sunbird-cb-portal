import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { WsEvents, EventService } from '@sunbird-cb/utils/src/public-api'
import { ConfigurationsService } from '@sunbird-cb/utils'
import { ActivatedRoute, Router } from '@angular/router'
/* tslint:disable*/
import _ from 'lodash'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit, OnDestroy {

  @Input()
  tabsData!: any
  constructor(
    private events: EventService,
    private configSvc: ConfigurationsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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

  public tourClick(tab: any) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
        id: `${_.camelCase(tab.name)}-menu`,
      },
      { },
    )
    if (tab.name == "getStartedTour") {
      this.router.navigate(['/page/home'], { relativeTo: this.activatedRoute, queryParamsHandling: 'merge' })
      this.configSvc.updateTourGuideMethod(false)
    }
  }

  translateLetMenuName(menuName: string): string {
    const translationKey = 'settingLeftMenu.' + menuName.replace(/\s/g, "")
    return this.translate.instant(translationKey);
  }

}
