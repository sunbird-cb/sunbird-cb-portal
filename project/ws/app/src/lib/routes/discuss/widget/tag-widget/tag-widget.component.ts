import { Component, Inject } from '@angular/core'
import { ConfigService, EventsService, NavigationServiceService, DiscussionService, BaseWrapperComponent } from '@sunbird-cb/discussions-ui-v8'

@Component({
  selector: 'app-tag-widget',
  templateUrl: './tag-widget.component.html',
  styleUrls: ['./tag-widget.component.scss'],
})

export class TagWidgetComponent extends BaseWrapperComponent {

  detailsToggle = true
  category = 'category'
  detailsPage = 'categoryDetails'
  tagAllDiscussPage =  'tagAllDiscuss'
  homePage = 'categoryHome'
  tid!: number
  slug!: string
  context: any = { categories: { result: [] } }
  categoryId: any
  alldiscussPage = 'alldiscuss'
  previousState: any

  constructor(
    @Inject(ConfigService)
    configSvc: ConfigService,
    @Inject(DiscussionService)
    discussionService: DiscussionService,
    @Inject(NavigationServiceService)
    navigationServiceService: NavigationServiceService,
    @Inject(EventsService)
    eventService: EventsService) {
    super(navigationServiceService, eventService, configSvc, discussionService)
  }
  // @Input() config

  wrapperInit() {
    this.state = this.alldiscussPage
  }

  widgetBackClick() {
    this.state = this.alldiscussPage
  }

  stateChange(event: any) {
    // debugger
    // console.log(event)
    this.previousState = this.state
    this.state = event.action
    if (event.action === this.detailsPage) {
      this.tid = event.tid
      this.slug = event.title
    }

    if (event.action === this.tagAllDiscussPage) {
      this.tid = event.tid
      this.slug = event.title
    }
  }
}
