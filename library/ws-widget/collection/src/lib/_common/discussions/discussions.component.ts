import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'ws-widget-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.scss'],
})

export class DiscussionsComponent implements OnInit {

  @Input() discussion: any
  @Input() count: any
  @Input() trend = false
  countArr: any[] = []
  dataToBind: any

  constructor(private router: Router, private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      let lang = JSON.stringify(localStorage.getItem('websiteLanguage'))
      lang = lang.replace(/\"/g, '')
      this.translate.use(lang)
    }
  }

  ngOnInit() {
    this.countArr =  this.count === 2 ? [1, 2] : [1, 2, 3]
  }

  handleSelectedDiscuss(discussData: any, trend: boolean): void {
    this.router.navigateByUrl(`/app/discussion-forum/topic/${ trend ? discussData.slug : discussData.topic.slug }?page=home`)
  }
}
