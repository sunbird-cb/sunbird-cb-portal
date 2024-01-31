import { Component, OnInit } from '@angular/core'
import { BtnSettingsService } from '@sunbird-cb/collection'
@Component({
  selector: 'ws-font-setting',
  templateUrl: './font-setting.component.html',
  styleUrls: ['./font-setting.component.scss'],
})
export class FontSettingComponent implements OnInit {

  constructor(public btnSettingsSvc: BtnSettingsService) { }
  fontValue = 14
  ngOnInit() {
    console.log(localStorage.getItem('setting'))
    const fontClass = localStorage.getItem('setting')
    switch (fontClass) {
      case 'x-small-typography':
      this.fontValue = 10
      break
      case 'small-typography':
      this.fontValue = 12
      break
      case 'normal-typography':
      this.fontValue = 14
      break
      case 'large-typography':
      this.fontValue = 16
      break
      case 'x-large-typography':
        this.fontValue = 18
      break
    }
  }

  changeFont(fontSize: any) {
    let fontClass = 'small-typography'
    switch (fontSize.value) {
      case 10:
        fontClass = 'x-small-typography'
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass)
        break
      case 12:
        fontClass = 'small-typography'
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass)
        break
      case 14:
        fontClass = 'normal-typography'
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass)
        break
      case 16:
        fontClass = 'large-typography'
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass)
        break
      case 18:
        fontClass = 'x-large-typography'
        localStorage.setItem('setting' , fontClass)
        this.btnSettingsSvc.changeFont(fontClass)
        break
    }

  }

}
