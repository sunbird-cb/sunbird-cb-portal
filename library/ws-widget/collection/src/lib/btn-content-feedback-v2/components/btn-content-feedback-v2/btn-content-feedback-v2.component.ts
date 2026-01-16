import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { BtnContentFeedbackDialogV2Component } from '../btn-content-feedback-dialog-v2/btn-content-feedback-dialog-v2.component'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { IWidgetBtnContentFeedbackV2 } from '../../models/btn-content-feedback-v2.model'

@Component({
  selector: 'ws-widget-btn-content-feedback-v2',
  templateUrl: './btn-content-feedback-v2.component.html',
  styleUrls: ['./btn-content-feedback-v2.component.scss'],
})
export class BtnContentFeedbackV2Component extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<IWidgetBtnContentFeedbackV2> {
  @Input() widgetData!: IWidgetBtnContentFeedbackV2
  @Input() forPreview = false
  @HostBinding('id')
  public id = 'v2-feedbak-content'
  isFeedbackEnabled = false
  constructor(private dialog: MatDialog, private configSvc: ConfigurationsService) {
    super()
  }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isFeedbackEnabled = !this.configSvc.restrictedFeatures.has('contentFeedback')
    }
  }

  openFeedbackDialog() {
    if (!this.forPreview) {
      this.dialog.open<BtnContentFeedbackDialogV2Component, IWidgetBtnContentFeedbackV2>(
        BtnContentFeedbackDialogV2Component,
        { data: this.widgetData, minWidth: '320px', width: '500px' },
      )
    }
  }
}
