import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import {
  BtnCallDialogComponent,
  IWidgetBtnCallDialogData,
} from './btn-call-dialog/btn-call-dialog.component'
import { EventService, ConfigurationsService } from '@sunbird-cb/utils-v2'

export interface IWidgetBtnCall {
  userName: string
  userPhone: string
  replaceIconWithLabel?: boolean
}
@Component({
  selector: 'ws-widget-btn-call',
  templateUrl: './btn-call.component.html',
  styleUrls: ['./btn-call.component.scss'],
})
export class BtnCallComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IWidgetBtnCall> {
  @Input() widgetData!: IWidgetBtnCall
  isCallEnabled = false

  constructor(private events: EventService, private dialog: MatDialog, private configSvc: ConfigurationsService) {
    super()
  }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isCallEnabled = !this.configSvc.restrictedFeatures.has('callUsers')
    }
  }

  showCallDialog() {
    this.raiseTelemetry()
    this.dialog.open<BtnCallDialogComponent, IWidgetBtnCallDialogData>(BtnCallDialogComponent, {
      data: {
        name: this.widgetData.userName,
        phone: this.widgetData.userPhone,
      },
    })
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      {
        type: 'call',
        subType: 'openDialog',
      },
      {
        name: this.widgetData.userName,
        phone: this.widgetData.userPhone,
      },
      {
        pageIdExt: 'btn-call',
      }
    )
  }
}
