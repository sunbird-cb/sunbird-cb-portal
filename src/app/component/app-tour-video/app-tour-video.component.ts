import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { EventService,WsEvents } from '@sunbird-cb/utils/src/public-api';

@Component({
  selector: 'ws-app-tour-video',
  templateUrl: './app-tour-video.component.html',
  styleUrls: ['./app-tour-video.component.scss']
})
export class AppTourVideoComponent implements OnInit, OnDestroy {

  @Input() showVideoTour: any
  @Input() isMobile: any
  @Output() emitedValue = new EventEmitter<string>()
  @ViewChild('tourVideoTag', { static: false }) tourVideoTag!: ElementRef<HTMLVideoElement>

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.raiseVideStartTelemetry()
  }

  letsStart(){
    this.emitedValue.emit('start')
  }

  letsSkip() {
    this.emitedValue.emit('skip')
  }

  ngOnDestroy() {
    console.log("time ",this.tourVideoTag.nativeElement.currentTime)
    this.raiseVideEndTelemetry(this.tourVideoTag.nativeElement.currentTime)
  }

  raiseVideStartTelemetry() {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: { type: '' },
        object: {},
        state: WsEvents.EnumTelemetrySubType.Loaded,
        eventSubType: WsEvents.EnumTelemetrySubType.GetStarted,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
      },
      pageContext: {pageId: "/home", module: WsEvents.EnumTelemetrySubType.GetStarted},
      from: '',
      to: 'Telemetry',
    }
    this.eventService.dispatchGetStartedEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }

  raiseVideEndTelemetry(progress: number) {
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      data: {
        edata: {type: ''},
        object: {duration: progress, total: 119},
        state: WsEvents.EnumTelemetrySubType.Unloaded,
        eventSubType: WsEvents.EnumTelemetrySubType.GetStarted,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
      },
      pageContext: {
        pageId: "/home",
        module: WsEvents.EnumTelemetrySubType.GetStarted,
      },
      from: '',
      to: 'Telemetry',
    }
    console.log("event ", event)
    this.eventService.dispatchGetStartedEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }


}


