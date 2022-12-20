import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import * as pdfjsLib from 'pdfjs-dist/webpack'
@Component({
  selector: 'ws-widget-certificate-dialog',
  templateUrl: './certificate-dialog.component.html',
  styleUrls: ['./certificate-dialog.component.scss'],
})
export class CertificateDialogComponent implements OnInit {

  url!: string
  constructor(
    public dialogRef: MatDialogRef<CertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit() {
    this.url = this.data.cet
  }

  dwonloadCert() {
    const a: any = document.createElement('a')
    a.href = this.data.cet
    a.download = 'Certificate'
    document.body.appendChild(a)
    a.style = 'display: none'
    a.click()
    a.remove()
  }
  dwonloadCertPng() {
    const uriData = this.data.cet
    const img = new Image()
    img.src = uriData
    img.width = 1200
    img.height = 700
    img.onload = () => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = [img.width, img.height]
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.imageSmoothingEnabled = true
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
  async dwonloadCertPdf() {
    // debugger
    let svg = this.data.cet
    if (svg) {
      svg = svg.replace(/data:image\/svg\+xml,/, '')
      svg = svg.replace(/\r?\n|\r/g, '').trim()
      const pdfDoc = await pdfjsLib.getDocument({ data: svg }).promise
      const page = await pdfDoc.getPage(1)
      const canvas = document.createElement('canvas')
      const canvasContext = canvas.getContext('2d')
      const viewport = page.getViewport({ scale: 1.0 })
      canvas.height = viewport.height
      canvas.width = viewport.width
      if (canvasContext) {
        await page.render({ canvasContext, viewport }).promise
        const dataUrl = canvas.toDataURL('application/pdf')
        const iframe = document.createElement('iframe')
        iframe.src = dataUrl
        document.body.appendChild(iframe)

        // or

        const link = document.createElement('a')
        link.href = dataUrl
        link.download = 'my-pdf.pdf'
        link.click()
      }
      // const canvas = document.createElement('canvas')
      // const context = canvas.getContext('2d')
      // if (context) {
      //   context.clearRect(0, 0, canvas.width, canvas.height)
      //   // canvg(canvas, svg)
      //   const imgData = canvas.toDataURL('image/png')
      //   const ppdf= pdfjsLib.PDFJS
      //   const a= new ppdf.PDFSinglePageViewer({params: {  }}})
      //   const pdf = await pdfjsLib.getDocument({ data: svg }).promise
      //   debugger
      //   console.log(pdf.getPage(1))
      //   // Generate PDF
      //   // const doc = new PDFJS.PDFViewer()
      //   // doc.addImage(imgData, 'PNG', 0, 0, 500, 500)
      //   // doc.save('Certificate.pdf')
      // }
    }
  }
}
// const pdfDoc = await pdfjsLib.getDocument({ data: this.data.cet }).promise
// const page = await pdfDoc.getPage(1)
// const canvas = document.createElement('canvas')
// const canvasContext = canvas.getContext('2d')
// const viewport = page.getViewport({ scale: 1.0 })
// canvas.height = viewport.height
// canvas.width = viewport.width
// if (canvasContext) {
//   await page.render({ canvasContext, viewport }).promise
//   const dataUrl = canvas.toDataURL('application/pdf')
//   const iframe = document.createElement('iframe')
//   iframe.src = dataUrl
//   document.body.appendChild(iframe)

//   // or

//   const link = document.createElement('a')
//   link.href = dataUrl
//   link.download = 'my-pdf.pdf'
//   link.click()
// }
