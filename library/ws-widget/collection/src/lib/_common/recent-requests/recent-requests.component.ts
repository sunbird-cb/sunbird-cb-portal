import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-widget-recent-requests',
  templateUrl: './recent-requests.component.html',
  styleUrls: ['./recent-requests.component.scss'],
})
export class RecentRequestsComponent implements OnInit {

  @Input() recentRequests: any
  @Output() updateRequest: EventEmitter<any> = new EventEmitter()
  userInfo: any

  constructor(
    private translate: TranslateService,
    private configService: ConfigurationsService,
    private eventService: EventService
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.userInfo =  this.configService && this.configService.userProfile
  }

  handleRequest(reqObject: any, action: string): void {
    const payload = {
      userIdFrom: this.userInfo.userId,
      userNameFrom: this.userInfo.userId,
      userDepartmentFrom: this.userInfo.departmentName,
      userIdTo: reqObject.id,
      userNameTo: reqObject.id,
      userDepartmentTo: reqObject.departmentName,
      status: action,
    }

    reqObject.connecting = true
    this.updateRequest.emit({ payload, action, reqObject })
  }
  handleFindConnectionsTelemetry(): void {
   this.eventService.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.RECENT_CONNECTION_REQUEST,
        id: 'findConnections',
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
  }
}
