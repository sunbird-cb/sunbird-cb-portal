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
  previousSlug: any
  stateCount = 0
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
    // debugger
    this.state = this.alldiscussPage
  }

  widgetBackClick() {
    this.stateCount = this.stateCount - 1
    if (this.stateCount === 0 || this.stateCount === 1) {
      this.state = this.alldiscussPage
      this.previousSlug = ''
    } else {
      this.state = this.previousState
    }

    if (this.previousSlug) {
      this.slug = this.previousSlug
      this.state = this.tagAllDiscussPage
    }
  }

  stateChange(event: any) {
    // console.log(event)
    this.previousState = this.state
    // tslint:disable-next-line: no-increment-decrement
    this.stateCount++
    this.state = event.action
    if (event.action === this.detailsPage) {
      this.tid = event.tid
      this.slug = event.title
    }

    if (event.action === this.tagAllDiscussPage) {
      this.tid = event.tid
      this.slug = event.title
      this.previousSlug = event.title
    }
  }
}
