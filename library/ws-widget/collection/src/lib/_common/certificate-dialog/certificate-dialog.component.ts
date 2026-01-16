import { Component, Inject, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { jsPDF } from 'jspdf'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ws-widget-certificate-dialog',
  templateUrl: './certificate-dialog.component.html',
  styleUrls: ['./certificate-dialog.component.scss'],
   /* tslint:disable */
   host: { class: 'certificate-inner-dialog-panel' },
   /* tslint:enable */
})
export class CertificateDialogComponent implements OnInit {
  url!: string
  navUrl = ''
  constructor(
    private events: EventService,
    public dialogRef: MatDialogRef<CertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.url = this.data.cet
    // tslint:disable-next-line:max-line-length
    this.navUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${environment.contentHost}/apis/public/v8/cert/download/${this.data.certId}`
  }

  downloadCert() {
    this.raiseIntreactTelemetry('svg')
    const a: any = document.createElement('a')
    a.href = this.data.cet
    a.download = 'Certificate'
    document.body.appendChild(a)
    a.style = 'display: none'
    a.click()
    a.remove()
  }

  downloadCertPng() {
    this.raiseIntreactTelemetry('png')
    const uriData = this.data.cet
    const img = new Image()
    img.src = uriData
    img.width = 1820
    img.height = 1000
    img.onload = () => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = [img.width, img.height]
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // ctx.imageSmoothingEnabled = true
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const a = document.createElement('a')
        const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
        a.href = canvas.toDataURL('image/png', quality)
        a.download = 'Certificate'
        a.append(canvas)
        a.click()
        a.remove()
      }
    }
  }
  async downloadCertPdf() {
    this.raiseIntreactTelemetry('pdf')
    const uriData = this.data.cet
    const img = new Image()
    img.src = uriData
    img.width = 1820
    img.height = 1000
    img.onload = () => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = [img.width, img.height]
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
        const dataImg = canvas.toDataURL('application/pdf', quality)
        const pdf = new jsPDF('landscape', 'px', 'a4')

        // add the image to the PDF
        pdf.addImage(dataImg, 10, 20, 600, 350)

        // download the PDF
        pdf.save('Certificate.pdf')
      }
    }
  }

  shareCert() {
    this.raiseShareIntreactTelemetry('share')
    return window.open(this.navUrl, '_blank')
  }

  raiseShareIntreactTelemetry(type?: string, action?: string) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: `${type}-${WsEvents.EnumInteractSubTypes.CERTIFICATE}`,
        subType:  action ? action : '',
      },
      {
        id: this.data.certId,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      }
    )
  }

  raiseIntreactTelemetry(action?: string) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'download-certificate',
        subType: action ? action : '',
      },
      {
        id: this.data.certId,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      }
    )
  }

}
