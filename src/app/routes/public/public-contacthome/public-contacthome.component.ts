import { Component, OnInit } from '@angular/core'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import { environment } from 'src/environments/environment'
// import { DOCUMENT } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-public-contacthome',
  templateUrl: './public-contacthome.component.html',
  styleUrls: ['./public-contacthome.component.scss'],
})
export class PublicContacthomeComponent implements OnInit {
  contactUsMail = ''
  environment!: any
  meetLink = ''
  meetingDetail = ''
  karmayogiBharatLink = ''

  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar

  constructor(
    private configSvc: ConfigurationsService,
    private translate: TranslateService) {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    }

  ngOnInit() {
    this.environment = environment
    this.meetLink = environment.contactMeetLink
    this.meetingDetail = environment.meetingLinkDetail
    this.karmayogiBharatLink = environment.karmayogiBharatLink
    if (this.configSvc.instanceConfig) {
      this.contactUsMail = this.configSvc.instanceConfig.mailIds.contactUs
    }
  }

  translateHub(hubName: string): string {
    const translationKey =  hubName
    return this.translate.instant(translationKey)
  }

  preventData(event: any) {
    event.preventDefault()
  }

  // ngAfterViewInit() {
  //   var s = this.document.createElement("script")
  //   s.type = "text/javascript"
  //   s.src = "https://desk.zoho.in/portal/api/web/inapp/120349000000222059?orgId=60023043070"
  //   s.nonce = "{place_your_nonce_value_here}"
  //   this.elementRef.nativeElement.appendChild(s)

  //   var ss = this.document.createElement("script")
  //   ss.type = "text/javascript"
  //   ss.src = "https://desk.zoho.in/portal/api/feedbackwidget/120349000000212259?orgId=60023043070&displayType=popout"
  //   this.elementRef.nativeElement.appendChild(ss)
  // }

}
