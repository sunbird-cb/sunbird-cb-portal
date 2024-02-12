import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils/src/public-api'

@Component({
  selector: 'ws-app-careers-pagination',
  templateUrl: './careers-pagination.component.html',
  styleUrls: ['./careers-pagination.component.scss'],
})
export class CareersPaginationComponent implements OnInit {

  @Input() pager: any
  @Output() changePage = new EventEmitter<any>(true)

  constructor(private translate: TranslateService,
              private langtranslations: MultilingualTranslationsService) {
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

  setPage(page: number) {
    this.changePage.emit(page)
  }

}
