import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { EventService } from '@sunbird-cb/utils'
import videoJs from 'video.js'
import { ROOT_WIDGET_CONFIG } from '../collection.config'
import { IWidgetsPlayerMediaData } from '../_models/player-media.model'
import {
  fireRealTimeProgressFunction,
  saveContinueLearningFunction,
  telemetryEventDispatcherFunction,
  videoInitializer,
  videoJsInitializer,
} from '../_services/videojs-util'
import { WidgetContentService } from '../_services/widget-content.service'
import { ViewerUtilService } from '@ws/viewer/src/lib/viewer-util.service'

const videoJsOptions: videoJs.PlayerOptions = {
  controls: true,
  autoplay: true,
  preload: 'auto',
  fluid: false,
  muted: true,
  techOrder: ['html5'],
  playbackRates: [1, 1.5],
  poster: '',
  html5: {
    hls: {
      overrideNative: true,
    },
    nativeVideoTracks: false,
    nativeAudioTracks: false,
    nativeTextTracks: false,
  },
  nativeControlsForTouch: false,
}

@Component({
  selector: 'ws-widget-player-video',
  templateUrl: './player-video.component.html',
  styleUrls: ['./player-video.component.scss'],
})
export class PlayerVideoComponent extends WidgetBaseComponent
  implements
  OnInit,
  AfterViewInit,
  OnDestroy,
  NsWidgetResolver.IWidgetData<IWidgetsPlayerMediaData> {
  @Input() widgetData!: IWidgetsPlayerMediaData
  @ViewChild('videoTag', { static: false }) videoTag!: ElementRef<HTMLVideoElement>
  @ViewChild('realvideoTag', { static: false }) realvideoTag!: ElementRef<HTMLVideoElement>
  @HostBinding('id')
  public id = 'v-player'
  private player: videoJs.Player | null = null
  private dispose: (() => void) | null = null
  videoEnd = false
  timerInterval: any
  video: any
  replayVideoFlag = false
  constructor(
    private eventSvc: EventService,
    private contentSvc: WidgetContentService,
    private viewerSvc: ViewerUtilService,
    private activatedRoute: ActivatedRoute,
  ) {
    super()
  }

  ngOnInit() {
  //   this.video=document.getElementById("videoTag");
  //   document.addEventListener("keydown",(e:any)=>{
  //     if(e.keyCode==37){       //left arrow
  //         this.backward()
  //     }else if(e.keyCode==39){ //right arrow
  //         this.forward()
  //     }
  //   }
  // )

  }

  // forward=()=>{
  //   this.skip(15);
  // }

  // backward=()=>{
  //    this.skip(-15);
  // }

  // skip(time:any) {
  //   this.video.currentTime=this.video.currentTime+time;
  // }

  async ngAfterViewInit() {

    this.widgetData = {
      ...this.widgetData,
    }
    if (this.widgetData && this.widgetData.identifier && !this.widgetData.url) {
      await this.fetchContent()
    }
    if (this.widgetData.url) {
      if (this.widgetData.isVideojs) {
        this.initializePlayer()
      } else {
        this.initializeVPlayer()
      }
    }
    const videoTag: any =   document.getElementsByTagName('video')[0]
    if (videoTag) {
      videoTag.onended = () => {
        this.videoEnd = true
        const videoTagElement: any = document.getElementById('videoTag') || document.getElementById('realvideoTag')
        const autoPlayVideo: any = document.getElementById('auto-play-video')
        if (videoTagElement) {
          if (autoPlayVideo) {
            autoPlayVideo.style.opacity = '0.8'
          }
          videoTagElement.style.filter = 'blur(2px)'

        }
        let counter = 1
        this.timerInterval =   setInterval(() => {
            if (counter <= 30) {
                this.updateProgress(counter)
            }
            if (counter > 30) {
              if (videoTag) {
                videoTag.style.filter = 'blur(0px)'
              }
              if (autoPlayVideo) {
                autoPlayVideo.style.opacity = '1'
              }
              counter = 0
              this.clearTimeInterval()
              this.viewerSvc.autoPlayNextVideo.next(true)
            }
            counter = counter + 1
          },                               1000)

      }
    }
  }

  clearTimeInterval() {
    clearInterval(this.timerInterval)
  }

  updateProgress(value: any) {
    const progress: any = document.querySelector('.circular-progress')
    progress.style.setProperty('--percentage', `${value * 12}deg`)
    // progress.innerText = `${value}%`
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose()
    }
    if (this.dispose) {
      this.dispose()
    }
    this.clearTimeInterval()
  }
  private initializeVPlayer() {
    // alert()
    // let playerInstance:any = this.player;
    // if(playerInstance) {
    //   var skipBehindButton = playerInstance.controlBar.addChild("button");
    //   var skipBehindButtonDom = skipBehindButton.el();
    //   skipBehindButtonDom.innerHTML = "30<<";
    //   skipBehindButton.addClass("buttonClass");

    //   // skipBehindButtonDom.onclick = function(){
    //   //     skipS3MV(-30);
    //   // }
    //   console.log("playerInstance.controlBar",playerInstance.controlBar);
    // }

    const dispatcher: telemetryEventDispatcherFunction = event => {
      if (this.widgetData.identifier) {
        this.eventSvc.dispatchEvent(event)
      }
    }
    const saveCLearning: saveContinueLearningFunction = data => {
      if (this.widgetData.identifier) {

        if (this.activatedRoute.snapshot.queryParams.collectionType &&
          this.activatedRoute.snapshot.queryParams.collectionType.toLowerCase() === 'playlist') {
          const continueLearningData = {
            contextPathId: this.activatedRoute.snapshot.queryParams.collectionId ?
              this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier,
            resourceId: data.resourceId,
            contextType: 'playlist',
            dateAccessed: Date.now(),
            data: JSON.stringify({
              progress: data.progress,
              timestamp: Date.now(),
              contextFullPath: [this.activatedRoute.snapshot.queryParams.collectionId, data.resourceId],
            }),
          }
          this.contentSvc
            .saveContinueLearning(continueLearningData)
            .toPromise()
            .catch()
        } else {
          const continueLearningData = {
            contextPathId: this.activatedRoute.snapshot.queryParams.collectionId ?
              this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier,
            ...data,
            // resourceId: data.resourceId,
            // dateAccessed: Date.now(),
            // data: data.data,
          }
          // JSON.stringify({
          //   progress: data.progress,
          //   timestamp: Date.now(),
          // }),
          this.contentSvc
            .saveContinueLearning(continueLearningData)
            .toPromise()
            .catch()
        }
      }
    }
    const fireRProgress: fireRealTimeProgressFunction = (identifier, data) => {
      const collectionId = this.activatedRoute.snapshot.queryParams.collectionId ?
              this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier
      const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
              this.activatedRoute.snapshot.queryParams.batchId : this.widgetData.identifier

      if (this.widgetData.identifier && identifier && data) {
          this.viewerSvc
            .realTimeProgressUpdate(identifier, data, collectionId, batchId)
      }
    }
    if (this.widgetData.resumePoint && this.widgetData.resumePoint !== 0) {
      this.realvideoTag.nativeElement.currentTime = this.widgetData.resumePoint
    }
    let enableTelemetry = false
    if (!this.widgetData.disableTelemetry && typeof (this.widgetData.disableTelemetry) !== 'undefined') {
      enableTelemetry = true
    }
    this.dispose = videoInitializer(
      this.realvideoTag.nativeElement,
      dispatcher,
      saveCLearning,
      fireRProgress,
      this.widgetData.passThroughData,
      ROOT_WIDGET_CONFIG.player.video,
      enableTelemetry,
      this.widgetData,
      this.widgetData.mimeType,
    ).dispose
  }

  private initializePlayer() {

    const dispatcher: telemetryEventDispatcherFunction = event => {
      if (this.widgetData.identifier) {
        this.eventSvc.dispatchEvent(event)
      }
    }
    const saveCLearning: saveContinueLearningFunction = data => {
      if (this.widgetData.identifier) {
        if (this.activatedRoute.snapshot.queryParams.collectionType &&
          this.activatedRoute.snapshot.queryParams.collectionType.toLowerCase() === 'playlist') {
          const continueLearningData = {
            contextPathId: this.activatedRoute.snapshot.queryParams.collectionId ?
              this.activatedRoute.snapshot.queryParams.collectionId : this.widgetData.identifier,
            resourceId: data.resourceId,
            contextType: 'playlist',
            dateAccessed: Date.now(),
            data: JSON.stringify({
              progress: data.progress,
              timestamp: Date.now(),
              contextFullPath: [this.activatedRoute.snapshot.queryParams.collectionId, data.resourceId],
            }),
          }
          this.contentSvc
            .saveContinueLearning(continueLearningData)
            .toPromise()
            .catch()
        } else {
          const continueLearningData = {
            contextPathId: this.activatedRoute.snapshot.queryParams.collectionId
              ? this.activatedRoute.snapshot.queryParams.collectionId
              : this.widgetData.identifier,
            ...data,
            // resourceId: data.resourceId,
            // dateAccessed: Date.now(),
            // data: JSON.stringify({
            //   progress: data.progress,
            //   timestamp: Date.now(),
            // }),
          }
          this.contentSvc
            .saveContinueLearning(continueLearningData)
            .toPromise()
            .catch()
        }
      }
    }
    const fireRProgress: fireRealTimeProgressFunction = (identifier, data) => {
      const resData = this.viewerSvc.getBatchIdAndCourseId(this.activatedRoute.snapshot.queryParams.collectionId,
                                                           this.activatedRoute.snapshot.queryParams.batchId, identifier)
      const collectionId = (resData && resData.courseId) ? resData.courseId : this.widgetData.identifier
      const batchId = (resData && resData.batchId) ? resData.batchId : this.widgetData.identifier
        if (this.widgetData.identifier && identifier && data) {
          this.viewerSvc
            .realTimeProgressUpdate(identifier, data, collectionId, batchId)
      }
    }
    let enableTelemetry = false
    if (!this.widgetData.disableTelemetry && typeof (this.widgetData.disableTelemetry) !== 'undefined') {
      enableTelemetry = true
    }
    const initObj = videoJsInitializer(
      this.videoTag.nativeElement,
      {
        ...videoJsOptions,
        poster: this.viewerSvc.getPublicUrl(this.widgetData.posterImage || ''),
        autoplay: this.widgetData.autoplay || false,
      },
      dispatcher,
      saveCLearning,
      fireRProgress,
      this.widgetData.passThroughData,
      ROOT_WIDGET_CONFIG.player.video,
      this.widgetData.resumePoint ? this.widgetData.resumePoint : 0,
      enableTelemetry,
      this.widgetData,
      this.widgetData.mimeType,
      this.widgetData.size
    )
    this.player = initObj.player
    this.dispose = initObj.dispose

    initObj.player.ready(() => {
      if (Array.isArray(this.widgetData.subtitles)) {
        this.widgetData.subtitles.forEach((u, index) => {
          initObj.player.addRemoteTextTrack(
            {
              default: index === 0,
              kind: 'captions',
              label: u.label,
              srclang: u.srclang,
              src: u.url,
            },
            false,
          )
        })
      }
      if (this.widgetData.url) {
        initObj.player.src(this.viewerSvc.getCdnUrl(this.widgetData.url))

      }
    })

    // const player = this.player;
    // console.log('player', this.player)
    // if(player) {
    //   if(player.controlBar.options_.children) {
    //     console.log('player', player);
    //     let seelBar:any = player.controlBar;
    //     seelBar.progressControl['children'][0]['SeekBar']['enabled_'] = false;
    //     console.log('seelBar', seelBar.progressControl)
    //   }
    // }
  }
  async fetchContent() {
    const content = await this.contentSvc
      .fetchContent(this.widgetData.identifier || '', 'minimal')
      .toPromise()
    if (content.artifactUrl && content.artifactUrl.indexOf('/content-store/') > -1) {
      this.widgetData.url = content.artifactUrl
      this.widgetData.posterImage = content.appIcon
      this.widgetData.posterImage = this.viewerSvc.getPublicUrl(this.widgetData.posterImage || '')
      await this.contentSvc.setS3Cookie(this.widgetData.identifier || '').toPromise()
    }

    this.widgetData.subtitles = content.subTitles
  }

  closeAutoPlay() {
    this.videoEnd = false
    this.replayVideoFlag = true
    clearInterval(this.timerInterval)
  }

  replayVideo() {
    this.replayVideoFlag = false
    const videoTag: any = document.getElementById('videoTag') || document.getElementById('realvideoTag')
    if (videoTag) {
      videoTag.style.filter = 'blur(0px)'
    }
    const autoPlayVideo: any = document.getElementById('auto-play-video')
    if (autoPlayVideo) {
      autoPlayVideo.style.opacity = '1'
    }
    if (this.player) {
      this.player.play()
    }
  }
}
