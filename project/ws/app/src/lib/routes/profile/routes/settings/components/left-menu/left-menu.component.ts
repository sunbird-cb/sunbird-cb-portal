import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ConfigurationsService , EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { ActivatedRoute, Router } from '@angular/router'
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
  tabsData!: any
  disableMenu = false
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
    }
  }

  ngOnInit(): void {
    let isNotMyUser = false
    let isIgotOrg = false
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.profileStatus) {
      isNotMyUser = this.configSvc.unMappedUser.profileDetails.profileStatus.toLowerCase() === 'not-my-user' ? true : false
    }
    if (this.configSvc && this.configSvc.unMappedUser
      && this.configSvc.unMappedUser.profileDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails
      && this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName) {
        isIgotOrg = this.configSvc.unMappedUser.profileDetails.employmentDetails.departmentName.toLowerCase() === 'igot' ? true : false
    }
    // let isIgotOrg = true
    if (isNotMyUser && isIgotOrg) {
      this.disableMenu = true
      // this.router.navigateByUrl('app/person-profile/me#profileInfo')
    } else {
      this.disableMenu = false
    }
    if(this.disableMenu) {
      this.tabsData = this.tabsData.map((item:any)=>{
        if(item.name === 'getStartedTour') {
          item['enabled'] = false
        }
        return item
      })
      console.log('this.tabsData ',this.tabsData )
    }

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
