import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { WidgetContentService } from '@sunbird-cb/collection'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import moment from 'moment'
import { ProfileCertificateDialogComponent } from '../profile-certificate-dialog/profile-certificate-dialog.component'
import { IProCert } from './profile-cretifications-v2.model'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'ws-widget-profile-cretifications-v2',
  templateUrl: './profile-cretifications-v2.component.html',
  styleUrls: ['./profile-cretifications-v2.component.scss'],
  /* tslint:disable */
  host: { class: 'flex flex-1' },
  /* tslint:enable */
})

// developing for old skill+certifications
export class ProfileCretificationsV2Component extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: IProCert
  @Output() certificateDialogOpen = new EventEmitter<string>()
  @HostBinding('id')
  public id = 'profile-cert-v2'
  certData: any
  defaultThumbnail = ''
  allCertificate: any = []
  certId: any

  constructor(
    private dialog: MatDialog,
    private contentSvc: WidgetContentService,
    private tocSvc: AppTocService,
    private configSvc: ConfigurationsService,
    private events: EventService,
    private translate: TranslateService
  ) {
    super()
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit(): void {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }
  }
  changeToDefaultImg($event: any) {
    $event.target.src = '/assets/instances/eagle/app_logos/default.png'
  }
  paDate(date: any): string {
    let dat
    if (date) {

      dat = `${this.translateTabName('Issued on')} ${moment(date).format('MMM YYYY')}`
    } else {
      // dat = 'Certificate Not issued '
      dat = this.translateTabName('certificateNotIssued')
    }
    return dat
  }

  downloadAllCertificate(data: any) {
    data.data.forEach((item: any) => {
      if (item.issuedCertificates !== null) {
        const certId = item.issuedCertificates[0].identifier
        this.contentSvc.downloadCert(certId).subscribe(response => {

          this.allCertificate.push({ identifier: item.issuedCertificates[0].identifier, dataUrl: response.result.printUri })

        })
      }
    })

  }

  downloadCert(data: any) {
if (data.length > 0) {
  this.certId = data[0].identifier
  this.contentSvc.downloadCert(this.certId).subscribe(response => {
    this.certData = response.result.printUri
  })
}
  }
  openCertificateDialog(value: any) {
    this.widgetData.certificates.forEach((element: any) => {
      if (value.issuedCertificates.length !== 0) {
        const certData = value.issuedCertificates
        certData.sort((a: any, b: any) => new Date(b.lastIssuedOn).getTime() - new Date(a.lastIssuedOn).getTime())
        if (certData && certData[0].identifier === element.identifier) {
          const cet = element.dataUrl
          const courseDoId = value.courseId
          const certId = element.identifier
          if (courseDoId) {
          this.tocSvc.fetchGetContentData(courseDoId).subscribe(res => {
            if (res.result) {
              const courseData = res.result
              this.raiseIntreactTelemetry()
              this.dialog.open(ProfileCertificateDialogComponent, {
                autoFocus: false,
                data: { cet, value, courseData, certId },
              })
            }
          })
        }
        }
      }
      // else{
      //   const cet = ''
      //   // this.dialog.open(ProfileCertificateDialogComponent, {
      //   //   autoFocus: false,
      //   //   data: {cet, value}
      //   // })
      // }
    })

  }
  raiseIntreactTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'view-certificate',
        subType: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      },
      {
        id: this.certId,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      })
  }
  translateTabName(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'profileCretificationsV2.' + menuName.replace(/\s/g, '')
    return this.translate.instant(translationKey)
  }
}
