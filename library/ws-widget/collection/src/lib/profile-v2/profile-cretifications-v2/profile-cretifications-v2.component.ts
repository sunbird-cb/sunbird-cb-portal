import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material'
import { WidgetContentService } from '@sunbird-cb/collection'
import { WidgetBaseComponent, NsWidgetResolver } from '@sunbird-cb/resolver'
import moment from 'moment'
import { ProfileCertificateDialogComponent } from '../profile-certificate-dialog/profile-certificate-dialog.component'
import { IProCert } from './profile-cretifications-v2.model'
// import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'

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
    // private tocSvc: AppTocService,
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
         // code reverted from 4.8.5 Ticket No:- 100759
        //   const courseDoId = value.courseId
        //   if (courseDoId) {
        //   this.tocSvc.fetchGetContentData(courseDoId).subscribe(res => {
        //     if (res.result) {
        //       const courseData = res.result
        //       this.dialog.open(ProfileCertificateDialogComponent, {
        //         autoFocus: false,
        //         data: { cet, value, courseData },
        //       })
        //     }
        //   })
        // }
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
