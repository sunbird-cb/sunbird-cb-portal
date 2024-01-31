import { Component, OnInit, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'ws-widget-update-posts',
  templateUrl: './update-posts.component.html',
  styleUrls: ['./update-posts.component.scss'],
})

export class UpdatePostsComponent implements OnInit {

    @Input() updateConfig: any
    @Input() updatesPosts: any
    @Input() isMobile = false

    constructor(private translate: TranslateService) {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    }

    ngOnInit() { }
}
