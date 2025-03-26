import { Component, OnInit, Input } from '@angular/core'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'

@Component({
  selector: 'ws-app-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['./provider-card.component.scss'],
})
export class ProviderCardComponent implements OnInit {
  @Input() provider!: any

  constructor(private events: EventService) { }

  ngOnInit() {
  }

  raiseTelemetery() {
    this.events.raiseInteractTelemetry(
      {
        type: 'click',
        id: 'card-content',
      },
      {
        id: this.provider.name,
        type: this.provider.orgId,
      },
      {
        pageIdExt: 'card-content',
        module: WsEvents.EnumTelemetrymodules.LEARN,
      })
  }

}
