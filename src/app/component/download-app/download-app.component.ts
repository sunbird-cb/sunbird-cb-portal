import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ws-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.scss']
})
export class DownloadAppComponent implements OnInit {
  @Input() popupClass:string = '';
  public isMobile = false;
  constructor() { }

  ngOnInit() {
    console.log('popupClass',this.popupClass,window.innerWidth);
    if(window.innerWidth < 768) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

}
