import { Component, OnInit } from '@angular/core';
import { BtnSettingsService } from '@sunbird-cb/collection'
@Component({
  selector: 'ws-font-setting',
  templateUrl: './font-setting.component.html',
  styleUrls: ['./font-setting.component.scss']
})
export class FontSettingComponent implements OnInit {

  constructor(public btnSettingsSvc: BtnSettingsService) { }

  ngOnInit() {
  }

  changeFont(fontSize:any) {
    console.log('fontSize',fontSize.value)
    let fontClass = 'small-typography';
    switch(fontSize.value) {
      case 10:
        fontClass = 'x-small-typography';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break;
      case 12:
        fontClass = 'small-typography';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break;
      case 14:
        fontClass = 'normal-typography';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break;
      case 16:
        fontClass = 'large-typography';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break;
      case 18:
        fontClass = 'x-large-typography';
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass) 
        break
    }
    
  }

}
