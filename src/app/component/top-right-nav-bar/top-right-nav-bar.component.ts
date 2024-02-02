import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from './../dialog-box/dialog-box.component';

import { HomePageService } from '../../services/home-page.service';
import { DomSanitizer } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
import { DialogBoxComponent as ZohoDialogComponent } from '@ws/app/src/lib/routes/profile-v3/components/dialog-box/dialog-box.component';
const rightNavConfig = [
  {
    "id": 1,
    "section": "download",
    "active": true
  },
  {
    "id": 2,
    "section": "font-setting",
    "active": true
  },
  {
    "id": 3,
    "section": "help",
    "active": true
  },
  {
    "id": 4,
    "section": "profile",
    "active": true
  }
]



@Component({
  selector: 'ws-top-right-nav-bar',
  templateUrl: './top-right-nav-bar.component.html',
  styleUrls: ['./top-right-nav-bar.component.scss']
})
export class TopRightNavBarComponent implements OnInit {
  @Input() item: any;
  @Input() rightNavConfig: any;
  dialogRef: any;
  zohoHtml: any
  zohoUrl: any = '/assets/static-data/zoho-code.html'
  constructor(public dialog: MatDialog, public homePageService: HomePageService, private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.rightNavConfig = this.rightNavConfig.topRightNavConfig ? this.rightNavConfig.topRightNavConfig : rightNavConfig;
    // console.log('rightNavConfig',this.rightNavConfig)
    this.homePageService.closeDialogPop.subscribe((data: any) => {
      if (data) {
        this.dialogRef.close();
      }
    })

    this.http.get(this.zohoUrl, { responseType: 'text' }).subscribe(res => {
      // console.log(res, "res====")
      this.zohoHtml = this.sanitizer.bypassSecurityTrustHtml(res);      
    })

  }

  getZohoForm() {
   
    const dialogRef = this.dialog.open(ZohoDialogComponent, {
      width: '60%',
      data: {
        view: 'zohoform',
        value: this.zohoHtml
      }
    });
    dialogRef.afterClosed().subscribe(() => {
    });

    setTimeout(()=>{
      this.callXMLRequest();
    },0);
  }


  openDialog(): void {
    this.dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '1000px',
    });

    this.dialogRef.afterClosed().subscribe(() => {
    });
  }

  callXMLRequest() {
    var webFormxhr:any = {};
    webFormxhr = new XMLHttpRequest();
    webFormxhr.open('GET', 'https://desk.zoho.in/support/GenerateCaptcha?action=getNewCaptcha&_=' + new Date().getTime(), true);
            webFormxhr.onreadystatechange =  () => {
                if (webFormxhr.readyState  === 4 && webFormxhr.status === 200) {
                    try {
                        var response = (webFormxhr.responseText != null) ? JSON.parse(webFormxhr.responseText) : '';
                        // console.log('response', webFormxhr, response);
                        // console.log('response.captchaUrl', response.captchaUrl);
                        // console.log("response end=========")
                        let  zsCaptchaUrl:any = document.getElementById('zsCaptchaUrl');
                        if(zsCaptchaUrl) {
                          zsCaptchaUrl.src = response.captchaUrl;
                          zsCaptchaUrl.style.display = 'block';
                        }                        
                        let xJdfEaS:any = document.getElementsByName('xJdfEaS')[0];
                        xJdfEaS.value = response.captchaDigest;
                        let zsCaptchaLoading:any = document.getElementById('zsCaptchaLoading');
                        zsCaptchaLoading.style.display = 'none';
                        let zsCaptcha:any = document.getElementById('zsCaptcha')
                        zsCaptcha.style.display = 'block';
                        // console.log("response end=========")  
                        let refreshCaptcha:any = document.getElementById('refreshCaptcha');
                        if(refreshCaptcha) {
                          refreshCaptcha.addEventListener('click', ()=>{
                            this.callXMLRequest();
                          })
                        } 
                      } catch (e) {
 
                      }
                }
                
            };
 
            webFormxhr.send();
  }

}
