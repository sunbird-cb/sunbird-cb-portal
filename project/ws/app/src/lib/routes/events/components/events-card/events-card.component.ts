import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-app-events-card',
  templateUrl: './events-card.component.html',
  styleUrls: ['./events-card.component.scss'],
})
export class EventsCardComponent implements OnInit {
  @Input() eventData: any

  constructor(private router: Router, private translate: TranslateService) {
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
    console.log(label)
    label = label.replace(/\s/g, "").toLocaleLowerCase()
    const translationKey = type + '.' +  label;
    return this.translate.instant(translationKey);
  }

}
