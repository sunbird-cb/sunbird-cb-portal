import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
/* tslint:disable */
import _ from 'lodash'
import moment from 'moment'
import { EventService } from '../../services/events.service'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService, ConfigurationsService } from '@sunbird-cb/utils-v2'
import { NsDiscussionV2 } from '@sunbird-cb/discussion-v2'

@Component({
  selector: 'ws-app-event-player',
  templateUrl: './event-player.component.html',
  styleUrls: ['./event-player.component.scss']
})
export class EventPlayerComponent implements OnInit {
  similarPosts!: any
  defaultError = 'Something went wrong, Please try again after sometime!'
  eventId!: any
  fetchSingleCategoryLoader = false
  eventData: any
  currentEvent = false
  pastEvent = false
  videoId = ''
  batchId = ''
  isEnrolled = false
  pageData: any = {}
  enrollFlowItems: any = []
  discussWidgetData!: NsDiscussionV2.ICommentWidgetData
  enrolledEvent: any
  skeletonLoader = false
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langtranslations: MultilingualTranslationsService,
    private configSvc: ConfigurationsService,
    private router: Router
    // private discussService: DiscussService,
    // private snackBar: MatSnackBar,
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

  ngOnInit() {
    this.skeletonLoader = true
    this.route.params.subscribe(params => {
      this.eventId = params?.eventId || ''
      this.callEventRead()
    })
  }
  callEventRead() {
    this.eventSvc.getEventData(this.eventId).subscribe((data: any) => {
      this.eventData = data.result.event
      const creatordata = this.eventData.creatorDetails
      const str = creatordata.replace(/\\/g, '')
      if (str.length > 0) {
        this.eventData.creatorDetails = JSON.parse(str)
      }
      const eventDate = this.customDateFormat(this.eventData.startDate, this.eventData.startTime)
      const eventendDate = this.customDateFormat(this.eventData.endDate, this.eventData.endTime)
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
      if (this.eventData && typeof this.eventData.batches === 'string') {
        this.eventData.batches = JSON.parse(this.eventData.batches)
      }
      if (Array.isArray(this.eventData.batches) && this.eventData.batches.length > 0) {
        this.batchId = this.eventData.batches[0].batchId || ''
      }
      this.checkEnrollFlowItems()
      this.skeletonLoader = false
    })
  }
  checkEnrollFlowItems() {
    this.pageData = (this.route.parent && this.route.parent.snapshot.data.pageData.data) || {}
    this.enrollFlowItems = this.pageData.enrollFlowItems
    if (this.batchId) {
      this.getUseEnrolled()
    }
    this.discussWidgetData = (this.route.parent && this.route.parent.snapshot.data.pageData.data.discussWidgetData) || []
    this.pageData = (this.route.parent && this.route.parent.snapshot.data.pageData.data) || {}
    if (this.discussWidgetData) {
      if (this.eventId) {
        this.discussWidgetData.newCommentSection.commentTreeData.entityId = this.eventId
        if (this.discussWidgetData.commentsList.repliesSection && this.discussWidgetData.commentsList.repliesSection.newCommentReply) {
          this.discussWidgetData.commentsList.repliesSection.newCommentReply.commentTreeData.entityId = this.eventId
        }
      }
      this.discussWidgetData.enrolledContent = true
      this.discussWidgetData.newCommentSection.commentBox.placeholder = 'Start a discussion'

      this.discussWidgetData = { ...this.discussWidgetData }
    }
  }


  getUseEnrolled() {
    let userId = ''
    if (this.configSvc.userProfile) {
      userId = this.configSvc.userProfile.userId || ''
    }
    this.discussWidgetData = (this.route.parent && this.route.parent.snapshot.data.pageData.data.discussWidgetData) || []
    if (this.eventData && userId) {
      this.eventSvc.getIsEnrolled(userId, this.eventData.identifier, this.batchId).subscribe((data: any) => {
        /* tslint:disable */
        console.log('data --- ', data)
        if (data && data.result && data.result.events && data.result.events.length > 0) {
          this.enrolledEvent = data.result.events.find((d: any) => d.contentId === this.eventData.identifier)
          this.enrolledEvent = { ...this.enrolledEvent }
          if (this.enrolledEvent
            && this.enrolledEvent.issuedCertificates
            && this.enrolledEvent.issuedCertificates.length) {
            const certId = this.enrolledEvent.issuedCertificates[0].identifier
            this.enrolledEvent['certificateObj'] = {
              certData: '',
              certId: certId,
            }
          }
          if (this.enrolledEvent && this.enrolledEvent.completionPercentage) {
            this.enrolledEvent['completionPercentage'] = Math.round(this.enrolledEvent.completionPercentage).toFixed(0)
          }
          this.isEnrolled = true
          this.navigateToSamePagewithEnroll()
        } else {
          this.isEnrolled = false
          this.router.navigateByUrl(`app/event-hub/home/${this.eventData.identifier}?batchId=${this.batchId}`)
        }
        this.discussWidgetData = { ...this.discussWidgetData }
      })
    }
  }

  get isenrollFlow() {
    if (this.eventData && this.enrollFlowItems && this.enrollFlowItems.length) {
      return this.eventData.resourceType && this.enrollFlowItems.includes(this.eventData.resourceType)
    } return false
  }

  navigateToSamePagewithEnroll() {
    if (this.isEnrolled) {
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: { isEnrolled: this.isEnrolled },
          queryParamsHandling: 'merge',
        })
    }
  }



  customDateFormat(date: any, time: any) {
    const stime = time.split('+')[0]
    const hour = stime.substr(0, 2)
    const min = stime.substr(2, 3)
    return `${date} ${hour}${min}`
  }

}
