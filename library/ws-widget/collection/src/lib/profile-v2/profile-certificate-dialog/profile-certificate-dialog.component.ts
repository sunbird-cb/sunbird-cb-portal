import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Router } from '@angular/router'
// import { DomSanitizer } from '@angular/platform-browser'
// import * as svg from 'save-svg-as-png';
// import domtoimage from 'dom-to-image';
// import FileSaver from 'file-saver';
// import { WidgetContentService } from '@sunbird-cb/collection/src/public-api';
// var domtoimage = require('dom-to-image');
// var download = require('downloadjs');

@Component({
  selector: 'ws-widget-app-profile-certificate-dialog',
  templateUrl: './profile-certificate-dialog.component.html',
  styleUrls: ['./profile-certificate-dialog.component.scss'],
})
export class ProfileCertificateDialogComponent implements OnInit {

  // @ViewChild('images',{
  // static: false
  // }) images: { nativeElement: Node; } | null | undefined;
  // certLink: any
  url!: string
  courseImg: any
  courseName: any
  courseID: any
  author!: string
  userID: any

  navUrl: any = ''
  shareUrl = 'https://medium.com/@garfunkel61/angular-simplest-solution-for-social-sharing-feature-6f00d5d99c5e'

  constructor(
    private router: Router,
    // private sanitizer: DomSanitizer,
    // private contentSvc: WidgetContentService,
    public dialogRef: MatDialogRef<ProfileCertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.url = this.data.cet
    // this.shareUrl = this.url
    // console.log(this.data.value, this.data.value.content.appIcon)
    this.courseImg = this.data.value.content.appIcon
    this.courseID = this.data.value.contentId
    this.userID = this.data.value.userId
    this.createNavigationUrl()

    // this.downloadCertInLocal(this.url)
  }

  private createNavigationUrl() {
    // let searchParams = new URLSearchParams();

    //     const sanit = this.sanitizer.bypassSecurityTrustUrl(`${this.url}`)
    // const url = this.data.cet
    // const url = 'https://igot.blob.core.windows.net/public/content/do_113410093720715264148/artifact
    // /do_113410070261366784147_1636971467537_rupixencompbgycq3zx0unsplash1636971467478.thumb.jpg'
    // searchParams.set('url', url);
    // console.log("url",sanit);
    // const url = `https://igot-dev.in/share/toc/${this.userID}/${this.courseID}`;
    // const a = this.sanitizer.bypassSecurityTrustUrl(
    //   `${this.data.cet}`)
    // searchParams.set('url', a);
    // console.log(a);
    this.navUrl = `https://www.linkedin.com/shareArticle?title=I%20earned%20a%20certficiation&url=${this.data.value.content.appIcon}`
    // this.navUrl =  url
    // console.log("navurl", this.navUrl)
  }

  navigate(data: any) {
    this.router.navigateByUrl(`/app/toc/${data}/overview`)
  }

  dwonloadCert() {
    const a: any = document.createElement('a')
    a.href = this.data.cet
    a.download = 'Certificate'
    document.body.appendChild(a)
    a.style = 'display: none'
    a.click()
    a.remove()

    // download as jpge

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
  shareCert() {
    // svg.svgAsPngUri(document.getElementById('certificate'), {}, (uri:any) => {
    //   console.log('png base 64 encoded', uri);
    // });
    // console.log("share")
    // const node = document.getElementById('certificate');
    // console.log("node", node)
    // if (node !== null) {
    //   domtoimage.toJpeg(node)
    //     .then((dataUrl: any) => {
    //       var link = document.createElement('a');
    //       console.log(link);
    //       link.setAttribute('type', 'hidden');
    //       link.download = 'my-image-name.jpeg';
    //       link.href = dataUrl;
    //       document.body.appendChild(link);
    //       link.click();
    //       link.remove();
    //       // link.download = 'my-image-name.jpeg';
    //       // link.href = dataUrl;
    //       this.contentSvc.pushJpgeCert(dataUrl).subscribe(
    //         (res) => {
    //           console.log(res)
    //         }
    //       )
    //       // link.click();
    //     });

    //   // let link = document.createElement('a');

    // }

    // console.log(navUrl);

    return window.open(this.navUrl, '_blank')
  }

//   downloadCertInLocal(cert:any){
// console.log(this.images);

// const img = new Image()
// const url = cert
// let link = ''
// let cet = ''
// img.onload = function () {
//   const canvas: any = document.getElementById('certCanvas') || {}
//   const ctx = canvas.getContext('2d')
//   const imgWidth = img.width
//   const imgHeight = img.height
//   canvas.width = imgWidth
//   canvas.height = imgHeight
//   ctx.drawImage(img, 0, 0, imgWidth, imgHeight)
//   let imgURI = canvas
//     .toDataURL('image/jpeg')

//   imgURI = decodeURIComponent(imgURI.replace('data:image/jpeg,', ''))
//   cet = imgURI
//   const arr = imgURI.split(',')
//   const mime = arr[0].match(/:(.*?);/)[1]
//   const bstr = atob(arr[1])
//   let n = bstr.length
//   const u8arr = new Uint8Array(n)
//   while (n) {
//     n = n - 1
//     u8arr[n] = bstr.charCodeAt(n)
//   }
//   const blob = new Blob([u8arr], { type: mime })
//   link = URL.createObjectURL(blob)
// console.log(link);
//   localStorage.setItem('certificate.jpeg', link)
//   // FileSaver.saveAs(blob, 'certificate.jpeg')
//   // if (localStorage.getItem(`certificate_downloaded_${self.content ? self.content.identifier : ''}`)) {
//   //   localStorage.removeItem(`certificate_downloaded_${self.content ? self.content.identifier : ''}`)
//   // }
// }
// setTimeout(() => {

//   this.navUrl = "https://www.linkedin.com/shareArticle?title=I%20earned%20a%20certficiation&url=" + link
//   console.log(this.navUrl)
// }, 5000);

// img.src = url

// console.log(img)
//   }
}
