import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-events-card',
  templateUrl: './events-card.component.html',
  styleUrls: ['./events-card.component.scss'],
})
export class EventsCardComponent implements OnInit {
  @Input() eventData: any

  constructor(private router: Router, private translate: TranslateService, private langtranslations: MultilingualTranslationsService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
   }

  ngOnInit() {
  }

  getEventDetails(eventID: any) {
    this.router.navigate([`/app/event-hub/home/${eventID}`])
  }

  translateLabels(label: string, type: any) {
    if (label) {
      return this.langtranslations.translateLabel(label, type, '')
    }

  }

}
