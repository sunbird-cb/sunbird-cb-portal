import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-client-slider',
  templateUrl: './client-slider.component.html',
  styleUrls: ['./client-slider.component.scss'],
})
export class ClientSliderComponent implements OnInit {
  @Input() clientList: any
  clients: any
  noClients = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  constructor(private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.clients =  this.clientList
  }
}
