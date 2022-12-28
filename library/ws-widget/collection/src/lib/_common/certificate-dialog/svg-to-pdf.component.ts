import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
// import { saveAs } from 'file-saver'
@Component({
  selector: 'ws-widget-svg-to-pdf',
  // tslint:disable-next-line: max-line-length
  template: ``,
})
export class SvgToPdfComponent implements AfterViewInit {
  @ViewChild('svg', { static: true }) svgElement!: ElementRef
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef

  ngAfterViewInit() {
    // Get the SVG element
    const svg = this.svgElement.nativeElement

    // Get the canvas element
    // const canvas = this.canvasElement.nativeElement
    const img = new Image()
    img.src = svg.replace(/\x3C/g, '<')
    img.width = 1200
    img.height = 700
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [img.width, img.height]
    const ctx = canvas.getContext('2d')
    // Draw the SVG onto the canvas
    if (ctx) {
      // ctx.drawSvg(svg.outerHTML, 0, 0)
      // // Get the data URL of the PDF
      // const pdfUrl = canvas.toDataURL()

      // // Use the data URL to create a PDF object
      // const pdf = new Blob([pdfUrl], { type: 'application/pdf' })

      // saveAs(pdf, 'certi.pdf')
    }

    // You can now use the PDF object, for example:
    // - Download it using the saveAs function from the FileSaver library
    // - Render it in an iframe
    // - Post it to a server using an HTTP client
  }
}
