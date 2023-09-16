import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { Subscription } from 'rxjs'
import { IWidgetsPlayerOfflineSessionData } from './player-offline-session.model'
import { ViewerDataService } from '@ws/viewer/src/lib/viewer-data.service'
import { WidgetContentService } from '../_services/widget-content.service'

@Component({
  selector: 'ws-widget-player-offline-session',
  templateUrl: './player-offline-session.component.html',
  styleUrls: ['./player-offline-session.component.scss'],
})
export class PlayerOfflineSessionComponent extends WidgetBaseComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetData!: IWidgetsPlayerOfflineSessionData
  viewerDataServiceSubscription: Subscription | null = null
  identifier: string | null = null
  content: any
  enableTelemetry = false
  tocConfig = null

  constructor(
    private viewerDataSvc: ViewerDataService,
    private widgetContentSvc: WidgetContentService,
  ) {
    super()
  }

  ngOnInit() {
    this.tocConfig  = this.widgetContentSvc.tocConfigData
    // TODO:When player is fully implemented put initial functions here
  }

  ngOnChanges() {
    if (this.widgetData && this.widgetData.content) {
      this.content = this.widgetData.content
    }
  }

  ngAfterViewInit() {
    if (this.widgetData.content) {
      this.content = this.widgetData.content
    }
    this.viewerDataServiceSubscription = this.viewerDataSvc.changedSubject.subscribe(_data => {
    })
  }

  ngOnDestroy() {
    if (this.identifier) {
      // TODO: When player is fully implemeted fire progress and save learning on player close

      // this.saveContinueLearning(this.identifier)
      // this.fireRealTimeProgress(this.identifier)
    }
  }
}
