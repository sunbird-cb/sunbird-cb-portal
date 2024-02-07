import { Component, OnInit, Input } from '@angular/core'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NsCardContent } from '../card-content-v2/card-content-v2.model'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver/src/public-api'

@Component({
  selector: 'ws-widget-card-competency',
  templateUrl: './card-competency.component.html',
  styleUrls: ['./card-competency.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '88px',
        width: '320px'
      })),
      state('expanded', style({
        minHeight: '108px',
        width: '372px',
        height: 'auto'
      })),
      transition('collapsed <=> expanded', [
        animate('0.5s')
      ])
    ])
  ]
})

export class CardCompetencyComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<NsCardContent.ICard> {

  @Input() widgetData!: NsCardContent.ICompetency
  @Input() competencyArea = ''
  isExpanded = false;

  constructor() {
    super()
  }

  ngOnInit() { 
  }

  handleToggleSize(_viewMore: any): void {
    this.isExpanded = !this.isExpanded;
  }
}
