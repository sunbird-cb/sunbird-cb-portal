import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ws-app-gyaan-karmayogi-home',
  templateUrl: './gyaan-karmayogi-home.component.html',
  styleUrls: ['./gyaan-karmayogi-home.component.scss']
})
export class GyaanKarmayogiHomeComponent implements OnInit {

  constructor( public translate: TranslateService,) { 
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
  }
  translateLetMenuName(menuName: string): string {
    // tslint:disable-next-line: prefer-template
    const translationKey = 'gyaanKarmayogi.' + menuName.replace(/\s/g, '')
    return this.translate.instant(translationKey)
  }
}
