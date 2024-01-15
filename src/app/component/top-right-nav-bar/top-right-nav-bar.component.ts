import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogBoxComponent } from './../dialog-box/dialog-box.component';
import { HomePageService } from '../../services/home-page.service';
import {DomSanitizer} from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
const rightNavConfig = [
  {
    "id":1,
    "section":"download",
    "active": true
  },
  {
    "id":2,
    "section":"font-setting",
    "active": true
  },
  {
    "id":3,
    "section":"help",
    "active": true
  },
  {
    "id":4,
    "section":"profile",
    "active": true
  }
]

const API_END_POINTS = {
  FETCH_ZOHO_FORM: 'src\zoho-code.html',
} 
@Component({
  selector: 'ws-top-right-nav-bar',
  templateUrl: './top-right-nav-bar.component.html',
  styleUrls: ['./top-right-nav-bar.component.scss']
})
export class TopRightNavBarComponent implements OnInit {
  @Input() item:any;
  @Input() rightNavConfig:any;
  dialogRef:any;
  zohoForm:any
  constructor(public dialog: MatDialog,  public homePageService: HomePageService, private http: HttpClient, private sanitizer:DomSanitizer    ) { }

   ngOnInit() {
    // this.zohoForm = 'src\zoho-code.html'
    

    this.rightNavConfig = this.rightNavConfig.topRightNavConfig ? this.rightNavConfig.topRightNavConfig : rightNavConfig;
    // console.log('rightNavConfig',this.rightNavConfig)
    this.homePageService.closeDialogPop.subscribe((data:any)=>{
      if(data) {
        this.dialogRef.close();
      }
      
    })

    this.http.get('src/zoho-code.txt',{responseType:'text'}).subscribe(res=>{
      console.log(res, "resp=")
      this.zohoForm = this.sanitizer.bypassSecurityTrustHtml(res);
    })
    console.log(this.zohoForm, "zohoForm=")

    



    // this.http.get<any>(`${API_END_POINTS.FETCH_ZOHO_FORM}`).subscribe((data:any)=> {
    //   // this.zohoForm = data
    //   console.log(data, "data=========")
    // })

   

  }

  // async getZohoData() {
  //   this.zohoForm = await this.getZohoFormData().toPromise().catch(_error => {})  
  // }

  getZohoFormData():any {
     this.http.get<any>(`${API_END_POINTS.FETCH_ZOHO_FORM}`).subscribe((data:any)=> {
      // this.zohoForm = data
      console.log(data, "data=========")
    })
  }

  ngOnChanges() {

  }


  getZohoForm() {

  }

  openDialog(): void { 
    this.dialogRef = this.dialog.open(DialogBoxComponent, { 
      width: '1000px', 
    }); 
  
    this.dialogRef.afterClosed().subscribe(() => { 
    }); 
  } 
 
}
