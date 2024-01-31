import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ConfigurationsService } from '@sunbird-cb/utils/src/public-api'

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
    private configService: ConfigurationsService
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

}
