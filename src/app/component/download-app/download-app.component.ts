import { Component, Input, OnInit } from '@angular/core';
import { HomePageService } from '../../services/home-page.service';
@Component({
  selector: 'ws-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.scss']
})
export class DownloadAppComponent implements OnInit {
  @Input() popupClass:string = '';
  public isMobile = false;
  constructor(public homePageService: HomePageService) { }

  ngOnInit() {
    // console.log('popupClass',this.popupClass,window.innerWidth);
    if(window.innerWidth <= 1200) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  closePopup() {
    this.homePageService.closeDialogPop.next(true);
  }

}
