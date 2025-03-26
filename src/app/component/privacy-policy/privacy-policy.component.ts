import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {

  hideHeader = false

  constructor(private translate: TranslateService, private activatedRoute: ActivatedRoute) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const mode = params['mode']
      if (mode && mode === 'mobile') {
        this.hideHeader = true
      }
    })
  }

 changeLanguage(language: string) {
    this.translate.use(language)
 }
}
