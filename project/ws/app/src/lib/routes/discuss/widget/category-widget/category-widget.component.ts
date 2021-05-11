import { Component, Inject, Input, OnInit } from '@angular/core'
import { ConfigService, IdiscussionConfig, EventsService, NavigationServiceService, DiscussionService, BaseWrapperComponent } from '@project-sunbird/discussions-ui-v8'
// import { EventsService } from '@project-sunbird/discussions-ui-v8/lib/events.service'
// import { NavigationServiceService } from '@project-sunbird/discussions-ui-v8/lib/navigation-service.service'
// import { DiscussionService } from '@project-sunbird/discussions-ui-v8/lib/services/discussion.service'
// import { BaseWrapperComponent } from '@project-sunbird/discussions-ui-v8/lib/wrapper/base-wrapper/base-wrapper.component'
import lodash from 'lodash'
import * as CONSTANTS from '@project-sunbird/discussions-ui-v8'

@Component({
  selector: 'igot-category-widget',
  templateUrl: './category-widget.component.html',
  styleUrls: ['./category-widget.component.css'],
})
export class CategoryWidgetComponent extends BaseWrapperComponent {

  @Input() discussionConfig!: IdiscussionConfig

  detailsToggle = true
  category = 'category'
  detailsPage = 'categoryDetails'
  homePage = 'categoryHome'
  tid!: number
  slug!: string
  categoryId: any

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
    this.state = this.category
  }

  stateChange(event: { action: string; tid: number; title: string; }) {
    this.state = event.action
    if (event.action === this.detailsPage) {
      this.tid = event.tid
      this.slug = event.title
    }
  }

  protected wrapperEventListener(data: any) {
  }
}
