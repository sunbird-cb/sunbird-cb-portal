import { Component, ElementRef, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import videoJs from 'video.js'
/* tslint:disable */
import  'videojs-youtube'
/* tslint:enable */
// videoJsInitializer
import { fireRealTimeProgressFunction, saveContinueLearningFunction, telemetryEventDispatcherFunction,  youtubeInitializer } from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/videojs-util'
import { NsContent, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { EventService } from './../../services/events.service'
import moment from 'moment'
// interface IYTOptions extends videoJs.PlayerOptions {
//   youtube: {
//     ytControls: 0 | 1 | 2
//     customVars?: {
//       wmode: 'transparent'
//     }
//   }
// }
// const videoJsOptions: IYTOptions = {
//   controls: true,
//   autoplay: false,
//   preload: 'auto',
//   fluid: true,
//   techOrder: ['youtube'],
//   playbackRates: [0.75, 0.85, 1, 1.25, 2, 3],
//   poster: '',
//   html5: {
//     hls: {
//       overrideNative: true,
//     },
//     nativeVideoTracks: false,
//     nativeAudioTracks: false,
//     nativeTextTracks: false,
//   },
//   nativeControlsForTouch: false,
//   youtube: {
//     ytControls: 0,
//     customVars: {
//       wmode: 'transparent',
//     },
//   },
// };

@Component({
  selector: 'app-event-you-tube',
  templateUrl: './event-you-tube.component.html',
  styleUrls: ['./event-you-tube.component.scss'],
})
export class EventYouTubeComponent implements OnInit, AfterViewInit, OnDestroy {
  currentEvent = false
  @Input() eventData: any
  @Input() videoId: any
  @ViewChild('youtubeTag', { static: false }) youtubeTag!: ElementRef
  progressInterval: any
  intervalStarted = false
  isEnrolled = false
  resumeEventStatus = 0
  private player: videoJs.Player | null = null
  private dispose: (() => void) | null = null
  constructor(private route: ActivatedRoute, private eventService: EventService, private configSvc: ConfigurationsService) {
  }

  ngOnInit(): void {
    /* tslint:disable */
    console.log('eventData', this.route.snapshot.data.content.data)
    /* tslint:enabel */
    this.eventData = this.route.snapshot.data['content'].data
    this.route.params.subscribe(params => {
      this.videoId = params.videoId

      // if (this.fetchNewData) {
      //   this.getTIDData()
      // }
      // this.data = this.route.snapshot.data.topic.data
    })
    this.route.queryParams.subscribe(params => {
      this.isEnrolled = params['isEnrolled']
    })
    // const isToday = this.compareDate(eventDate, eventendDate, this.eventData)
    // if (isToday) {
    //   this.currentEvent = true
    // }
    const sDate = this.customDateFormat(this.eventData.startDate, this.eventData.startTime)
    const eDate = this.customDateFormat(this.eventData.endDate, this.eventData.endTime)
    const msDate = Math.floor(moment(sDate).valueOf() / 1000)
    const meDate = Math.floor(moment(eDate).valueOf() / 1000)
    const cDate = Math.floor(moment(new Date()).valueOf() / 1000)
    if (cDate >= msDate && cDate <= meDate) {
      this.currentEvent = true
    } else {
      this.currentEvent = false
    }
    this.eventStateRead() 

    
  }

  eventStateRead() {
    
    let req = {
      eventId:  this.eventData.identifier,
      batchId: this.getBatchId()
    }
    this.eventService.eventStateRead(req).subscribe((data)=>{
      if(data && data.result && data.result.events && data.result.events.length) {
        let resumeFrom = JSON.parse(data.result.events[0]['progressdetails'])['stateMetaData']
        this.resumeEventStatus = data.result.events[0]['status']
        resumeFrom = resumeFrom ? Number(resumeFrom) : 0
        if(!this.currentEvent && !this.isEnrolled) {
          resumeFrom = 0
        }
        this.initializePlayer(resumeFrom)
      } else {
        this.initializePlayer('')

      }
      /* tslint:disable */
      console.log('req event state read', data )
      /* tslint:enable */

    })
  }
  ngAfterViewInit() {
    // let playerOptions = {
    //         autoplay: false,
    //         controls: true,
    //         preload: 'auto',
    //         techOrder: ['youtube'],
    //         youtube: {ytControls: 2,rel:0,fs:0,modestbranding: 1},
    //         sources: [{type: 'video/youtube',src: 'https://www.youtube.com/watch?v=OqfyN7c71HE'}]
    //     }
    //     videoJs(`youtubeTag`, playerOptions, () => {console.log('pronto')});

    // this.initializePlayer('')
    // this.player = new (<any>window).YT.Player
    /* tslint:disable */
    console.log('initObj', this.dispose)
    /* tslint:enable */
  }

  initializePlayer(resumeFrom: any) {
    let timeSpent = resumeFrom ? resumeFrom : 0

      let timeStamp  = ''
      let timeStampString: any  = ''
      let lastTimeAccessed = ''
     let progress = ''

    const dispatcher: telemetryEventDispatcherFunction = (event: any) => {
      /* tslint:disable */
      console.log(event['data'])
    
      if(event['data']['passThroughData'] && event['data']['passThroughData']['timeSpent']) {
        timeSpent = event['data']['passThroughData']['timeSpent']
        /* tslint:disable */
        console.log('timeSpent % 60 === 0 ', timeSpent, ':: ', timeSpent % 60 === 0)
        // if(timeSpent % 60 === 0){
        //   this.saveProgressUpdate(this.eventData.duration,timeSpent,lastTimeAccessed)
        // }
        if(this.eventData) {
          if (this.eventData.startDate && this.eventData.startTime) {
            let eventDateTime = this.eventData.startDate + ' '+this.eventData.startTime
            let eventDateTimeStamp = new Date(eventDateTime).getTime()
            let currentDateTimeStamp = new Date().getTime()
            if(currentDateTimeStamp >= eventDateTimeStamp) {
                this.startInterval(timeSpent, lastTimeAccessed)
                this.intervalStarted = true
            }
          }
        }
        
      }
      /* tslint:disable */
      if(event['data'] && event['data']['playerStatus'] === 'ENDED') {
        this.saveProgressUpdate(this.eventData.duration,timeSpent,lastTimeAccessed)
      }
      // if(event['data']['passThroughData'] && event['data']['passThroughData']['playerDuration']) {
      //   playerDuration =  event['data']['passThroughData']['playerDuration']
      // }
      /* tslint:enable */
      // if (this.widgetData.identifier) {
      //   this.eventSvc.dispatchEvent(event)
      // }
    }
    const saveCLearning: saveContinueLearningFunction = data => {
      /* tslint:disable */
      console.log(data, timeSpent)

      const dataobj: any = JSON.parse(data.data)
      if(dataobj && dataobj.timestamp) {
        timeStamp = dataobj.timestamp
        timeStampString = new Date(timeStamp).toISOString().replace('T',' ').replace('Z',' ').split('.')
        lastTimeAccessed  = timeStampString[0]+':00+0000'
        progress = dataobj.progress.toString()
      }
      
      this.saveProgressUpdate(progress,timeSpent, lastTimeAccessed)
      
      
    
     

    }
    const fireRProgress: fireRealTimeProgressFunction = (identifier, data) => {
      /* tslint:disable */
      console.log(identifier, data)
      /* tslint:enable */
      // if (this.widgetData.identifier && identifier && data) {
      //   this.viewerSvc
      //     .realTimeProgressUpdate(identifier, data)
      // }
    }
    const initObj = youtubeInitializer(
      this.youtubeTag.nativeElement,
      this.videoId,
      dispatcher,
      saveCLearning,
      fireRProgress,
      { resumeFrom }, // passThrough Data,
      '',
      true, // enable telemetry,
      {}, // widget data
      NsContent.EMimeTypes.YOUTUBE, // type
      '500px', // height
    )
    this.dispose = initObj.dispose
  }

  startInterval(timeSpent: any, lastTimeAccessed: any) {
    if (!this.intervalStarted) {
      this.progressInterval = setInterval(() => {
        if (this.progressInterval) {
          clearInterval(this.progressInterval)
        }
        this.saveProgressUpdate(this.eventData.duration, timeSpent, lastTimeAccessed)
      },                                  1000 * 60)
    }
    }

  getBatchId() {
    let batchId = ''
      if (this.eventData && typeof this.eventData.batches === 'string') {
        this.eventData.batches = JSON.parse(this.eventData.batches)
      }
      if (Array.isArray(this.eventData.batches) && this.eventData.batches.length > 0) {
        batchId = this.eventData.batches[0].batchId || ''
      }
    return batchId
  }

  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }

  saveProgressUpdate(progress: any, timeSpent: any, lastTimeAccessed: any) {
       let userId = ''
       let completionPercentage: any = 0
       const batchId = this.getBatchId()
      if (this.configSvc.userProfile) {
        userId = this.configSvc.userProfile.userId || ''
      }
      if (timeSpent) {
        completionPercentage = (timeSpent / (this.eventData.duration * 60)) * 100
      }

    if (this.eventData) {
      const req  = {
        'request': {
        'userId': userId,
        'events': [
            {
                'eventId': this.eventData.identifier,
                'batchId': batchId,
                'status':  completionPercentage > 50 ? 2 : 1,
                'lastAccessTime': lastTimeAccessed, // data.dateAccessed
                'progressdetails': {
                    'max_size': this.eventData.duration * 60, // complete video duration
                    'current': [ // current state
                      progress,
                    ],
                    'duration': timeSpent, // watch time
                    'mimeType': 'application/html',
                    'stateMetaData': timeSpent, // last state
                },
                'completionPercentage': completionPercentage ? Number(parseFloat(completionPercentage).toFixed(2)) : 0.0,
            },
        ],
      },
    }
    if (this.resumeEventStatus !== 2) {
      /* tslint:disable */
      console.log('req', req)
      /* tslint:enable */
        this.eventService.saveEventProgressUpdate(req).subscribe(() => {})
    } else {
      /* tslint:disable */
      console.log('Already completed ', req)
    }
    }
  }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler() {
  //   console.log('on unload')
  //   this.ngOnDestroy()
  // // event.preventDefault();
  // // any other code / dialog logic
  // }

  ngOnDestroy() {
    /* tslint:disable */
    console.log(this.player)
    /* tslint:enable */
    clearInterval(this.progressInterval)
    this.intervalStarted = false
    if (this.player) {
      this.player.dispose()
    }
    if (this.dispose) {
      this.dispose()
    }

  }

}
