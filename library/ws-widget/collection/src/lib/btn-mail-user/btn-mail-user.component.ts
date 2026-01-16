import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { NsContent } from '../_services/widget-content.model'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { BtnMailUserDialogComponent } from './btn-mail-user-dialog/btn-mail-user-dialog.component'
import { EventService, ConfigurationsService, WsEvents } from '@sunbird-cb/utils-v2'

export interface IBtnMailUser {
  content: NsContent.IContent
  emails: string[]
  user: any
  labelled?: boolean
}

@Component({
  selector: 'ws-widget-btn-mail-user',
  templateUrl: './btn-mail-user.component.html',
  styleUrls: ['./btn-mail-user.component.scss'],
})
export class BtnMailUserComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IBtnMailUser> {
  @Input() widgetData!: IBtnMailUser
  isShareEnabled = false

  constructor(
    private events: EventService,
    private dialog: MatDialog,
    private configSvc: ConfigurationsService,
  ) {
    super()
  }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isShareEnabled = !this.configSvc.restrictedFeatures.has('mailUsers')
    }
  }

  openQueryMailDialog(event: Event) {
    event.stopPropagation()
    this.raiseTelemetry()
    this.dialog.open<BtnMailUserDialogComponent, IBtnMailUser>(
      BtnMailUserDialogComponent,
      {
        minWidth: '40vw',
        maxWidth: '80vw',
        data: this.widgetData,
      },
    )
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'email',
        subType: 'openDialog',
        id: this.widgetData.content.identifier,
      },
      {
        id: this.widgetData.content.identifier,
        emails: this.widgetData.emails,
      },
      {
        pageIdExt: 'btn-mail-user',
        module: WsEvents.EnumTelemetrymodules.PROFILE,
      }
    )
  }

}
