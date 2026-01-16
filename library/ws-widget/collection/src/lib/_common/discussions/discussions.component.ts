import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
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

  constructor(private router: Router, private translate: TranslateService, private eventService: EventService) {
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

  handleSelectedDiscuss(discussData: any, context: string | boolean): void {
    const subType = context && context === 'my-discussions' ? 'my-discussions' : 'trending-discussions'
    let slug = (discussData && discussData.slug) ? discussData.slug : ''
    if (!slug && discussData && discussData.topic && discussData.topic.slug) {
      slug = discussData.topic.slug
    }
    this.router.navigateByUrl(`/app/discussion-forum/topic/${slug}?page=home`)
    this.eventService.raiseInteractTelemetry(
      {
        subType,
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'card-content',
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.HOME,
      }
    )
  }
}
