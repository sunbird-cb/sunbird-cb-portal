import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material'
import { WidgetContentService } from '@sunbird-cb/collection'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import moment from 'moment'
import { ProfileCertificateDialogComponent } from '../profile-certificate-dialog/profile-certificate-dialog.component'
import { IProCert } from './profile-cretifications-v2.model'

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
  allCertificate: any = []

  constructor(
    private dialog: MatDialog,
    private contentSvc: WidgetContentService,
  ) {
    super()
  }

  ngOnInit(): void {
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
  const certId = data[0].identifier
  this.contentSvc.downloadCert(certId).subscribe(response => {
    this.certData = response.result.printUri
  })
}
  }
  openCertificateDialog(value: any) {
    this.widgetData.certificates.forEach((element: any) => {
      if (value.issuedCertificates.length !== 0) {
        if (value.issuedCertificates[0].identifier === element.identifier) {
          const cet = element.dataUrl
          this.dialog.open(ProfileCertificateDialogComponent, {
            autoFocus: false,
            data: { cet, value },
          })
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

}
