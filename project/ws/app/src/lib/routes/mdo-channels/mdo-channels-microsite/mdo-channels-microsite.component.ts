import { Component, OnInit } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
/* tslint:disable */
import * as _ from 'lodash'

@Component({
  selector: 'ws-app-mdo-channels-microsite',
  templateUrl: './mdo-channels-microsite.component.html',
  styleUrls: ['./mdo-channels-microsite.component.scss']
})
export class MdoChannelsMicrositeComponent implements OnInit {
  channnelName = ''
  orgId = ''
  selectedIndex = 0
  sectionList: any = []
  titles = [
    {
      title: `MDO channel`,
      url: `/app/learn/mdo-channels/all-channels`,
      textClass: 'ws-mat-black60-text',
      icon: '', disableTranslate: true,
    },
  ]
  showModal: boolean = false

  constructor(
    private route: ActivatedRoute,
    private eventSvc: EventService,
  ) { 
    if (this.route.snapshot.data && this.route.snapshot.data.formData
      && this.route.snapshot.data.formData.data
      && this.route.snapshot.data.formData.data.result
      && this.route.snapshot.data.formData.data.result.form
      && this.route.snapshot.data.formData.data.result.form.data
      && this.route.snapshot.data.formData.data.result.form.data.sectionList
    ) {
      this.sectionList = this.route.snapshot.data.formData.data.result.form.data.sectionList
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.channnelName = params['channel']
      this.orgId = params['orgId']
      this.titles.push({
        title: this.channnelName, icon: '', url: 'none', disableTranslate: true,
        textClass: '',
      })
    })
  }

  public tabClicked(tabEvent: MatTabChangeEvent) {
    const data: WsEvents.ITelemetryTabData = {
      label: `${tabEvent.tab.textLabel}`,
      index: tabEvent.index,
    }
    this.eventSvc.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        subType: WsEvents.EnumInteractSubTypes.PROFILE_EDIT_TAB,
        id: `${_.camelCase(data.label)}-tab`,
      },
      {},
      {
        module: WsEvents.EnumTelemetrymodules.PROFILE,
      }
    )

  }
  hideContentStrip(event: any, contentStripData: any) {
    if (event) {
      contentStripData['hideSection'] = true
    }
  }

  triggerOpenDialog(event: boolean) {
    if(event) {
      this.showModal = true
      document.body.style.overflow = 'hidden'
    }
  }

  onClose() {
    this.showModal = false
    document.body.style.overflow = 'auto'
  }

}
