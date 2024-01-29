import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'

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
      let lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
   }

  ngOnInit() {
  }

  getEventDetails(eventID: any) {
    this.router.navigate([`/app/event-hub/home/${eventID}`])
  }


  translateLabels(label: string, type: any) {
    return this.langtranslations.translateLabel(label, type, '')
  }

}
