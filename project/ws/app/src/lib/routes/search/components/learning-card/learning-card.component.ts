import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2'
import { SafeHtml, DomSanitizer } from '@angular/platform-browser'
/* tslint:disable*/
import _ from 'lodash'
@Component({
  selector: 'ws-app-learning-card',
  templateUrl: './learning-card.component.html',
  styleUrls: ['./learning-card.component.scss'],
})
export class LearningCardComponent implements OnInit, OnChanges {
  @Input()
  displayType: 'basic' | 'advanced' = 'basic'
  @Input()
  content: NsContent.IContent = {} as NsContent.IContent
  contentProgress = 0
  isExpanded = false
  defaultThumbnail = ''
  description: SafeHtml = ''
  constructor(
    private events: EventService,
    private configSvc: ConfigurationsService,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent || ''
    }

  }
  ngOnChanges(changes: SimpleChanges) {
    for (const prop in changes) {
      if (prop === 'content' && this.content.description) {
        this.content.description = this.content.description.replace(/<br>/g, '')
        this.description = this.domSanitizer.bypassSecurityTrustHtml(this.content.description)
      }
    }
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'cardSearch',
        id: this.content.identifier,
      },
      {
        id: this.content.identifier,
        type: this.content.primaryCategory,
      },
      {
        pageIdExt: `${_.camelCase(this.content.primaryCategory)}-card`,
        module: _.camelCase(this.content.primaryCategory),
    })
  }
}
