import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fireRealTimeProgressFunction, saveContinueLearningFunction, telemetryEventDispatcherFunction, videoJsInitializer } from '../../../../../../../../../library/ws-widget/collection/src/lib/_services/videojs-util';
import { Subscription } from 'rxjs';
import videoJs from 'video.js'
import moment from 'moment'
import { EventService } from '../../services/events.service';
import { ConfigurationsService, NsContent } from '@sunbird-cb/utils-v2';

interface IYTOptions extends videoJs.PlayerOptions {
  youtube: {
    ytControls: 0 | 1 | 2
    customVars?: {
      wmode: 'transparent'
    }
  }
}

const videoJsOptions: IYTOptions = {
  controls: true,
  autoplay: true,
  preload: 'auto',
  fluid: true,
  techOrder: ['html5'],
  height: 200,
  playbackRates: [0.75, 0.85, 1, 1.25, 2, 3],
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
  youtube: {
    ytControls: 0,
    customVars: {
      wmode: 'transparent',
    },
  },
}

@Component({
  selector: 'ws-app-event-video-player',
  templateUrl: './event-video-player.component.html',
  styleUrls: ['./event-video-player.component.scss']
})
export class EventVideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {

  eventData: any
  @ViewChild('videoTag') videoTag!: ElementRef<HTMLVideoElement>
  screenSubscription: Subscription | null = null
  screenHeight: string | null = null
  videoId: any
  isEnrolled = false
  currentEvent = false
  resumeEventStatus = 0
  rateToFire = 180
  intervalStarted = false
  widgetData: any = {}
  player: videoJs.Player | null = null
  dispose: (() => void) | null = null
  pageConfigData: any = {}
  constructor(private route: ActivatedRoute,
    private eventService: EventService,
    private configSvc: ConfigurationsService,

  ) {

  }
  ngOnInit() {
    this.eventData = this.route.snapshot.data['content'].data
    this.pageConfigData = this.route.snapshot.data['pageData'] && this.route.snapshot.data['pageData'].data || {}
    if (this.pageConfigData && this.pageConfigData.fireUpdate) {
      this.rateToFire = this.pageConfigData.fireUpdate
    }
    this.videoId = this.eventData.registrationLink
    this.route.queryParams.subscribe(params => {
      this.isEnrolled = params['isEnrolled']
    })

    const sDate = this.customDateFormat(this.eventData.startDate, this.eventData.startTime)
    // const eDate = this.customDateFormat(this.eventData.endDate, this.eventData.endTime)
    const msDate = Math.floor(moment(sDate).valueOf() / 1000)
    // const meDate = Math.floor(moment(eDate).valueOf() / 1000)
    const cDate = Math.floor(moment(new Date()).valueOf() / 1000)
    if (cDate >= msDate) {
      this.currentEvent = true
    } else {
      this.currentEvent = false
    }
    this.eventStateRead()

  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose()
    }
    if (this.dispose) {
      this.dispose()
    }
  }

  ngAfterViewInit() {


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

  eventStateRead() {

    let req = {
      eventId: this.eventData.identifier,
      batchId: this.getBatchId()
    }
    this.eventService.eventStateRead(req).subscribe((data) => {
      if (data && data.result && data.result.events && data.result.events.length) {
        let resumeFrom = JSON.parse(data.result.events[0]['progressdetails'])['stateMetaData']
        this.resumeEventStatus = data.result.events[0]['status']
        resumeFrom = resumeFrom ? Number(resumeFrom) : 0
        if (!this.currentEvent && !this.isEnrolled) {
          resumeFrom = 0
        }

        this.widgetData = {
          "isVideojs": true,
          "disableTelemetry": false,
          "url": this.eventData.registrationLink,
          "identifier": this.eventData.identifier,
          "mimeType": "video/mp4",
          "resumePoint": 0,
          "continueLearning": true,
          "subtitles": [],
          "collectionId": this.eventData.identifier,
          "contentType": "Event",
          "primaryCategory": "Event",
          "channel": this.eventData.channel,
          "version": "2",
          "size": "31",
          "hideUpNext": false
        }
        this.initializePlayer(resumeFrom)
      } else {
        this.initializePlayer('')

      }
      /* tslint:disable */
      console.log('req event state read', data)
      /* tslint:enable */

    })
  }

  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }


  initializePlayer(resumeFrom: any) {
    let timeSpent = resumeFrom ? resumeFrom : 0

    let timeStamp = ''
    let timeStampString: any = ''
    let lastTimeAccessed = ''
    /* tslint:disable */
    //  let progress : any= ''
    /* tslint:enable */

    const dispatcher: telemetryEventDispatcherFunction = (event: any) => {
      /* tslint:disable */
      console.log("dispatcher", event['data'])

      if (event['data']['passThroughData'] && event['data']['passThroughData']['timeSpent']) {
        timeSpent = event['data']['passThroughData']['timeSpent']
        /* tslint:disable */
        console.log('timeSpent % 60 === 0 ', timeSpent, ':: ', timeSpent % 60 === 0)
        // if(timeSpent % 60 === 0){
        //   this.saveProgressUpdate(this.eventData.duration,timeSpent,lastTimeAccessed)
        // }
        if (this.eventData) {
          if (this.eventData.startDate && this.eventData.startTime) {
            let eventDateTime = this.eventData.startDate + ' ' + this.eventData.startTime
            let eventDateTimeStamp = new Date(eventDateTime).getTime()
            let currentDateTimeStamp = new Date().getTime()
            if (currentDateTimeStamp >= eventDateTimeStamp) {
              if (timeSpent && timeSpent % this.rateToFire === 0) {
                this.startInterval(timeSpent, lastTimeAccessed)
              }
              this.intervalStarted = true
              this.currentEvent = true
            }
          }
        }

      }

      console.log("event['data'] ", event['data'])
      /* tslint:disable */
      if (event['data'] && event['data']['playerStatus'] === 'ENDED') {
        if (this.currentEvent) {
          this.saveProgressUpdate(this.eventData.duration, timeSpent, lastTimeAccessed)

        }
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
      console.log("saveCLearning", data, timeSpent)
      const dataobj: any = JSON.parse(data.data)
      if (dataobj && dataobj.timestamp) {
        // let progress = ''
        timeStamp = dataobj.timestamp
        timeStampString = new Date(timeStamp).toISOString().replace('T', ' ').replace('Z', ' ').split('.')
        lastTimeAccessed = timeStampString[0] + ':00+0000'
        // progress = dataobj.progress.toString()
      }
      if (this.currentEvent) {
        this.saveProgressUpdate(this.eventData.duration, timeSpent, lastTimeAccessed)
      }

    }
    const fireRProgress: fireRealTimeProgressFunction = (identifier, data) => {
      console.log(identifier, data)
    }
    const initObj = videoJsInitializer(
      this.videoTag.nativeElement,
      {
        ...videoJsOptions,
        poster: '',
        sources: [
          {
            type: NsContent.EMimeTypes.MP4,
            src: this.eventData.registrationLink,
            //src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
        ],
      },
      dispatcher,
      saveCLearning,
      fireRProgress,
      { resumeFrom: resumeFrom },
      NsContent.EMimeTypes.MP4,
      resumeFrom, // passThrough Data,
      true, // enable telemetry,
      this.widgetData,
      NsContent.EMimeTypes.MP4,
      '200px', // height
    )
    this.player = initObj.player
    this.dispose = initObj.dispose
  }

  startInterval(timeSpent: any, lastTimeAccessed: any) {
    this.saveProgressUpdate(this.eventData.duration, timeSpent, lastTimeAccessed, true)
  }
  saveProgressUpdate(progress: any, timeSpent: any, lastTimeAccessed: any, normalUpdate?: boolean) {
    let userId = ''
    let completionPercentage: any = 0
    const batchId = this.getBatchId()
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
    }
    console.log("progress ", progress + timeSpent + lastTimeAccessed + normalUpdate)
    if (timeSpent) {
      // completionPercentage = (timeSpent / (this.eventData.duration * 60)) * 100
      completionPercentage = normalUpdate ?
        (this.eventData.duration * 60 / (this.eventData.duration * 60)) * 100 :
        (timeSpent / (this.eventData.duration * 60)) * 100
    }

    if (this.eventData) {
      const req = {
        'request': {
          'userId': userId,
          'events': [
            {
              'eventId': this.eventData.identifier,
              'batchId': batchId,
              'status': completionPercentage > 50 ? 2 : 1,
              'lastAccessTime': lastTimeAccessed, // data.dateAccessed
              'progressdetails': {
                'max_size': this.eventData.duration * 60, // complete video duration
                'current': [ // current state
                  progress,
                ],
                'duration': normalUpdate ? this.eventData.duration * 60 : timeSpent, // watch time
                'mimeType': 'application/html',
                'stateMetaData': timeSpent, // last state
              },
              'completionPercentage': completionPercentage ? Number(parseFloat(completionPercentage).toFixed(2)) : 0.0,
            },
          ],
        },
      }
      // if (completionPercentage > 50) {
      //   this.rateToFire = 300
      // }
      if (this.resumeEventStatus !== 2) {
        /* tslint:disable */
        console.log('req', req)
        /* tslint:enable */
        this.eventService.saveEventProgressUpdate(req).subscribe((_res: any) => {
          if (completionPercentage > 50) {
            this.resumeEventStatus = 2
          }
        })
      } else {
        /* tslint:disable */
        console.log('Already completed ', req)
      }
    }
  }

}
