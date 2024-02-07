import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { EventService, WsEvents } from '@sunbird-cb/utils/src/public-api'
// tslint:disable-next-line
import _ from 'lodash'
import { Subscription } from 'rxjs'
import { NSProfileDataV3 } from '../../models/profile-v3.models'
import { StepService } from '../../services/step.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-l-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class SetupLeftMenuComponent implements OnInit, OnDestroy {
  @Input()
  tabsData!: NSProfileDataV3.IProfileTab[]
  private routerSubscription: Subscription | null = null
  currentStep = 1
  constructor(
    private events: EventService,
    private stepService: StepService,
    private translate: TranslateService
  ) {

    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
    this.stepService.currentStep.subscribe(cs => {
      this.currentStep = cs
    })
  }
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
  }

  public menuClick(tab: any) {
    this.stepService.skiped.next(false)
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.SIDE_MENU,
        id: `${_.camelCase(tab.name)}-menu`,
      },
      {},
    )
  }
  getLink(url: string) {
    // if (!this.stepService.currentStep.value.allowSkip) {
    return url
    // } return null
  }

  translateTo(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'profilehome.' + menuName.replace(/\s/g, '')
    return this.translate.instant(translationKey)
  }

}
