import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api';

@Component({
  selector: 'ws-app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
  // tslint:disable-next-line: no-host-metadata-property
  host: { class: 'flex flex-1' },
})
export class InsightsComponent implements OnInit {

  constructor(private translate: TranslateService,private langtranslations: MultilingualTranslationsService) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
  }

  ngOnInit() {
  }

}
