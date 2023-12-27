import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
// import { NSDiscussData } from '../../../discuss/models/discuss.model'
import { ActivatedRoute } from '@angular/router'
// import { MatSnackBar } from '@angular/material'
import { MatDialog } from '@angular/material/dialog'
// import { DiscussService } from '../../../discuss/services/discuss.service'
/* tslint:disable */
import _ from 'lodash'
import * as moment from 'moment'
import { EventService } from '../../services/events.service'
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

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private eventSvc: EventService,
    // private discussService: DiscussService,
    // private snackBar: MatSnackBar,
  ) { }

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
    })
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

}
