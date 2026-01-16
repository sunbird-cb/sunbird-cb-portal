import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2';

@Component({
  selector: 'ws-app-events-home-v2',
  templateUrl: './events-home-v2.component.html',
  styleUrls: ['./events-home-v2.component.scss']
})
export class EventsHomeV2Component implements OnInit {
  isFullScreen: boolean = false

  constructor(
    private router: Router,
    private langtranslations: MultilingualTranslationsService,
    private translateService: TranslateService,
  ) {
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      this.translateService.setDefaultLang('hi')
      if (localStorage.getItem('websiteLanguage')) {
        this.translateService.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translateService.use(lang)
      }
    })
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isFullScreen = event.url.includes('home/do_')
      }
    })
  }

}
