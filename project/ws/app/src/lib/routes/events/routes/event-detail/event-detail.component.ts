import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
// import { NSDiscussData } from '../../../discuss/models/discuss.model'
import { ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import { MatDialog } from '@angular/material/dialog'
// import { DiscussService } from '../../../discuss/services/discuss.service'
/* tslint:disable */
import _ from 'lodash'
import moment from 'moment'
import { EventService } from '../../services/events.service'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { CertificateDialogComponent } from './../../../../../../../../../library/ws-widget/collection/src/lib/_common/certificate-dialog/certificate-dialog.component'
import { WidgetContentLibService } from '@sunbird-cb/consumption'
/* tslint:enable */

@Component({
  selector: 'ws-app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastError', { static: true }) toastError!: ElementRef<any>
  // data!: NSDiscussData.IDiscussionData
  similarPosts!: any
  defaultError = 'Something went wrong, Please try again after sometime!'
  eventId!: any
  fetchSingleCategoryLoader = false
  eventData: any
  currentEvent = false
  pastEvent = false
  // fetchNewData = false
  showYouTubeVideoFlag = false
  enrollFlowItems = ['Karmayogi Saptah']
  // playerVars = {
  //   cc_lang_pref: 'en',
  // };
  // private player: YT.Player | any
  public ytEvent: any
  version: any = '...'
  skeletonLoader = false
  enrolledEvent: any
  batchId = ''
  isEnrolled = false
  downloadCertificateBool = false
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private configSvc: ConfigurationsService,
    private contentSvc: WidgetContentLibService,
    // private discussService: DiscussService,
    private snackBar: MatSnackBar,
  ) {
    if (localStorage.getItem('websiteLanguage')) {
      this.translate.setDefaultLang('en')
      const lang = localStorage.getItem('websiteLanguage')!
      this.translate.use(lang)
    }
    this.langtranslations.languageSelectedObservable.subscribe(() => {
      if (localStorage.getItem('websiteLanguage')) {
        this.translate.setDefaultLang('en')
        const lang = localStorage.getItem('websiteLanguage')!
        this.translate.use(lang)
      }
    })

  }

  get isenrollFlow() {
    if (this.eventData) {
      return this.eventData.resourceType && this.enrollFlowItems.includes(this.eventData.resourceType)
    }

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params.eventId
      // if (this.fetchNewData) {
      //   this.getTIDData()
      // }
      // this.data = this.route.snapshot.data.topic.data
    })
    this.eventSvc.getEventData(this.eventId).subscribe((data: any) => {
      this.eventData = data.result.event
      this.eventSvc.eventData = data.result.event
      if (this.eventData && typeof this.eventData.batches === 'string') {
        this.eventData.batches = JSON.parse(this.eventData.batches)
      }
      if (Array.isArray(this.eventData.batches) && this.eventData.batches.length > 0) {
        this.batchId = this.eventData.batches[0].batchId || ''
      }
      /* tslint:disable */
      console.log(this.eventSvc)
      /* tslint:enable */
      const creatordata = this.eventData.creatorDetails
      const str = creatordata.replace(/\\/g, '')
      if (str.length > 0) {
        this.eventData.creatorDetails = JSON.parse(str)
      }
      const eventDate = this.customDateFormat(this.eventData.startDate, this.eventData.startTime)
      const eventendDate = this.customDateFormat(this.eventData.endDate, this.eventData.endTime)
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
      }
      const now = new Date()
      const today = moment(now).format('YYYY-MM-DD HH:mm')

      if (eventDate < today && eventendDate < today) {
        this.pastEvent = true
      }
      if (this.isenrollFlow) {
        this.getUserIsEnrolled()
      }
    })
  }

  getUserIsEnrolled() {
    let userId = ''
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
    }
    if (this.eventData && userId) {
      this.eventSvc.getIsEnrolled(userId, this.eventData.identifier, this.batchId).subscribe((data: any) => {
        /* tslint:disable */
        console.log('data --- ', data)
        if (data && data.result && data.result.events && data.result.events.length > 0) {
          this.enrolledEvent = data.result.events.find((d: any) => d.contentId === this.eventData.identifier)
          this.enrolledEvent = { ...this.enrolledEvent }
          if(this.enrolledEvent 
            && this.enrolledEvent.issuedCertificates
            && this.enrolledEvent.issuedCertificates.length){
              const certId = this.enrolledEvent.issuedCertificates[0].identifier
              this.enrolledEvent['certificateObj'] = {
                certData: '',
                certId: certId,
              }
          }
          if( this.enrolledEvent && this.enrolledEvent.completionPercentage) {
            this.enrolledEvent['completionPercentage'] = Math.round(this.enrolledEvent.completionPercentage).toFixed(0)
          }
        }
      })
    }
  }

  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }

  compareDate(selectedStartDate: any, selectedEndDate: any, eventData: any) {
    const now = new Date()
    const today = moment(now).format('YYYY-MM-DD HH:mm')

    const day = new Date().getDate()
    const year = new Date().getFullYear()
    // tslint:disable-next-line:prefer-template
    const month = ('0' + (now.getMonth() + 1)).slice(-2)
    const todaysdate = `${year}-${month}-${day}`

    const stime = eventData.startTime.split('+')[0]
    const shour = stime.substr(0, 2) * 60
    const smin = stime.substr(3, 2) * 1
    const starttime = shour + smin

    const currentTime = new Date().getHours() * 60 + new Date().getMinutes()
    const minustime = starttime - currentTime
    if (eventData.startDate === todaysdate && minustime < 16 && (selectedStartDate > today || selectedEndDate < today))  {
      return true
    }
    return false
  }

  // fetchSingleCategoryDetails(cid: number) {
    // this.fetchSingleCategoryLoader = true
    // this.discussService.fetchSingleCategoryDetails(cid).subscribe(
    //   (data: NSDiscussData.ICategoryData) => {
    //     this.similarPosts = data.topics
    //     this.fetchSingleCategoryLoader = false
    //   },
    //   (err: any) => {
    //     this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
    //     this.fetchSingleCategoryLoader = false
    //   })
  // }

  // private openSnackbar(primaryMsg: string, duration: number = 5000) {
  //   this.snackBar.open(primaryMsg, 'X', {
  //     duration,
  //   })
  // }

    onStateChange(event: any) {
      this.ytEvent = event.data
    }
    // savePlayer(player: any) {
    //   this.player = player
    // }

    // playVideo() {
    //   this.player.playVideo()
    // }

    // pauseVideo() {
    //   this.player.pauseVideo()
    // }

    handleOpenCertificateDialog() {
      this.downloadCertificateBool = true
      const certId = this.enrolledEvent && this.enrolledEvent.certificateObj.certId
      if (this.enrolledEvent && this.enrolledEvent.certificateObj && !this.enrolledEvent.certificateObj.certData) {
        this.contentSvc.downloadCert(certId).subscribe(response => {
          if (this.enrolledEvent) {
            this.downloadCertificateBool = false
            this.enrolledEvent['certificateObj']['certData'] = response.result.printUri
            this.dialog.open(CertificateDialogComponent, {
              width: '1200px',
              data: { cet: response.result.printUri, certId: this.enrolledEvent && this.enrolledEvent.certificateObj.certId },
            })
          }
        },                                             (_error: any) => {
          this.downloadCertificateBool = false
          // this.loggerService.error('CERTIFICATE FETCH ERROR >', error)
          this.snackBar.open('Unable to View Certificate, due to some error!')
        })
      } else {
        this.downloadCertificateBool = false
        this.dialog.open(CertificateDialogComponent, {
          width: '1200px',
          data: { cet: this.enrolledEvent && this.enrolledEvent.certificateObj.certData, certId: this.enrolledEvent && this.enrolledEvent.certificateObj.certId },
        })
      }
    }

    translateLabels(label: string, type: any) {
      return this.langtranslations.translateActualLabel(label, type, '')
    }
  

}
