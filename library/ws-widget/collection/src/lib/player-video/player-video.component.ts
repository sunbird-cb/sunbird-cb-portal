import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { EventService } from '@sunbird-cb/utils-v2'
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
import { AppTocService } from '@ws/app/src/lib/routes/app-toc/services/app-toc.service'
import { Subscription } from 'rxjs'
import 'videojs-hls-quality-selector';
const videoJsOptions: videoJs.PlayerOptions = {
  controls: true,
  autoplay: true,
  preload: 'auto',
  fluid: false,
  muted: false,
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
  plugins: {
    hlsQualitySelector: {
      displayCurrentQuality: true, // ✅ Show current quality in the menu
    },
  },

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
  @Input() widgetData!: any
  @ViewChild('videoTag') videoTag!: ElementRef<HTMLVideoElement>
  @ViewChild('realvideoTag') realvideoTag!: ElementRef<HTMLVideoElement>
  @HostBinding('id')
  public id = 'v-player'
  private player: videoJs.Player | null = null
  private dispose: (() => void) | null = null
  videoEnd = false
  timerInterval: any
  video: any
  replayVideoFlag = false
  activeTranscriptionLanguage = 'en'
  transcriptionLangArr = []
  transcriptionSubscriptionData:any = {}
  playerInitObj:any
  previousSubtitleLanguage = 'en'
  playTranscriptionVideoSubscription:Subscription | null = null
  changeTranscriptionLanguageEventSubscription: Subscription | null = null  
  videoUrl = 'https://portal.uat.karmayogibharat.net/stream-store/content/do_114194996168163328192/artifact/manifest.m3u8'
  constructor(
    private eventSvc: EventService,
    private contentSvc: WidgetContentService,
    private viewerSvc: ViewerUtilService,
    private activatedRoute: ActivatedRoute,
    private appTocService: AppTocService
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

  this.playTranscriptionVideoSubscription = this.appTocService.playTranscriptionVideo.subscribe((playTime:any)=>{
    let startTime  = playTime.startTime
    let endTime  = playTime.endTime
    // let lastPlayedTime = startTime;
    if(startTime && endTime) {
      const player = this.playerInitObj.player;

      player.currentTime(startTime); // Jump to star
      this.playerInitObj.player.currentTime(startTime); // jump to start  
      // setTimeout(()=>{
        // initObj.player.autoplay()
        if(this.videoTag && this.videoTag.nativeElement) {
          this.videoTag.nativeElement.muted = false
          this.videoTag.nativeElement.play();
        } else if (this.realvideoTag && this.realvideoTag.nativeElement) {
          this.realvideoTag.nativeElement.muted = false
          this.realvideoTag.nativeElement.play();
        }
        
      // },1000)      
     // initObj.player.play();    
     this.playerInitObj.player.on('timeupdate',  ()=> {
        // console.log('this.playerInitObj.player.currentTime()',this.playerInitObj.player.currentTime())
        // console.log('endTime',endTime)
        if (endTime && parseInt(this.playerInitObj.player.currentTime()) >= parseInt(endTime)) {          
          this.playerInitObj.player.pause();
          setTimeout(()=>{
            endTime = player.duration()
          },0)
         
        }
      });
      // player.on('play', () => {
      //   const current = player.currentTime();
      //   if (current >= endTime && lastPlayedTime < endTime) {
      //     player.currentTime(lastPlayedTime);
      //   }
    
      // });
    }


  })

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
    let playerInitialize = false
    
    this.widgetData = {
      ...this.widgetData,
    }
    //this.appTocService.transriptionIdentifier.next(this.widgetData)
    if (this.widgetData && this.widgetData.identifier && !this.widgetData.url) {
      
      await this.fetchContent()
    }
    if (this.widgetData.url) {
      if (this.widgetData.isVideojs) {
        if(!this.playerInitObj) {
          playerInitialize = true
          this.initializePlayer()
        }
        
        this.changeTranscriptionLanguageEventSubscription = this.appTocService.changeTranscriptionLanguageEvent.subscribe((data:any)=>{          
          if(data && data?.activeLang) {
            // console.log('data--', data)
            this.transcriptionLangArr = []
            this.transcriptionSubscriptionData = data   
            this.activeTranscriptionLanguage = this.transcriptionSubscriptionData?.activeLang
            this.transcriptionLangArr = this.transcriptionSubscriptionData?.langData
            if(this.transcriptionSubscriptionData?.loadPlayer) {
              this.initializePlayer()  
            } else {
              if (Array.isArray(this.transcriptionLangArr) && !playerInitialize) {
  
                let tracks = this.playerInitObj.player.textTracks()
                //let allCues:any = []
                for (let i = 0; i < tracks.length; i++) {
                  const track = tracks[i];
                  // console.log(tracks[i].label, tracks[i]);
  
                  if (track.kind === 'subtitles' || track.kind === 'metadata') {
                  //  track.mode = 'showing'; // or 'hidden' if you don't want it on screen
                  if (track.language === this.activeTranscriptionLanguage) {
                    track.mode = 'showing';
  
                  } else {
                    track.mode = 'disabled'; // prevent multiple from showing
                  }
  
  
  
                    track.addEventListener('cuechange', () => {
                      const activeCues = track.activeCues;
  
                      if (activeCues && activeCues.length > 0) {
                        for (let j = 0; j < activeCues.length; j++) {
                          const cue:any = activeCues[j];
  
                          // Log or store cue
                          // allCues.push({
                          //   start: cue.startTime,
                          //   end: cue.endTime,
                          //   text: cue?.text
                          // });
                          // console.log(cue)
                          this.appTocService.setTranscriptionData({
                            start: cue.startTime,
                            end: cue.endTime,
                            text: cue?.text
                          })
  
                          // Show in browser
                          // const entry = document.createElement('div');
                          // entry.textContent = `Cue: [${cue.startTime.toFixed(1)}s - ${cue.endTime.toFixed(1)}s] → ${cue.text}`;
                          // cueLog.appendChild(entry);
                        }
                        //console.log('cue', allCues)
                      }
                    });
                  }
                }
              }
            }
  
          } else {
            this.initializePlayer()   
          }
        })
      } else {
        this.initializeVPlayer()
      }
    }

    const videoTag: any =   document.getElementsByTagName('video')[0]
    if (videoTag) {
      videoTag.onended = () => {
        this.videoEnd = true
        if (this.widgetData && this.widgetData.hideUpNext) {
          this.replayVideoFlag = this.widgetData.hideUpNext ? true : false
        }
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
            if (counter <= 5) {
                this.updateProgress(counter)
            }
            if (counter > 5) {
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
    progress.style.setProperty('--percentage', `${value * 72}deg`)
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

    if(this.changeTranscriptionLanguageEventSubscription) {
      this.changeTranscriptionLanguageEventSubscription.unsubscribe()
    }
    if(this.playTranscriptionVideoSubscription) {
      this.playTranscriptionVideoSubscription.unsubscribe()
    }
    
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
              this.activatedRoute.snapshot.queryParams.collectionId : ''
      const batchId = this.activatedRoute.snapshot.queryParams.batchId ?
              this.activatedRoute.snapshot.queryParams.batchId : ''
      const isPreAssessment = this.activatedRoute.snapshot.queryParams.preAssessment
      if(isPreAssessment) {
        if (this.widgetData.identifier && identifier && data) {
          this.viewerSvc
            .realTimeProgressUpdateForPreAssessment(identifier, data)
        }
      } else if (this.widgetData.identifier && identifier && data) {
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
    let startTime = 0
    let endTime = 0
    if(this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.from && this.activatedRoute.snapshot.queryParams.from === 'globalSearch') {
      if(this.activatedRoute.snapshot.queryParams.st) {
      startTime = this.activatedRoute.snapshot.queryParams.st
      endTime = this.activatedRoute.snapshot.queryParams.et      
      }
    }

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
      const collectionId = (resData && resData.courseId) ? resData.courseId : ''
      const batchId = (resData && resData.batchId) ? resData.batchId : ''
      const isPreAssessment = this.activatedRoute.snapshot.queryParams.preAssessment
      if(isPreAssessment) {
        if (this.widgetData.identifier && identifier && data) {
          this.viewerSvc
            .realTimeProgressUpdateForPreAssessment(identifier, data)
        }
      } else if (this.widgetData.identifier && identifier && data && collectionId && batchId) {
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
        poster: this.widgetData.posterImage ? this.viewerSvc.getPublicUrl(this.widgetData.posterImage || '') : '',
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
      this.widgetData.size,
      
    )
    this.playerInitObj = initObj
    this.player = initObj.player
   ;
    this.dispose = initObj.dispose
    
    

    initObj.player.ready(() => {
      
      let tracks = initObj.player.textTracks()
      setTimeout(() => {
        const ccButton = initObj.player.controlBar.getChild('SubsCapsButton') as any;
        if (ccButton) {
          if (ccButton?.menu && typeof ccButton.menu.children === 'function') {
            // ✅ Rename menu items like "Captions Off" → "Subtitles Off"
            ccButton.menu.children().forEach((item: any) => {
              const label = item.options_?.label;
                // console.log('Found menu item:', label);

                if (!label) return;

                let newLabel = label;

                if (label.toLowerCase() === 'captions off') {
                  newLabel = 'Subtitles Off';
                } else if (label.toLowerCase().includes('captions')) {
                  newLabel = label.replace(/captions/gi, 'Subtitles');
                }

                // 🔧 Update both label option & DOM element text
                item.options_.label = newLabel;

                // Find the actual DOM element and update its text
                const itemEl = item.el();
                const labelEl = itemEl?.querySelector('.vjs-menu-item-text');

                if (labelEl) {
                  labelEl.textContent = newLabel;
                }

            });
          }
      
          const el = ccButton.el();
          if (el) {
            
            const span = el.querySelector('.vjs-icon-placeholder');
            if (span) {
              // Clear any default icon classes
              span.classList.remove('vjs-icon-placeholder', 'vjs-icon-subtitles', 'vjs-icon-captions');
      
              // Add custom layout
              span.innerHTML = `
                <div class="custom-cc-wrapper">
                  <img src="/assets/ai-tutor/subtitle-on.svg" id="custom-cc-icon-img" class="custom-cc-icon-img" alt="icon" />
                  <span class="custom-cc-label">Subtitle</span>
                </div>
              `;
            }
          }
        }
         const qualityBtn = document.querySelector('.vjs-quality-selector .vjs-menu-button');

        if (qualityBtn && this.widgetData && this.widgetData.streamingUrl) {
          qualityBtn.innerHTML = '';

          const wrapper = document.createElement('div');
          wrapper.className = 'quality-wrapper'; // flex container

          const icon = document.createElement('span');
          icon.className = 'vjs-icon-placeholder';
          icon.innerHTML = '<i class="material-icons quality-icons"  title="Quality">tune</i>';

          // const text = document.createElement('span');
          // text.className = 'vjs-menu-value';
          // text.textContent = 'Quality';

          wrapper.appendChild(icon);
          // wrapper.appendChild(text);
          qualityBtn.appendChild(wrapper);
        }
      }, 100);
      this.activeTranscriptionLanguage = this.transcriptionSubscriptionData?.activeLang
      this.transcriptionLangArr = this.transcriptionSubscriptionData?.langData
      // console.log('this.transcriptionLangArr----', this.transcriptionLangArr)
      // if (Array.isArray(this.widgetData.subtitles)) {
      //   this.widgetData.subtitles.forEach((u, index) => {
      //     initObj.player.addRemoteTextTrack(
      //       {
      //         default: index === 0,
      //         kind: 'subtitles',
      //         label: this.titleCase(u.label),
      //         srclang: u.srclang,
      //         src: u.url,
      //       },
      //       false,
      //     )
      //   })
      // }
      if (this.widgetData.url) {

        // if(this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams.from && this.activatedRoute.snapshot.queryParams.from === 'globalSearch') {
        //   if(this.activatedRoute.snapshot.queryParams.st) {
        //     let startTime = this.activatedRoute.snapshot.queryParams.st
        //     let endTime = this.activatedRoute.snapshot.queryParams.et
        //     initObj.player.currentTime(startTime); // jump to start          
        //     initObj.player.play();    
        //     initObj.player.on('timeupdate',  ()=> {
        //       if (endTime && initObj.player.currentTime() >= endTime) {
        //         initObj.player.pause();
        //       }
        //     });
        //   }
        // }

        // initObj.player.src(this.viewerSvc.getCdnUrl(this.widgetData.url))
        if(this.widgetData && this.widgetData.streamingUrl) {
          initObj.player.src(this.widgetData.streamingUrl)
          //this.videoUrl = this.widgetData.streamingUrl
        } else {
          initObj.player.src(this.viewerSvc.getCdnUrl(this.widgetData.url))
          this.videoUrl = this.widgetData.url
        }
        

        if(startTime && endTime) {
          initObj.player.currentTime(startTime); // jump to start  
          setTimeout(()=>{
            // initObj.player.autoplay()
            if(this.videoTag && this.videoTag.nativeElement) {
              this.videoTag.nativeElement.muted = true
              this.videoTag.nativeElement.play();
            } else if (this.realvideoTag && this.realvideoTag.nativeElement) {
              this.realvideoTag.nativeElement.muted = true
              this.realvideoTag.nativeElement.play();
            }
            
          },0)
          
         // initObj.player.play();    
          initObj.player.on('timeupdate',  ()=> {
            if (endTime && initObj.player.currentTime() >= endTime) {
              initObj.player.pause();
            }
          });
        }

      }

      if (Array.isArray(this.transcriptionLangArr)) {
        const defaultTrackTemp:any = this.transcriptionLangArr.find((t:any) => t.label === this.transcriptionSubscriptionData?.activeLang);
        
        let defaultTrack:any = this.transcriptionLangArr.filter((item: any) => {
          return item?.label === defaultTrackTemp?.label
        });
        this.transcriptionLangArr.forEach((track:any) => {
          // console.log(track?.label , defaultTrack?.label)
          // console.log('track--', track)
          initObj.player.addRemoteTextTrack({
            kind: 'subtitles',
            src: (track?.label === defaultTrack?.label) ? defaultTrack?.uri : "",
            srclang: this.titleCase(track.label),
            label: this.titleCase(track.language),
            default: track.label
          }, false);
        });
        initObj.player.on('texttrackchange', () => {
          
          for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i];
            if (track.mode === 'showing') {
              const currentLang = track.language;
              if (currentLang !== this.previousSubtitleLanguage) {
                //console.log(`Subtitle language changed from ${this.previousSubtitleLanguage} to ${currentLang}`);

                this.previousSubtitleLanguage = currentLang; // Update for next comparison
                this.activeTranscriptionLanguage = currentLang;
                //const remoteTracks:any = initObj.player.remoteTextTracks();
                // for (let j = remoteTracks.length - 1; j >= 0; j--) {
                //   initObj.player.removeRemoteTextTrack(remoteTracks[j]);
                // }
                const newTrack:any = this.transcriptionLangArr.find((t: any) => { 
                  // console.log(t)
                  return t.label === currentLang.toLowerCase()

                });
                if (newTrack && (newTrack.label !== defaultTrack?.label) && currentLang && this.previousSubtitleLanguage) {
                  this.replaceSubtitleTrack(newTrack);
                } else {
                  this.replaceSubtitleTrack(defaultTrack);
                }
                // if(newTrack) {
                //   this.transcriptionLangArr.forEach((track:any) => {
                //     // console.log(track?.label , defaultTrack?.label)
                //     // console.log('track--', track)
                //     initObj.player.addRemoteTextTrack({
                //       kind: 'subtitles',
                //       src: (track?.label === newTrack?.label) ? newTrack?.uri : "",
                //       srclang: this.titleCase(track.label),
                //       label: this.titleCase(track.language),
                //       default: track.default_lang
                //     }, false);
                //   });
      
                // }

                

                // Optional: sync with a service or trigger UI update
                // this.appTocService.setActiveSubtitleLanguage(currentLang);
               // console.log('About to call next with:', currentLang);
                this.appTocService.setActiveSubtitleLanguage(currentLang);
                
                //console.log('Called next');
              } 
              
              this.updateSubtitleButtonIcon(true)
              break; // Only one track should be 'showing'
            } else {
              this.previousSubtitleLanguage = ''
              this.updateSubtitleButtonIcon(false)
            }
          }
        });
        // console.log('initObj--', initObj.player.textTracks())
        
        //let allCues:any = []
        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          // console.log(tracks[i].label, tracks[i]);

          if (track.kind === 'subtitles' || track.kind === 'metadata') {
          //  track.mode = 'showing'; // or 'hidden' if you don't want it on screen
          if (track.language === this.activeTranscriptionLanguage) {
            track.mode = 'showing';
          } else {
            track.mode = 'disabled'; // prevent multiple from showing
          }

            track.addEventListener('cuechange', () => {
              const activeCues = track.activeCues;

              if (activeCues && activeCues.length > 0) {
                for (let j = 0; j < activeCues.length; j++) {
                  const cue:any = activeCues[j];

                  // Log or store cue
                  // allCues.push({
                  //   start: cue.startTime,
                  //   end: cue.endTime,
                  //   text: cue?.text
                  // });

                  this.appTocService.setTranscriptionData({
                    start: cue.startTime,
                    end: cue.endTime,
                    text: cue?.text
                  })

                  // Show in browser
                  // const entry = document.createElement('div');
                  // entry.textContent = `Cue: [${cue.startTime.toFixed(1)}s - ${cue.endTime.toFixed(1)}s] → ${cue.text}`;
                  // cueLog.appendChild(entry);
                }
                //console.log('cue', allCues)
              }
            });
          }
        }
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

  titleCase(str: string): string {
    return str && str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  replaceSubtitleTrack(newTrack: any) {

    // const defaultTrackTemp:any = this.transcriptionLangArr.find((t:any) => t.default_lang);
    // console.log('defaultTrack--', defaultTrackTemp)
    // let defaultTrack:any = this.transcriptionLangArr.filter((item: any) => {
    //   return item?.label === defaultTrackTemp?.default_lang
    // });

    const videoEl = this.playerInitObj.player.el().getElementsByTagName('video')[0];
    const existingTracks = videoEl.querySelectorAll('track');
    existingTracks.forEach((el: any) => el.remove());
  
    const trackEl = document.createElement('track');
    trackEl.kind = 'subtitles';
    trackEl.src = newTrack.uri;
    trackEl.srclang = newTrack.label.toLowerCase();
    trackEl.label = newTrack.language;
    trackEl.default = true;
    videoEl.appendChild(trackEl);
    let tracks = videoEl.textTracks;


      // setTimeout(() => {
        
        console.log('👉 Number of textTracks:', tracks.length);

        for (let i = 0; i < tracks.length; i++) {
          const t = tracks[i];
          if (t.kind === 'subtitles') {
            // Toggle and force reflow if needed
            if (t.mode === 'showing') {
              t.mode = 'hidden';
            } else {
              // Workaround: re-set mode after short delay to force repaint
              t.mode = 'hidden';
              setTimeout(() => {
                t.mode = 'showing';
              }, 1000); // or 10–50ms if needed
            }
          }
          
          console.log(`Track [${i}]: kind=${t.kind}, language=${t.language}, cues?`, t.cues, t.cues?.length);
        }
      // }, 1000);
  
    // Wait for the TextTrack to load
    const waitForTrack = () => {
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (
          (track.kind === 'subtitles' || track.kind === 'metadata') &&
          track.language.toLowerCase() === newTrack.label.toLowerCase() &&
          track.cues && track.cues.length > 0
        ) {
          track.mode = 'showing';
  
          // Now attach cuechange
          track.addEventListener('cuechange', () => {
            const activeCues = track.activeCues;
            if (activeCues && activeCues.length > 0) {
              for (let j = 0; j < activeCues.length; j++) {
                const cue: any = activeCues[j];
                this.appTocService.setTranscriptionData({
                  start: cue.startTime,
                  end: cue.endTime,
                  text: cue?.text
                });
              }
            }
          });
  
          console.log('✅ Cuechange listener attached');
          return; // Done
        } else {
         // track.mode = 'hidden'
        }
      }
  
      // Retry after short delay
      setTimeout(waitForTrack, 0);
    };
  
    waitForTrack();
  }

  updateSubtitleButtonIcon(subtitlesOn: boolean) {
    let subtitleImage =  document.getElementById('custom-cc-icon-img') as HTMLImageElement
    
    if(subtitleImage) {
      subtitleImage.src = subtitlesOn ? "/assets/ai-tutor/subtitle-on.svg" : "/assets/ai-tutor/subtitle-off.svg"
    }

    if(!subtitlesOn) {
      const videoEl = this.playerInitObj.player.el().getElementsByTagName('video')[0];
      let tracks = videoEl.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i];
        if (t.kind === 'subtitles') {
          // Toggle and force reflow if needed
          if (t.mode === 'showing') {
            t.mode = 'hidden';
          }
        }
        
       // console.log(`Track [${i}]: kind=${t.kind}, language=${t.language}, cues?`, t.cues, t.cues?.length);
      }
    }
  }
  
}