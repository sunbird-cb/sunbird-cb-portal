import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-widget-card-notify',
  templateUrl: './card-notify.component.html',
  styleUrls: ['./card-notify.component.scss'],
})
export class CardNotifyComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData: any
  showMsg = false

  constructor(
    private configSvc: ConfigurationsService,
    private router: Router,
  ) {
    super()
  }

  ngOnInit() {
    // competency based
    // if (this.configSvc.userProfileV2 &&
    //   this.configSvc.userProfileV2.competencies && this.configSvc.userProfileV2.competencies.length) {
    //   this.showMsg = false
    // }

    // topics based
    if (
      (this.configSvc.userProfileV2 && this.configSvc.userProfileV2.desiredTopics && this.configSvc.userProfileV2.desiredTopics.length) ||
      (this.configSvc.userProfileV2 && this.configSvc.userProfileV2.systemTopics && this.configSvc.userProfileV2.systemTopics.length)) {
      this.showMsg = false
    }
  }

  navigate() {
    // this.router.navigate(['/app/competencies/home'])
    this.router.navigate(['/app/setup'])
  }

}
