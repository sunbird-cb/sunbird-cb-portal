import { Component, OnInit, Input } from '@angular/core'
import { NsCardContent } from '../card-content-v2/card-content-v2.model'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver/src/public-api'

@Component({
  selector: 'ws-widget-card-competency',
  templateUrl: './card-competency.component.html',
  styleUrls: ['./card-competency.component.scss'],
})

export class CardCompetencyComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<NsCardContent.ICard> {

  @Input() widgetData!: NsCardContent.ICompetency
  @Input() competencyArea = ''

  constructor() {
    super()
  }

  ngOnInit() { }
}
