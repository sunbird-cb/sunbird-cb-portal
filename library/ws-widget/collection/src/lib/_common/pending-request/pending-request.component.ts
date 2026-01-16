import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'ws-widget-pending-request',
  templateUrl: './pending-request.component.html',
  styleUrls: ['./pending-request.component.scss'],
})

export class PendingRequestComponent implements OnInit {
  @Input() pendingRequestData: any
  @Input() isLoading = true
  constructor(private router: Router, private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
  }

  navigateTo() {
    this.router.navigateByUrl('app/network-v2/connection-requests?page=people_connection_request')
  }

}
