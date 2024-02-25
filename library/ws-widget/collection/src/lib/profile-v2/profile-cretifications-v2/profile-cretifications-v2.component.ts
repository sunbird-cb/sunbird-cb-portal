import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material'
import { WidgetContentService } from '@sunbird-cb/collection'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import moment from 'moment'
import { ProfileCertificateDialogComponent } from '../profile-certificate-dialog/profile-certificate-dialog.component'
import { IProCert } from './profile-cretifications-v2.model'
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { ConfigurationsService, EventService, WsEvents } from '@sunbird-cb/utils'
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
  ) {
    super()
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

      dat = `Issued on ${moment(date).format('MMM YYYY')}`
    } else {
      dat = 'Certificate Not issued '
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
        if (value.issuedCertificates[0].identifier === element.identifier) {
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
}
