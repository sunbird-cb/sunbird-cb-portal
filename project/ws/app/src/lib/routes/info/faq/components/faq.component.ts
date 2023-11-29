import { Component, OnInit } from '@angular/core'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  showSideMenu: Boolean = true
  constructor(private translate: TranslateService,) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = localStorage.getItem('websiteLanguage')!
     
      this.translate.use(lang)
      console.log('current lang ------', this.translate.getBrowserLang())
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        console.log('onLangChange', event);
      });
    }
   }

  ngOnInit() {
  }
  
  translateHub(hubName: string): string {
    const translationKey =  hubName;
    return this.translate.instant(translationKey);
  }

  showMenuButton() {
    this.showSideMenu = this.showSideMenu ? false : true
  }
  closeNav() {
    this.showSideMenu = this.showSideMenu ? false : true
  }
}
