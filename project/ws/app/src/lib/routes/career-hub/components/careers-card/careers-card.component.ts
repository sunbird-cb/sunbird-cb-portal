import { Component, OnInit, Input } from '@angular/core'
import { NSDiscussData } from '../../../discuss/models/discuss.model'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-app-careers-card',
  templateUrl: './careers-card.component.html',
  styleUrls: ['./careers-card.component.scss'],
})
export class CareersCardComponent implements OnInit {
  @Input()
  discuss!: NSDiscussData.IDiscussionData

  constructor(private router: Router, private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService) {
    this.langtranslations.languageSelectedObservable.subscribe((data: any) => {
      // tslint:disable
      console.log("daata -----------" , data)
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })
   }

  ngOnInit() {
  }

  getCareer() {
    this.router.navigate([`/app/careers/home/${this.discuss.tid}/${this.discuss.title}`])
  }

}
