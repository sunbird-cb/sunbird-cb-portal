import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2';
import * as _ from 'lodash';
import { SettingsService } from '../../settings.service'

@Component({
  selector: 'ws-app-left-menu-item',
  templateUrl: './left-menu-item.component.html',
  styleUrls: ['./left-menu-item.component.scss']
})
export class LeftMenuItemComponent implements OnChanges {
  //#region (global variables)
  //#region (input and output )
  @Input() item: any;
  //#endregion (input and output )

  disableMenu = false
  //#endregion (global variables)

  //#region (constructor)
  constructor(
    private events: EventService,
    private configSvc: ConfigurationsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private settingsService: SettingsService,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }
  //#endregion (constructor)

  ngOnChanges(): void {
    const profileStatus = _.get(this.configSvc, 'unMappedUser.profileDetails.profileStatus', '').toLowerCase();
    const departmentName = _.get(this.configSvc, 'unMappedUser.profileDetails.employmentDetails.departmentName', '').toLowerCase();
    const isNotMyUser = profileStatus === 'not-my-user';
    const isIgotOrg = departmentName === 'igot';
    this.disableMenu = isNotMyUser && isIgotOrg;
    if (this.disableMenu && _.get(this.item, 'name') === 'getStartedTour') {
      this.item['enabled'] = false;
    }
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

  public toggleOpen(item: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    item.open = !item.open;
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
    else if (tab.name == "resetPassword") {
      this.resetPassword()
    }
  }

  translateLetMenuName(menuName: string): string {
    const translationKey = 'settingLeftMenu.' + menuName.replace(/\s/g, "")
    return this.translate.instant(translationKey);
  }

  resetPassword() {
    this.settingsService.resetPassword().subscribe({
      next: (response: any) => {
        if (response?.params?.status === 'success') {
          const link = response?.result?.result?.link
          window.open(link, '_blank')
        }
      }
    })
  }

}
