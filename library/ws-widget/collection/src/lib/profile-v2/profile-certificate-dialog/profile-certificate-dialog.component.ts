import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Router } from '@angular/router'
// import { DomSanitizer } from '@angular/platform-browser'
// import * as svg from 'save-svg-as-png';
// import domtoimage from 'dom-to-image';
// import { WidgetContentService } from '@sunbird-cb/collection/src/public-api';
// var domtoimage = require('dom-to-image');
// var download = require('downloadjs');

@Component({
  selector: 'ws-widget-app-profile-certificate-dialog',
  templateUrl: './profile-certificate-dialog.component.html',
  styleUrls: ['./profile-certificate-dialog.component.scss'],
})
export class ProfileCertificateDialogComponent implements OnInit {

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
    a.download = 'çertificate'
    document.body.appendChild(a)
    a.style = 'display: none'
    a.click()
    a.remove()

    // download as jpge

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
}
