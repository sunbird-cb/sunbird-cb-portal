import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'ws-app-tour-video',
  templateUrl: './app-tour-video.component.html',
  styleUrls: ['./app-tour-video.component.scss'],
})
export class AppTourVideoComponent implements OnInit, OnDestroy {
  @Input() showVideoTour: any
  @Input() isMobile: any
  @Input() videoProgressTime = 0
  @Output() emitedValue = new EventEmitter<string>()
  @Output() videoPlayed = new EventEmitter()
  videoPlayedProgress = true
  environment: any
  videoUrl: any
  // tslint:disable-next-line
  @ViewChild('tourVideoTag') tourVideoTag!: ElementRef<HTMLVideoElement>

  constructor(private eventService: EventService, private translate: TranslateService) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!

      this.translate.use(lang)
      // console.log('current lang ------', this.translate.getBrowserLang())
      // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      //   console.log('onLangChange', event)
      // })
    }
  }

  ngOnInit() {
    this.environment = environment
    this.videoUrl = `https://${this.environment.sitePath}/assets/public/content/guide-videos/Website_Video.mp4`
    try {
      if (this.videoProgressTime > 0) {
        this.videoPlayedProgress = false
        setTimeout(() => {
          // @ts-ignore
          const aud = document.getElementById('tourVideoTag')
          let approxTime = 0
          // @ts-ignore
          aud.ontimeupdate = () => {
            // @ts-ignore
            const currentTime = Math.floor(aud['currentTime'])
            if (currentTime !== approxTime) {
              approxTime = currentTime
              if (approxTime === this.videoProgressTime) {
                this.videoPlayedProgress = true
                this.videoPlayed.emit({ state: 'played', time: approxTime })
              }
            }
          }
          // tslint:disable-next-line
        }, 2000)
      }
      // tslint:disable-next-line: align
    } catch (error) {
      // console.error('Video progress time error')
    }
    this.raiseVideStartTelemetry()
  }

  letsStart() {
    this.emitedValue.emit('start')
  }

  letsSkip() {
    this.emitedValue.emit('skip')
  }

  ngOnDestroy() {
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
      pageContext: { pageId: '/home', module: WsEvents.EnumTelemetrySubType.GetStarted },
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
        edata: { type: '' },
        object: { duration: progress, total: 119 },
        state: WsEvents.EnumTelemetrySubType.Unloaded,
        eventSubType: WsEvents.EnumTelemetrySubType.GetStarted,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
      },
      pageContext: {
        pageId: '/home',
        module: WsEvents.EnumTelemetrySubType.GetStarted,
      },
      from: '',
      to: 'Telemetry',
    }
    this.eventService.dispatchGetStartedEvent<WsEvents.IWsEventTelemetryInteract>(event)
  }
}
